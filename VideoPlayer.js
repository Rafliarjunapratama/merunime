import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

const VideoPlayer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl } = route.params;

  const [showBack, setShowBack] = useState(true);

  // Lock ke landscape + sembunyikan system UI
  useEffect(() => {
    const enableFullscreen = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );

      if (Platform.OS === "android") {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("inset-swipe");
      }
    };

    enableFullscreen();

    return () => {
      ScreenOrientation.unlockAsync();
      if (Platform.OS === "android") {
        NavigationBar.setVisibilityAsync("visible");
      }
    };
  }, []);

  // Hilangkan auto hide total, tombol back selalu muncul
  const handleTouch = () => {
    setShowBack(prev => !prev); // toggle tombol back saat disentuh
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {Platform.OS === "web" ? (
        <iframe
          src={videoUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="fullscreen"
        />
      ) : (
        <WebView
          source={{ uri: videoUrl }}
          style={styles.webview}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
        />
      )}

      <TouchableWithoutFeedback onPress={handleTouch}>
        <View style={styles.overlay} pointerEvents="box-none">
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 9999,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default VideoPlayer;
