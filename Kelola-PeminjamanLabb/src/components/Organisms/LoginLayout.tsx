import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import LoginHeader from "@/components/Molecules/LoginHeader";
import LoginForm from "@/components/Organisms/LoginForm";

const COLORS = {
  navy: "#1E3A8A",
  background: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
};

type LoginLayoutProps = {
  role: "Guru" | "Laboran";
};

export default function LoginLayout({ role }: LoginLayoutProps) {
  // iPad / laptop: header + kartu jadi satu kolom di tengah layar.
  // "ready" memastikan layout lebar baru dipasang setelah komponen termuat,
  // supaya juga benar pada versi web hasil export (static).
  const { width } = useWindowDimensions();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const wide = ready && width >= 768;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navy}
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, wide && styles.scrollWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={wide ? styles.headerWide : undefined}>
            <LoginHeader />
          </View>

          {/* Satu-satunya kartu pada halaman login */}
          <View style={styles.card}>
            <LoginForm role={role} />
          </View>
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

  scrollWide: {
    justifyContent: "center",
    paddingVertical: 32,
  },

  container: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  headerWide: {
    borderRadius: 32,
    overflow: "hidden",
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 18,
    marginTop: -24,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
    ...Platform.select({
      web: {
        boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.10)",
      },
    }),
  },
});
