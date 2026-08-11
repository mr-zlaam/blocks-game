import { createAudioPlayer, AudioPlayer, setIsAudioActiveAsync, setAudioModeAsync } from "expo-audio";

const sounds: Record<string, AudioPlayer> = {};

/** Preloads all game audio assets so they are ready for instant playback. */
export async function preloadSounds() {
  try {
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

/** Instantly plays a preloaded sound effect. */
export async function playSound(name: "clear" | "bonus" | "lose" | "gameover") {
  const player = sounds[name];
  if (player) {
    // Rewind and play
    await player.seekTo(0);
    player.play();
  }
}
