import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LogoSILAKOM() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Ionicons
          name="desktop-outline"
          size={48}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.logoText}>SILAKOM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#176B5B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  logoText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#176B5B",
    letterSpacing: 3,
  },
});