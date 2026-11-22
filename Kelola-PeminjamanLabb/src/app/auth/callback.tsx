import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function AuthCallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#223F91" />

      <Text style={styles.title}>
        Menyelesaikan Login Google
      </Text>

      <Text style={styles.description}>
        Silakan tunggu sebentar dan kembali ke halaman SILAKOM.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5F7FB",
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "700",
    color: "#223F91",
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },
});
