// Data-driven command dispatch
// Each handler is a pure function: (state, sceneData, args) => { actions[], message }

import { getScene } from '../data/scenes.js';
import { NPCS, findNPCByAlias } from '../data/npcs.js';
import { ITEMS } from '../data/items.js';
import { COMMANDS, NOISE_WORDS, parseDirection, findCommand } from '../data/commands-config.js';
import { getPuzzleById } from '../data/puzzles.js';
import { getWorld } from '../data/worlds.js';

// Parse raw input into { command, args }
export function parseInput(input) {
  const tokens = input.trim().toLowerCase().split(/\s+/);
  if (tokens.length === 0 || tokens[0] === '') return null;

  const verb = tokens[0];

  // Check if it's a direction shortcut (n, s, e, w, etc.)
  const dir = parseDirection(verb);
  if (dir) {
    return { command: COMMANDS.go, args: dir };
  }

  // Find matching command
  const cmd = findCommand(verb);
  if (!cmd) return null;

  // Strip noise words from args
  let args = tokens.slice(1)
    .filter(t => !NOISE_WORDS.includes(t))
    .join(' ');

  return { command: cmd, args };
}

// Main dispatch — returns { actions: [], message: string }
export function executeCommand(state, input) {
  const parsed = parseInput(input);
  if (!parsed) {
    return { actions: [], message: `I don't understand "${input}". Type HELP for commands.` };
  }

  const scene = getScene(state.currentScene);
  if (!scene) {
    return { actions: [], message: 'Error: unknown scene.' };
  }

  const { command, args } = parsed;

  switch (command.name) {
    case 'look': return handleLook(state, scene, args);
    case 'get': return handleGet(state, scene, args);
    case 'use': return handleUse(state, scene, args);
    case 'talk': return handleTalk(state, scene, args);
    case 'go': return handleGo(state, scene, args);
    case 'open': return handleOpen(state, scene, args);
    case 'read': return handleRead(state, scene, args);
    case 'give': return handleGive(state, scene, args);
    case 'help': return handleHelp();
    case 'inventory': return handleInventory(state);
    case 'clojure': return handleClojure(state, scene, args);
    case 'cast': return handleClojure(state, scene, args);
    case 'eat': return handleEat(state, args);
    case 'save': return { actions: [{ type: 'SAVE' }], message: 'Game saved!' };
    case 'load': return { actions: [{ type: 'LOAD' }], message: 'Game loaded!' };
    default:
      return { actions: [], message: `I don't know how to ${command.name}.` };
  }
}

// ---- Handler functions (pure — return actions + message) ----

function handleLook(state, scene, target) {
  if (!target || target === 'around' || target === 'room') {
    // Describe the room
    let msg = scene.description;
    const items = scene.objects.filter(o => {
      if (o.requiresFlag && !state.flags[o.requiresFlag]) return false;
      // Don't show items already in inventory
      if (o.canTake && state.inventory.some(i => i.id === o.id)) return false;
      return true;
    });
    if (items.length > 0) {
      msg += '\n\nYou can see: ' + items.map(o => o.name).join(', ') + '.';
    }
    const npcNames = scene.npcs.map(id => NPCS[id]?.name).filter(Boolean);
    if (npcNames.length > 0) {
      msg += '\n' + npcNames.join(', ') + (npcNames.length === 1 ? ' is' : ' are') + ' here.';
    }
    const exitDirs = Object.keys(scene.exits);
    if (exitDirs.length > 0) {
      msg += '\nExits: ' + exitDirs.join(', ') + '.';
    }
    return { actions: [], message: msg };
  }

  // Look at specific object
  const obj = findObject(scene, target, state);
  if (obj) {
    return { actions: [], message: obj.description };
  }

  // Look at NPC
  const npc = findNPCByAlias(target, scene.npcs);
  if (npc) {
    return { actions: [], message: npc.description };
  }

  return { actions: [], message: `You don't see "${target}" here.` };
}

function handleGet(state, scene, target) {
  if (!target) return { actions: [], message: 'Get what?' };

  const obj = findObject(scene, target, state);
  if (!obj) return { actions: [], message: `You don't see "${target}" here.` };
  if (!obj.canTake) return { actions: [], message: `You can't take the ${obj.name}.` };
  if (obj.requiresFlag && !state.flags[obj.requiresFlag]) return { actions: [], message: `You can't take that yet.` };
  if (state.inventory.some(i => i.id === obj.id)) return { actions: [], message: `You already have the ${obj.name}.` };

  const actions = [
    { type: 'ADD_TO_INVENTORY', item: { id: obj.id, name: obj.name } },
  ];
  if (obj.points) actions.push({ type: 'ADD_SCORE', points: obj.points });

  return { actions, message: `You pick up the ${obj.name}.` };
}

