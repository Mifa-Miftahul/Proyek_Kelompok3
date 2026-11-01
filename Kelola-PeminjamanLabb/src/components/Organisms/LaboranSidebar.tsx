import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import LogoSILAKOM from '../Molecules/LogoSILAKOM';
import { NAV_ITEMS, LaboranRoute } from './LaboranBottomNavigation';

const COLORS = {
  navy: '#223F91',
  white: '#FFFFFF',
  paleBlue: '#E0E7FF',
  line: 'rgba(255,255,255,0.18)',
};

type LaboranSidebarProps = {
  activeRoute: LaboranRoute;
  // true = hanya ikon + label kecil (iPad portrait), false = sidebar penuh (laptop)
  compact?: boolean;
};

// Pengganti bottom navigation di layar lebar (iPad dan laptop).
export default function LaboranSidebar({
  activeRoute,
  compact = false,
}: LaboranSidebarProps) {
  const router = useRouter();

  return (
    <View style={[styles.sidebar, compact ? styles.compact : styles.full]}>
      <View style={[styles.brand, compact && styles.brandCompact]}>
        <View style={styles.logoBox}>
          <LogoSILAKOM size={30} color={COLORS.white} />
        </View>

        {!compact && (
          <View style={styles.brandText}>
            <Text style={styles.brandTitle}>SILAKOM</Text>
            <Text style={styles.brandSubtitle}>Panel Laboran</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {NAV_ITEMS.map((item) => {
        const active = activeRoute === item.route;

        return (
          <Pressable
            key={item.route}
            onPress={() => {
              if (!active) router.replace(item.path as never);
            }}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.item,
              compact ? styles.itemCompact : styles.itemFull,
              active && styles.itemActive,
              pressed && !active && styles.itemPressed,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={compact ? 24 : 21}
              color={active ? COLORS.navy : COLORS.white}
            />
            <Text
              numberOfLines={1}
              style={[
                compact ? styles.labelCompact : styles.labelFull,
                active && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: COLORS.navy,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  full: { width: 232 },
  compact: { width: 88, paddingHorizontal: 8 },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 6,
    paddingBottom: 18,
  },
  brandCompact: { justifyContent: 'center', paddingHorizontal: 0 },
  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#647DB6',
  },
  brandText: { flex: 1 },
  brandTitle: { color: COLORS.white, fontSize: 17, fontWeight: '800' },
  brandSubtitle: { color: COLORS.paleBlue, fontSize: 10, marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginBottom: 14,
  },
  item: {
    borderRadius: 12,
    marginBottom: 6,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  itemFull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  itemCompact: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 64,
  },
  itemActive: { backgroundColor: COLORS.white },
  itemPressed: { backgroundColor: 'rgba(255,255,255,0.12)' },
  labelFull: { color: COLORS.paleBlue, fontSize: 13, fontWeight: '600' },
  labelCompact: { color: COLORS.paleBlue, fontSize: 10, fontWeight: '500' },
  labelActive: { color: COLORS.navy, fontWeight: '700' },
});
