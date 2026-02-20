// Command definitions as data — no if/else chains

export const COMMANDS = {
  look: {
    name: 'look',
    aliases: ['look', 'l', 'examine', 'ex', 'x', 'inspect', 'view', 'see', 'check'],
    description: 'Look around or examine something',
    hasTarget: true,
  },
  get: {
    name: 'get',
    aliases: ['get', 'take', 'grab', 'pick', 'pickup', 'acquire'],
    description: 'Pick up an item',
    hasTarget: true,
  },
  use: {
    name: 'use',
    aliases: ['use', 'apply', 'put', 'insert', 'place'],
    description: 'Use an item or interact with something',
    hasTarget: true,
  },
  talk: {
    name: 'talk',
    aliases: ['talk', 'speak', 'chat', 'ask', 'greet', 'hello', 'hi'],
    description: 'Talk to someone',
    hasTarget: true,
  },
  go: {
    name: 'go',
    aliases: ['go', 'walk', 'move', 'travel', 'head'],
    description: 'Move in a direction',
    hasTarget: true,
  },
  open: {
    name: 'open',
    aliases: ['open', 'unlock'],
    description: 'Open something',
    hasTarget: true,
  },
  read: {
    name: 'read',
    aliases: ['read', 'study'],
    description: 'Read something',
    hasTarget: true,
  },
  give: {
    name: 'give',
    aliases: ['give', 'offer', 'hand', 'feed'],
    description: 'Give an item to someone',
    hasTarget: true,
  },
  help: {
    name: 'help',
    aliases: ['help', 'commands', '?', 'hint'],
    description: 'Show available commands',
    hasTarget: false,
  },
  inventory: {
    name: 'inventory',
    aliases: ['inventory', 'inv', 'i', 'items', 'bag'],
    description: 'Check your inventory',
    hasTarget: false,
  },
  clojure: {
    name: 'clojure',
    aliases: ['clojure', 'clj', 'repl', 'code', 'eval', 'lisp'],
    description: 'Open the Clojure console',
    hasTarget: false,
  },
  save: {
    name: 'save',
    aliases: ['save'],
    description: 'Save your game',
    hasTarget: false,
  },
  load: {
    name: 'load',
    aliases: ['load', 'restore'],
    description: 'Load a saved game',
    hasTarget: false,
  },
  eat: {
    name: 'eat',
    aliases: ['eat', 'consume', 'taste', 'bite'],
    description: 'Eat something',
    hasTarget: true,
  },
  cast: {
    name: 'cast',
    aliases: ['cast', 'spell'],
    description: 'Cast a spell (opens Clojure console)',
    hasTarget: false,
  },
};

export const DIRECTIONS = {
  north: ['north', 'n', 'forward', 'up'],
  south: ['south', 's', 'back', 'down'],
  east: ['east', 'e', 'right'],
  west: ['west', 'w', 'left'],
  enter: ['enter', 'in', 'inside'],
  exit: ['exit', 'out', 'outside', 'leave'],
};

// Prepositions/articles to strip from input
export const NOISE_WORDS = ['the', 'a', 'an', 'to', 'at', 'with', 'on', 'in', 'from', 'into', 'onto'];

export function parseDirection(word) {
  const w = word.toLowerCase();
  for (const [dir, aliases] of Object.entries(DIRECTIONS)) {
    if (aliases.includes(w)) return dir;
  }
  return null;
}

export function findCommand(verb) {
  const v = verb.toLowerCase();
  for (const cmd of Object.values(COMMANDS)) {
    if (cmd.aliases.includes(v)) return cmd;
  }
  return null;
}
