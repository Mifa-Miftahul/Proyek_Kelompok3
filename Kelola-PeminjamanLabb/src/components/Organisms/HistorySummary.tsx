import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookingRequest } from '../../constants/bookingData';
import HistorySummaryCard from '../Molecules/HistorySummaryCard';

type Props = {
  bookings: BookingRequest[];
};

export default function HistorySummary({ bookings }: Props) {
  const total = bookings.length;
  const approved = bookings.filter(
    (item) => item.status === 'Disetujui',
  ).length;
  const rejected = bookings.filter(
    (item) => item.status === 'Ditolak',
  ).length;
  const pending = bookings.filter(
    (item) => item.status === 'Pending',
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <HistorySummaryCard
          title="Total"
          value={total}
          icon="▤"
          color="#223F91"
          backgroundColor="#E8EDFF"
        />
        <HistorySummaryCard
          title="Disetujui"
          value={approved}
          icon="✓"
          color="#15803D"
          backgroundColor="#DCFCE7"
        />
      </View>

      <View style={styles.row}>
        <HistorySummaryCard
          title="Ditolak"
          value={rejected}
          icon="×"
          color="#DC2626"
          backgroundColor="#FEE2E2"
        />
        <HistorySummaryCard
          title="Pending"
          value={pending}
          icon="◷"
          color="#B7791F"
          backgroundColor="#FFF4D6"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});