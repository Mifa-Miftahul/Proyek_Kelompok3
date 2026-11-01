import React from 'react';
import { View, StyleSheet } from 'react-native';
import BookingSummaryCard from '@/components/Molecules/BookingSummaryCard';

type Props = {
  pending: number;
  approved: number;
  rejected: number;
};

export default function BookingSummary({
  pending,
  approved,
  rejected,
}: Props) {
  return (
    <View style={styles.container}>
      <BookingSummaryCard
        icon="time-outline"
        count={pending}
        label="Menunggu"
        color="#D97706"
        background="#FEF3C7"
      />

      <BookingSummaryCard
        icon="checkmark-circle-outline"
        count={approved}
        label="Disetujui"
        color="#15803D"
        background="#DCFCE7"
      />

      <BookingSummaryCard
        icon="close-circle-outline"
        count={rejected}
        label="Ditolak"
        color="#DC2626"
        background="#FEE2E2"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
});