import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookingRequest, BookingStatus } from '../../constants/bookingData';
import HistoryCard from './HistoryCard';

type Props = {
  bookings: BookingRequest[];
  filter: 'Semua' | BookingStatus;
  onFilterChange: (value: 'Semua' | BookingStatus) => void;
  onSelect: (booking: BookingRequest) => void;
};

const FILTERS: ('Semua' | BookingStatus)[] = [
  'Semua',
  'Pending',
  'Disetujui',
  'Ditolak',
];

export default function HistoryList({
  bookings,
  filter,
  onFilterChange,
  onSelect,
}: Props) {
  return (
    <View>
      <Text style={styles.heading}>Daftar Riwayat</Text>

      <View style={styles.filterContainer}>
        {FILTERS.map((item) => {
          const active = filter === item;

          return (
            <Text
              key={item}
              onPress={() => onFilterChange(item)}
              style={[styles.filter, active && styles.activeFilter]}
            >
              {item}
            </Text>
          );
        })}
      </View>

      <Text style={styles.result}>
        Menampilkan {bookings.length} data peminjaman
      </Text>

      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <HistoryCard
            key={booking.id}
            booking={booking}
            onPress={() => onSelect(booking)}
          />
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>▤</Text>
          <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
          <Text style={styles.emptyText}>
            Tidak ada data peminjaman dengan status ini.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#26334D',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filter: {
    overflow: 'hidden',
    fontSize: 11,
    color: '#6F7890',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E7EF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilter: {
    color: '#FFFFFF',
    backgroundColor: '#223F91',
    borderColor: '#223F91',
    fontWeight: '700',
  },
  result: {
    fontSize: 11,
    color: '#8991A3',
    marginBottom: 12,
  },
  empty: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  emptyIcon: {
    fontSize: 30,
    color: '#AAB3C5',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#35415B',
  },
  emptyText: {
    fontSize: 11,
    color: '#8991A3',
    marginTop: 5,
    textAlign: 'center',
  },
});