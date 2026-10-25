import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import LoginInput from "@/components/Molecules/LoginInput";
import LoginButton from "@/components/Molecules/LoginButton";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        "Data belum lengkap",
        "Silakan isi username dan password."
      );
      return;
    }

    setLoading(true);

    // Login tampilan saja.
    // Belum terhubung dengan backend.
    setTimeout(() => {
      setLoading(false);

      Alert.alert(
        "Login",
        "Form berhasil divalidasi. Autentikasi backend belum dihubungkan."
      );
    }, 500);
  };

  return (
    <View style={styles.container}>
      <LoginInput
        label="Username"
        icon="person-outline"
        placeholder="Masukkan username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <LoginInput
        label="Password"
        icon="lock-closed-outline"
        placeholder="Masukkan password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <LoginButton
        onPress={handleLogin}
        loading={loading}
      />

      <Text style={styles.footerText}>
        Sistem Informasi Laboratorium Komputer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  footerText: {
    fontSize: 12,
    color: "#78909C",
    textAlign: "center",
    marginTop: 28,
  },
});