import { useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import { preloadSounds } from "@/lib/audio";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    preloadSounds();
    // Hide the bottom Android navigation bar for an immersive full-screen experience
    void NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
