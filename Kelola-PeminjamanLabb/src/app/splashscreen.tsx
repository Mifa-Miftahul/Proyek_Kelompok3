import { useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

import SplashBrand from "@/components/Organisms/SplashBrand";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/Guru/login");
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.content}>
        <SplashBrand />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  footer: {
    alignItems: "center",
    paddingBottom: 28,
  },

  footerLine: {
    width: 45,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#176B5B",
  },
});
