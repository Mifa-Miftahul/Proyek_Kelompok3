
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LogoSILAKOMProps = {
  size?: number;
  color?: string;
};

export default function LogoSILAKOM({
  size = 155,
  color = "#1E3A8A",
}: LogoSILAKOMProps) {
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size * 0.94,
        },
      ]}
    >
      <Ionicons
        name="laptop-outline"
        size={size * 0.72}
        color={color}
      />

      <Ionicons
        name="happy-outline"
        size={size * 0.28}
        color={color}
        style={{ position: "absolute", top: size * 0.28 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});