function handleUse(state, scene, target) {
  if (!target) return { actions: [], message: 'Use what?' };

  // Check for use interactions in scene
  if (scene.useInteractions) {
    for (const interaction of scene.useInteractions) {
      const targetObj = findObject(scene, target, state);
      if (!targetObj) continue;

      // Match by target alias
      if (matchesTarget(target, interaction.target) || targetObj.id === interaction.target) {
        // Check condition
        if (interaction.condition && !interaction.condition(state.flags)) continue;

        if (interaction.startsPuzzle) {
          return {
            actions: [{ type: 'OPEN_CLOJURE_CONSOLE', puzzleId: interaction.startsPuzzle }],
            message: interaction.message || `You activate the ${targetObj.name}...`,
          };
        }

        if (interaction.setsFlag) {
          const actions = [{ type: 'SET_FLAG', flag: interaction.setsFlag }];
          return { actions, message: interaction.message || `You use the ${targetObj.name}.` };
        }
      }
    }
  }

  // Check if object has a puzzle
  const obj = findObject(scene, target, state);
  if (obj && obj.startsPuzzle) {
    return {
      actions: [{ type: 'OPEN_CLOJURE_CONSOLE', puzzleId: obj.startsPuzzle }],
      message: `You activate the ${obj.name}...`,
    };
  }

  if (obj) return { actions: [], message: `You can't figure out how to use the ${obj.name} here.` };

  return { actions: [], message: `You don't see "${target}" to use.` };
}

function handleTalk(state, scene, target) {
  if (!target) {
    // If only one NPC in scene, talk to them
    if (scene.npcs.length === 1) {
      target = scene.npcs[0];
    } else if (scene.npcs.length === 0) {
      return { actions: [], message: 'There\'s nobody here to talk to.' };
    } else {
      return { actions: [], message: 'Talk to whom? ' + scene.npcs.map(id => NPCS[id]?.name).filter(Boolean).join(', ') + '?' };
    }
  }

  const npc = findNPCByAlias(target, scene.npcs);
  if (!npc) return { actions: [], message: `You don't see "${target}" here to talk to.` };

  // Find appropriate dialogue
  for (const d of npc.dialogue) {
    if (d.condition(state.flags)) {
      const actions = [];
      if (d.setsFlag) actions.push({ type: 'SET_FLAG', flag: d.setsFlag });
      if (d.points) actions.push({ type: 'ADD_SCORE', points: d.points });
      return { actions, message: `${npc.name}: "${d.text}"` };
    }
  }

  return { actions: [], message: `${npc.name} doesn't have anything new to say.` };
}

function handleGo(state, scene, args) {
  if (!args) return { actions: [], message: 'Go where? Try: north, south, east, west.' };

  const dir = parseDirection(args) || args;
  const exit = scene.exits[dir];

  if (!exit) {
    return { actions: [], message: `You can't go ${dir} from here. Exits: ${Object.keys(scene.exits).join(', ')}.` };
  }

  if (exit.requiresFlag && !state.flags[exit.requiresFlag]) {
    return { actions: [], message: exit.failMessage || `You can't go that way yet.` };
  }

  const targetScene = getScene(exit.to);
  const targetWorld = getWorld(targetScene?.world);
  const actions = [{ type: 'MOVE_TO_SCENE', scene: exit.to, world: targetScene?.world }];

  let msg = `You head ${dir}.\n\n`;
  // Check for world transition
  if (targetScene && targetScene.world !== scene.world && targetWorld) {
    msg += `✦ Welcome to ${targetWorld.name}: ${targetWorld.subtitle}! ✦\n\n`;
  }
  msg += targetScene ? targetScene.description : '';

  return { actions, message: msg };
}

function handleOpen(state, scene, target) {
  if (!target) return { actions: [], message: 'Open what?' };
  const obj = findObject(scene, target, state);
  if (!obj) return { actions: [], message: `You don't see "${target}" to open.` };
  return { actions: [], message: `You can't open the ${obj.name}.` };
}

