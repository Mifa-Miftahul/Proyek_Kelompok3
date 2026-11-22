import { useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

import SplashBrand from "@/components/Organisms/SplashBrand";
import { supabase } from "@/lib/supabase";

const HOME_ROUTE = {
  guru: "/Guru/dashboard",
  laboran: "/Laboran/dashboard",
} as const;

export default function SplashScreen() {
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      // Menjaga splash tetap terlihat minimal 1 detik.
      const minimumDelay = new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          await minimumDelay;

          if (mounted) {
            router.replace("/login" as never);
          }
          return;
        }

        // Memastikan session masih valid di sisi Supabase.
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          await supabase.auth.signOut();
          await minimumDelay;

          if (mounted) {
            router.replace("/login" as never);
          }
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("users")
            .select("role, is_active")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (
          !profile ||
          profile.is_active !== true ||
          !(profile.role in HOME_ROUTE)
        ) {
          await supabase.auth.signOut();
          await minimumDelay;

          if (mounted) {
            router.replace("/login" as never);
          }
          return;
        }

        await minimumDelay;

        if (mounted) {
          router.replace(
            HOME_ROUTE[profile.role as keyof typeof HOME_ROUTE] as never
          );
        }
      } catch (error) {
        console.error("Inisialisasi aplikasi gagal:", error);

        await minimumDelay;

        if (mounted) {
          router.replace("/login" as never);
        }
      }
    };

    initializeApp();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <SplashBrand />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  footer: {
    alignItems: "center",
    paddingBottom: 28,
  },

  footerLine: {
    width: 45,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#176B5B",
  },
});
