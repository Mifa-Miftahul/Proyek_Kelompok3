import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookingStatus } from '@/constants/bookingData';

type Props = {
  status: BookingStatus;
};

const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    color: '#D97706',
    background: '#FEF3C7',
  },
  Disetujui: {
    label: 'Disetujui',
    color: '#15803D',
    background: '#DCFCE7',
  },
  Ditolak: {
    label: 'Ditolak',
    color: '#DC2626',
    background: '#FEE2E2',
  },
};

export default function BookingStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
});