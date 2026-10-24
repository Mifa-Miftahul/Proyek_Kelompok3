import React from "react";
import { Text, StyleSheet } from "react-native";

export default function Tagline() {
  return (
    <Text style={styles.tagline}>
      Kelola Laboratorium dengan Mudah,{"\n"}
      Efisien, dan Terintegrasi
    </Text>
  );
}

const styles = StyleSheet.create({
  tagline: {
    fontSize: 12,
    lineHeight: 19,
    color: "#1E3A8A",
    textAlign: "center",
    fontStyle: "italic",
  },
});