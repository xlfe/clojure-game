// State management — single atom with pure reducer
// The entire game state is ONE plain object

export const initialState = {
  screen: 'title',           // 'title' | 'game' | 'win'
  currentWorld: 'enchanted-grove',
  currentScene: 'cottage',
  inventory: [],
  score: 0,
  maxScore: 500,
  flags: {},
  completedPuzzles: [],
  clojureEnv: {},
  messageHistory: [],
  currentMessage: '',
  currentPuzzle: null,
  clojureConsoleOpen: false,
  clojureOutput: [],
};

// Pure reducer: (state, action) => newState
export function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'MOVE_TO_SCENE':
      return {
        ...state,
        currentScene: action.scene,
        currentWorld: action.world || state.currentWorld,
      };

    case 'ADD_TO_INVENTORY':
      if (state.inventory.some(i => i.id === action.item.id)) return state;
      return {
        ...state,
        inventory: [...state.inventory, action.item],
      };

    case 'REMOVE_FROM_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.filter(i => i.id !== action.itemId),
      };

    case 'ADD_SCORE':
      return {
        ...state,
        score: Math.min(state.score + action.points, state.maxScore),
      };

    case 'SET_FLAG':
      return {
        ...state,
        flags: { ...state.flags, [action.flag]: action.value !== undefined ? action.value : true },
      };

    case 'COMPLETE_PUZZLE':
      if (state.completedPuzzles.includes(action.puzzleId)) return state;
      return {
        ...state,
        completedPuzzles: [...state.completedPuzzles, action.puzzleId],
      };

    case 'SET_MESSAGE':
      return {
        ...state,
        currentMessage: action.message,
        messageHistory: [...state.messageHistory, action.message],
      };

    case 'OPEN_CLOJURE_CONSOLE':
      return {
        ...state,
        clojureConsoleOpen: true,
        currentPuzzle: action.puzzleId || null,
        clojureOutput: [],
      };

    case 'CLOSE_CLOJURE_CONSOLE':
      return {
        ...state,
        clojureConsoleOpen: false,
        currentPuzzle: null,
      };

    case 'ADD_CLOJURE_OUTPUT':
      return {
        ...state,
        clojureOutput: [...state.clojureOutput, action.entry],
      };

    case 'SET_CLOJURE_ENV':
      return {
        ...state,
        clojureEnv: { ...state.clojureEnv, ...action.env },
      };

    case 'LOAD_STATE':
      return { ...state, ...action.savedState, screen: 'game' };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

// State atom with dispatch
let gameState = { ...initialState };
let listeners = [];

export function getState() {
  return gameState;
}

export function dispatch(action) {
  gameState = gameReducer(gameState, action);
  for (const listener of listeners) {
    listener(gameState);
  }
  return gameState;
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function resetState() {
  gameState = { ...initialState };
  for (const listener of listeners) {
    listener(gameState);
  }
}
