import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import { gameReducer, INITIAL_STATE } from "./gameReducer";
import { loadHighScore, saveHighScore, loadGameState, saveGameState } from "@/lib/storage";

import type { GameState, GameAction, BlockColor } from "@/lib/game";

/** Measured absolute position of the board grid on screen. */
export interface BoardLayout {
  x: number;
  y: number;
  cellSize: number;
  cellGap: number;
}

/** Hover preview state — shown on the board while dragging a piece. */
export interface HoverState {
  row: number;
  col: number;
  isValid: boolean;
  wouldScore: boolean;
  completedLines?: { rows: number[]; cols: number[] };
  shapeGrid: readonly (readonly boolean[])[];
  color: BlockColor;
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  boardLayoutRef: React.MutableRefObject<BoardLayout | null>;
  hoverState: HoverState | null;
  setHoverState: (hover: HoverState | null) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

/** Provides game state, board layout, and hover state to the tree. */
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const boardLayoutRef = useRef<BoardLayout | null>(null);
  const [hoverState, setHoverStateRaw] = useState<HoverState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const setHoverState = useCallback((hover: HoverState | null) => {
    setHoverStateRaw(hover);
  }, []);

  // Load persisted game state (or just high score) on mount
  useEffect(() => {
    void loadGameState().then((savedState) => {
      if (savedState) {
        dispatch({ type: "RESTORE_GAME_STATE", state: savedState });
      } else {
        void loadHighScore().then((saved) => {
          if (saved > 0) {
            dispatch({ type: "RESTORE_HIGH_SCORE", highScore: saved });
          }
          dispatch({ type: "START_GAME" });
        });
      }
      setIsLoaded(true);
    });
  }, []);

  // Persist game state whenever it changes
  useEffect(() => {
    if (isLoaded && state.pieces.length > 0) {
      void saveGameState(state);
    }
    // Also save high score separately so it survives even if game state is wiped
    if (isLoaded && state.highScore > 0) {
      void saveHighScore(state.highScore);
    }
  }, [state, isLoaded]);

  if (!isLoaded) return null;

  return (
    <GameContext.Provider
      value={{ state, dispatch, boardLayoutRef, hoverState, setHoverState }}
    >
      {children}
    </GameContext.Provider>
  );
}

/** Hook to access game state, dispatch, board layout, and hover state. */
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a <GameProvider>");
  }
  return ctx;
}
