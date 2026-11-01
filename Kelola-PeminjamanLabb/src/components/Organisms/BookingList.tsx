import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BookingRequest } from '@/constants/bookingData';
import BookingCard from './BookingCard';

type Props = {
  bookings: BookingRequest[];
  onDetail: (booking: BookingRequest) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  filter: string;
};

export default function BookingList({
  bookings,
  onDetail,
  onApprove,
  onReject,
  filter,
}: Props) {
  if (bookings.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="file-tray-outline" size={42} color="#94A3B8" />
        <Text style={styles.emptyTitle}>Belum Ada Pengajuan</Text>
        <Text style={styles.emptyDescription}>
          Tidak ada pengajuan dengan status {filter.toLowerCase()}.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onDetail={onDetail}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  empty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    color: '#1E293B',
    fontWeight: '700',
    fontSize: 15,
    marginTop: 12,
  },
  emptyDescription: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});