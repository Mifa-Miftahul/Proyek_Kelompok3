import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = {
  navy: "#223F91",
  white: "#FFFFFF",
};

type BackHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress: () => void;
};

// Header halaman dalam (bukan halaman utama) dengan tombol kembali.
export default function BackHeader({
  title,
  subtitle,
  onBackPress,
}: BackHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBackPress}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Kembali"
        hitSlop={8}
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.white} />
      </Pressable>

      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 85,
    backgroundColor: COLORS.navy,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  pressed: {
    opacity: 0.7,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  subtitle: {
    color: "#E0E7FF",
    fontSize: 10,
  },
});
