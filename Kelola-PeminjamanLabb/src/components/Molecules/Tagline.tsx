import { View, Text, StyleSheet } from "react-native";

export default function Tagline() {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <Text style={styles.tagline}>
        "Kelola Laboratorium dengan Mudah,{"\n"}
        Efisien, dan Terintegrasi"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  divider: {
    height: 1,
    width: 225,
    backgroundColor: "#1E3A8A",
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
