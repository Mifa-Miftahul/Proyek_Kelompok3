import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';

import HeaderDashboard from '../../components/Molecules/HeaderDashboard';
import PageTitle from '../../components/Molecules/PageTitle';
import InfoNotice from '../../components/Molecules/InfoNotice';

import BookingForm from '../../components/Organisms/BookingForm';
import BottomNavigation from '../../components/Organisms/BottomNavigation';

import { BookingFormData } from '../../components/Organisms/BookingForm';

const COLORS = {
  navy: '#223F91',
  background: '#F8FAFC',
};

export default function Peminjaman() {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    const routes: Record<string, string> = {
      Dashboard: '/Guru/dashboard',
      JadwalLab: '/Guru/jadwal-lab',
      DaftarLab: '/Guru/daftar-lab',
      BuatPeminjaman: '/Guru/peminjaman',
    };

    const destination = routes[route];

    if (destination) {
      router.push(destination as any);
    }
  };

  
const handleSubmit = (data: BookingFormData) => {
  const booking = {
    id: `PJM-${Date.now()}`,
    laboratory: data.lab?.name,
    laboratoryId: data.lab?.id,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    className: data.className,
    subject: data.subject,
    studentCount: Number(data.studentCount),
    purpose: data.purpose,
    status: 'Pending',
  };

  console.log('Data Pengajuan:', booking);

  if (Platform.OS === 'web') {
    window.alert(
      'Pengajuan Berhasil!\nPengajuan peminjaman laboratorium berhasil dibuat dan menunggu persetujuan laboran.'
    );
    router.replace('/Guru/dashboard' as any);
  } else {
    Alert.alert(
      'Pengajuan Berhasil',
      'Pengajuan peminjaman laboratorium berhasil dibuat dan menunggu persetujuan laboran.',
      [
        {
          text: 'Mengerti',
          onPress: () => router.replace('/Guru/dashboard' as any),
        },
      ],
    );
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <HeaderDashboard
          onNotificationPress={() => {
            Alert.alert('Notifikasi', 'Belum ada notifikasi baru.');
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <PageTitle
            title="Buat Peminjaman"
            description="Ajukan penggunaan laboratorium untuk kegiatan praktikum."
          />

          <InfoNotice />

          <BookingForm onSubmit={handleSubmit} />
        </ScrollView>

        <BottomNavigation
          activeRoute="BuatPeminjaman"
          onNavigate={handleNavigate}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 25,
  },
});
