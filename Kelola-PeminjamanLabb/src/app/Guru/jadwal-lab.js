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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
  background: '#F5F7FB',
  white: '#FFFFFF',
  muted: '#64748B',
  greenBg: '#D1FAE5',
  greenText: '#059669',
  yellowBg: '#FEF3C7',
  yellowText: '#D97706',
  redBg: '#FEE2E2',
  redText: '#DC2626',
};

const laboratories = [
  {
    id: 'LAB-001',
    name: 'Lab Pemrograman',
    location: 'Gedung Informatika',
    room: 'Ruang Lab 1',
    capacity: 30,
    icon: 'monitor',
    description: 'Laboratorium untuk praktikum pemrograman dan pengembangan aplikasi.',
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

const labSchedules = {
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
      day: 'Senin',
      date: '19 Oktober 2026',
      time: '12.30 - 15.30',
      subject: 'Administrasi Jaringan',
      teacher: 'Ibu Sinta',
      className: 'XI TKJ 2',
      status: 'Terjadwal',
    },
    {
      id: 'JAD-007',
      day: 'Rabu',
      date: '21 Oktober 2026',
      time: '10.00 - 12.30',
      subject: 'Praktikum Routing',
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
      time: '07.30 - 10.00',
      subject: 'Praktikum Fiber Optik',
      teacher: 'Ibu Rina',
      className: 'XII TKJ 1',
      status: 'Terjadwal',
    },
    {
      id: 'JAD-009',
      day: 'Kamis',
      date: '22 Oktober 2026',
      time: '10.00 - 12.30',
      subject: 'Instalasi Kabel Optik',
      teacher: 'Bapak Budi',
      className: 'XII TKJ 2',
      status: 'Terjadwal',
    },
  ],
};

