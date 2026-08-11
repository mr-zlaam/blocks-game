import { createAudioPlayer, AudioPlayer, setIsAudioActiveAsync, setAudioModeAsync } from "expo-audio";

const sounds: Record<string, AudioPlayer> = {};

/** Preloads all game audio assets so they are ready for instant playback. */
export async function preloadSounds() {
  try {
    await setIsAudioActiveAsync(true);
    await setAudioModeAsync({ playsInSilentMode: true });

    sounds.takk = createAudioPlayer(require("../assets/sounds/takk.wav"));
    sounds.clear = createAudioPlayer(require("../assets/sounds/hooting.wav"));
  } catch (err) {
    console.warn("Failed to load sounds", err);
  }
}

/** Instantly plays a preloaded sound effect. */
export async function playSound(name: "takk" | "clear") {
  const player = sounds[name];
  if (player) {
    // Rewind and play
    await player.seekTo(0);
    player.play();
  }
}
