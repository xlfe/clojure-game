// NPC definitions with dialogue trees (data only)

export const NPCS = {
  // ===== World 1: Enchanted Grove =====
  'wizard-parenthesis': {
    id: 'wizard-parenthesis',
    name: 'Wizard Parenthesis',
    aliases: ['wizard', 'parenthesis', 'old wizard', 'old man'],
    world: 'enchanted-grove',
    description: 'An ancient wizard in sparkling robes. His long beard is braided with glowing runes shaped like parentheses.',
    dialogue: [
      {
        condition: (flags) => !flags.talkedToWizard,
        text: 'Welcome, young coder! I am Wizard Parenthesis, keeper of the ancient language of Clojure. In this world, everything is an expression wrapped in parentheses — like (+ 1 2)! The function always comes FIRST. Talk to me again after you\'ve tried the terminal in the meadow.',
        setsFlag: 'talkedToWizard',
        points: 5,
      },
      {
        condition: (flags) => flags.talkedToWizard && !flags.learnedBasicClojure,
        text: 'Head east to the Sparkle Meadow and find the magic terminal. Type your first Clojure spell there! Remember: parentheses are your friends, not your enemies!',
      },
      {
        condition: (flags) => flags.learnedBasicClojure,
        text: 'Excellent work! You\'re learning fast. Keep exploring — there are many more spells to discover. Each world teaches you new powers!',
      },
    ],
  },
  'melody-fox': {
    id: 'melody-fox',
    name: 'Melody the Sparkle Fox',
    aliases: ['melody', 'fox', 'sparkle fox'],
    world: 'enchanted-grove',
    description: 'A shimmering fox with fur that changes color like a rainbow. Musical notes float around her.',
    dialogue: [
      {
        condition: (flags) => !flags.metMelody,
        text: 'Hi there! I\'m Melody! I love music AND code — they\'re both about patterns! Did you know that (first (list "do" "re" "mi")) gives you just "do"? Lists are like playlists!',
        setsFlag: 'metMelody',
        points: 5,
      },
      {
        condition: (flags) => flags.metMelody,
        text: 'Try using first and rest on lists! first gets the first thing, and rest gets everything else. It\'s like a playlist — first song, then the rest!',
      },
    ],
  },
  'dj-bracket': {
    id: 'dj-bracket',
    name: 'DJ Bracket',
    aliases: ['dj', 'bracket', 'frog', 'dj bracket'],
    world: 'enchanted-grove',
    description: 'A funky frog wearing headphones and a tiny DJ booth made of crystal. Beats pulse from tiny speakers.',
    dialogue: [
      {
        condition: (flags) => !flags.metDJ,
        text: 'Yo yo yo! I\'m DJ Bracket! Check it — in Clojure, square brackets [] make vectors, and curly braces {} make maps. But the REAL magic? Parentheses ()! Drop some beats with (str "boom" " " "bap")!',
        setsFlag: 'metDJ',
        points: 5,
      },
      {
        condition: (flags) => flags.metDJ,
        text: 'Keep mixin\' those expressions! Try nesting them — like a beat inside a beat inside a beat! (str "Stars: " (+ 10 20))... that\'s a remix!',
      },
    ],
  },

  // ===== World 2: Dragon Highlands =====
  'ember': {
    id: 'ember',
    name: 'Ember the Fire Dragon',
    aliases: ['ember', 'fire dragon', 'dragon'],
    world: 'dragon-highlands',
    description: 'A majestic red dragon with scales that glow like embers. Smoke curls from her nostrils as she studies an ancient codex.',
    dialogue: [
      {
        condition: (flags) => !flags.metEmber,
        text: 'Greetings, hatchling! I am Ember, scholar of the flames. In the Dragon Highlands, we make DECISIONS with our code. if is the simplest: (if condition then else). Like choosing whether to breathe fire or ice!',
        setsFlag: 'metEmber',
        points: 5,
      },
      {
        condition: (flags) => flags.metEmber && !flags.learnedIf,
        text: 'Try the terminal on Fire Ridge. The if expression has three parts: the test, what happens if true, and what happens if false. Like: (if (> temperature 100) "fire" "ice")',
      },
      {
        condition: (flags) => flags.learnedIf,
        text: 'Well done! But what if you need MORE than two choices? That\'s when you use cond — it\'s like a chain of if statements. Ask Tsunami about it in the Sea Caves!',
      },
    ],
  },
  'tsunami': {
    id: 'tsunami',
    name: 'Tsunami the Sea Dragon',
    aliases: ['tsunami', 'sea dragon', 'water dragon'],
    world: 'dragon-highlands',
    description: 'A sleek blue dragon with rippling aqua scales. Water orbits around her like living jewelry.',
    dialogue: [
      {
        condition: (flags) => !flags.metTsunami,
        text: 'Hey! I\'m Tsunami. I don\'t just breathe water — I CODE with it! defn lets you create your OWN functions. Like: (defn splash [x] (* x 3)). Then you can use (splash 5) to get 15! Functions are reusable spells!',
        setsFlag: 'metTsunami',
        points: 5,
      },
      {
        condition: (flags) => flags.metTsunami,
        text: 'Functions are the BEST. Once you defn a function, you can call it as many times as you want. Try creating one at the terminal!',
      },
    ],
  },
  'starflight': {
    id: 'starflight',
    name: 'Starflight the Sky Dragon',
    aliases: ['starflight', 'sky dragon', 'night dragon'],
    world: 'dragon-highlands',
    description: 'A dark purple dragon whose scales shimmer like a starry night sky. He\'s surrounded by floating books.',
    dialogue: [
      {
        condition: (flags) => !flags.metStarflight,
        text: 'Oh! Hello! I\'m Starflight. I love studying let bindings! let creates temporary names for values: (let [x 10 y 20] (+ x y)). The names only exist inside the let — they\'re local, like a secret code!',
        setsFlag: 'metStarflight',
        points: 5,
      },
      {
        condition: (flags) => flags.metStarflight,
        text: 'let is super useful when you need to compute something step by step. The bindings go in pairs: name value name value. Then use them in the body expression!',
      },
    ],
  },

  // ===== World 3: Shadow Forest =====
  'luna': {
    id: 'luna',
    name: 'Luna the Wolf Girl',
    aliases: ['luna', 'wolf girl', 'wolf', 'girl'],
    world: 'shadow-forest',
    description: 'A girl with wild silver hair and wolf ears. Her eyes glow amber in the moonlight. A spectral wolf stands beside her.',
    dialogue: [
      {
        condition: (flags) => !flags.metLuna,
        text: 'You... you can see me? Most humans can\'t. I\'m Luna. I can transform between human and wolf — just like how map TRANSFORMS a whole list at once! (map inc [1 2 3]) turns every number into the next one. The forest is cursed, but together we can break it!',
        setsFlag: 'metLuna',
        points: 5,
      },
      {
        condition: (flags) => flags.metLuna && !flags.learnedMap,
        text: 'map is like transformation magic — it applies a function to every element. filter is like choosing which wolves to call — it keeps only the ones that pass a test. Try them at the moonlit terminal!',
      },
      {
        condition: (flags) => flags.learnedMap,
        text: 'You\'re getting it! The deepest magic is reduce — it combines everything into one. Like how a pack is stronger together. We\'ll need that to break the curse.',
      },
    ],
  },
  'fang': {
    id: 'fang',
    name: 'Fang the Elder Wolf',
    aliases: ['fang', 'elder wolf', 'old wolf', 'elder'],
    world: 'shadow-forest',
    description: 'A massive grey wolf with wise, scarred eyes. Ancient runes are etched into his fur.',
    dialogue: [
      {
        condition: (flags) => !flags.metFang,
        text: 'Greetings, pup. I am Fang, keeper of pack wisdom. In Clojure, we store knowledge in MAPS: {:name "Fang" :age 150 :rank "elder"}. You can add to a map with assoc, read with get, and change with update. Maps are like the wisdom of the pack — organized and accessible.',
        setsFlag: 'metFang',
        points: 5,
      },
      {
        condition: (flags) => flags.metFang,
        text: 'Maps pair keys with values. Keywords like :name are great keys. assoc adds, get retrieves, update transforms. Master these, and you master the forest\'s data.',
      },
    ],
  },
  'willow': {
    id: 'willow',
    name: 'Willow the Tree Spirit',
    aliases: ['willow', 'tree spirit', 'spirit', 'tree'],
    world: 'shadow-forest',
    description: 'An ethereal being made of woven branches and glowing leaves. Her voice sounds like rustling wind.',
    dialogue: [
      {
        condition: (flags) => !flags.metWillow,
        text: 'Shhhh... listen to the wind. I am Willow. I know the threading macros — -> and ->>. They let data FLOW through transformations like water through roots. (-> 5 inc (* 3)) takes 5, adds 1 to get 6, then multiplies by 3 to get 18. Beautiful, isn\'t it?',
        setsFlag: 'metWillow',
        points: 5,
      },
      {
        condition: (flags) => flags.metWillow,
        text: '-> passes the result as the FIRST argument. ->> passes it as the LAST argument. For collections, ->> is usually what you want: (->> [1 2 3] (map inc) (filter even?))',
      },
    ],
  },
};

export function getNPC(id) {
  return NPCS[id] || null;
}

export function findNPCByAlias(alias, sceneNpcs) {
  const a = alias.toLowerCase();
  for (const npcId of sceneNpcs) {
    const npc = NPCS[npcId];
    if (!npc) continue;
    if (npc.id === a || npc.name.toLowerCase().includes(a) || npc.aliases.some(al => a.includes(al))) {
      return npc;
    }
  }
  return null;
}
