
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LoginButtonProps = {
  onPress: () => void;
  loading?: boolean;
};

export default function LoginButton({
  onPress,
  loading = false,
}: LoginButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.buttonText}>Masuk</Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 49,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
