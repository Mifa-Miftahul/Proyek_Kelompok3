import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  navy: "#1E3A8A",
  blue: "#3B82F6",
  lightBlue: "#DBEAFE",
  background: "#F8FAFC",
  white: "#FFFFFF",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
};

export default function LoginGuru() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email/NIP dan password wajib diisi.");
      return;
    }

    setError("");

    // Sementara untuk pengujian UI.
    // Belum melakukan autentikasi ke database.
    router.replace("/Guru/dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons name="flask-outline" size={36} color={COLORS.white} />
            </View>

            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>PEMOB</Text>
              <Text style={styles.brandSubtitle}>
                Pengelolaan Manajemen{"\n"}Laboratorium
              </Text>
            </View>
          </View>

          <View style={styles.headerDivider} />

          <Text style={styles.headerDescription}>
            Kelola laboratorium dengan lebih mudah,
            {"\n"}efisien dan terorganisir.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.userIcon}>
            <Ionicons name="person-outline" size={28} color={COLORS.navy} />
          </View>

          <Text style={styles.welcome}>Selamat Datang, Guru!</Text>

          <Text style={styles.description}>
            Masuk untuk melanjutkan ke aplikasi SILAKOM.
          </Text>

          <Text style={styles.label}>Email atau NIP</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.muted} />

            <TextInput
              style={styles.input}
              placeholder="Masukkan email atau NIP"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={COLORS.muted}
            />

            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Masuk</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.help}>Mengalami kendala saat masuk?</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 54,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#647DB6",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    marginLeft: 12,
  },
  brandTitle: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: "900",
  },
  brandSubtitle: {
    fontSize: 11,
    color: "#DBEAFE",
    lineHeight: 15,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#4965A5",
    marginVertical: 20,
  },
  headerDescription: {
    fontSize: 13,
    color: "#DBEAFE",
    lineHeight: 21,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 18,
    marginTop: -20,
    borderRadius: 25,
    padding: 22,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.lightBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  welcome: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: "800",
  },
  description: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 7,
    marginBottom: 25,
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
    marginBottom: 19,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 12,
  },
  error: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 12,
  },
  button: {
    height: 49,
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  help: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 21,
  },
});
