// All scene definitions (data only — no draw functions)
// Draw functions are in renderer/scene-renderer.js

export const SCENES = {
  // ===============================================
  // WORLD 1: THE ENCHANTED GROVE
  // ===============================================

  'cottage': {
    id: 'cottage',
    name: "Wizard's Cottage",
    world: 'enchanted-grove',
    description: 'You stand in a cozy wizard\'s study. Bookshelves line the walls, filled with glowing spellbooks. A bubbling cauldron sits in the corner, and a window lets in warm sunlight. The old Wizard Parenthesis sits at his desk, surrounded by floating parentheses.',
    objects: [
      { id: 'spellbook', name: 'Spellbook', aliases: ['book', 'spell book', 'tome'], description: 'A thick book titled "Clojure for Young Wizards". Glowing parentheses float off its pages.', canTake: false, readable: true, readText: 'Chapter 1: Everything in Clojure starts with parentheses! (+ 1 2) means "add 1 and 2". The function always goes FIRST!' },
      { id: 'cauldron', name: 'Cauldron', aliases: ['pot', 'caldron'], description: 'A bubbling cauldron. The bubbles form numbers: 1, 1, 2, 3, 5, 8, 13... it\'s computing Fibonacci!', canTake: false },
      { id: 'window', name: 'Window', aliases: ['glass'], description: 'Through the window you can see a beautiful garden with flowers and a magic terminal.', canTake: false },
    ],
    npcs: ['wizard-parenthesis'],
    exits: {
      east: { to: 'garden', requiresFlag: 'talkedToWizard', failMessage: 'The wizard calls out — "Wait! Come talk to me first before you go exploring!"' },
      outside: { to: 'garden', requiresFlag: 'talkedToWizard', failMessage: 'Talk to the wizard first!' },
    },
    puzzles: [],
  },

  'garden': {
    id: 'garden',
    name: 'The Cottage Garden',
    world: 'enchanted-grove',
    description: 'A lovely garden outside the cottage. Colorful flowers bloom everywhere, butterflies dance in the air, and a stone path leads east toward a shimmering meadow. A sign post points the way.',
    objects: [
      { id: 'rainbow-flower', name: 'Rainbow Flower', aliases: ['flower', 'flowers'], description: 'A beautiful flower that shimmers with all the colors of the rainbow.', canTake: true, points: 5 },
      { id: 'signpost', name: 'Signpost', aliases: ['sign', 'post'], description: 'A wooden sign reads: "EAST → Sparkle Meadow | NORTH → Friendship Bridge"', canTake: false, readable: true, readText: 'EAST → Sparkle Meadow | NORTH → Friendship Bridge' },
    ],
    npcs: [],
    exits: {
      west: { to: 'cottage' },
      east: { to: 'sparkle-meadow' },
      north: { to: 'friendship-bridge', requiresFlag: 'learnedBasicClojure', failMessage: 'The path to the north shimmers but seems blocked by a magical barrier. Maybe learning some Clojure will open it?' },
    },
    puzzles: [],
  },

  'sparkle-meadow': {
    id: 'sparkle-meadow',
    name: 'Sparkle Meadow',
    world: 'enchanted-grove',
    description: 'A dazzling meadow where the grass itself sparkles like glitter. A magic terminal sits on a crystal pedestal, glowing with invitation. Tiny sparkles float through the air like fireflies.',
    objects: [
      { id: 'terminal', name: 'Magic Terminal', aliases: ['terminal', 'computer', 'pedestal', 'screen'], description: 'A crystalline terminal that responds to Clojure code. It glows softly, waiting for your first spell.', canTake: false, usable: true, startsPuzzle: 'prefix-notation' },
      { id: 'sparkle-dust', name: 'Sparkle Dust', aliases: ['dust', 'glitter', 'sparkles'], description: 'A small pouch of shimmering sparkle dust. It seems magical!', canTake: true, points: 5 },
    ],
    npcs: ['melody-fox'],
    exits: {
      west: { to: 'garden' },
      south: { to: 'melody-clearing', requiresFlag: 'solvedPrefixNotation', failMessage: 'A sparkling barrier blocks the south path. Solve the terminal puzzle first!' },
    },
    puzzles: ['prefix-notation', 'variadic-add'],
    useInteractions: [
      { item: null, target: 'terminal', startsPuzzle: 'prefix-notation', condition: (flags) => !flags.solvedPrefixNotation },
      { item: null, target: 'terminal', startsPuzzle: 'variadic-add', condition: (flags) => flags.solvedPrefixNotation && !flags.solvedVariadicAdd },
    ],
  },

  'friendship-bridge': {
    id: 'friendship-bridge',
    name: 'Friendship Bridge',
    world: 'enchanted-grove',
    description: 'A beautiful bridge made of woven rainbow threads stretches over a sparkling stream. Friendship bracelets hang from the railings. A terminal glows on one side.',
    objects: [
      { id: 'friendship-bracelet', name: 'Friendship Bracelet', aliases: ['bracelet', 'bead bracelet'], description: 'A colorful friendship bracelet. It says "CODE FRIENDS FOREVER" in tiny beads.', canTake: true, points: 10 },
      { id: 'bridge-terminal', name: 'Bridge Terminal', aliases: ['terminal', 'computer'], description: 'A terminal decorated with friendship bracelets. It wants you to join words together!', canTake: false, usable: true, startsPuzzle: 'string-concat' },
    ],
    npcs: [],
    exits: {
      south: { to: 'garden' },
      north: { to: 'crystal-cave', requiresFlag: 'solvedStringConcat', failMessage: 'The bridge extends further north, but a word-barrier blocks the way. Try the terminal!' },
    },
    puzzles: ['string-concat'],
    useInteractions: [
      { item: null, target: 'bridge-terminal', startsPuzzle: 'string-concat', condition: (flags) => !flags.solvedStringConcat },
    ],
  },

  'crystal-cave': {
    id: 'crystal-cave',
    name: 'Crystal Cave',
    world: 'enchanted-grove',
    description: 'A cavern filled with massive glowing crystals in every color. Light refracts through them creating rainbow patterns on the walls. A terminal grows from a crystal formation.',
    objects: [
      { id: 'crystal-shard', name: 'Crystal Shard', aliases: ['crystal', 'shard', 'gem'], description: 'A piece of pure crystallized Clojure magic. It hums when you speak code near it.', canTake: true, points: 10 },
      { id: 'cave-terminal', name: 'Crystal Terminal', aliases: ['terminal', 'computer'], description: 'A terminal that has grown naturally from the crystal formations. It asks you to give a crystal a name.', canTake: false, usable: true, startsPuzzle: 'define-value' },
    ],
    npcs: [],
    exits: {
      south: { to: 'friendship-bridge' },
      east: { to: 'melody-clearing', requiresFlag: 'solvedDefineValue', failMessage: 'The cave passage glows but won\'t open. The crystal terminal needs you to define a value first!' },
    },
    puzzles: ['define-value'],
    useInteractions: [
      { item: null, target: 'cave-terminal', startsPuzzle: 'define-value', condition: (flags) => !flags.solvedDefineValue },
    ],
  },

  'melody-clearing': {
    id: 'melody-clearing',
    name: 'Melody Clearing',
    world: 'enchanted-grove',
    description: 'A circular clearing where musical notes float visibly in the air. Tree stumps form a natural amphitheater. DJ Bracket\'s booth pulses with bass. A terminal sits center stage.',
    objects: [
      { id: 'melody-stone', name: 'Melody Stone', aliases: ['stone', 'music stone'], description: 'A smooth stone that plays a tune when held. Each note is an element in a list!', canTake: true, points: 5 },
      { id: 'clearing-terminal', name: 'Stage Terminal', aliases: ['terminal', 'computer'], description: 'A terminal on the stage. Musical notes float around it — it wants you to make a list!', canTake: false, usable: true, startsPuzzle: 'create-list' },
    ],
    npcs: ['dj-bracket'],
    exits: {
      north: { to: 'sparkle-meadow' },
      west: { to: 'crystal-cave' },
      south: { to: 'enchanted-stage', requiresFlag: 'solvedFirstElement', failMessage: 'The path to the grand stage is locked. Keep solving puzzles here!' },
    },
    puzzles: ['create-list', 'first-element'],
    useInteractions: [
      { item: null, target: 'clearing-terminal', startsPuzzle: 'create-list', condition: (flags) => !flags.solvedCreateList },
      { item: null, target: 'clearing-terminal', startsPuzzle: 'first-element', condition: (flags) => flags.solvedCreateList && !flags.solvedFirstElement },
    ],
  },

  'enchanted-stage': {
    id: 'enchanted-stage',
    name: 'The Enchanted Stage',
    world: 'enchanted-grove',
    description: 'A magnificent outdoor concert stage decorated with sparkles and glowing lights. The stage is set for a grand performance! A spotlight shines on a terminal at center stage.',
    objects: [
      { id: 'stage-terminal', name: 'Stage Terminal', aliases: ['terminal', 'computer'], description: 'The grand terminal on stage. It\'s time to learn about rest and count!', canTake: false, usable: true, startsPuzzle: 'rest-list' },
      { id: 'concert-poster', name: 'Concert Poster', aliases: ['poster'], description: 'A poster reads: "TONIGHT: The Clojure Code Concert! Learn rest and count!"', canTake: false, readable: true, readText: 'TONIGHT: The Clojure Code Concert! Special guests: rest and count!' },
    ],
    npcs: [],
    exits: {
      north: { to: 'melody-clearing' },
      east: { to: 'starlight-pool', requiresFlag: 'solvedCountList', failMessage: 'The path to the Starlight Pool needs more musical knowledge. Keep practicing!' },
    },
    puzzles: ['rest-list', 'count-list'],
    useInteractions: [
      { item: null, target: 'stage-terminal', startsPuzzle: 'rest-list', condition: (flags) => !flags.solvedRestList },
      { item: null, target: 'stage-terminal', startsPuzzle: 'count-list', condition: (flags) => flags.solvedRestList && !flags.solvedCountList },
    ],
  },

  'starlight-pool': {
    id: 'starlight-pool',
    name: 'Starlight Pool',
    world: 'enchanted-grove',
    description: 'A magical pool that reflects the stars even in daylight. The water glows with inner light. This is the heart of the Enchanted Grove — and the gateway to the Dragon Highlands! A grand terminal floats above the water.',
    objects: [
      { id: 'starlight-gem', name: 'Starlight Gem', aliases: ['gem', 'starlight', 'star gem'], description: 'A gem that captures and radiates starlight. The ultimate treasure of the Grove.', canTake: true, points: 15, requiresFlag: 'solvedNestedExpressions' },
      { id: 'pool-terminal', name: 'Pool Terminal', aliases: ['terminal', 'computer', 'floating terminal'], description: 'A terminal that floats above the starlit pool. It\'s time for the final Grove challenges!', canTake: false, usable: true, startsPuzzle: 'multiply' },
      { id: 'world-gate', name: 'World Gate', aliases: ['gate', 'portal', 'door'], description: 'A shimmering portal that leads to the Dragon Highlands. It needs the power of nested expressions to open!', canTake: false },
    ],
    npcs: [],
    exits: {
      west: { to: 'enchanted-stage' },
      north: { to: 'dragon-gate', requiresFlag: 'solvedNestedExpressions', failMessage: 'The portal to the Dragon Highlands flickers but won\'t open. Solve all the pool terminal puzzles first!' },
    },
    puzzles: ['multiply', 'nested-expressions'],
    useInteractions: [
      { item: null, target: 'pool-terminal', startsPuzzle: 'multiply', condition: (flags) => !flags.solvedMultiply },
      { item: null, target: 'pool-terminal', startsPuzzle: 'nested-expressions', condition: (flags) => flags.solvedMultiply && !flags.solvedNestedExpressions },
    ],
  },

  // ===============================================
  // WORLD 2: THE DRAGON HIGHLANDS
  // ===============================================

  'dragon-gate': {
    id: 'dragon-gate',
    name: 'The Dragon Gate',
    world: 'dragon-highlands',
    description: 'Massive stone gates carved with dragon reliefs tower before you. Beyond them, volcanic peaks glow against a fiery sky. The air is warm and smells of sulfur and adventure. Ember the Fire Dragon guards the entrance.',
    objects: [
      { id: 'dragon-statue', name: 'Dragon Statue', aliases: ['statue', 'carving'], description: 'An ancient stone dragon. Its eyes seem to follow you. An inscription reads: "if you are brave, enter."', canTake: false, readable: true, readText: '"Those who master if shall command the flames. Those who master cond shall rule the highlands."' },
    ],
    npcs: ['ember'],
    exits: {
      south: { to: 'starlight-pool' },
      east: { to: 'fire-ridge', requiresFlag: 'metEmber', failMessage: 'Ember blocks the path. "Speak with me first, hatchling!"' },
    },
    puzzles: [],
  },

  'fire-ridge': {
    id: 'fire-ridge',
    name: 'Fire Ridge',
    world: 'dragon-highlands',
    description: 'A ridge of volcanic rock overlooking rivers of lava below. The heat shimmers in the air. Fire geysers erupt periodically. A terminal carved from obsidian sits on a ledge.',
    objects: [
      { id: 'fire-scale', name: 'Fire Scale', aliases: ['scale', 'dragon scale', 'red scale'], description: 'A brilliantly red dragon scale that fell from Ember. It\'s warm to the touch.', canTake: true, points: 10 },
      { id: 'fire-terminal', name: 'Obsidian Terminal', aliases: ['terminal', 'computer', 'obsidian'], description: 'A terminal carved from volcanic obsidian. Lava flows through its circuits. Time to learn if and cond!', canTake: false, usable: true, startsPuzzle: 'if-conditional' },
    ],
    npcs: [],
    exits: {
      west: { to: 'dragon-gate' },
      north: { to: 'sky-nest', requiresFlag: 'solvedCondMultiway', failMessage: 'The path up to the Sky Nest requires mastery of conditionals. Solve both terminal puzzles!' },
    },
    puzzles: ['if-conditional', 'cond-multiway'],
    useInteractions: [
      { item: null, target: 'fire-terminal', startsPuzzle: 'if-conditional', condition: (flags) => !flags.solvedIfConditional },
      { item: null, target: 'fire-terminal', startsPuzzle: 'cond-multiway', condition: (flags) => flags.solvedIfConditional && !flags.solvedCondMultiway },
    ],
  },

  'sky-nest': {
    id: 'sky-nest',
    name: 'Sky Nest',
    world: 'dragon-highlands',
    description: 'A nest built on the highest peak, above the clouds. You can see the entire world from here! Baby sky dragons play among fluffy clouds. A wind-powered terminal spins gently.',
    objects: [
      { id: 'sky-feather', name: 'Sky Feather', aliases: ['feather', 'blue feather'], description: 'A luminous blue feather from a sky dragon. It floats when released.', canTake: true, points: 10 },
      { id: 'sky-terminal', name: 'Wind Terminal', aliases: ['terminal', 'computer'], description: 'A terminal powered by mountain winds. It teaches boolean logic and function definition!', canTake: false, usable: true, startsPuzzle: 'boolean-logic' },
    ],
    npcs: [],
    exits: {
      south: { to: 'fire-ridge' },
      east: { to: 'sea-caves', requiresFlag: 'solvedDefineFunction', failMessage: 'The sky bridge to the Sea Caves needs function power to activate!' },
    },
    puzzles: ['boolean-logic', 'define-function'],
    useInteractions: [
      { item: null, target: 'sky-terminal', startsPuzzle: 'boolean-logic', condition: (flags) => !flags.solvedBooleanLogic },
      { item: null, target: 'sky-terminal', startsPuzzle: 'define-function', condition: (flags) => flags.solvedBooleanLogic && !flags.solvedDefineFunction },
    ],
  },

  'sea-caves': {
    id: 'sea-caves',
    name: 'Sea Caves',
    world: 'dragon-highlands',
    description: 'Underwater caverns lit by bioluminescent coral. Water drips musically from stalactites. Tsunami the Sea Dragon swims gracefully through an underground river. A coral terminal glows aqua.',
    objects: [
      { id: 'sea-pearl', name: 'Sea Pearl', aliases: ['pearl'], description: 'An iridescent pearl from the deepest cave. It glows aqua.', canTake: true, points: 10 },
      { id: 'sea-terminal', name: 'Coral Terminal', aliases: ['terminal', 'computer', 'coral'], description: 'A terminal made of living coral. It teaches string functions and let bindings!', canTake: false, usable: true, startsPuzzle: 'function-with-strings' },
    ],
    npcs: ['tsunami'],
    exits: {
      west: { to: 'sky-nest' },
      south: { to: 'prophecy-chamber', requiresFlag: 'solvedLetBindings', failMessage: 'The underwater passage needs local binding magic to illuminate!' },
    },
    puzzles: ['function-with-strings', 'let-bindings'],
    useInteractions: [
      { item: null, target: 'sea-terminal', startsPuzzle: 'function-with-strings', condition: (flags) => !flags.solvedFunctionWithStrings },
      { item: null, target: 'sea-terminal', startsPuzzle: 'let-bindings', condition: (flags) => flags.solvedFunctionWithStrings && !flags.solvedLetBindings },
    ],
  },

  'prophecy-chamber': {
    id: 'prophecy-chamber',
    name: 'Prophecy Chamber',
    world: 'dragon-highlands',
    description: 'An ancient chamber deep underground. Dragon prophecies are carved into every wall, glowing with ancient fire. A prophecy terminal sits on an altar, surrounded by candles.',
    objects: [
      { id: 'prophecy-scroll', name: 'Prophecy Scroll', aliases: ['scroll', 'prophecy'], description: 'The scroll reads: "One function to find the maximum, three arguments it shall take..."', canTake: true, points: 5, readable: true, readText: '"When three powers are compared, only the greatest shall prevail. Write the function of max-power."' },
      { id: 'prophecy-terminal', name: 'Prophecy Terminal', aliases: ['terminal', 'computer', 'altar'], description: 'An ancient terminal on a stone altar. The prophecy demands a multi-argument function!', canTake: false, usable: true, startsPuzzle: 'multi-arg-function' },
    ],
    npcs: ['starflight'],
    exits: {
      north: { to: 'sea-caves' },
      east: { to: 'lava-bridge', requiresFlag: 'solvedMultiArgFunction', failMessage: 'The prophecy must be fulfilled before the path opens!' },
    },
    puzzles: ['multi-arg-function'],
    useInteractions: [
      { item: null, target: 'prophecy-terminal', startsPuzzle: 'multi-arg-function', condition: (flags) => !flags.solvedMultiArgFunction },
    ],
  },

  'lava-bridge': {
    id: 'lava-bridge',
    name: 'Lava Bridge',
    world: 'dragon-highlands',
    description: 'A narrow bridge of cooled lava spans a river of molten rock. The bridge glows red at the edges. On the far side, you can see a crystal hoard glittering. A terminal made of cooled lava sits at the bridge\'s midpoint.',
    objects: [
      { id: 'lava-crystal', name: 'Lava Crystal', aliases: ['crystal', 'lava stone'], description: 'A crystal formed in volcanic heat. It pulses with orange light.', canTake: true, points: 10 },
      { id: 'lava-terminal', name: 'Lava Terminal', aliases: ['terminal', 'computer'], description: 'A terminal of cooled lava. It teaches anonymous functions — fn!', canTake: false, usable: true, startsPuzzle: 'anonymous-function' },
    ],
    npcs: [],
    exits: {
      west: { to: 'prophecy-chamber' },
      east: { to: 'crystal-hoard', requiresFlag: 'solvedAnonymousFunction', failMessage: 'The bridge won\'t solidify further without the power of anonymous functions!' },
    },
    puzzles: ['anonymous-function'],
    useInteractions: [
      { item: null, target: 'lava-terminal', startsPuzzle: 'anonymous-function', condition: (flags) => !flags.solvedAnonymousFunction },
    ],
  },

  'crystal-hoard': {
    id: 'crystal-hoard',
    name: 'Crystal Hoard',
    world: 'dragon-highlands',
    description: 'A vast cavern filled with glittering crystals of every size and color. This is where dragons store their most precious treasures — and knowledge. A magnificent terminal sits atop a pile of gems.',
    objects: [
      { id: 'dragon-key', name: 'Dragon Key', aliases: ['key', 'golden key'], description: 'A key forged in dragon fire. It opens the way to the Dragon Council.', canTake: true, points: 15, requiresFlag: 'solvedCombinedLogic' },
      { id: 'hoard-terminal', name: 'Crystal Hoard Terminal', aliases: ['terminal', 'computer'], description: 'The most ornate terminal yet. It challenges you to combine defn with cond!', canTake: false, usable: true, startsPuzzle: 'combined-logic' },
    ],
    npcs: [],
    exits: {
      west: { to: 'lava-bridge' },
      north: { to: 'dragon-council', requiresFlag: 'hasDragonKey', failMessage: 'The council door is locked. You need the Dragon Key!' },
    },
    puzzles: ['combined-logic'],
    useInteractions: [
      { item: null, target: 'hoard-terminal', startsPuzzle: 'combined-logic', condition: (flags) => !flags.solvedCombinedLogic },
      { item: 'dragon-key', target: 'dragon-council', message: 'You insert the Dragon Key. The massive doors swing open!', setsFlag: 'dragonCouncilOpen' },
    ],
  },

  'dragon-council': {
    id: 'dragon-council',
    name: 'Dragon Council',
    world: 'dragon-highlands',
    description: 'The grand council chamber of the dragons! Three enormous thrones hold Ember, Tsunami, and Starflight. The ceiling is open to the starry sky. A final terminal sits in the center of the council ring. Beyond is the portal to the Shadow Forest!',
    objects: [
      { id: 'council-terminal', name: 'Council Terminal', aliases: ['terminal', 'computer'], description: 'The Dragon Council\'s terminal. The final challenge: write a dragon element classifier!', canTake: false, usable: true, startsPuzzle: 'dragon-classifier' },
      { id: 'forest-portal', name: 'Forest Portal', aliases: ['portal', 'gate'], description: 'A swirling green portal. Through it, you glimpse dark trees and moonlight. The Shadow Forest awaits!', canTake: false },
    ],
    npcs: [],
    exits: {
      south: { to: 'crystal-hoard' },
      north: { to: 'forest-edge', requiresFlag: 'solvedDragonClassifier', failMessage: 'The Forest Portal remains dormant. Complete the Dragon Council challenge!' },
    },
    puzzles: ['dragon-classifier'],
    useInteractions: [
      { item: null, target: 'council-terminal', startsPuzzle: 'dragon-classifier', condition: (flags) => !flags.solvedDragonClassifier },
    ],
  },

  // ===============================================
  // WORLD 3: THE SHADOW FOREST
  // ===============================================

  'forest-edge': {
    id: 'forest-edge',
    name: 'Forest Edge',
    world: 'shadow-forest',
    description: 'The edge of the Shadow Forest. Tall dark trees loom ahead, but moonlight filters through the canopy creating silver patterns on the ground. You can hear wolves howling in the distance. Luna the Wolf Girl stands at the treeline.',
    objects: [
      { id: 'moon-pendant', name: 'Moon Pendant', aliases: ['pendant', 'necklace', 'moon'], description: 'A crescent moon pendant hanging from a branch. It glows softly.', canTake: true, points: 10 },
    ],
    npcs: ['luna'],
    exits: {
      south: { to: 'dragon-council' },
      north: { to: 'moonlit-path', requiresFlag: 'metLuna', failMessage: 'The forest is dark and confusing. Maybe Luna can guide you?' },
    },
    puzzles: [],
  },

  'moonlit-path': {
    id: 'moonlit-path',
    name: 'Moonlit Path',
    world: 'shadow-forest',
    description: 'A winding path lit by moonbeams. The trees here are ancient and tall. Glowing mushrooms line the path. A terminal carved into a tree stump glows with moonlight.',
    objects: [
      { id: 'path-terminal', name: 'Moon Terminal', aliases: ['terminal', 'computer', 'stump'], description: 'A terminal in an ancient stump. It teaches map and filter — transformation magic!', canTake: false, usable: true, startsPuzzle: 'map-transform' },
      { id: 'glowing-mushroom', name: 'Glowing Mushroom', aliases: ['mushroom', 'shroom'], description: 'A bioluminescent mushroom. It pulses gently in blue and purple.', canTake: false },
    ],
    npcs: [],
    exits: {
      south: { to: 'forest-edge' },
      east: { to: 'wolf-den', requiresFlag: 'solvedFilterSelect', failMessage: 'The path deeper into the forest is shrouded in shadow. Master filter to clear it!' },
    },
    puzzles: ['map-transform', 'filter-select'],
    useInteractions: [
      { item: null, target: 'path-terminal', startsPuzzle: 'map-transform', condition: (flags) => !flags.solvedMapTransform },
      { item: null, target: 'path-terminal', startsPuzzle: 'filter-select', condition: (flags) => flags.solvedMapTransform && !flags.solvedFilterSelect },
    ],
  },

  'wolf-den': {
    id: 'wolf-den',
    name: 'Wolf Den',
    world: 'shadow-forest',
    description: 'A cozy den beneath an enormous oak tree. Wolf pups play-fight while Fang the Elder Wolf watches from a mossy boulder. Bones, pelts, and carved runestones decorate the space. A terminal sits by the fire pit.',
    objects: [
      { id: 'wolf-fang-item', name: 'Wolf Fang', aliases: ['fang tooth', 'tooth'], description: 'An ancient wolf fang carved with runes of pack wisdom.', canTake: true, points: 10 },
      { id: 'den-terminal', name: 'Den Terminal', aliases: ['terminal', 'computer'], description: 'A terminal by the fire pit. It teaches reduce and assoc — combining and storing knowledge!', canTake: false, usable: true, startsPuzzle: 'reduce-combine' },
    ],
    npcs: ['fang'],
    exits: {
      west: { to: 'moonlit-path' },
      north: { to: 'ancient-tree', requiresFlag: 'solvedAssocMap', failMessage: 'Fang blocks the north path. "Learn to store wisdom in maps before you seek the Ancient Tree."' },
    },
    puzzles: ['reduce-combine', 'assoc-map'],
    useInteractions: [
      { item: null, target: 'den-terminal', startsPuzzle: 'reduce-combine', condition: (flags) => !flags.solvedReduceCombine },
      { item: null, target: 'den-terminal', startsPuzzle: 'assoc-map', condition: (flags) => flags.solvedReduceCombine && !flags.solvedAssocMap },
    ],
  },

  'ancient-tree': {
    id: 'ancient-tree',
    name: 'The Ancient Tree',
    world: 'shadow-forest',
    description: 'The oldest tree in the forest — thousands of years old, wider than a house. Its bark is covered in glowing symbols. Willow the Tree Spirit lives within. A terminal grows from the tree\'s roots.',
    objects: [
      { id: 'ancient-acorn', name: 'Ancient Acorn', aliases: ['acorn', 'seed'], description: 'An acorn from the Ancient Tree. It holds centuries of accumulated wisdom.', canTake: true, points: 10 },
      { id: 'tree-terminal', name: 'Root Terminal', aliases: ['terminal', 'computer', 'root'], description: 'A terminal woven into the tree\'s roots. It teaches get — reading from maps!', canTake: false, usable: true, startsPuzzle: 'get-from-map' },
    ],
    npcs: ['willow'],
    exits: {
      south: { to: 'wolf-den' },
      east: { to: 'transformation-spring', requiresFlag: 'solvedGetFromMap', failMessage: 'The ancient bark door won\'t open. Learn to read from maps first!' },
    },
    puzzles: ['get-from-map'],
    useInteractions: [
      { item: null, target: 'tree-terminal', startsPuzzle: 'get-from-map', condition: (flags) => !flags.solvedGetFromMap },
    ],
  },

  'transformation-spring': {
    id: 'transformation-spring',
    name: 'Transformation Spring',
    world: 'shadow-forest',
    description: 'A mystical spring where the water glows silver under the moon. Things that touch the water transform — leaves become butterflies, stones become gems. A terminal shaped like a flowing waterfall stands nearby.',
    objects: [
      { id: 'transformation-potion', name: 'Transformation Potion', aliases: ['potion', 'bottle', 'elixir'], description: 'A bottle of spring water that shimmers with transformation magic.', canTake: true, points: 10 },
      { id: 'spring-terminal', name: 'Spring Terminal', aliases: ['terminal', 'computer', 'waterfall'], description: 'A terminal shaped like a waterfall. It teaches the threading macros -> and ->>!', canTake: false, usable: true, startsPuzzle: 'thread-first' },
    ],
    npcs: [],
    exits: {
      west: { to: 'ancient-tree' },
      north: { to: 'shadow-maze', requiresFlag: 'solvedThreadLast', failMessage: 'The mist won\'t part. Master both threading macros to see through!' },
    },
    puzzles: ['thread-first', 'thread-last'],
    useInteractions: [
      { item: null, target: 'spring-terminal', startsPuzzle: 'thread-first', condition: (flags) => !flags.solvedThreadFirst },
      { item: null, target: 'spring-terminal', startsPuzzle: 'thread-last', condition: (flags) => flags.solvedThreadFirst && !flags.solvedThreadLast },
    ],
  },

  'shadow-maze': {
    id: 'shadow-maze',
    name: 'Shadow Maze',
    world: 'shadow-forest',
    description: 'A labyrinth of dark hedges animated by the curse. The shadows move and shift, but your coding skills light the way. A terminal pulses in a clearing at the maze\'s center.',
    objects: [
      { id: 'shadow-cloak', name: 'Shadow Cloak', aliases: ['cloak', 'cape'], description: 'A cloak woven from living shadows. It makes you nearly invisible.', canTake: true, points: 10 },
      { id: 'maze-terminal', name: 'Maze Terminal', aliases: ['terminal', 'computer'], description: 'A terminal at the heart of the maze. It teaches update — transforming values in maps!', canTake: false, usable: true, startsPuzzle: 'update-map' },
    ],
    npcs: [],
    exits: {
      south: { to: 'transformation-spring' },
      north: { to: 'pack-summit', requiresFlag: 'solvedUpdateMap', failMessage: 'The maze shifts, blocking the exit. Solve the terminal puzzle to find the way!' },
    },
    puzzles: ['update-map'],
    useInteractions: [
      { item: null, target: 'maze-terminal', startsPuzzle: 'update-map', condition: (flags) => !flags.solvedUpdateMap },
    ],
  },

  'pack-summit': {
    id: 'pack-summit',
    name: 'Pack Summit',
    world: 'shadow-forest',
    description: 'The highest point in the Shadow Forest. All the wolves have gathered under the full moon. The entire pack howls in unison. A powerful terminal stands on a moonlit rock.',
    objects: [
      { id: 'summit-terminal', name: 'Summit Terminal', aliases: ['terminal', 'computer', 'rock'], description: 'A terminal on the moonlit summit rock. It teaches loop/recur — the power of recursion!', canTake: false, usable: true, startsPuzzle: 'loop-recur' },
      { id: 'curse-fragment', name: 'Curse Fragment', aliases: ['fragment', 'dark crystal', 'curse'], description: 'A fragment of the dark curse. Collecting it weakens the curse on the forest.', canTake: true, points: 5 },
    ],
    npcs: [],
    exits: {
      south: { to: 'shadow-maze' },
      east: { to: 'final-tower', requiresFlag: 'solvedLoopRecur', failMessage: 'The path to the Final Tower is sealed by recursion magic. Master loop/recur first!' },
    },
    puzzles: ['loop-recur'],
    useInteractions: [
      { item: null, target: 'summit-terminal', startsPuzzle: 'loop-recur', condition: (flags) => !flags.solvedLoopRecur },
    ],
  },

  'final-tower': {
    id: 'final-tower',
    name: 'The Final Tower',
    world: 'shadow-forest',
    description: 'An ancient tower rises from the forest floor, covered in glowing vines. At the top, the source of the curse pulses with dark energy. The Master Terminal awaits — your final challenge! Luna, Fang, and Willow stand behind you, lending their strength.',
    objects: [
      { id: 'master-terminal', name: 'Master Terminal', aliases: ['terminal', 'computer', 'master'], description: 'The Master Terminal. Break the curse by composing map, filter, and reduce into one beautiful expression!', canTake: false, usable: true, startsPuzzle: 'final-curse-breaker' },
      { id: 'curse-orb', name: 'Curse Orb', aliases: ['orb', 'dark orb'], description: 'A swirling orb of dark energy — the source of the forest\'s curse. It can only be broken with the power of functional composition.', canTake: false },
    ],
    npcs: [],
    exits: {
      west: { to: 'pack-summit' },
    },
    puzzles: ['final-curse-breaker'],
    useInteractions: [
      { item: null, target: 'master-terminal', startsPuzzle: 'final-curse-breaker', condition: (flags) => !flags.solvedFinalCurseBreaker },
    ],
  },
};

export function getScene(id) {
  return SCENES[id] || null;
}

export function getScenesByWorld(worldId) {
  return Object.values(SCENES).filter(s => s.world === worldId);
}
