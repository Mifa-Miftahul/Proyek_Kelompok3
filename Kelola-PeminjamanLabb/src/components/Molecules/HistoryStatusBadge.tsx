import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookingStatus } from '../../constants/bookingData';

type Props = {
  status: BookingStatus;
};

export default function HistoryStatusBadge({ status }: Props) {
  const statusStyle = {
    Pending: styles.pending,
    Disetujui: styles.approved,
    Ditolak: styles.rejected,
  };

  const textStyle = {
    Pending: styles.pendingText,
    Disetujui: styles.approvedText,
    Ditolak: styles.rejectedText,
  };

  return (
    <View style={[styles.badge, statusStyle[status]]}>
      <Text style={[styles.text, textStyle[status]]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  pending: { backgroundColor: '#FFF4D6' },
  pendingText: { color: '#B7791F' },
  approved: { backgroundColor: '#DCFCE7' },
  approvedText: { color: '#15803D' },
  rejected: { backgroundColor: '#FEE2E2' },
  rejectedText: { color: '#DC2626' },
});