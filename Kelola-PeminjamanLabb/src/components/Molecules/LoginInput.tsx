
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LoginInputProps = TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
};

const COLORS = {
  navy: "#1E3A8A",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
};

export default function LoginInput({
  label,
  icon,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  ...inputProps
}: LoginInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.muted}
        />

        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor="#94A3B8"
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={onTogglePassword}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword
                ? "Sembunyikan password"
                : "Tampilkan password"
            }
          >
            <Ionicons
              name={
                showPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={21}
              color={COLORS.muted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 19,
  },

  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 12,
  },
});
