import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ActionButton from "@/components/Molecules/ActionButton";
import LoginInput from "@/components/Molecules/LoginInput";
import { useToast } from "@/components/Molecules/Toast";
import LaboranScreenLayout from "@/components/Organisms/LaboranScreenLayout";
import { supabase } from "@/lib/supabase";

const COLORS = {
  navy: "#223F91",
  blue: "#3B82F6",
  paleBlue: "#DCEBFF",
  background: "#F5F7FB",
  white: "#FFFFFF",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
  green: "#059669",
  paleGreen: "#D1FAE5",
  red: "#DC2626",
};

type Profile = {
  nama: string;
  nip: string;
  role: string;
  is_active: boolean;
};

export default function AturPasswordScreen() {
  const router = useRouter();
  const toast = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // Memastikan pengguna memiliki sesi dan profil Laboran aktif.
  useEffect(() => {
    let mounted = true;

    const verifyAccount = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          router.replace("/login" as never);
          return;
        }

        const { data: userProfile, error: profileError } =
          await supabase
            .from("users")
            .select("nama, nip, role, is_active")
            .eq("id", data.user.id)
            .maybeSingle();

        if (profileError || !userProfile) {
          throw new Error("Gagal memuat profil akun.");
        }

        if (
          userProfile.role !== "laboran" ||
          userProfile.is_active !== true
        ) {
          await supabase.auth.signOut();
          router.replace("/login" as never);
          return;
        }

        if (mounted) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Verifikasi akun gagal:", error);

        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Gagal memeriksa akun."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    verifyAccount();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSavePassword = async () => {
    if (submitting) return;

    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Password minimal 8 karakter.");
      return;
    }

    if (password.length > 128) {
      setErrorMessage("Password maksimal 128 karakter.");
      return;
    }

    if (password !== confirmation) {
      setErrorMessage("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setSubmitting(true);

      // Mengubah password pada akun Auth yang sedang login.
      // UUID akun dan identitas Google tidak berubah.
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error("Gagal memperbarui password:", error);
        setErrorMessage(
          error.message || "Gagal menyimpan password."
        );
        return;
      }

      setPassword("");
      setConfirmation("");
      setShowPassword(false);
      setShowConfirmation(false);

      toast.show("Password NIP berhasil diperbarui.");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setErrorMessage("Terjadi kesalahan saat menyimpan password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LaboranScreenLayout
      title="Atur Password NIP"
      description="Pengaturan akses akun Laboran"
      icon="shield-lock"
      activeRoute="Dashboard"
      toastMessage={toast.message}
    >
      <View style={styles.container}>
        <View style={styles.backRow}>
          <ActionButton
            label="Kembali"
            icon="arrow-back-outline"
            variant="secondary"
            small
            onPress={() => router.back()}
          />
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.navy} />
            <Text style={styles.loadingText}>
              Memeriksa akun...
            </Text>
          </View>
        ) : !profile ? (
          <View style={styles.card}>
            <Ionicons
              name="alert-circle-outline"
              size={38}
              color={COLORS.red}
            />
            <Text style={styles.errorTitle}>
              Akun tidak dapat diverifikasi
            </Text>
            <Text style={styles.description}>
              {errorMessage || "Silakan login kembali."}
            </Text>

            <ActionButton
              label="Kembali ke Login"
              onPress={() => router.replace("/login" as never)}
              style={styles.fullButton}
            />
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={28}
                  color={COLORS.navy}
                />
              </View>

              <Text style={styles.title}>
                Buat Password Login NIP
              </Text>

              <Text style={styles.description}>
                Gunakan password ini untuk masuk menggunakan NIP
                tanpa perlu membuka Google setiap kali login.
              </Text>

              <View style={styles.profileBox}>
                <Text style={styles.profileLabel}>Nama Laboran</Text>
                <Text style={styles.profileValue}>
                  {profile.nama}
                </Text>

                <View style={styles.profileDivider} />

                <Text style={styles.profileLabel}>NIP</Text>
                <Text style={styles.profileValue}>
                  {profile.nip}
                </Text>
              </View>

              <View style={styles.notice}>
                <Ionicons
                  name="information-circle-outline"
                  size={19}
                  color={COLORS.blue}
                />
                <Text style={styles.noticeText}>
                  Password akan disimpan pada akun yang sama dengan
                  Google. Login Google tetap dapat digunakan.
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.formTitle}>
                Password Baru
              </Text>

              <LoginInput
                label="Password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChangeText={setPassword}
                icon="lock-closed-outline"
                secureTextEntry
                showPassword={showPassword}
                onTogglePassword={() =>
                  setShowPassword((value) => !value)
                }
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={128}
                returnKeyType="next"
              />

              <LoginInput
                label="Konfirmasi Password"
                placeholder="Masukkan ulang password"
                value={confirmation}
                onChangeText={setConfirmation}
                icon="lock-closed-outline"
                secureTextEntry
                showPassword={showConfirmation}
                onTogglePassword={() =>
                  setShowConfirmation((value) => !value)
                }
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={128}
                returnKeyType="done"
                onSubmitEditing={handleSavePassword}
              />

              {!!errorMessage && (
                <View style={styles.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={17}
                    color={COLORS.red}
                  />
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                </View>
              )}

              <ActionButton
                label={
                  submitting
                    ? "Menyimpan..."
                    : "Simpan Password NIP"
                }
                icon="save-outline"
                onPress={handleSavePassword}
                disabled={
                  submitting ||
                  !password ||
                  !confirmation
                }
                style={styles.fullButton}
              />

              <Text style={styles.footerText}>
                Jangan bagikan password kepada siapa pun.
              </Text>
            </View>
          </>
        )}
      </View>
    </LaboranScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },

  backRow: {
    alignItems: "flex-start",
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.paleBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  title: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
  },

  profileBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 13,
    marginTop: 17,
  },

  profileLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 4,
  },

  profileValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },

  profileDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 11,
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#EFF6FF",
    borderRadius: 11,
    padding: 12,
    marginTop: 14,
  },

  noticeText: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 11,
    lineHeight: 17,
  },

  formTitle: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 18,
  },

  fullButton: {
    width: "100%",
    marginTop: 8,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 11,
    marginBottom: 10,
  },

  errorText: {
    flex: 1,
    color: COLORS.red,
    fontSize: 11,
    lineHeight: 17,
  },

  errorTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
  },

  loading: {
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 12,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 13,
  },
});
