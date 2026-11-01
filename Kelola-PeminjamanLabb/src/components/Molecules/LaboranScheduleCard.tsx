import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import StatusBadge from './StatusBadge';
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


export type Schedule = {
  id: string;
  labId: string;
  day: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  className: string;
  status: 'Berlangsung' | 'Terjadwal';
};

type LaboranScheduleCardProps = {
  schedule: Schedule;
  onEdit: () => void;
  onDelete: () => void;
};

// Kartu jadwal seperti ScheduleCard milik Guru, ditambah tombol Edit & Hapus.
export default function LaboranScheduleCard({
  schedule,
  onEdit,
  onDelete,
}: LaboranScheduleCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.main}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={20} color={COLORS.navy} />
          <Text style={styles.time}>{schedule.time}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.subject}>{schedule.subject}</Text>
            <StatusBadge status={schedule.status} />
          </View>

          <Text style={styles.className}>{schedule.className}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={15} color={COLORS.muted} />
            <Text style={styles.detailText}>{schedule.teacher}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={15} color={COLORS.muted} />
            <Text style={styles.detailText}>
              {schedule.day}, {schedule.date}
            </Text>
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
    padding: 15,
    marginBottom: 13,
  },
  main: { flexDirection: 'row' },
  timeContainer: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 9,
  },
  time: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 8,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginRight: 13,
  },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 9,
  },
  subject: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  className: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 9,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 7,
  },
  detailText: { color: COLORS.muted, fontSize: 11, flexShrink: 1 },
  actions: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});
