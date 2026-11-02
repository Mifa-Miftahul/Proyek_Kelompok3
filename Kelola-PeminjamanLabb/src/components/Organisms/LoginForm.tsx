import { useEffect, useRef, useState } from "react";
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
  paleBlue: "#DBEAFE",
  muted: "#64748B",
  text: "#1E293B",
  border: "#E2E8F0",
  soft: "#F8FAFC",
  red: "#DC2626",
  paleRed: "#FEF2F2",
  redBorder: "#FECACA",
};

type Role = "Guru" | "Laboran";

type Account = {
  role: Role;
  nama: string;
  nip: string;
  password: string;
};

// Akun dummy untuk demo (belum ada database).
// Nanti bagian ini diganti dengan pengecekan ke server.
const DEMO_ACCOUNTS: Account[] = [
  {
    role: "Guru",
    nama: "Salwa Ayudia",
    nip: "24880100",
    password: "guru123",
  },
  {
    role: "Laboran",
    nama: "Andi Setiawan",
    nip: "2488010040",
    password: "laboran123",
  },
];

// Halaman awal tiap peran setelah login berhasil.
const HOME_ROUTE: Record<Role, string> = {
  Guru: "/Guru/dashboard",
  Laboran: "/Laboran/dashboard",
};

type Errors = {
  nip?: string;
  password?: string;
};

export default function LoginForm() {
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Validasi format isian
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
    if (loading) return;

    setLoginError("");
    if (!validate()) return;

    setLoading(true);

    // "Login berhasil?" pada flowchart. Cabang Tidak: tetap di halaman login.
    timer.current = setTimeout(() => {
      const account = DEMO_ACCOUNTS.find(
        (item) => item.nip === nip && item.password === password,
      );

      if (!account) {
        setLoading(false);
        setLoginError("NIP atau password salah. Periksa kembali lalu coba lagi.");
        return;
      }

      router.replace(HOME_ROUTE[account.role] as never);
    }, 700);
  };

  // Isi otomatis dari akun demo
  const fillDemo = (account: Account) => {
    setNip(account.nip);
    setPassword(account.password);
    setErrors({});
    setLoginError("");
  };

  return (
    <View>
      <Text style={styles.welcome}>Selamat Datang!</Text>

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
          setLoginError("");
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
  demoBox: {
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 22,
  },
  demoTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  demoSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
    marginBottom: 10,
  },
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  roleBadge: {
    backgroundColor: COLORS.paleBlue,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  roleBadgeText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: "800",
  },
  demoInfo: { flex: 1, minWidth: 0 },
  demoName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  demoCredential: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
  },
});