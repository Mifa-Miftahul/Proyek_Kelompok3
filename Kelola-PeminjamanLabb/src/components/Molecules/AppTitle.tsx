import { Text, StyleSheet } from "react-native";

export default function AppTitle() {
  return <Text style={styles.title}>SILAKOM</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1E3A8A",
    letterSpacing: 1,
    marginTop: 8,
  },
});