import React from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet } from 'react-native';

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
  background: '#F5F7FB',
  white: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  placeholder: '#94A3B8',
  border: '#E2E8F0',
  divider: '#EDF1F7',
  green: '#059669',
  paleGreen: '#D1FAE5',
  red: '#DC2626',
  paleRed: '#FEE2E2',
};



type ChipSelectorProps = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  // true = chip turun ke baris baru (dipakai di form), false = scroll horizontal
  wrap?: boolean;
};

// Pilihan berbentuk chip, gaya sama dengan filter hari di halaman Jadwal Lab.
export default function ChipSelector({
  options,
  value,
  onChange,
  wrap = false,
}: ChipSelectorProps) {
  const chips = options.map((option) => {
    const active = option === value;

    return (
      <Pressable
        key={option}
        onPress={() => onChange(option)}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={[styles.chip, active && styles.activeChip]}
      >
        <Text style={[styles.text, active && styles.activeText]}>
          {option}
        </Text>
      </Pressable>
    );
  });

  if (wrap) {
    return <View style={styles.wrap}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {chips}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexDirection: 'row', gap: 8, paddingBottom: 14 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  text: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: { color: COLORS.white },
});
