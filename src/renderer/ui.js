// DOM UI updates (message box, inventory, score, clojure console)

import { getScene } from '../data/scenes.js';
import { getWorld } from '../data/worlds.js';
import { getPuzzleById } from '../data/puzzles.js';

let elements = {};

export function cacheElements() {
  elements = {
    messageBox: document.getElementById('message-box'),
    commandInput: document.getElementById('command-input'),
    inventoryPanel: document.getElementById('inventory-panel'),
    scoreDisplay: document.getElementById('score-display'),
    locationDisplay: document.getElementById('location-display'),
    worldDisplay: document.getElementById('world-display'),
    clojureConsole: document.getElementById('clojure-console'),
    clojureOutput: document.getElementById('clojure-output'),
    clojureInput: document.getElementById('clojure-input'),
    clojurePuzzleTitle: document.getElementById('clojure-puzzle-title'),
    clojurePuzzleDesc: document.getElementById('clojure-puzzle-desc'),
    clojureHint: document.getElementById('clojure-hint'),
    titleScreen: document.getElementById('title-screen'),
    gameScreen: document.getElementById('game-screen'),
    winScreen: document.getElementById('win-screen'),
  };
}

export function renderUI(state) {
  updateScore(state);
  updateLocation(state);
  updateInventory(state);
}

export function showMessage(text) {
  if (!elements.messageBox) return;
  // Format text with basic markup
  let html = escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  // Color Clojure code in messages
  html = html.replace(/\(([^)]+)\)/g, '<span class="code">($1)</span>');
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = html;
  elements.messageBox.appendChild(div);
  elements.messageBox.scrollTop = elements.messageBox.scrollHeight;
}

export function clearMessages() {
  if (elements.messageBox) elements.messageBox.innerHTML = '';
}

function updateScore(state) {
  if (elements.scoreDisplay) {
    elements.scoreDisplay.textContent = `Score: ${state.score}/${state.maxScore}`;
  }
}

function updateLocation(state) {
  const scene = getScene(state.currentScene);
  if (elements.locationDisplay && scene) {
    elements.locationDisplay.textContent = scene.name;
  }
  const world = getWorld(state.currentWorld);
  if (elements.worldDisplay && world) {
    elements.worldDisplay.textContent = world.name;
  }
}

function updateInventory(state) {
  if (!elements.inventoryPanel) return;
  elements.inventoryPanel.innerHTML = '';
  if (state.inventory.length === 0) {
    elements.inventoryPanel.innerHTML = '<span class="empty-inv">Empty</span>';
    return;
  }
  for (const item of state.inventory) {
    const span = document.createElement('span');
    span.className = 'inventory-item';
    span.textContent = item.name;
    span.title = item.name;
    elements.inventoryPanel.appendChild(span);
  }
}

export function showScreen(name) {
  if (elements.titleScreen) elements.titleScreen.classList.toggle('active', name === 'title');
  if (elements.gameScreen) elements.gameScreen.classList.toggle('active', name === 'game');
  if (elements.winScreen) elements.winScreen.classList.toggle('active', name === 'win');
}

// Clojure console
export function openClojureConsole(puzzleId) {
  if (!elements.clojureConsole) return;
  elements.clojureConsole.style.display = 'flex';
  elements.clojureOutput.innerHTML = '';

  if (puzzleId) {
    const puzzle = getPuzzleById(puzzleId);
    if (puzzle) {
      elements.clojurePuzzleTitle.textContent = `Puzzle #${puzzle.number}: ${puzzle.title}`;
      elements.clojurePuzzleDesc.textContent = puzzle.description;
      elements.clojureHint.textContent = `Hint: ${puzzle.hint}`;
      addClojureOutput(`<span class="clj-system">; ${puzzle.title}</span>`);
      addClojureOutput(`<span class="clj-system">; ${puzzle.description}</span>`);
    }
  } else {
    elements.clojurePuzzleTitle.textContent = 'Clojure REPL';
    elements.clojurePuzzleDesc.textContent = 'Type Clojure expressions to experiment!';
    elements.clojureHint.textContent = 'Try: (+ 1 2 3), (str "Hello" " " "World"), (map inc [1 2 3])';
    addClojureOutput('<span class="clj-system">; Welcome to the Clojure REPL! Type expressions and press Enter.</span>');
  }

  setTimeout(() => elements.clojureInput?.focus(), 100);
}

export function closeClojureConsole() {
  if (elements.clojureConsole) {
    elements.clojureConsole.style.display = 'none';
  }
  elements.commandInput?.focus();
}

export function addClojureOutput(html) {
  if (!elements.clojureOutput) return;
  const div = document.createElement('div');
  div.className = 'clj-line';
  div.innerHTML = html;
  elements.clojureOutput.appendChild(div);
  elements.clojureOutput.scrollTop = elements.clojureOutput.scrollHeight;
}

export function getClojureInput() {
  return elements.clojureInput;
}

export function getCommandInput() {
  return elements.commandInput;
}

export function focusCommandInput() {
  elements.commandInput?.focus();
}

export function showWinScreen(state) {
  showScreen('win');
  const finalScore = document.getElementById('final-score');
  const puzzleCount = document.getElementById('puzzle-count');
  if (finalScore) finalScore.textContent = `Final Score: ${state.score}/${state.maxScore}`;
  if (puzzleCount) puzzleCount.textContent = `Puzzles Solved: ${state.completedPuzzles.length}/30`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
