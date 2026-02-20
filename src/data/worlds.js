// World/chapter definitions (data only)

export const WORLDS = {
  'enchanted-grove': {
    id: 'enchanted-grove',
    name: 'The Enchanted Grove',
    subtitle: 'Learn the Basics',
    description: 'A magical forest of sparkles, music, and friendship. Taylor Swift-inspired aesthetics with glitter, concert vibes, and friendship bracelets.',
    theme: 'sparkle',
    scenes: ['cottage', 'garden', 'sparkle-meadow', 'friendship-bridge', 'crystal-cave', 'melody-clearing', 'enchanted-stage', 'starlight-pool'],
    startScene: 'cottage',
    teaches: ['prefix notation', 'arithmetic', 'strings', 'def', 'lists', 'first/rest', 'count', 'nested expressions'],
    color: 'lightMagenta',
  },
  'dragon-highlands': {
    id: 'dragon-highlands',
    name: 'The Dragon Highlands',
    subtitle: 'Master Control Flow',
    description: 'Volcanic peaks and dragon lairs inspired by Wings of Fire. Elemental dragons teach logic and functions.',
    theme: 'volcanic',
    scenes: ['dragon-gate', 'fire-ridge', 'sky-nest', 'sea-caves', 'prophecy-chamber', 'lava-bridge', 'crystal-hoard', 'dragon-council'],
    startScene: 'dragon-gate',
    teaches: ['if', 'cond', 'boolean logic', 'defn', 'fn', 'let', 'multi-arg functions', 'anonymous functions'],
    color: 'lightRed',
  },
  'shadow-forest': {
    id: 'shadow-forest',
    name: 'The Shadow Forest',
    subtitle: 'Wield Data & Composition',
    description: 'Moonlit forests of transformation, inspired by Wolf Girl. Pack dynamics, nature magic, and the power to break curses.',
    theme: 'moonlit',
    scenes: ['forest-edge', 'moonlit-path', 'wolf-den', 'ancient-tree', 'transformation-spring', 'shadow-maze', 'pack-summit', 'final-tower'],
    startScene: 'forest-edge',
    teaches: ['map', 'filter', 'reduce', 'maps', 'assoc/get/update', 'threading macros', 'loop/recur', 'composition'],
    color: 'lightCyan',
  },
};

export function getWorld(id) {
  return WORLDS[id] || null;
}

export function getWorldForScene(sceneId) {
  for (const world of Object.values(WORLDS)) {
    if (world.scenes.includes(sceneId)) return world;
  }
  return null;
}
