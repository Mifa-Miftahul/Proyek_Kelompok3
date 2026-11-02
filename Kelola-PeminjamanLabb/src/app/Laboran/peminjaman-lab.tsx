
import React, { useMemo, useState } from 'react';
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
  INITIAL_BOOKINGS,
} from '@/constants/bookingData';

import BookingHeader from '@/components/Organisms/BookingHeader';
import BookingSummary from '@/components/Organisms/BookingSummary';
import BookingList from '@/components/Organisms/BookingList';
import BookingDetailModal from '@/components/Organisms/BookingDetailModal';
import LaboranBottomNavigation from '@/components/Organisms/LaboranBottomNavigation';

import BookingFilter, {
  BookingFilterType,
} from '@/components/Molecules/BookingFilter';

export default function KelolaPeminjaman() {
  const [bookings, setBookings] =
    useState<BookingRequest[]>(INITIAL_BOOKINGS);

  const [activeFilter, setActiveFilter] =
    useState<BookingFilterType>('Semua');

  const [selectedBooking, setSelectedBooking] =
    useState<BookingRequest | null>(null);

  const [showDetail, setShowDetail] = useState(false);

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

  // Memperbarui status pengajuan
  const handleUpdateStatus = (
    id: string,
    status: BookingStatus
  ) => {
    const booking = bookings.find(
      (item) => item.id === id
    );

    if (!booking || booking.status !== 'Pending') return;

    const action = status === 'Disetujui' ? 'menyetujui' : 'menolak';

    Alert.alert(
      status === 'Disetujui'
        ? 'Setujui Peminjaman'
        : 'Tolak Peminjaman',
      `Apakah kamu yakin ingin ${action} pengajuan ${id}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: status === 'Disetujui' ? 'Setujui' : 'Tolak',
          style: status === 'Ditolak' ? 'destructive' : 'default',
          onPress: () => {
            setBookings((previous) =>
              previous.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      status,
                      rejectionReason:
                        status === 'Ditolak'
                          ? 'Pengajuan ditolak oleh Laboran.'
                          : undefined,
                    }
                  : item
              )
            );

            setShowDetail(false);
            setSelectedBooking(null);

            Alert.alert(
              'Berhasil',
              status === 'Disetujui'
                ? 'Pengajuan berhasil disetujui.'
                : 'Pengajuan berhasil ditolak.'
            );
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
        <BookingList
          bookings={filteredBookings}
          filter={activeFilter}
          onDetail={handleDetail}
          onApprove={(id) =>
            handleUpdateStatus(id, 'Disetujui')
          }
          onReject={(id) =>
            handleUpdateStatus(id, 'Ditolak')
          }
        />
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
        onApprove={(id) =>
          handleUpdateStatus(id, 'Disetujui')
        }
        onReject={(id) =>
          handleUpdateStatus(id, 'Ditolak')
        }
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
