import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Tone = "blue" | "yellow" | "green" | "red";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  blue: { bg: "#DCEBFF", fg: "#223F91" },
  yellow: { bg: "#FEF3C7", fg: "#D97706" },
  green: { bg: "#D1FAE5", fg: "#059669" },
  red: { bg: "#FEE2E2", fg: "#EF4444" },
};

type StatTileProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  value: number | string;
  label: string;
  tone?: Tone;
  onPress?: () => void;
};

// Kartu angka kecil untuk ringkasan di dashboard / riwayat.
export default function StatTile({
  icon,
  value,
  label,
  tone = "blue",
  onPress,
}: StatTileProps) {
  const color = TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${label}: ${value}`}
      style={({ pressed }) => [
        styles.tile,
        pressed && onPress && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color.bg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color.fg} />
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.value, { color: color.fg }]}>{value}</Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F4FA",
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
  },
  label: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 1,
  },
});
