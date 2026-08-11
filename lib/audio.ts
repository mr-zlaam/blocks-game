import { createAudioPlayer, AudioPlayer, setIsAudioActiveAsync, setAudioModeAsync } from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";

const sounds: Record<string, AudioPlayer> = {};
let isSoundEnabled = true;

/** Preloads all game audio assets so they are ready for instant playback. */
export async function preloadSounds() {
  try {
    try {
      const stored = await AsyncStorage.getItem("sound_enabled");
      if (stored !== null) {
        isSoundEnabled = stored === "true";
      }
    } catch (storageErr) {
      console.warn("Could not read sound preferences, defaulting to true", storageErr);
    }

    await setIsAudioActiveAsync(true);
    await setAudioModeAsync({ playsInSilentMode: true });

    sounds.clear = createAudioPlayer(require("../assets/sounds/mixkit-casino-bling-achievement-2067.wav"));
    sounds.bonus = createAudioPlayer(require("../assets/sounds/mixkit-game-bonus-reached-2065.wav"));
    sounds.lose = createAudioPlayer(require("../assets/sounds/mixkit-player-losing-or-failing-2042.wav"));
    sounds.gameover = createAudioPlayer(require("../assets/sounds/universfield-game-over-deep-male-voice-clip-352695.mp3"));
  } catch (err) {
    console.warn("Failed to load sounds", err);
  }
}

export function getIsSoundEnabled() {
  return isSoundEnabled;
}

export async function toggleSoundEnabled() {
  isSoundEnabled = !isSoundEnabled;
  try {
    await AsyncStorage.setItem("sound_enabled", isSoundEnabled.toString());
  } catch (err) {
    console.warn("Could not save sound preferences", err);
  }
  return isSoundEnabled;
}

/** Instantly plays a preloaded sound effect. */
export async function playSound(name: "clear" | "bonus" | "lose" | "gameover") {
  if (!isSoundEnabled) return;

  const player = sounds[name];
  if (player) {
    // Rewind and play
    await player.seekTo(0);
    player.play();
  }
}
