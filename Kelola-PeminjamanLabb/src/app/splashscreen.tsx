
import { useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";

import SplashBrand from "../components/Organisms/SplashBrand";

const COLORS = {
  navy: "#1E3A8A",
  white: "#FFFFFF",
};

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
        backgroundColor={COLORS.white}
      />

      <View style={styles.circleTop} />
      <View style={styles.circleRight} />

      <SplashBrand />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  circleTop: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.navy,
    top: -150,
    left: -130,
  },

  circleRight: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.navy,
    top: "20%",
    right: -160,
  },
});
