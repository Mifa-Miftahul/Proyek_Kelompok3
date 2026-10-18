import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.circleTop} />
      <View style={styles.circleRight} />

      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Ionicons name="laptop-outline" size={112} color={COLORS.navy} />

          <Ionicons
            name="happy-outline"
            size={43}
            color={COLORS.navy}
            style={styles.face}
          />
        </View>

        <Text style={styles.title}>SILAKOM</Text>

        <View style={styles.divider} />

        <Text style={styles.tagline}>
          "Kelola Laboratorium dengan Mudah,{"\n"}
          Efisien, dan Terintegrasi"
        </Text>
      </View>
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

  logoContainer: {
    alignItems: "center",
    marginTop: 10,
  },

  logo: {
    width: 155,
    height: 145,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  face: {
    position: "absolute",
    top: 43,
  },

  title: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.navy,
    letterSpacing: 1,
    marginTop: 8,
  },

  divider: {
    height: 1,
    width: 225,
    backgroundColor: COLORS.navy,
    marginTop: 4,
    marginBottom: 9,
  },

  tagline: {
    textAlign: "center",
    color: "#111827",
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 19,
  },
});
