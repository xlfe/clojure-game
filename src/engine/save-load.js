// Save/Load system — JSON serialization of state

const SAVE_KEY = 'clojure-quest-save';

export function saveGame(state) {
  const saveData = {
    version: 1,
    timestamp: Date.now(),
    currentWorld: state.currentWorld,
    currentScene: state.currentScene,
    inventory: state.inventory,
    score: state.score,
    flags: state.flags,
    completedPuzzles: state.completedPuzzles,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    console.error('Failed to save:', e);
    return false;
  }
}

export function loadGame() {
  try {
    const json = localStorage.getItem(SAVE_KEY);
    if (!json) return null;
    const data = JSON.parse(json);
    if (data.version !== 1) return null;
    return data;
  } catch (e) {
    console.error('Failed to load:', e);
    return null;
  }
}

export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}
