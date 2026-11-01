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
  maxLength?: number;
  // Pesan kesalahan validasi, tampil di bawah kolom
  error?: string;
};

const COLORS = {
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
  red: "#DC2626",
  paleRed: "#FFF7F7",
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
  maxLength,
  error,
}: LoginInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputContainer, !!error && styles.inputError]}>
        <Ionicons
          name={icon}
          size={20}
          color={error ? COLORS.red : COLORS.muted}
        />

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
          maxLength={maxLength}
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

      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons
            name="alert-circle-outline"
            size={14}
            color={COLORS.red}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: "100%",
    marginBottom: 18,
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
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.red,
    backgroundColor: COLORS.paleRed,
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
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },
  errorText: {
    flex: 1,
    color: COLORS.red,
    fontSize: 11,
  },
  eyeButton: {
    width: 32,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    flexShrink: 0,
  },
});