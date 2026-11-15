
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderDashboardProps = {
  onLogoutPress: () => void;
  greeting?: string;
  schoolName?: string;
};

const COLORS = {
  navy: "#223F91",
  white: "#FFFFFF",
};

export default function HeaderDashboard({
  onLogoutPress,
  greeting = "Halo, Salwa Ayudia 👋🏻",
  schoolName = "Guru - SMK Islamic Center Cirebon",
}: HeaderDashboardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.headerTextWrap}>
        <Text style={styles.greeting}>{greeting}</Text>

        <Text style={styles.schoolName}>{schoolName}</Text>
      </View>

      <Pressable
        style={[
          styles.logoutButton,
          Platform.OS === "web" && isHovered ? styles.hoverLogout : null,
        ]}
        onPress={onLogoutPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        accessibilityRole="button"
        accessibilityLabel="Logout"
        hitSlop={8}
      >
        <Ionicons name="log-out-outline" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 85,
    backgroundColor: COLORS.navy,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  schoolName: {
    color: "#E0E7FF",
    fontSize: 10,
    fontWeight: "400",
  },

  logoutButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 20,
  },

  hoverLogout: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});