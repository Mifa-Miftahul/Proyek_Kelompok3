import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import LabSelector from '../../components/Organisms/LabSelector';
import ScheduleList from '../../components/Organisms/ScheduleList';
import BottomNavigation from '../../components/Organisms/BottomNavigation';

// ==========================================
// WARNA APLIKASI
// ==========================================

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
  background: '#F5F7FB',
  white: '#FFFFFF',
  muted: '#64748B',
  gray: '#64748B',
  border: '#E2E8F0',
  greenBg: '#D1FAE5',
  greenText: '#059669',
  yellowBg: '#FEF3C7',
  yellowText: '#D97706',
  redBg: '#FEE2E2',
  redText: '#DC2626',
};


// ==========================================
// TIPE DATA TYPESCRIPT
// ==========================================

type LabId = 'LAB-001' | 'LAB-002' | 'LAB-003';

type LabIcon = 'monitor' | 'lan' | 'access-point';

type LabStatus = 'Berlangsung' | 'Terjadwal';

type Laboratory = {
  id: LabId;
  name: string;
  location: string;
  room: string;
  capacity: number;
  icon: LabIcon;
  description: string;
};

type LabSchedule = {
  id: string;
  day: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  className: string;
  status: LabStatus;
};

// ==========================================
// DATA LABORATORIUM
// ==========================================

const laboratories: Laboratory[] = [
  {
    id: 'LAB-001',
    name: 'Lab Pemrograman',
    location: 'Gedung Informatika',
    room: 'Ruang Lab 1',
    capacity: 30,
    icon: 'monitor',
    description:
      'Laboratorium untuk praktikum pemrograman dan pengembangan aplikasi.',
  },
  {
    id: 'LAB-002',
    name: 'Lab Jaringan',
    location: 'Gedung Informatika',
    room: 'Ruang Lab 2',
    capacity: 25,
    icon: 'lan',
    description: 'Laboratorium untuk praktikum jaringan komputer.',
  },
  {
    id: 'LAB-003',
    name: 'Lab Fiber Optik',
    location: 'Gedung Informatika',
    room: 'Ruang Lab 3',
    capacity: 20,
    icon: 'access-point',
    description: 'Laboratorium untuk praktikum jaringan fiber optik.',
  },
];

// ==========================================
// DATA JADWAL LABORATORIUM
// ==========================================

const labSchedules: Record<LabId, LabSchedule[]> = {
  'LAB-001': [
    {
      id: 'JAD-001',
      day: 'Senin',
      date: '19 Oktober 2026',
      time: '07.30 - 10.00',
      subject: 'Praktikum Pemrograman',
      teacher: 'Salwa Ayudia',
      className: 'X RPL 1',
      status: 'Berlangsung',
    },
    {
      id: 'JAD-002',
      day: 'Senin',
      date: '19 Oktober 2026',
      time: '10.00 - 12.30',
      subject: 'Pemrograman Web',
      teacher: 'Bapak Andi',
      className: 'X RPL 2',
      status: 'Terjadwal',
    },
    {
      id: 'JAD-003',
      day: 'Senin',
      date: '19 Oktober 2026',
      time: '12.30 - 15.30',
      subject: 'Praktikum Basis Data',
      teacher: 'Ibu Rina',
      className: 'XI RPL 1',
      status: 'Terjadwal',
    },
    {
      id: 'JAD-004',
      day: 'Selasa',
      date: '20 Oktober 2026',
      time: '07.30 - 10.00',
      subject: 'Pemrograman Dasar',
      teacher: 'Salwa Ayudia',
      className: 'X RPL 1',
      status: 'Terjadwal',
    },
  ],

  'LAB-002': [
    {
      id: 'JAD-005',
      day: 'Senin',
      date: '19 Oktober 2026',
      time: '07.30 - 10.00',
      subject: 'Jaringan Komputer',
      teacher: 'Bapak Budi',
      className: 'XI TKJ 1',
      status: 'Terjadwal',
    },
    {
      id: 'JAD-006',
      day: 'Rabu',
      date: '21 Oktober 2026',
      time: '10.00 - 12.30',
      subject: 'Administrasi Jaringan',
      teacher: 'Ibu Rina',
      className: 'XI TKJ 2',
      status: 'Terjadwal',
    },
    {
      id: 'JAD-007',
      day: 'Kamis',
      date: '22 Oktober 2026',
      time: '07.30 - 10.00',
      subject: 'Praktikum Router',
      teacher: 'Bapak Budi',
      className: 'XII TKJ 1',
      status: 'Terjadwal',
    },
  ],

  'LAB-003': [
    {
      id: 'JAD-008',
      day: 'Selasa',
      date: '20 Oktober 2026',
      time: '10.00 - 12.30',
      subject: 'Praktikum Fiber Optik',
      teacher: 'Bapak Andi',
      className: 'XII TKJ 1',
      status: 'Terjadwal',
    },
    {
      id: 'JAD-009',
      day: 'Jumat',
      date: '23 Oktober 2026',
      time: '07.30 - 10.00',
      subject: 'Instalasi Kabel Optik',
      teacher: 'Ibu Rina',
      className: 'XII TKJ 2',
      status: 'Terjadwal',
    },
  ],
};

