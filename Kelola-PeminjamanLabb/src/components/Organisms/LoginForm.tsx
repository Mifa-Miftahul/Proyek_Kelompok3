import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

import LoginInput from "../Molecules/LoginInput";
import LoginButton from "../Molecules/LoginButton";

const COLORS = {
  navy: "#1E3A8A",
  muted: "#64748B",
};

type Role = "Guru" | "Laboran";

// Halaman awal tiap peran setelah login. Peran ditentukan oleh halaman
// login yang dipakai (app/Guru/login.tsx atau app/Laboran/login.tsx),
// bukan dipilih di layar.
const HOME_ROUTE: Record<Role, string> = {
  Guru: "/Guru/dashboard",
  Laboran: "/Laboran/dashboard",
};

type LoginFormProps = {
  role?: Role;
};

type Errors = {
  nip?: string;
  password?: string;
};

// Konten form login. Kartu pembungkusnya ada di LoginLayout (satu lapis).
export default function LoginForm({ role = "Guru" }: LoginFormProps) {
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Validasi form sebelum masuk
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

  const handleLogin = () => {
    if (loading || !validate()) return;

    setLoading(true);

    // Navigasi untuk pengujian UI.
    // Belum melakukan autentikasi ke database.
    timer.current = setTimeout(() => {
      router.replace(HOME_ROUTE[role] as never);
    }, 700);
  };

  return (
    <View>
      <Text style={styles.welcome}>Selamat Datang, {role}!</Text>

      <Text style={styles.description}>
        Masuk dengan NIP dan password kamu untuk melanjutkan ke aplikasi SILAKOM.
      </Text>

      <LoginInput
        label="NIP"
        placeholder="Masukkan NIP"
        value={nip}
        onChangeText={(value) => {
          // NIP hanya angka
          setNip(value.replace(/\D/g, ""));
          if (errors.nip) setErrors((prev) => ({ ...prev, nip: undefined }));
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

      <LoginButton onPress={handleLogin} loading={loading} />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          // Belum ada fitur bantuan login.
        }}
      >
        <Text style={styles.help}>Mengalami kendala saat masuk?</Text>
      </TouchableOpacity>
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
  help: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 20,
  },
});