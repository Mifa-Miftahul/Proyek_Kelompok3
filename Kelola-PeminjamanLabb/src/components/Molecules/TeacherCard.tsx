import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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


export type Teacher = {
  id: string;
  nama: string;
  nip: string;
  password: string;
};

type TeacherCardProps = {
  teacher: Teacher;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TeacherCard({
  teacher,
  onEdit,
  onDelete,
}: TeacherCardProps) {
  const initial = teacher.nama.trim().charAt(0).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {teacher.nama}
          </Text>

          <View style={styles.nipRow}>
            <Ionicons name="card-outline" size={14} color={COLORS.muted} />
            <Text style={styles.nip}>NIP {teacher.nip}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <RowActions onEdit={onEdit} onDelete={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleBlue,
  },
  avatarText: { color: COLORS.navy, fontSize: 18, fontWeight: '700' },
  info: { flex: 1, minWidth: 0 },
  name: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  nipRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  nip: { color: COLORS.muted, fontSize: 11 },
  actions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});
