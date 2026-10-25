
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import LoginInput from "../Molecules/LoginInput";
import LoginButton from "../Molecules/LoginButton";

const COLORS = {
  navy: "#1E3A8A",
  lightBlue: "#DBEAFE",
  white: "#FFFFFF",
  muted: "#64748B",
};

export default function LoginForm() {
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

    // Navigasi untuk pengujian UI.
    // Belum melakukan autentikasi ke database.
    router.replace("/Guru/dashboard");
  };

  return (
    <View style={styles.card}>

      <Text style={styles.welcome}>Selamat Datang, Guru!</Text>

      <Text style={styles.description}>
        Masuk untuk melanjutkan ke aplikasi SILAKOM.
      </Text>

      <LoginInput
        label="Email atau NIP"
        placeholder="Masukkan email atau NIP"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (error) setError("");
        }}
        icon="person-outline"
        keyboardType="email-address"
        returnKeyType="next"
      />

      <LoginInput
        label="Password"
        placeholder="Masukkan password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (error) setError("");
        }}
        icon="lock-closed-outline"
        secureTextEntry
        showPassword={showPassword}
        onTogglePassword={() =>
          setShowPassword((previous) => !previous)
        }
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <LoginButton onPress={handleLogin} />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          // Belum ada fitur bantuan login.
        }}
      >
        <Text style={styles.help}>
          Mengalami kendala saat masuk?
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  error: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 12,
  },
  help: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 21,
  },
});
