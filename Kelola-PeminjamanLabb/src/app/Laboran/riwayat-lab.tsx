import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {
  BookingRequest,
  BookingStatus,
  INITIAL_BOOKINGS,
} from '../../constants/bookingData';

import HistorySummary from '../../components/Organisms/HistorySummary';
import HistoryList from '../../components/Organisms/HistoryList';
import HistoryDetailModal from '../../components/Organisms/HistoryDetailModal';
import LaboranBottomNavigation from '../../components/Organisms/LaboranBottomNavigation';
import BookingHeader from '@/components/Organisms/BookingHeader';

type HistoryFilter = 'Semua' | BookingStatus;

export default function RiwayatLabScreen() {
  const [bookings] = useState<BookingRequest[]>(INITIAL_BOOKINGS);
  const [filter, setFilter] = useState<HistoryFilter>('Semua');
  const [selectedBooking, setSelectedBooking] =
    useState<BookingRequest | null>(null);

  const filteredBookings = useMemo(() => {
    const result = bookings.filter((booking) => {
      if (filter === 'Semua') return true;
      return booking.status === filter;
    });

    return [...result].sort((a, b) => b.date.localeCompare(a.date));
  }, [bookings, filter]);

  return (
    <SafeAreaView style={styles.safeArea}>
  <StatusBar barStyle="dark-content" />

  <BookingHeader name="Laboran" />

  <View style={styles.container}>
    <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageTitle}>
  <Text style={styles.title}>Riwayat Peminjaman</Text>
  <Text style={styles.description}>
    Lihat seluruh riwayat pengajuan peminjaman laboratorium.
  </Text>
</View>

          <HistorySummary bookings={bookings} />

          <HistoryList
            bookings={filteredBookings}
            filter={filter}
            onFilterChange={setFilter}
            onSelect={setSelectedBooking}
          />
        </ScrollView>

        <LaboranBottomNavigation activeRoute="Riwayat" />
      </View>

      <HistoryDetailModal
        visible={selectedBooking !== null}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 20,
  },

  pageTitle: {
  marginBottom: 20,
},
title: {
  color: '#1E293B',
  fontSize: 22,
  fontWeight: '700',
},
description: {
  color: '#64748B',
  fontSize: 13,
  marginTop: 6,
  lineHeight: 19,
},

});

