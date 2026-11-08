import React, { useEffect, useMemo, useState } from 'react';
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
} from '../../constants/bookingData';

import { supabase } from '../../lib/supabase';

import HistorySummary from '../../components/Organisms/HistorySummary';
import HistoryList from '../../components/Organisms/HistoryList';
import HistoryDetailModal from '../../components/Organisms/HistoryDetailModal';
import LaboranBottomNavigation from '../../components/Organisms/LaboranBottomNavigation';
import BookingHeader from '@/components/Organisms/BookingHeader';

type HistoryFilter = 'Semua' | BookingStatus;

export default function RiwayatLabScreen() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState('');


// Mengambil data riwayat dari Supabase
const fetchBookings = async () => {
  try {
    setLoading(true);
    setErrorMessage('');

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('Sesi login tidak ditemukan. Silakan login kembali.');
    }

    const { data, error } = await supabase
      .from('peminjaman')
      .select(`
        *,
        users!fk_peminjaman_guru (
          nama,
          nip
        ),
        laboratorium!fk_peminjaman_laboratorium (
          nama_lab,
          ruangan
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedBookings: BookingRequest[] = (data || []).map(
      (item: any) => ({
        id: String(item.id_peminjaman),
        teacherName: item.users?.nama || 'Nama Guru tidak tersedia',
        labName: item.laboratorium?.nama_lab || 'Laboratorium tidak tersedia',
        labId: String(item.id_lab),
        date: item.tanggal,
        startTime: item.jam_mulai?.slice(0, 5) || '',
        endTime: item.jam_selesai?.slice(0, 5) || '',
        className: item.kelas,
        subject: item.mata_pelajaran,
        studentCount: item.jumlah_siswa,
        purpose: item.keperluan,
        status: item.status as BookingStatus,
        rejectionReason: item.alasan_penolakan || undefined,
      })
    );

    setBookings(formattedBookings);
  } catch (error: any) {
    console.error('Gagal mengambil riwayat peminjaman:', error);
    setErrorMessage(
      error.message || 'Gagal mengambil riwayat peminjaman.'
    );
  } finally {
    setLoading(false);
  }
};

// Panggil ketika halaman dibuka
useEffect(() => {
  fetchBookings();
}, []);
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

          {loading ? (
  <Text style={styles.description}>
    Sedang mengambil data riwayat...
  </Text>
) : errorMessage ? (
  <Text style={{ color: 'red', marginVertical: 16 }}>
    {errorMessage}
  </Text>
) : (
  <>
    <HistorySummary bookings={bookings} />

    <HistoryList
      bookings={filteredBookings}
      filter={filter}
      onFilterChange={setFilter}
      onSelect={setSelectedBooking}
    />
  </>
)}
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

