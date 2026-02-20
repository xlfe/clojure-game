// All 30 Clojure puzzles — progressive curriculum
// Each puzzle is pure data with a check function

export const PUZZLES = [
  // ===== WORLD 1: Enchanted Grove (Basics) =====
  {
    id: 'prefix-notation',
    world: 'enchanted-grove',
    scene: 'sparkle-meadow',
    number: 1,
    title: 'Your First Spell',
    description: 'In Clojure, we write math differently! The operation goes FIRST, then the numbers. Try adding 3 and 4.',
    hint: 'Type: (+ 3 4)',
    solution: '(+ 3 4)',
    teaches: 'Prefix notation — the function comes first!',
    check: (value, display) => {
      if (Number(value) === 7) return { solved: true, message: 'You cast your first spell! 3 + 4 = 7. In Clojure, we put the + FIRST — that\'s called prefix notation!' };
      return { solved: false, message: `You got ${display}, but we need 7. Try (+ 3 4)` };
    },
  },
  {
    id: 'variadic-add',
    world: 'enchanted-grove',
    scene: 'sparkle-meadow',
    number: 2,
    title: 'Rainbow Power',
    description: 'Clojure functions can take MANY arguments! Add up all 7 rainbow numbers to power the bridge.',
    hint: 'Type: (+ 1 2 3 4 5 6 7)',
    solution: '(+ 1 2 3 4 5 6 7)',
    teaches: 'Variadic arguments — one function, many inputs!',
    check: (value, display) => {
      if (Number(value) === 28) return { solved: true, message: 'The rainbow glows with 28 units of power! You discovered that + can take any number of arguments!' };
      return { solved: false, message: `You got ${display}, but we need 28. Add all numbers 1 through 7!` };
    },
  },
  {
    id: 'string-concat',
    world: 'enchanted-grove',
    scene: 'friendship-bridge',
    number: 3,
    title: 'Friendship Message',
    description: 'Use the str function to join words together into a friendship bracelet message!',
    hint: 'Type: (str "Hello " "World")',
    solution: '(str "Hello " "World")',
    teaches: 'String concatenation with str',
    check: (value, display) => {
      if (typeof value === 'string' && value.includes('Hello') && value.includes('World')) {
        return { solved: true, message: `"${value}" — Beautiful! The str function joins strings together!` };
      }
      return { solved: false, message: 'Use (str "Hello " "World") to join the words!' };
    },
  },
  {
    id: 'define-value',
    world: 'enchanted-grove',
    scene: 'crystal-cave',
    number: 4,
    title: 'Name the Crystal',
    description: 'Give the magic crystal a name using def! This stores a value so you can use it later.',
    hint: 'Type: (def crystal-name "Starshine")',
    solution: '(def crystal-name "Starshine")',
    teaches: 'Binding values with def',
    check: (value, display, code) => {
      if (code.includes('def ') && code.includes('crystal-name')) {
        return { solved: true, message: 'The crystal glows with its new name! def creates a name for a value you can use later.' };
      }
      return { solved: false, message: 'Use def to name the crystal: (def crystal-name "Starshine")' };
    },
  },
  {
    id: 'create-list',
    world: 'enchanted-grove',
    scene: 'melody-clearing',
    number: 5,
    title: 'Sparkle Collection',
    description: 'Create a list of magical ingredients! Lists hold multiple things in order.',
    hint: 'Type: (list "sparkle" "glitter" "shine")',
    solution: '(list "sparkle" "glitter" "shine")',
    teaches: 'Creating lists',
    check: (value, display) => {
      const s = String(display || value).toLowerCase();
      if (s.includes('sparkle') && s.includes('glitter') && s.includes('shine')) {
        return { solved: true, message: 'A sparkling list! Lists are one of the most important things in Clojure!' };
      }
      return { solved: false, message: 'Create a list with: (list "sparkle" "glitter" "shine")' };
    },
  },
  {
    id: 'first-element',
    world: 'enchanted-grove',
    scene: 'melody-clearing',
    number: 6,
    title: 'First Note',
    description: 'Use first to get the first item from a list — like picking the first note of a melody!',
    hint: 'Type: (first (list "do" "re" "mi"))',
    solution: '(first (list "do" "re" "mi"))',
    teaches: 'Accessing list elements with first',
    check: (value) => {
      if (String(value) === 'do') return { solved: true, message: '"do" — The first note rings out! first always gives you the beginning of a list.' };
      return { solved: false, message: 'Use first to get the first item: (first (list "do" "re" "mi"))' };
    },
  },
  {
    id: 'rest-list',
    world: 'enchanted-grove',
    scene: 'enchanted-stage',
    number: 7,
    title: 'The Rest of the Song',
    description: 'Use rest to get everything EXCEPT the first item. It\'s like the rest of the melody!',
    hint: 'Type: (rest (list 1 2 3))',
    solution: '(rest (list 1 2 3))',
    teaches: 'List tail with rest',
    check: (value, display) => {
      const s = String(display || value);
      if (s.includes('2') && s.includes('3') && !s.startsWith('(1')) {
        return { solved: true, message: 'The melody continues! rest gives you everything after the first element.' };
      }
      return { solved: false, message: 'Use rest to get the tail: (rest (list 1 2 3))' };
    },
  },
  {
    id: 'count-list',
    world: 'enchanted-grove',
    scene: 'enchanted-stage',
    number: 8,
    title: 'Count the Stars',
    description: 'How many stars are in the sky? Use count to find out!',
    hint: 'Type: (count (list 1 2 3 4 5))',
    solution: '(count (list 1 2 3 4 5))',
    teaches: 'Counting with count',
    check: (value) => {
      if (Number(value) === 5) return { solved: true, message: '5 stars! count tells you how many items are in a collection.' };
      return { solved: false, message: 'Count the items: (count (list 1 2 3 4 5))' };
    },
  },
  {
    id: 'multiply',
    world: 'enchanted-grove',
    scene: 'starlight-pool',
    number: 9,
    title: 'Star Multiplication',
    description: 'Multiply the star power! The stage needs 6 rows of 12 lights each.',
    hint: 'Type: (* 6 12)',
    solution: '(* 6 12)',
    teaches: 'Multiplication',
    check: (value) => {
      if (Number(value) === 72) return { solved: true, message: '72 lights blaze to life! Multiplication works just like addition — function first!' };
      return { solved: false, message: 'Multiply 6 times 12: (* 6 12)' };
    },
  },
  {
    id: 'nested-expressions',
    world: 'enchanted-grove',
    scene: 'starlight-pool',
    number: 10,
    title: 'The Grand Sparkle Spell',
    description: 'Combine string and math to create the ultimate sparkle spell! Nest expressions inside each other.',
    hint: 'Type: (str "Sparkle " (+ 10 20) " stars!")',
    solution: '(str "Sparkle " (+ 10 20) " stars!")',
    teaches: 'Nested expressions — expressions inside expressions!',
    check: (value) => {
      const s = String(value);
      if (s.includes('30') && s.toLowerCase().includes('sparkle')) {
        return { solved: true, message: `"${s}" — Magnificent! You nested an expression inside another. This is the power of Clojure!` };
      }
      return { solved: false, message: 'Nest the math inside the string: (str "Sparkle " (+ 10 20) " stars!")' };
    },
  },

  // ===== WORLD 2: Dragon Highlands (Control Flow) =====
  {
    id: 'if-conditional',
    world: 'dragon-highlands',
    scene: 'fire-ridge',
    number: 11,
    title: 'Fire or Ice',
    description: 'Dragons use if to make decisions. If the temperature is hot, breathe fire! Otherwise, breathe ice.',
    hint: 'Type: (if (> 10 5) "fire" "ice")',
    solution: '(if (> 10 5) "fire" "ice")',
    teaches: 'Conditionals with if',
    check: (value) => {
      if (String(value) === 'fire') return { solved: true, message: '"fire" — Correct! if checks a condition, then picks the first result if true, or the second if false.' };
      return { solved: false, message: 'Use if to decide: (if (> 10 5) "fire" "ice")' };
    },
  },
  {
    id: 'cond-multiway',
    world: 'dragon-highlands',
    scene: 'fire-ridge',
    number: 12,
    title: 'Element Detector',
    description: 'Some decisions have more than two options! Use cond to check multiple conditions.',
    hint: 'Type: (cond (= 1 2) "fire" (= 1 1) "water" :else "air")',
    solution: '(cond (= 1 2) "fire" (= 1 1) "water" :else "air")',
    teaches: 'Multi-way conditionals with cond',
    check: (value) => {
      if (String(value) === 'water') return { solved: true, message: '"water" — cond checks each condition in order and picks the first true one!' };
      return { solved: false, message: 'Use cond with multiple conditions. The result should be "water".' };
    },
  },
  {
    id: 'boolean-logic',
    world: 'dragon-highlands',
    scene: 'sky-nest',
    number: 13,
    title: 'Dragon Logic',
    description: 'Dragons must pass TWO tests to fly: they must be old enough AND have strong wings. Use and to combine checks!',
    hint: 'Type: (and true (> 5 3))',
    solution: '(and true (> 5 3))',
    teaches: 'Boolean logic with and',
    check: (value) => {
      if (value === true) return { solved: true, message: 'true — Both conditions passed! and returns true only if ALL conditions are true.' };
      return { solved: false, message: 'Both conditions must be true: (and true (> 5 3))' };
    },
  },
  {
    id: 'define-function',
    world: 'dragon-highlands',
    scene: 'sky-nest',
    number: 14,
    title: 'Dragon Training',
    description: 'Create a function that doubles a dragon\'s power! defn defines a named function.',
    hint: 'Type: (defn double [x] (* x 2))',
    solution: '(defn double [x] (* x 2))',
    teaches: 'Defining functions with defn',
    check: (value, display, code) => {
      if (code.includes('defn') && code.includes('double')) {
        return { solved: true, message: 'You trained the double function! defn creates a reusable spell you can call anytime.' };
      }
      return { solved: false, message: 'Define a doubling function: (defn double [x] (* x 2))' };
    },
  },
  {
    id: 'function-with-strings',
    world: 'dragon-highlands',
    scene: 'sea-caves',
    number: 15,
    title: 'Dragon Greeting',
    description: 'Create a greeting function that welcomes dragons by name!',
    hint: 'Type: (defn greet [name] (str "Hello, " name "!"))',
    solution: '(defn greet [name] (str "Hello, " name "!"))',
    teaches: 'Functions with string operations',
    check: (value, display, code) => {
      if (code.includes('defn') && code.includes('greet')) {
        return { solved: true, message: 'The greet function is ready! Functions can do anything — math, strings, even other function calls!' };
      }
      return { solved: false, message: 'Create a greeting function: (defn greet [name] (str "Hello, " name "!"))' };
    },
  },
  {
    id: 'let-bindings',
    world: 'dragon-highlands',
    scene: 'sea-caves',
    number: 16,
    title: 'Sea Cave Calculation',
    description: 'Use let to create temporary names for values, then combine them!',
    hint: 'Type: (let [x 10 y 20] (+ x y))',
    solution: '(let [x 10 y 20] (+ x y))',
    teaches: 'Local bindings with let',
    check: (value) => {
      if (Number(value) === 30) return { solved: true, message: '30! let creates temporary names that only exist inside the brackets. Super useful for complex calculations!' };
      return { solved: false, message: 'Use let for local bindings: (let [x 10 y 20] (+ x y))' };
    },
  },
  {
    id: 'multi-arg-function',
    world: 'dragon-highlands',
    scene: 'prophecy-chamber',
    number: 17,
    title: 'Prophecy Power',
    description: 'The prophecy requires a function that finds the maximum of three dragon power levels!',
    hint: 'Type: (defn max-power [a b c] (max a b c))',
    solution: '(defn max-power [a b c] (max a b c))',
    teaches: 'Multi-argument functions',
    check: (value, display, code) => {
      if (code.includes('defn') && (code.includes('max-power') || code.includes('max-of-three'))) {
        return { solved: true, message: 'The prophecy accepts your function! Functions can take as many arguments as needed.' };
      }
      return { solved: false, message: 'Create a function with 3 args: (defn max-power [a b c] (max a b c))' };
    },
  },
  {
    id: 'anonymous-function',
    world: 'dragon-highlands',
    scene: 'lava-bridge',
    number: 18,
    title: 'Lava Bridge Secret',
    description: 'Create a quick unnamed function and use it right away! fn creates an anonymous function.',
    hint: 'Type: ((fn [x] (* x x)) 7)',
    solution: '((fn [x] (* x x)) 7)',
    teaches: 'Anonymous functions with fn',
    check: (value) => {
      if (Number(value) === 49) return { solved: true, message: '49! You created a function with fn and called it immediately. fn is like defn but without a name!' };
      return { solved: false, message: 'Create and call an anonymous function: ((fn [x] (* x x)) 7)' };
    },
  },
  {
    id: 'combined-logic',
    world: 'dragon-highlands',
    scene: 'crystal-hoard',
    number: 19,
    title: 'Crystal Sorter',
    description: 'Write a function that classifies a number: "small" if less than 10, "medium" if less than 100, otherwise "large".',
    hint: 'Type: (defn size [n] (cond (< n 10) "small" (< n 100) "medium" :else "large"))',
    solution: '(defn size [n] (cond (< n 10) "small" (< n 100) "medium" :else "large"))',
    teaches: 'Combining defn with cond',
    check: (value, display, code) => {
      if (code.includes('defn') && code.includes('cond')) {
        return { solved: true, message: 'The crystal sorter works! You combined functions with multi-way decisions — that\'s real programming!' };
      }
      return { solved: false, message: 'Combine defn and cond to classify numbers by size.' };
    },
  },
  {
    id: 'dragon-classifier',
    world: 'dragon-highlands',
    scene: 'dragon-council',
    number: 20,
    title: 'Dragon Council Challenge',
    description: 'The council demands a function that determines a dragon\'s element! If power > 100, "fire". If speed > 100, "sky". Otherwise "earth".',
    hint: 'Type: (defn element [power speed] (cond (> power 100) "fire" (> speed 100) "sky" :else "earth"))',
    solution: '(defn element [power speed] (cond (> power 100) "fire" (> speed 100) "sky" :else "earth"))',
    teaches: 'Complex function composition',
    check: (value, display, code) => {
      if (code.includes('defn') && code.includes('element') && code.includes('cond')) {
        return { solved: true, message: 'The Dragon Council approves! You\'ve mastered control flow and functions!' };
      }
      return { solved: false, message: 'Define the element classifier function using defn and cond.' };
    },
  },

  // ===== WORLD 3: Shadow Forest (Data & Composition) =====
  {
    id: 'map-transform',
    world: 'shadow-forest',
    scene: 'moonlit-path',
    number: 21,
    title: 'Moonlight Transform',
    description: 'Use map to transform every item in a list! map applies a function to each element.',
    hint: 'Type: (map inc [1 2 3 4 5])',
    solution: '(map inc [1 2 3 4 5])',
    teaches: 'Transforming collections with map',
    check: (value, display) => {
      const s = String(display || value);
      if (s.includes('2') && s.includes('3') && s.includes('4') && s.includes('5') && s.includes('6')) {
        return { solved: true, message: 'Each number increased by 1! map transforms every element using a function — no loops needed!' };
      }
      return { solved: false, message: 'Transform each number: (map inc [1 2 3 4 5])' };
    },
  },
  {
    id: 'filter-select',
    world: 'shadow-forest',
    scene: 'moonlit-path',
    number: 22,
    title: 'Shadow Filter',
    description: 'Use filter to keep only the even numbers — they\'re the ones the shadows can\'t touch!',
    hint: 'Type: (filter even? [1 2 3 4 5 6])',
    solution: '(filter even? [1 2 3 4 5 6])',
    teaches: 'Selecting elements with filter',
    check: (value, display) => {
      const s = String(display || value);
      if (s.includes('2') && s.includes('4') && s.includes('6') && !s.includes('1 ') && !s.includes('3 ') && !s.includes('5 ')) {
        return { solved: true, message: 'Only evens remain! filter keeps elements that pass the test function.' };
      }
      return { solved: false, message: 'Filter the even numbers: (filter even? [1 2 3 4 5 6])' };
    },
  },
  {
    id: 'reduce-combine',
    world: 'shadow-forest',
    scene: 'wolf-den',
    number: 23,
    title: 'Pack Strength',
    description: 'Use reduce to combine all the pack\'s power into one total! reduce folds a list into a single value.',
    hint: 'Type: (reduce + [1 2 3 4 5])',
    solution: '(reduce + [1 2 3 4 5])',
    teaches: 'Combining with reduce',
    check: (value) => {
      if (Number(value) === 15) return { solved: true, message: '15 — The pack\'s combined strength! reduce takes a function and runs it across the whole list, accumulating a result.' };
      return { solved: false, message: 'Reduce the list with +: (reduce + [1 2 3 4 5])' };
    },
  },
  {
    id: 'assoc-map',
    world: 'shadow-forest',
    scene: 'wolf-den',
    number: 24,
    title: 'Wolf Profile',
    description: 'Add a new power to Luna\'s profile using assoc! Maps store key-value pairs.',
    hint: 'Type: (assoc {:name "Luna"} :power "transform")',
    solution: '(assoc {:name "Luna"} :power "transform")',
    teaches: 'Adding to maps with assoc',
    check: (value, display) => {
      const s = String(display || value);
      if (s.includes('Luna') && s.includes('transform') && s.includes('power')) {
        return { solved: true, message: 'Luna\'s profile updated! Maps are like dictionaries — they pair keys with values.' };
      }
      return { solved: false, message: 'Add to the map: (assoc {:name "Luna"} :power "transform")' };
    },
  },
  {
    id: 'get-from-map',
    world: 'shadow-forest',
    scene: 'ancient-tree',
    number: 25,
    title: 'Ancient Knowledge',
    description: 'The ancient tree stores wisdom in a map. Use get to retrieve Luna\'s power!',
    hint: 'Type: (get {:name "Luna" :power "transform"} :power)',
    solution: '(get {:name "Luna" :power "transform"} :power)',
    teaches: 'Reading from maps with get',
    check: (value) => {
      if (String(value) === 'transform') return { solved: true, message: '"transform" — You read from the map! get retrieves the value for a key.' };
      return { solved: false, message: 'Get the power: (get {:name "Luna" :power "transform"} :power)' };
    },
  },
  {
    id: 'thread-first',
    world: 'shadow-forest',
    scene: 'transformation-spring',
    number: 26,
    title: 'Transformation Flow',
    description: 'Use the threading macro -> to chain transformations! It passes the result of each step to the next.',
    hint: 'Type: (-> 5 inc (* 3) str)',
    solution: '(-> 5 inc (* 3) str)',
    teaches: 'Threading with ->',
    check: (value) => {
      if (String(value) === '18') return { solved: true, message: '"18" — 5 → inc → 6 → (* 3) → 18 → str → "18". The threading macro chains operations beautifully!' };
      return { solved: false, message: 'Thread the value: (-> 5 inc (* 3) str)' };
    },
  },
  {
    id: 'thread-last',
    world: 'shadow-forest',
    scene: 'transformation-spring',
    number: 27,
    title: 'Deep Transform',
    description: 'Use ->> to thread a collection through map and filter!',
    hint: 'Type: (->> [1 2 3 4 5] (map inc) (filter even?))',
    solution: '(->> [1 2 3 4 5] (map inc) (filter even?))',
    teaches: 'Thread-last with ->>',
    check: (value, display) => {
      const s = String(display || value);
      if (s.includes('2') && s.includes('4') && s.includes('6') && !s.includes('3 ') && !s.includes('5 ')) {
        return { solved: true, message: 'The data flowed through each transformation! ->> threads the result as the LAST argument of each step.' };
      }
      return { solved: false, message: 'Thread the collection: (->> [1 2 3 4 5] (map inc) (filter even?))' };
    },
  },
  {
    id: 'update-map',
    world: 'shadow-forest',
    scene: 'shadow-maze',
    number: 28,
    title: 'Maze Transformation',
    description: 'Use update to change a value in a map by applying a function to it!',
    hint: 'Type: (update {:health 50} :health inc)',
    solution: '(update {:health 50} :health inc)',
    teaches: 'Updating maps with update',
    check: (value, display) => {
      const s = String(display || value);
      if (s.includes('51') && s.includes('health')) {
        return { solved: true, message: 'Health increased to 51! update applies a function to a value in a map.' };
      }
      return { solved: false, message: 'Update the health: (update {:health 50} :health inc)' };
    },
  },
  {
    id: 'loop-recur',
    world: 'shadow-forest',
    scene: 'pack-summit',
    number: 29,
    title: 'Pack Howl',
    description: 'Use loop and recur to count down from 5 to 1! This is recursion — the function calls itself.',
    hint: 'Type: (loop [n 5 acc 1] (if (= n 0) acc (recur (dec n) (* acc n))))',
    solution: '(loop [n 5 acc 1] (if (= n 0) acc (recur (dec n) (* acc n))))',
    teaches: 'Recursion with loop/recur',
    check: (value) => {
      if (Number(value) === 120) return { solved: true, message: '120 (that\'s 5 factorial)! loop/recur repeats code without using a loop — it\'s the Clojure way!' };
      return { solved: false, message: 'Calculate 5! with loop/recur: (loop [n 5 acc 1] (if (= n 0) acc (recur (dec n) (* acc n))))' };
    },
  },
  {
    id: 'final-curse-breaker',
    world: 'shadow-forest',
    scene: 'final-tower',
    number: 30,
    title: 'Break the Curse',
    description: 'Combine map, filter, and reduce to calculate the total power of all even-numbered wolves in the pack! This is the ultimate test of everything you\'ve learned.',
    hint: 'Type: (->> [1 2 3 4 5 6 7 8 9 10] (filter even?) (map #(* % %)) (reduce +))',
    solution: '(->> [1 2 3 4 5 6 7 8 9 10] (filter even?) (map #(* % %)) (reduce +))',
    teaches: 'Composing map + filter + reduce',
    check: (value) => {
      // (filter even?) => [2 4 6 8 10], (map square) => [4 16 36 64 100], (reduce +) => 220
      if (Number(value) === 220) return { solved: true, message: 'THE CURSE IS BROKEN! 220 — You composed filter, map, and reduce into one beautiful pipeline. You are a true Clojure coder!' };
      return { solved: false, message: 'Compose the transformations: filter even numbers, square them with map, then reduce with +. The answer is 220.' };
    },
  },
];

export function getPuzzleById(id) {
  return PUZZLES.find(p => p.id === id);
}

export function getPuzzlesForScene(sceneId) {
  return PUZZLES.filter(p => p.scene === sceneId);
}

export function getPuzzlesForWorld(worldId) {
  return PUZZLES.filter(p => p.world === worldId);
}
