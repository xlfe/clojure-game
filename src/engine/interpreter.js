// Clojure interpreter wrapper using Scittle (SCI)
// Provides safe evaluation of Clojure code with game-specific bindings

let sciReady = false;
let evalFn = null;

// Game-specific Clojure functions injected into the environment
const GAME_CLOJURE_PRELUDE = `
;; Quest magic namespace
(defn sparkle [n] (* n 7))
(defn rainbow-color [n]
  (nth ["red" "orange" "yellow" "green" "blue" "indigo" "violet"] (mod n 7)))
(defn dragon-power [element level]
  {:element element :power (* level 10)})
(defn wolf-howl [intensity]
  (str (apply str (repeat intensity "Awooo")) "!"))
(defn friendship-bracelet [& names]
  (str "💫 " (clojure.string/join " ♥ " names) " 💫"))
(defn magic-number [x] (* x 7))
(defn doughnut-power [x] (+ (* x 10) 5))
(defn spell [& args] (clojure.string/join " " args))

;; Make inc and dec available
;; These should already be available in SCI
`;

export function initInterpreter() {
  // scittle.core.eval_string is set by the scittle.js script tag
  if (typeof scittle !== 'undefined' && scittle.core && scittle.core.eval_string) {
    evalFn = scittle.core.eval_string;
    sciReady = true;
    // Load game prelude
    try {
      evalFn(GAME_CLOJURE_PRELUDE);
    } catch (e) {
      console.warn('Failed to load Clojure prelude:', e);
    }
    return true;
  }
  console.warn('Scittle not loaded yet');
  return false;
}

export function isReady() {
  return sciReady;
}

export function evaluate(code) {
  if (!sciReady) {
    if (!initInterpreter()) {
      return { success: false, error: 'Clojure interpreter not ready. Make sure scittle.js is loaded.' };
    }
  }
  try {
    const result = evalFn(code);
    return { success: true, value: result, display: formatResult(result) };
  } catch (e) {
    const msg = e.message || String(e);
    // Make error messages kid-friendly
    const friendly = friendlyError(msg, code);
    return { success: false, error: friendly, rawError: msg };
  }
}

function formatResult(value) {
  if (value === null || value === undefined) return 'nil';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number') return String(value);
  // ClojureScript collections get toString'd
  try {
    const s = String(value);
    if (s === '[object Object]') {
      return JSON.stringify(value);
    }
    return s;
  } catch {
    return String(value);
  }
}

function friendlyError(msg, code) {
  if (msg.includes('Could not resolve symbol')) {
    const match = msg.match(/Could not resolve symbol:\s*(\S+)/);
    const sym = match ? match[1] : 'that';
    return `Hmm, I don't know what "${sym}" means yet. Did you spell it right? Maybe you need to define it first with (def ...) or (defn ...)`;
  }
  if (msg.includes('Unexpected end of input') || msg.includes('EOF')) {
    return `Looks like you're missing a closing parenthesis ) — every ( needs a matching )!`;
  }
  if (msg.includes('is not a function') || msg.includes('cannot be cast')) {
    return `That doesn't look like a function call. Remember: in Clojure, the function goes FIRST inside the parentheses, like (+ 1 2)`;
  }
  if (msg.includes('Wrong number of args')) {
    return `Oops! You gave that function the wrong number of arguments. Check how many it needs!`;
  }
  if (msg.includes('Unmatched delimiter')) {
    return `You have an extra parenthesis ) that doesn't match an opening one. Count your parens!`;
  }
  return `Something went wrong: ${msg}. Don't worry, try again!`;
}

// Puzzle checking system
import { PUZZLES } from '../data/puzzles.js';

export function checkPuzzle(puzzleId, code, result) {
  const puzzle = PUZZLES.find(p => p.id === puzzleId);
  if (!puzzle) return { solved: false, message: 'Unknown puzzle.' };

  if (!result.success) {
    return { solved: false, message: result.error };
  }

  const check = puzzle.check(result.value, result.display, code);
  return check;
}
