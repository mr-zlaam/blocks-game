import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GameState } from "./game";

const KEYS = {
  HIGH_SCORE: "blocks_game:high_score",
  GAME_STATE: "blocks_game:game_state",
} as const;

/** Load the persisted high score. Returns 0 if not set. */
export async function loadHighScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(KEYS.HIGH_SCORE);
    return value ? parseInt(value, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/** Save the high score if it's higher than the current persisted one. */
export async function saveHighScore(score: number): Promise<void> {
  try {
    const current = await loadHighScore();
    if (score > current) {
      await AsyncStorage.setItem(KEYS.HIGH_SCORE, String(score));
    }
  } catch {
    // Silently fail — persistence is non-critical
  }
}

/** Load the persisted game session. */
export async function loadGameState(): Promise<GameState | null> {
  try {
    const value = await AsyncStorage.getItem(KEYS.GAME_STATE);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

/** Save the current game session. */
export async function saveGameState(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.GAME_STATE, JSON.stringify(state));
  } catch {
    // Silently fail
  }
}
