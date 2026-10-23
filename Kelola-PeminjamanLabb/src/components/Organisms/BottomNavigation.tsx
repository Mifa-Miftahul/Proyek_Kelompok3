import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import BottomNavItem from '../Molecules/BottomNavItem';

// ==================== COLORS ====================

const COLORS = {
  navy: '#223F91',
};

// ==================== TYPES ====================

type BottomNavigationProps = {
  activeRoute: string;
  onNavigate: (route: string) => void;
};

// ==================== NAVIGATION ITEMS ====================

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'home',
    route: 'Dashboard',
  },
  {
    label: 'Jadwal Lab',
    icon: 'calendar-outline',
    route: 'JadwalLab',
  },
  {
    label: 'Daftar Lab',
    icon: 'business-outline',
    route: 'DaftarLab',
  },
  {
    label: 'Peminjaman Lab',
    icon: 'calendar-clear-outline',
    route: 'BuatPeminjaman',
  },
] as const;

// ==================== BOTTOM NAVIGATION ====================

export default function BottomNavigation({
  activeRoute,
  onNavigate,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => (
        <BottomNavItem
          key={item.route}
          label={item.label}
          icon={item.icon}
          active={activeRoute === item.route}
          onPress={() => onNavigate(item.route)}
        />
      ))}
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
    paddingHorizontal: 2,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
});