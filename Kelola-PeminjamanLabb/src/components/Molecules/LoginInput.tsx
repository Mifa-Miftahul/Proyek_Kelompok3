import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LoginInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
};

const COLORS = {
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
};

export default function LoginInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  showPassword = false,
  onTogglePassword,
  keyboardType = "default",
  returnKeyType = "next",
  onSubmitEditing,
  autoCapitalize = "none",
  autoCorrect,
}: LoginInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color={COLORS.muted} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />

        {secureTextEntry && onTogglePassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={onTogglePassword}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword
                ? "Sembunyikan password"
                : "Tampilkan password"
            }
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
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
  field: {
    width: "100%",
  },
  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    minHeight: 49,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 19,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 0,
    outlineStyle: "none",
  } as any,
  eyeButton: {
    width: 32,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    flexShrink: 0,
  },
});