function handleRead(state, scene, target) {
  if (!target) return { actions: [], message: 'Read what?' };
  const obj = findObject(scene, target, state);
  if (!obj) return { actions: [], message: `You don't see "${target}" to read.` };
  if (obj.readText) return { actions: [], message: obj.readText };
  if (obj.readable) return { actions: [], message: obj.description };
  return { actions: [], message: `There's nothing to read on the ${obj.name}.` };
}

function handleGive(state, scene, target) {
  if (!target) return { actions: [], message: 'Give what to whom?' };

  // Parse "give X to Y" or "give Y X"
  const parts = target.split(/\s+to\s+/i);
  if (parts.length < 2) {
    return { actions: [], message: 'Try: give [item] to [person]' };
  }

  const itemName = parts[0].trim();
  const npcName = parts[1].trim();

  const invItem = state.inventory.find(i => matchesTarget(itemName, i.id) || matchesTarget(itemName, i.name));
  if (!invItem) return { actions: [], message: `You don't have "${itemName}".` };

  const npc = findNPCByAlias(npcName, scene.npcs);
  if (!npc) return { actions: [], message: `"${npcName}" isn't here.` };

  return { actions: [], message: `${npc.name} doesn't want the ${invItem.name} right now.` };
}

function handleHelp() {
  const msg = `COMMANDS:
  LOOK [thing] — Examine your surroundings or an object
  GET [item] — Pick up an item
  USE [thing] — Use or interact with something
  TALK [person] — Talk to someone
  GO [direction] — Move (north/south/east/west or n/s/e/w)
  READ [thing] — Read text on something
  GIVE [item] TO [person] — Give an item
  INVENTORY — Check your items
  CLOJURE — Open the Clojure console
  SAVE / LOAD — Save or load your game
  HELP — Show this help

TIPS:
  • Talk to everyone! NPCs teach you Clojure concepts.
  • USE terminals to start coding puzzles.
  • Type "look" to see what's around you.
  • Can't go somewhere? You might need to solve a puzzle first!`;
  return { actions: [], message: msg };
}

function handleInventory(state) {
  if (state.inventory.length === 0) {
    return { actions: [], message: 'Your inventory is empty.' };
  }
  const items = state.inventory.map(i => `  • ${i.name}`).join('\n');
  return { actions: [], message: `You are carrying:\n${items}` };
}

function handleClojure(state, scene) {
  // Find the first available puzzle in the scene
  if (scene.puzzles && scene.puzzles.length > 0) {
    for (const puzzleId of scene.puzzles) {
      const puzzle = getPuzzleById(puzzleId);
      if (puzzle && !state.completedPuzzles.includes(puzzleId)) {
        return {
          actions: [{ type: 'OPEN_CLOJURE_CONSOLE', puzzleId }],
          message: 'Opening the Clojure console...',
        };
      }
    }
  }
  // Open free-form REPL
  return {
    actions: [{ type: 'OPEN_CLOJURE_CONSOLE', puzzleId: null }],
    message: 'Opening the Clojure REPL. Type Clojure expressions to experiment!',
  };
}

function handleEat(state, target) {
  if (!target) return { actions: [], message: 'Eat what?' };
  const item = state.inventory.find(i => matchesTarget(target, i.id) || matchesTarget(target, i.name));
  if (!item) return { actions: [], message: `You don't have "${target}" to eat.` };
  return { actions: [], message: `The ${item.name} doesn't look edible!` };
}

// ---- Helpers ----

function findObject(scene, target, state) {
  const t = target.toLowerCase();
  for (const obj of scene.objects) {
    // Skip items already taken
    if (obj.canTake && state.inventory.some(i => i.id === obj.id)) continue;
    // Skip items with unmet flag requirements
    if (obj.requiresFlag && !state.flags[obj.requiresFlag]) continue;

    if (obj.id === t || obj.name.toLowerCase() === t) return obj;
    if (obj.aliases && obj.aliases.some(a => t.includes(a.toLowerCase()))) return obj;
    if (t.includes(obj.id) || t.includes(obj.name.toLowerCase())) return obj;
  }
  return null;
}

function matchesTarget(input, target) {
  if (!input || !target) return false;
  const a = input.toLowerCase();
  const b = target.toLowerCase();
  return a === b || a.includes(b) || b.includes(a);
}
