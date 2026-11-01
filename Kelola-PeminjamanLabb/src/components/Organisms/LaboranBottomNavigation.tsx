import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import BottomNavItem from '../Molecules/BottomNavItem';

const COLORS = {
  navy: '#223F91',
};

export type LaboranRoute =
  | 'Dashboard'
  | 'JadwalLab'
  | 'KelolaLab'
  | 'AkunGuru'
  | 'Peminjaman'
  | 'Riwayat';

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'home-outline', route: 'Dashboard', path: '/Laboran/dashboard' },
  { label: 'Jadwal Lab', icon: 'calendar-outline', route: 'JadwalLab', path: '/Laboran/jadwal-lab' },
  { label: 'Detail Lab', icon: 'business-outline', route: 'KelolaLab', path: '/Laboran/kelola-lab' },
  { label: 'Akun Guru', icon: 'people-outline', route: 'AkunGuru', path: '/Laboran/akun-guru' },
  { label: 'Peminjaman', icon: 'clipboard-outline', route: 'Peminjaman', path: '/Laboran/peminjaman-lab' },
  { label: 'Riwayat', icon: 'time-outline', route: 'Riwayat', path: '/Laboran/riwayat-lab' },
] as const;

type LaboranBottomNavigationProps = {
  activeRoute: LaboranRoute;
};

// Navigasi bawah laboran, memakai BottomNavItem yang sama dengan halaman Guru.
export default function LaboranBottomNavigation({
  activeRoute,
}: LaboranBottomNavigationProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => (
        <BottomNavItem
          key={item.route}
          label={item.label}
          icon={item.icon}
          active={activeRoute === item.route}
          onPress={() => {
            if (activeRoute !== item.route) {
              router.replace(item.path as never);
            }
          }}
        />
      ))}
    </View>
  );
}

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
