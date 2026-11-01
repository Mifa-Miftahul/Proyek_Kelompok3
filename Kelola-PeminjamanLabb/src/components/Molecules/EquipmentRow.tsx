import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import RowActions from './RowActions';

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


export type Equipment = {
  id: string;
  nama: string;
  jumlah: number;
};

type EquipmentRowProps = {
  item: Equipment;
  onEdit: () => void;
  onDelete: () => void;
};

const ICONS: Record<
  string,
  React.ComponentProps<typeof MaterialCommunityIcons>['name']
> = {
  Komputer: 'desktop-classic',
  Proyektor: 'projector',
  Router: 'router-wireless',
  Switch: 'lan',
  'Access Point': 'access-point',
};

// Satu baris perangkat: sama seperti di Daftar Lab (Guru) + tombol Edit/Hapus.
export default function EquipmentRow({
  item,
  onEdit,
  onDelete,
}: EquipmentRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name={ICONS[item.nama] ?? 'devices'}
            size={21}
            color={COLORS.navy}
          />
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {item.nama}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.jumlah} unit</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <RowActions onEdit={onEdit} onDelete={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  name: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: COLORS.paleBlue,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  badgeText: { color: COLORS.navy, fontSize: 10, fontWeight: '700' },
  actions: { marginTop: 10 },
});
