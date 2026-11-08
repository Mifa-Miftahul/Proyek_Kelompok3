
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

import {
  BookingRequest,
  BookingStatus,
} from '@/constants/bookingData';

import BookingHeader from '@/components/Organisms/BookingHeader';
import BookingSummary from '@/components/Organisms/BookingSummary';
import BookingList from '@/components/Organisms/BookingList';
import BookingDetailModal from '@/components/Organisms/BookingDetailModal';
import LaboranBottomNavigation from '@/components/Organisms/LaboranBottomNavigation';
import { supabase } from '../../lib/supabase';

import BookingFilter, {
  BookingFilterType,
} from '@/components/Molecules/BookingFilter';

export default function KelolaPeminjaman() {
const [bookings, setBookings] = useState<BookingRequest[]>([]);
const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState('');

  const [activeFilter, setActiveFilter] =
    useState<BookingFilterType>('Semua');

  const [selectedBooking, setSelectedBooking] =
    useState<BookingRequest | null>(null);

  const [showDetail, setShowDetail] = useState(false);

  
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
    console.error('Gagal mengambil data peminjaman:', error);
    setErrorMessage(error.message || 'Gagal mengambil data peminjaman.');
  } finally {
    setLoading(false);
  }
};

// Panggil fungsi ketika halaman dibuka
useEffect(() => {
  fetchBookings();
}, []);



  // Menghitung jumlah pengajuan berdasarkan status
  const totalPending = bookings.filter(
    (item) => item.status === 'Pending'
  ).length;

  const totalApproved = bookings.filter(
    (item) => item.status === 'Disetujui'
  ).length;

  const totalRejected = bookings.filter(
    (item) => item.status === 'Ditolak'
  ).length;

  // Menampilkan pengajuan sesuai filter
  const filteredBookings = useMemo(() => {
    if (activeFilter === 'Semua') {
      return bookings;
    }

    return bookings.filter(
      (item) => item.status === activeFilter
    );
  }, [bookings, activeFilter]);

  // Membuka detail pengajuan
  const handleDetail = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setShowDetail(true);
  };


const handleApprove = (id: string) => {
  Alert.alert(
    'Setujui Peminjaman',
    `Apakah kamu yakin ingin menyetujui pengajuan ${id}?`,
    [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Setujui',
        onPress: async () => {
          try {
            const { data: userData, error: userError } =
              await supabase.auth.getUser();

            if (userError || !userData.user) {
              throw new Error('Sesi Laboran tidak ditemukan.');
            }

            const { data, error } = await supabase
              .from('peminjaman')
              .update({
                status: 'Disetujui',
                approved_by: userData.user.id,
              })
              .eq('id_peminjaman', Number(id))
              .eq('status', 'Pending')
              .select('id_peminjaman')
              .maybeSingle();

            if (error) throw error;

            if (!data) {
              throw new Error(
                'Pengajuan tidak ditemukan atau status sudah berubah.'
              );
            }

            await fetchBookings();
            setShowDetail(false);
            setSelectedBooking(null);

            Alert.alert('Berhasil', 'Pengajuan berhasil disetujui.');
          } catch (error: any) {
            console.error('Gagal menyetujui:', error);
            Alert.alert('Gagal', error.message);
          }
        },
      },
    ]
  );
};

const handleReject = (id: string, reason: string) => {
  if (!reason.trim()) {
    Alert.alert(
      'Alasan Belum Diisi',
      'Silakan tuliskan alasan penolakan terlebih dahulu.'
    );
    return;
  }

  Alert.alert(
    'Tolak Peminjaman',
    `Apakah kamu yakin ingin menolak pengajuan ${id}?`,
    [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Tolak',
        style: 'destructive',
        onPress: async () => {
          try {
            const { data: userData, error: userError } =
              await supabase.auth.getUser();

            if (userError || !userData.user) {
              throw new Error('Sesi Laboran tidak ditemukan.');
            }

            const { data, error } = await supabase
              .from('peminjaman')
              .update({
                status: 'Ditolak',
                alasan_penolakan: reason.trim(),
                approved_by: userData.user.id,
              })
              .eq('id_peminjaman', Number(id))
              .eq('status', 'Pending')
              .select('id_peminjaman')
              .maybeSingle();

            if (error) throw error;

            if (!data) {
              throw new Error(
                'Pengajuan tidak ditemukan atau status sudah berubah.'
              );
            }

            await fetchBookings();

            setShowDetail(false);
            setSelectedBooking(null);

            Alert.alert(
              'Berhasil',
              'Pengajuan berhasil ditolak.'
            );
          } catch (error: any) {
            console.error('Gagal menolak peminjaman:', error);
            Alert.alert(
              'Gagal',
              error.message || 'Terjadi kesalahan saat menolak pengajuan.'
            );
          }
        },
      },
    ]
  );
};


  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <BookingHeader name="Laboran" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Judul halaman */}
        <View style={styles.pageTitle}>
          <Text style={styles.title}>
            Pengajuan Peminjaman
          </Text>

          <Text style={styles.description}>
            Kelola dan konfirmasi pengajuan peminjaman laboratorium.
          </Text>
        </View>

        {/* Ringkasan pengajuan */}
        <BookingSummary
          pending={totalPending}
          approved={totalApproved}
          rejected={totalRejected}
        />

        {/* Filter status */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>
            Daftar Pengajuan
          </Text>

          <BookingFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </View>

        {/* Daftar pengajuan */}
        {loading ? (
  <Text style={styles.description}>
    Sedang mengambil data peminjaman...
  </Text>
) : errorMessage ? (
  <Text style={{ color: 'red', marginVertical: 16 }}>
    {errorMessage}
  </Text>
) : (
  <BookingList
    bookings={filteredBookings}
    filter={activeFilter}
    onDetail={handleDetail}
    onApprove={handleApprove}
  />
)}
      </ScrollView>

      <LaboranBottomNavigation activeRoute="Peminjaman" />  

      {/* Modal detail pengajuan */}
      <BookingDetailModal
        visible={showDetail}
        booking={selectedBooking}
        onClose={() => {
          setShowDetail(false);
          setSelectedBooking(null);
        }}
        onApprove={handleApprove}
onReject={handleReject}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
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
  filterSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 13,
  },
});
