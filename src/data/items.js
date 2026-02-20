// All item definitions (data only)
// Items are referenced by scenes and can be in inventory

export const ITEMS = {
  // ===== World 1: Enchanted Grove =====
  'rainbow-flower': {
    id: 'rainbow-flower',
    name: 'Rainbow Flower',
    description: 'A beautiful flower that shimmers with all the colors of the rainbow.',
    canTake: true,
    points: 5,
  },
  'friendship-bracelet': {
    id: 'friendship-bracelet',
    name: 'Friendship Bracelet',
    description: 'A sparkling bracelet woven with colorful threads. It radiates warmth.',
    canTake: true,
    points: 10,
  },
  'crystal-shard': {
    id: 'crystal-shard',
    name: 'Crystal Shard',
    description: 'A glowing shard of pure crystallized magic. It hums with energy.',
    canTake: true,
    points: 10,
  },
  'melody-stone': {
    id: 'melody-stone',
    name: 'Melody Stone',
    description: 'A smooth stone that plays a soft tune when you hold it.',
    canTake: true,
    points: 5,
  },
  'sparkle-dust': {
    id: 'sparkle-dust',
    name: 'Sparkle Dust',
    description: 'A pouch of shimmering dust. Perfect for making things magical!',
    canTake: true,
    points: 5,
  },
  'starlight-gem': {
    id: 'starlight-gem',
    name: 'Starlight Gem',
    description: 'A gem that captures and radiates starlight. The key to the Grove\'s magic.',
    canTake: true,
    points: 15,
  },

  // ===== World 2: Dragon Highlands =====
  'fire-scale': {
    id: 'fire-scale',
    name: 'Fire Scale',
    description: 'A brilliantly red dragon scale. It\'s warm to the touch.',
    canTake: true,
    points: 10,
  },
  'sky-feather': {
    id: 'sky-feather',
    name: 'Sky Feather',
    description: 'A luminous blue feather from a sky dragon. It floats gently.',
    canTake: true,
    points: 10,
  },
  'sea-pearl': {
    id: 'sea-pearl',
    name: 'Sea Pearl',
    description: 'An iridescent pearl from the deepest sea cave. It glows aqua.',
    canTake: true,
    points: 10,
  },
  'prophecy-scroll': {
    id: 'prophecy-scroll',
    name: 'Prophecy Scroll',
    description: 'An ancient scroll written in dragon runes. It describes a powerful function...',
    canTake: true,
    points: 5,
  },
  'dragon-key': {
    id: 'dragon-key',
    name: 'Dragon Key',
    description: 'A key forged in dragon fire. It can open the path to the council.',
    canTake: true,
    points: 15,
  },
  'lava-crystal': {
    id: 'lava-crystal',
    name: 'Lava Crystal',
    description: 'A crystal formed in volcanic heat. It pulses with orange light.',
    canTake: true,
    points: 10,
  },

  // ===== World 3: Shadow Forest =====
  'moon-pendant': {
    id: 'moon-pendant',
    name: 'Moon Pendant',
    description: 'A pendant shaped like the crescent moon. It glows in the dark.',
    canTake: true,
    points: 10,
  },
  'wolf-fang': {
    id: 'wolf-fang',
    name: 'Wolf Fang',
    description: 'An ancient wolf fang carved with runes. It represents pack wisdom.',
    canTake: true,
    points: 10,
  },
  'shadow-cloak': {
    id: 'shadow-cloak',
    name: 'Shadow Cloak',
    description: 'A cloak woven from shadows. It makes you harder to see in the dark.',
    canTake: true,
    points: 10,
  },
  'ancient-acorn': {
    id: 'ancient-acorn',
    name: 'Ancient Acorn',
    description: 'An acorn from the Ancient Tree. It contains centuries of wisdom.',
    canTake: true,
    points: 10,
  },
  'transformation-potion': {
    id: 'transformation-potion',
    name: 'Transformation Potion',
    description: 'A bubbling green potion. One sip lets you understand the forest.',
    canTake: true,
    points: 10,
  },
  'curse-fragment': {
    id: 'curse-fragment',
    name: 'Curse Fragment',
    description: 'A dark crystal fragment. Collecting all of them weakens the curse.',
    canTake: true,
    points: 5,
  },
};

export function getItem(id) {
  return ITEMS[id] || null;
}
