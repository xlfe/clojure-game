// The Clojure Quest — Main entry point
// Boot, render loop, event handling

import { getState, dispatch, subscribe } from './engine/state.js';
import { executeCommand } from './engine/commands.js';
import { initInterpreter, evaluate, checkPuzzle } from './engine/interpreter.js';
import { saveGame, loadGame } from './engine/save-load.js';
import { EGARenderer } from './renderer/ega-renderer.js';
import { renderScene } from './renderer/scene-renderer.js';
import { SPRITES } from './renderer/sprites.js';
import { EGA_PALETTE } from './renderer/ega-renderer.js';
import {
  cacheElements, renderUI, showMessage, showScreen,
  openClojureConsole, closeClojureConsole, addClojureOutput,
  getClojureInput, getCommandInput, focusCommandInput, showWinScreen,
} from './renderer/ui.js';
import { initAudio, playSound, playMagicSound, playPuzzleSolved, playWinSound } from './audio/audio.js';
import { getPuzzleById } from './data/puzzles.js';
import { getScene } from './data/scenes.js';

let renderer = null;
let animFrame = 0;
let isRunning = false;

// Command history
const commandHistory = [];
let historyIndex = -1;
const clojureHistory = [];
let clojureHistoryIndex = -1;

// ---- Initialization ----

function init() {
  cacheElements();

  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    renderer = new EGARenderer(canvas);
  }

  setupEventListeners();
  showScreen('title');
  animateTitle();
}

function setupEventListeners() {
  // Start button
  document.getElementById('start-btn')?.addEventListener('click', startGame);
  document.getElementById('continue-btn')?.addEventListener('click', continueGame);

  // Command input
  const cmdInput = getCommandInput();
  cmdInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = cmdInput.value.trim();
      if (input) {
        commandHistory.push(input);
        historyIndex = commandHistory.length;
        handleCommand(input);
        cmdInput.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        cmdInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        cmdInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        cmdInput.value = '';
      }
    }
  });

  // Clojure input
  const cljInput = getClojureInput();
  cljInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = cljInput.value.trim();
      if (input) {
        clojureHistory.push(input);
        clojureHistoryIndex = clojureHistory.length;
        handleClojureInput(input);
        cljInput.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (clojureHistoryIndex > 0) {
        clojureHistoryIndex--;
        cljInput.value = clojureHistory[clojureHistoryIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (clojureHistoryIndex < clojureHistory.length - 1) {
        clojureHistoryIndex++;
        cljInput.value = clojureHistory[clojureHistoryIndex];
      } else {
        clojureHistoryIndex = clojureHistory.length;
        cljInput.value = '';
      }
    } else if (e.key === 'Escape') {
      dispatch({ type: 'CLOSE_CLOJURE_CONSOLE' });
      closeClojureConsole();
    }
  });

  // ESC to close console
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && getState().clojureConsoleOpen) {
      dispatch({ type: 'CLOSE_CLOJURE_CONSOLE' });
      closeClojureConsole();
    }
  });

  // Close console button
  document.getElementById('close-clojure')?.addEventListener('click', () => {
    dispatch({ type: 'CLOSE_CLOJURE_CONSOLE' });
    closeClojureConsole();
  });

  // Play again
  document.getElementById('play-again-btn')?.addEventListener('click', () => {
    dispatch({ type: 'RESET' });
    startGame();
  });

  // State change listener
  subscribe((state) => {
    renderUI(state);
  });
}

function startGame() {
  initAudio();
  initInterpreter();
  dispatch({ type: 'SET_SCREEN', screen: 'game' });
  dispatch({ type: 'MOVE_TO_SCENE', scene: 'cottage', world: 'enchanted-grove' });
  showScreen('game');

  const state = getState();
  const scene = getScene(state.currentScene);
  showMessage('Welcome to The Clojure Quest! You find yourself in a wizard\'s cottage. Type LOOK to see around you, or TALK to speak to the wizard.');
  if (scene) showMessage(scene.description);

  renderUI(state);
  focusCommandInput();
  isRunning = true;
  requestAnimationFrame(gameLoop);
}

function continueGame() {
  const saved = loadGame();
  if (saved) {
    initAudio();
    initInterpreter();
    dispatch({ type: 'LOAD_STATE', savedState: saved });
    showScreen('game');
    showMessage('Game loaded! Welcome back to The Clojure Quest!');
    const state = getState();
    const scene = getScene(state.currentScene);
    if (scene) showMessage(scene.description);
    renderUI(state);
    focusCommandInput();
    isRunning = true;
    requestAnimationFrame(gameLoop);
  }
}

// ---- Command handling ----

function handleCommand(input) {
  showMessage(`> ${input}`);
  const state = getState();
  const result = executeCommand(state, input);

  // Process actions
  for (const action of result.actions) {
    if (action.type === 'SAVE') {
      saveGame(getState());
    } else if (action.type === 'LOAD') {
      continueGame();
      return;
    } else if (action.type === 'OPEN_CLOJURE_CONSOLE') {
      dispatch(action);
      openClojureConsole(action.puzzleId);
      playMagicSound();
      if (result.message) showMessage(result.message);
      return;
    } else {
      dispatch(action);
    }
  }

  if (result.message) {
    showMessage(result.message);
  }

  // Auto-save on scene transitions, puzzle completions, and item pickups
  if (result.actions.some(a => a.type === 'MOVE_TO_SCENE' || a.type === 'COMPLETE_PUZZLE' || a.type === 'ADD_TO_INVENTORY')) {
    saveGame(getState());
  }

  // Play appropriate sound and effects
  if (result.actions.some(a => a.type === 'ADD_TO_INVENTORY')) playSound('pickup');
  else if (result.actions.some(a => a.type === 'MOVE_TO_SCENE')) {
    playSound('walk');
    flashTransition();
  }
  else if (result.actions.some(a => a.type === 'ADD_SCORE')) playSound('success');

  // Check for win condition
  if (getState().flags.solvedFinalCurseBreaker) {
    handleWin();
  }
}

