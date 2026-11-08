import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { supabase } from "../../lib/supabase";
import LoginButton from "../Molecules/LoginButton";
import LoginInput from "../Molecules/LoginInput";

const COLORS = {
  navy: "#1E3A8A",
  muted: "#64748B",
  red: "#DC2626",
  paleRed: "#FEF2F2",
  redBorder: "#FECACA",
};

type Role = "guru" | "laboran";

type Errors = {
  nip?: string;
  password?: string;
};

const HOME_ROUTE: Record<Role, string> = {
  guru: "/Guru/dashboard",
  laboran: "/Laboran/dashboard",
};

export default function LoginForm() {
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Errors = {};

    if (!nip) {
      next.nip = "NIP wajib diisi.";
    } else if (!/^\d{8,18}$/.test(nip)) {
      next.nip = "NIP harus berupa angka 8 sampai 18 digit.";
    }

    if (!password) {
      next.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      next.password = "Password minimal 6 karakter.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (loading) return;

    setLoginError("");

    if (!validate()) return;

    setLoading(true);

    try {
      // Konversi NIP menjadi email internal Supabase.
      const email = `${nip}@silakom.id`;

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData.user) {
        setLoginError(
          "NIP atau password salah. Periksa kembali lalu coba lagi.",
        );
        return;
      }

      // Ambil profil pengguna berdasarkan UUID dari Supabase Auth.
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, nama, nip, role, is_active")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setLoginError("Profil pengguna tidak ditemukan.");
        return;
      }

      // Tolak akun yang sudah dinonaktifkan.
      if (!profile.is_active) {
        await supabase.auth.signOut();
        setLoginError("Akun kamu sudah dinonaktifkan. Hubungi Laboran.");
        return;
      }

      // Pastikan role sesuai dengan role yang tersedia.
      const role = profile.role as Role;

      if (role !== "guru" && role !== "laboran") {
        await supabase.auth.signOut();
        setLoginError("Role akun tidak valid.");
        return;
      }

      router.replace(HOME_ROUTE[role] as never);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.welcome}>Selamat Datang!</Text>

      <Text style={styles.description}>
        Masuk dengan NIP dan password kamu untuk melanjutkan ke aplikasi
        SILAKOM.
      </Text>

      <LoginInput
        label="NIP"
        placeholder="Masukkan NIP"
        value={nip}
        onChangeText={(value) => {
          setNip(value.replace(/\D/g, ""));
          setLoginError("");
          if (errors.nip) {
            setErrors((prev) => ({ ...prev, nip: undefined }));
          }
        }}
        icon="card-outline"
        keyboardType="number-pad"
        returnKeyType="next"
        maxLength={18}
        error={errors.nip}
      />

      <LoginInput
        label="Password"
        placeholder="Masukkan password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setLoginError("");
          if (errors.password) {
            setErrors((prev) => ({ ...prev, password: undefined }));
          }
        }}
        icon="lock-closed-outline"
        secureTextEntry
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((previous) => !previous)}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
        error={errors.password}
      />

      {!!loginError && (
        <View style={styles.loginError}>
          <Ionicons name="alert-circle" size={18} color={COLORS.red} />
          <Text style={styles.loginErrorText}>{loginError}</Text>
        </View>
      )}

      <LoginButton onPress={handleLogin} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  welcome: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
  },
  description: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 24,
  },
  loginError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: COLORS.paleRed,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  loginErrorText: {
    flex: 1,
    color: COLORS.red,
    fontSize: 12,
    lineHeight: 17,
  },
});
