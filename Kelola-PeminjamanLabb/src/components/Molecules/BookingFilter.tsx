import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { BookingStatus } from '@/constants/bookingData';

export type BookingFilterType = 'Semua' | BookingStatus;

type Props = {
  activeFilter: BookingFilterType;
  onFilterChange: (filter: BookingFilterType) => void;
};

const FILTERS: BookingFilterType[] = [
  'Semua',
  'Pending',
  'Disetujui',
  'Ditolak',
];

export default function BookingFilter({
  activeFilter,
  onFilterChange,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const active = activeFilter === filter;

        return (
          <Pressable
            key={filter}
            onPress={() => onFilterChange(filter)}
            style={[styles.button, active && styles.activeButton]}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 9,
    paddingBottom: 3,
  },
  button: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeButton: {
    backgroundColor: '#223F91',
    borderColor: '#223F91',
  },
  text: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
});