// ==========================================
// KOMPONEN UTAMA
// ==========================================

export default function JadwalLabScreen() {
  const router = useRouter();

  const [selectedLab, setSelectedLab] =
    useState<Laboratory>(laboratories[0]);

  const [selectedDay, setSelectedDay] =
    useState<string>('Semua');

  const days = [
    'Semua',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
  ];

  const currentSchedules = labSchedules[selectedLab.id];

  const filteredSchedules =
    selectedDay === 'Semua'
      ? currentSchedules
      : currentSchedules.filter(
          (schedule) => schedule.day === selectedDay
        );

  const ongoingCount = filteredSchedules.filter(
    (schedule) => schedule.status === 'Berlangsung'
  ).length;

  const navigateTo = (path: string) => {
    router.push(path as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navy}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Kembali"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={COLORS.white}
          />
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            Jadwal Laboratorium
          </Text>

          <Text style={styles.headerSubtitle}>
            Sistem Peminjaman Laboratorium
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="calendar-outline"
            size={25}
            color={COLORS.white}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* RINGKASAN */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>
              Jadwal Praktikum
            </Text>

            <Text style={styles.welcomeDescription}>
              Pantau jadwal penggunaan laboratorium dengan mudah.
            </Text>
          </View>

          <View style={styles.welcomeIcon}>
            <Ionicons
              name="school-outline"
              size={32}
              color={COLORS.navy}
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconBlue}>
              <Ionicons
                name="business-outline"
                size={22}
                color={COLORS.navy}
              />
            </View>

            <Text style={styles.statNumber}>
              {laboratories.length}
            </Text>

            <Text style={styles.statLabel}>
              Laboratorium
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconGreen}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color={COLORS.greenText}
              />
            </View>

            <Text style={styles.statNumber}>
              {currentSchedules.length}
            </Text>

            <Text style={styles.statLabel}>
              Total Jadwal
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconYellow}>
              <Ionicons
                name="time-outline"
                size={22}
                color={COLORS.yellowText}
              />
            </View>

            <Text style={styles.statNumber}>
              {ongoingCount}
            </Text>

            <Text style={styles.statLabel}>
              Berlangsung
            </Text>
          </View>
        </View>

        {/* PILIH LABORATORIUM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pilih Laboratorium
          </Text>

          <Text style={styles.sectionDescription}>
            Pilih laboratorium untuk melihat jadwal praktikum.
          </Text>

<LabSelector
  laboratories={laboratories}
  selectedLabId={selectedLab.id}
  onSelectLab={(lab) => {
    setSelectedLab(lab);
  }}
/>
        </View>

        
        {/* DAFTAR JADWAL */}
        <View style={styles.section}>
          <View style={styles.scheduleSectionHeader}>
            <View style={styles.scheduleTitleContainer}>
              <Text style={styles.sectionTitle}>
                Jadwal Penggunaan
              </Text>

              <Text style={styles.sectionDescription}>
                {selectedLab.name} · {selectedLab.room}
              </Text>
            </View>

            <View style={styles.scheduleCountBadge}>
              <Text style={styles.scheduleCountText}>
                {filteredSchedules.length} jadwal
              </Text>
            </View>
          </View>

          {/* FILTER HARI */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayFilterContainer}
          >
            {days.map((day) => {
              const isActive = selectedDay === day;

              return (
                <Pressable
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.dayFilterButton,
                    isActive && styles.activeDayFilterButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayFilterText,
                      isActive && styles.activeDayFilterText,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* KARTU JADWAL */}
          <ScheduleList
            schedules={filteredSchedules}
            selectedDay={selectedDay}
          />
        </View>

        {/* INFORMASI */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={COLORS.navy}
          />

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Informasi Jadwal
            </Text>

            <Text style={styles.infoDescription}>
              Jadwal ditampilkan berdasarkan laboratorium dan
              hari yang dipilih. Hubungi laboran jika terdapat
              perubahan jadwal praktikum.
            </Text>
          </View>
        </View>
    </ScrollView>


{/* BOTTOM NAVIGATION */}
<BottomNavigation
  activeRoute="JadwalLab"
  onNavigate={(route) => {
    const routes: Record<string, string> = {
      Dashboard: '/Guru/dashboard',
      JadwalLab: '/Guru/jadwal-lab',
      DaftarLab: '/Guru/daftar-lab',
      BuatPeminjaman: '/Guru/peminjaman',
    };

    const path = routes[route];

    if (path) {
      router.push(path as never);
    }
  }}
/>
    </SafeAreaView>
  );
}

// ==========================================
// STYLESHEET
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight ?? 0
        : 0,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginRight: 12,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#DCE6FF',
    fontSize: 11,
    marginTop: 4,
  },

  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    marginLeft: 8,
  },

  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  welcomeTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  welcomeTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  welcomeDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
  },

  welcomeIcon: {
    width: 58,
    height: 58,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statIconBlue: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleBlue,
    marginBottom: 9,
  },

  statIconGreen: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.greenBg,
    marginBottom: 9,
  },

  statIconYellow: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.yellowBg,
    marginBottom: 9,
  },

  statNumber: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 4,
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: 'center',
  },

  section: {
    marginBottom: 27,
  },

  sectionTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 7,
  },

  sectionDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 15,
  },

  labCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  selectedLabCard: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },

  labIconContainer: {
    width: 49,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleBlue,
    borderRadius: 14,
    marginRight: 12,
  },

  selectedLabIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  labCardContent: {
    flex: 1,
    marginRight: 8,
  },

  labName: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },

  selectedLabText: {
    color: COLORS.white,
  },

  labDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 8,
  },

  selectedLabDescription: {
    color: '#DCE6FF',
  },

  labInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  labCapacity: {
    color: COLORS.muted,
    fontSize: 11,
  },

  scheduleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  scheduleTitleContainer: {
    flex: 1,
  },

  scheduleCountBadge: {
    backgroundColor: COLORS.paleBlue,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginLeft: 8,
  },

  scheduleCountText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
  },

  dayFilterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },

  dayFilterButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  activeDayFilterButton: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },

  dayFilterText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
  },

  activeDayFilterText: {
    color: COLORS.white,
  },

  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 15,
    marginBottom: 13,
  },

  scheduleTimeContainer: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 9,
  },

  scheduleTime: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 8,
  },

  scheduleDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginRight: 13,
  },

  scheduleContent: {
    flex: 1,
  },

  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 9,
  },

  scheduleSubject: {
    flex: 1,
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  ongoingBadge: {
    backgroundColor: COLORS.greenBg,
  },

  scheduledBadge: {
    backgroundColor: COLORS.paleBlue,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  ongoingText: {
    color: COLORS.greenText,
  },

  scheduledText: {
    color: COLORS.navy,
  },

  scheduleClass: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 11,
  },

  scheduleDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },

  scheduleDetailText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
  },

  ongoingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenBg,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginTop: 5,
    gap: 7,
  },

  ongoingDot: {
    width: 7,
    height: 7,
    backgroundColor: COLORS.greenText,
    borderRadius: 4,
  },

  ongoingIndicatorText: {
    color: COLORS.greenText,
    fontSize: 10,
    fontWeight: '600',
  },

  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 28,
  },

  emptyIconContainer: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleBlue,
    borderRadius: 22,
    marginBottom: 14,
  },

  emptyStateTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyStateDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.paleBlue,
    borderRadius: 15,
    padding: 15,
    gap: 11,
    marginBottom: 18,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  infoDescription: {
    color: '#475569',
    fontSize: 11,
    lineHeight: 18,
  },

  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    paddingTop: 11,
    paddingBottom: Platform.OS === 'ios' ? 20 : 11,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  navLabel: {
    color: COLORS.gray,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },

  activeNavLabel: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});