// ---- Clojure console handling ----

function handleClojureInput(input) {
  addClojureOutput(`<span class="clj-input">user=> ${escapeHtml(input)}</span>`);

  const result = evaluate(input);
  const state = getState();

  if (result.success) {
    addClojureOutput(`<span class="clj-result">${escapeHtml(result.display)}</span>`);

    // Check if there's an active puzzle
    if (state.currentPuzzle) {
      const check = checkPuzzle(state.currentPuzzle, input, result);
      if (check.solved) {
        addClojureOutput(`<span class="clj-success">${escapeHtml(check.message)}</span>`);
        handlePuzzleSolved(state.currentPuzzle);
      } else if (check.message) {
        addClojureOutput(`<span class="clj-hint">${escapeHtml(check.message)}</span>`);
      }
    }
  } else {
    addClojureOutput(`<span class="clj-error">${escapeHtml(result.error)}</span>`);
  }
}

function handlePuzzleSolved(puzzleId) {
  playPuzzleSolved();

  // Mark puzzle complete
  dispatch({ type: 'COMPLETE_PUZZLE', puzzleId });
  dispatch({ type: 'ADD_SCORE', points: 15 });

  // Set the flag (camelCase from kebab-case puzzle id)
  const flagName = 'solved' + puzzleId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  dispatch({ type: 'SET_FLAG', flag: flagName });

  // Puzzle-specific progression flags
  const puzzle = getPuzzleById(puzzleId);
  if (puzzle) {
    // World 1 progression
    if (puzzleId === 'prefix-notation') {
      dispatch({ type: 'SET_FLAG', flag: 'learnedBasicClojure' });
    }
    // World 2 progression
    if (puzzleId === 'if-conditional') {
      dispatch({ type: 'SET_FLAG', flag: 'learnedIf' });
    }
    // World 3 progression
    if (puzzleId === 'map-transform') {
      dispatch({ type: 'SET_FLAG', flag: 'learnedMap' });
    }
  }

  showMessage(`Puzzle solved! +15 points! (${getState().completedPuzzles.length}/30 puzzles complete)`);

  // Close console after a moment
  setTimeout(() => {
    dispatch({ type: 'CLOSE_CLOJURE_CONSOLE' });
    closeClojureConsole();
  }, 2000);
}

// ---- Win condition ----

function handleWin() {
  playWinSound();
  setTimeout(() => {
    showWinScreen(getState());
  }, 1000);
}

// ---- Render loop ----

function gameLoop() {
  if (!isRunning) return;
  animFrame++;

  const state = getState();
  if (state.screen === 'game' && renderer) {
    renderScene(renderer, state.currentScene, animFrame, state);
  }

  requestAnimationFrame(gameLoop);
}

// ---- Title screen animation ----

function animateTitle() {
  if (!renderer) return;

  function titleLoop() {
    const state = getState();
    if (state.screen !== 'title') return;

    animFrame++;
    const r = renderer;
    r.clear(EGA_PALETTE.black);

    // Starry background
    const rng = seededRandom(42);
    for (let i = 0; i < 50; i++) {
      const x = Math.floor(rng() * 384);
      const y = Math.floor(rng() * 240);
      const twinkle = (animFrame + i * 7) % 20 < 15;
      if (twinkle) r.drawStar(x, y, rng() > 0.7 ? 2 : 1);
    }

    // Title text
    r.drawText('THE CLOJURE QUEST', 80, 40, EGA_PALETTE.lightCyan, 2);
    r.drawText('A Coding Adventure', 110, 70, EGA_PALETTE.lightMagenta);

    // Animated parentheses
    const pColors = [EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen];
    for (let i = 0; i < 8; i++) {
      const px = 30 + i * 45 + Math.sin(animFrame * 0.03 + i) * 15;
      const py = 100 + Math.cos(animFrame * 0.04 + i * 2) * 20;
      r.drawText(i % 2 === 0 ? '(' : ')', px, py, pColors[i % 4], 2);
    }

    // Player and sparkles
    SPRITES.player.draw(r, 120, 150, animFrame);
    for (let i = 0; i < 6; i++) {
      const sx = 80 + i * 50 + Math.sin(animFrame * 0.05 + i) * 10;
      const sy = 160 + Math.cos(animFrame * 0.04 + i * 2) * 15;
      r.drawSparkle(sx, sy, animFrame + i * 3);
    }

    // Crystal
    SPRITES.crystal.draw(r, 260, 150, EGA_PALETTE.lightCyan, animFrame);

    r.render();
    requestAnimationFrame(titleLoop);
  }

  titleLoop();
}

function flashTransition() {
  if (!renderer) return;
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  canvas.style.transition = 'opacity 0.15s';
  canvas.style.opacity = '0.3';
  setTimeout(() => {
    canvas.style.opacity = '1';
    setTimeout(() => { canvas.style.transition = ''; }, 200);
  }, 150);
}

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// Boot
document.addEventListener('DOMContentLoaded', init);
