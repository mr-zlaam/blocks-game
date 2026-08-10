import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";

import { gameReducer, INITIAL_STATE } from "./gameReducer";

import type { GameState, GameAction } from "@/lib/game";

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

/** Provides game state to the component tree. */
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Auto-start game on mount
  useEffect(() => {
    if (state.pieces.length === 0) {
      dispatch({ type: "START_GAME" });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

/** Hook to access game state and dispatch. */
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a <GameProvider>");
  }
  return ctx;
}