function HoverableButton({
  children,
  style,
  hoverStyle,
  onPress,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      {...props}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        style,
        Platform.OS === 'web' && isHovered ? hoverStyle : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

function StatusBadge({ status }) {
  const isOngoing = status === 'Berlangsung';

  return (
    <View
      style={[
        styles.statusBadge,
        isOngoing ? styles.ongoingBadge : styles.scheduledBadge,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          isOngoing ? styles.ongoingText : styles.scheduledText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

function LabCard({ lab, onPress }) {
  const schedules = labSchedules[lab.id] || [];

  return (
    <Pressable
      style={styles.labCard}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.labIconCircle}>
        <MaterialCommunityIcons
          name={lab.icon}
          size={27}
          color={COLORS.navy}
        />
      </View>

      <View style={styles.labDetails}>
        <Text style={styles.labName}>{lab.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>{lab.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="people-outline"
            size={14}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>
            Kapasitas {lab.capacity} siswa
          </Text>
        </View>

        <View style={styles.labFooter}>
          <View style={styles.scheduleCount}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={COLORS.blue}
            />
            <Text style={styles.scheduleCountText}>
              {schedules.length} jadwal
            </Text>
          </View>

          <View style={styles.viewSchedule}>
            <Text style={styles.viewScheduleText}>Lihat Jadwal</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={COLORS.blue}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function ScheduleCard({ item }) {
  return (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleTimeColumn}>
        <View style={styles.timeIconCircle}>
          <Ionicons
            name="time-outline"
            size={19}
            color={COLORS.navy}
          />
        </View>
        <View style={styles.timeLine} />
      </View>

      <View style={styles.scheduleDetails}>
        <View style={styles.scheduleTopRow}>
          <Text style={styles.scheduleDay}>{item.day}</Text>
          <StatusBadge status={item.status} />
        </View>

        <Text style={styles.scheduleSubject}>{item.subject}</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={13}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="time-outline"
            size={13}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="people-outline"
            size={13}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>{item.className}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="person-outline"
            size={13}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>{item.teacher}</Text>
        </View>
      </View>
    </View>
  );
}

export default function JadwalLabScreen() {
  const router = useRouter();
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Semua');

  const days = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const selectedSchedules = selectedLab
    ? labSchedules[selectedLab.id] || []
    : [];

  const filteredSchedules =
    selectedDay === 'Semua'
      ? selectedSchedules
      : selectedSchedules.filter(
          (schedule) => schedule.day === selectedDay
        );

  const goBack = () => {
    if (selectedLab) {
      setSelectedLab(null);
      setSelectedDay('Semua');
    } else {
      router.replace('/Guru/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navy}
      />

      <View style={styles.screen}>
        <View style={styles.header}>
          <HoverableButton
            style={styles.backButton}
            hoverStyle={styles.hoverBackButton}
            onPress={goBack}
            accessibilityLabel="Kembali"
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={COLORS.white}
            />
          </HoverableButton>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Jadwal Laboratorium</Text>
            <Text style={styles.headerSubtitle}>
              {selectedLab
                ? selectedLab.name
                : 'Pilih laboratorium untuk melihat jadwal'}
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={COLORS.white}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!selectedLab ? (
            <>
              <View style={styles.introSection}>
                <Text style={styles.pageTitle}>Pilih Laboratorium</Text>
                <Text style={styles.pageDescription}>
                  Pilih laboratorium terlebih dahulu untuk melihat jadwal
                  penggunaan dan praktikum.
                </Text>
              </View>

              <View style={styles.labList}>
                {laboratories.map((lab) => (
                  <LabCard
                    key={lab.id}
                    lab={lab}
                    onPress={() => {
                      setSelectedLab(lab);
                      setSelectedDay('Semua');
                    }}
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={styles.selectedLabCard}>
                <View style={styles.selectedLabIcon}>
                  <MaterialCommunityIcons
                    name={selectedLab.icon}
                    size={28}
                    color={COLORS.navy}
                  />
                </View>

                <View style={styles.selectedLabDetails}>
                  <Text style={styles.selectedLabName}>
                    {selectedLab.name}
                  </Text>
                  <Text style={styles.selectedLabLocation}>
                    {selectedLab.room} · {selectedLab.location}
                  </Text>
                  <Text style={styles.selectedLabDescription}>
                    {selectedLab.description}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.blue}
                  />
                  <Text style={styles.statNumber}>
                    {selectedSchedules.length}
                  </Text>
                  <Text style={styles.statLabel}>Total Jadwal</Text>
                </View>

                <View style={styles.statCard}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={COLORS.greenText}
                  />
                  <Text style={styles.statNumber}>
                    {selectedSchedules.filter(
                      (item) => item.status === 'Berlangsung'
                    ).length}
                  </Text>
                  <Text style={styles.statLabel}>Berlangsung</Text>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Filter Hari</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dayFilterRow}
                >
                  {days.map((day) => {
                    const isActive = selectedDay === day;

                    return (
                      <Pressable
                        key={day}
                        onPress={() => setSelectedDay(day)}
                        style={[
                          styles.dayChip,
                          isActive && styles.activeDayChip,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayChipText,
                            isActive && styles.activeDayChipText,
                          ]}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.scheduleSection}>
                <View style={styles.scheduleSectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>
                      Daftar Jadwal
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                      {selectedDay === 'Semua'
                        ? 'Semua hari'
                        : `Hari ${selectedDay}`}
                    </Text>
                  </View>

                  <View style={styles.resultBadge}>
                    <Text style={styles.resultBadgeText}>
                      {filteredSchedules.length} jadwal
                    </Text>
                  </View>
                </View>

                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((item) => (
                    <ScheduleCard key={item.id} item={item} />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIconCircle}>
                      <Ionicons
                        name="calendar-clear-outline"
                        size={30}
                        color={COLORS.muted}
                      />
                    </View>
                    <Text style={styles.emptyTitle}>
                      Belum Ada Jadwal
                    </Text>
                    <Text style={styles.emptyDescription}>
                      Tidak ada jadwal untuk hari {selectedDay} di
                      laboratorium ini.
                    </Text>
                  </View>
                )}
              </View>

              <Pressable
                style={styles.changeLabButton}
                onPress={goBack}
              >
                <Ionicons
                  name="swap-horizontal-outline"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={styles.changeLabButtonText}>
                  Pilih Laboratorium Lain
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>

        {!selectedLab && (
          <View style={styles.bottomBar}>
            <HoverableButton
              style={styles.navItem}
              hoverStyle={styles.hoverNavItem}
              onPress={() => router.replace('/Guru/dashboard')}
            >
              <View style={styles.navIconWrap}>
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={COLORS.white}
                />
              </View>
              <Text style={styles.navLabel}>Dashboard</Text>
            </HoverableButton>

            <HoverableButton
              style={styles.navItem}
              hoverStyle={styles.hoverNavItem}
              onPress={() => router.replace('/Guru/jadwal-lab')}
            >
              <View style={[styles.navIconWrap, styles.activeNavIcon]}>
                <Ionicons
                  name="calendar"
                  size={24}
                  color={COLORS.navy}
                />
              </View>
              <Text style={[styles.navLabel, styles.activeNavLabel]}>
                Jadwal Lab
              </Text>
            </HoverableButton>

            <HoverableButton
              style={styles.navItem}
              hoverStyle={styles.hoverNavItem}
              onPress={() => router.replace('/Guru/daftar-lab')}
            >
              <View style={styles.navIconWrap}>
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={COLORS.white}
                />
              </View>
              <Text style={styles.navLabel}>Daftar Lab</Text>
            </HoverableButton>

            <HoverableButton
              style={styles.navItem}
              hoverStyle={styles.hoverNavItem}
              onPress={() => router.replace('/Guru/peminjaman')}
            >
              <View style={styles.navIconWrap}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={24}
                  color={COLORS.white}
                />
              </View>
              <Text style={styles.navLabel}>Peminjaman Lab</Text>
            </HoverableButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight || 0
        : 0,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 24,
  },
  header: {
    minHeight: 82,
    backgroundColor: COLORS.navy,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  hoverBackButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#DCE7FF',
    fontSize: 10,
    marginTop: 4,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introSection: {
    marginBottom: 16,
  },
  pageTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  pageDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  labList: {
    gap: 12,
  },
  labCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EEF8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 8px rgba(15, 23, 42, 0.08)',
      },
    }),
  },
  labIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  labDetails: {
    flex: 1,
    minWidth: 0,
  },
  labName: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoText: {
    color: COLORS.muted,
    fontSize: 11,
    flexShrink: 1,
  },
  labFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 7,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F7',
  },
  scheduleCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scheduleCountText: {
    color: COLORS.blue,
    fontSize: 10,
    fontWeight: '600',
  },
  viewSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewScheduleText: {
    color: COLORS.blue,
    fontSize: 11,
    fontWeight: '600',
  },
  selectedLabCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EEF8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 8px rgba(15, 23, 42, 0.08)',
      },
    }),
  },
  selectedLabIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedLabDetails: {
    flex: 1,
  },
  selectedLabName: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },
  selectedLabLocation: {
    color: COLORS.muted,
    fontSize: 10,
    marginBottom: 7,
  },
  selectedLabDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EEF8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.07)',
      },
    }),
  },
  statNumber: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  dayFilterRow: {
    gap: 8,
    paddingVertical: 2,
    paddingRight: 4,
  },
  dayChip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#DCE4F0',
  },
  activeDayChip: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  dayChipText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '500',
  },
  activeDayChipText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  scheduleSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EEF8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 8px rgba(15, 23, 42, 0.08)',
      },
    }),
  },
  scheduleSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: -5,
    marginBottom: 8,
  },
  resultBadge: {
    backgroundColor: COLORS.paleBlue,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  resultBadgeText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '600',
  },
  scheduleCard: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F7',
  },
  scheduleTimeColumn: {
    alignItems: 'center',
    marginRight: 12,
    width: 26,
  },
  timeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: '#E0E9F8',
    marginTop: 4,
  },
  scheduleDetails: {
    flex: 1,
    paddingBottom: 10,
  },
  scheduleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  scheduleDay: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  scheduleSubject: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  ongoingBadge: {
    backgroundColor: COLORS.greenBg,
  },
  ongoingText: {
    color: COLORS.greenText,
  },
  scheduledBadge: {
    backgroundColor: COLORS.paleBlue,
  },
  scheduledText: {
    color: COLORS.navy,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  emptyDescription: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
  },
  changeLabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    paddingVertical: 13,
    marginBottom: 12,
  },
  changeLabButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    minHeight: 64,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    gap: 3,
    borderRadius: 12,
  },
  navIconWrap: {
    width: 42,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  activeNavIcon: {
    backgroundColor: COLORS.white,
    width: 47,
    height: 39,
    marginTop: -15,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
  },
  navLabel: {
    color: '#E0E7FF',
    fontSize: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeNavLabel: {
    color: COLORS.white,
    fontWeight: '700',
  },
  hoverBackButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  hoverNavItem: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});