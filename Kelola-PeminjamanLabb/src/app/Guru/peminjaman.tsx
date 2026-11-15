
import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import HeaderDashboard from '../../components/Molecules/HeaderDashboard';
import PageTitle from '../../components/Molecules/PageTitle';
import InfoNotice from '../../components/Molecules/InfoNotice';

import BookingForm from '../../components/Organisms/BookingForm';
import BottomNavigation from '../../components/Organisms/BottomNavigation';

import { BookingFormData } from '../../components/Organisms/BookingForm';

import { supabase } from '../../lib/supabase';

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

  // ==================== SUBMIT PEMINJAMAN ====================

  const handleSubmit = async (data: BookingFormData) => {
    try {
      if (!data.lab) {
        if (Platform.OS === 'web') {
          window.alert('Peringatan\n\nPilih laboratorium terlebih dahulu.');
        } else {
          Alert.alert(
            'Peringatan',
            'Pilih laboratorium terlebih dahulu.',
          );
        }
        return;
      }

      // Pastikan sesi pengguna tersedia.
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        const title = 'Sesi Login Berakhir';
        const description =
          'Silakan login kembali menggunakan akun guru.';

        if (Platform.OS === 'web') {
          window.alert(`${title}\n\n${description}`);
        } else {
          Alert.alert(title, description);
        }
        return;
      }

      // Kirim pengajuan ke fungsi database Supabase.
      const { data: bookingId, error } = await supabase.rpc(
        'ajukan_peminjaman',
        {
          p_id_lab: Number(data.lab.id),
          p_tanggal: data.date,
          p_jam_mulai: data.startTime,
          p_jam_selesai: data.endTime,
          p_kelas: data.className.trim(),
          p_mata_pelajaran: data.subject.trim(),
          p_jumlah_siswa: Number(data.studentCount),
          p_keperluan: data.purpose.trim(),
        },
      );

      if (error) {
        throw error;
      }

      // Pengajuan berhasil.
      console.log('Pengajuan berhasil disimpan:', bookingId);

      const successMessage =
        `Pengajuan peminjaman laboratorium berhasil dikirim.\n\n` +
        `Nomor Pengajuan: ${bookingId}\n` +
        `Status: Pending\n\n` +
        `Silakan menunggu persetujuan laboran.`;

      if (Platform.OS === 'web') {
        window.alert(`Pengajuan Berhasil!\n\n${successMessage}`);
        router.replace('/Guru/dashboard' as any);
      } else {
        Alert.alert(
          'Pengajuan Berhasil',
          successMessage,
          [
            {
              text: 'Mengerti',
              onPress: () => {
                router.replace('/Guru/dashboard' as any);
              },
            },
          ],
          { cancelable: false },
        );
      }
    } catch (error: any) {
      // Tangani error agar pengguna mendapatkan notifikasi yang sesuai.
      const message = error?.message ?? '';

      let title = 'Pengajuan Gagal';
      let description =
        'Pengajuan belum berhasil disimpan. Silakan coba kembali.';

      if (message.includes('Jadwal laboratorium sudah terisi')) {
        title = 'Jadwal Tidak Tersedia';
        description =
          'Jadwal laboratorium yang kamu pilih sudah digunakan. Silakan pilih tanggal atau jam lainnya.';
      } else if (message.includes('Kapasitas laboratorium')) {
        title = 'Kapasitas Terlampaui';
        description = message;
      } else if (message.includes('Jumlah siswa')) {
        title = 'Jumlah Siswa Tidak Valid';
        description = message;
      } else if (message.includes('Laboratorium tidak ditemukan')) {
        title = 'Laboratorium Tidak Ditemukan';
        description =
          'Laboratorium yang dipilih tidak ditemukan. Silakan pilih laboratorium lain.';
      } else if (
        message.includes('Sesi login') ||
        message.includes('guru aktif')
      ) {
        title = 'Akses Ditolak';
        description =
          'Sesi login tidak valid atau akun guru sudah tidak aktif. Silakan login kembali.';
      } else if (message.includes('Tanggal peminjaman tidak valid')) {
        title = 'Tanggal Tidak Valid';
        description = message;
      } else if (message.includes('Jam selesai harus setelah jam mulai')) {
        title = 'Waktu Tidak Valid';
        description = message;
      } else if (message.includes('Semua informasi peminjaman wajib diisi')) {
        title = 'Formulir Belum Lengkap';
        description = message;
      }

      if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${description}`);
      } else {
        Alert.alert(title, description);
      }

      // Tidak melempar error lagi karena sudah ditangani di sini.
    }
  };

  // ==================== RENDER ====================

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <HeaderDashboard
          onLogoutPress={async () => {
            await supabase.auth.signOut();
            router.replace('/' as any);
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

// ==================== STYLES ====================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
