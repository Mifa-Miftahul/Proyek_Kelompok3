
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import StatusBadgeDaftarLab from './StatusBadgeDaftarLab';

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

export type LabStatus = 'Tersedia' | 'Dipakai';

export type LabIcon =
  React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type LaboranLabCardProps = {
  name: string;
  room: string;
  icon: LabIcon;
  status: LabStatus;
  meta?: string;
  selected?: boolean;
  onPress: () => void;
};

// Kartu lab untuk laboran.
export default function LaboranLabCard({
  name,
  room,
  icon,
  status,
  meta,
  selected = false,
  onPress,
}: LaboranLabCardProps) {
  const color = selected ? COLORS.white : COLORS.navy;
  const mutedColor = selected ? '#DCE6FF' : COLORS.muted;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Pilih ${name}`}
      style={[styles.card, selected && styles.selectedCard]}
    >
      <View style={[styles.iconBox, selected && styles.selectedIconBox]}>
        <MaterialCommunityIcons
          name={icon}
          size={27}
          color={color}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.name, selected && styles.selectedName]}
          numberOfLines={1}
        >
          {name}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={mutedColor}
          />

          <Text style={[styles.infoText, { color: mutedColor }]}>
            {room}
            {meta ? ` · ${meta}` : ''}
          </Text>
        </View>

        <StatusBadgeDaftarLab status={status} />
      </View>

      <Ionicons
        name={selected ? 'checkmark-circle' : 'chevron-forward'}
        size={22}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  selectedCard: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleBlue,
  },

  selectedIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  content: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
  },

  name: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },

  selectedName: {
    color: COLORS.white,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },

  infoText: {
    fontSize: 11,
    flexShrink: 1,
  },
});