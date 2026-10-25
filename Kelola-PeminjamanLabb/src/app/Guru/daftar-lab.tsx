
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

import BottomNavigation from '../../components/Organisms/BottomNavigation';
import InfoRowDaftarLab from '../../components/Molecules/InfoRowDaftarLab';
import HeaderDaftarLab from '../../components/Molecules/HeaderDaftarLab';
import InfoLab from '../../components/Organisms/InfoLab';

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
  background: '#F5F7FB',
  white: '#FFFFFF',
  muted: '#64748B',
  text: '#1E293B',
  border: '#E2E8F0',
  green: '#059669',
  paleGreen: '#D1FAE5',
  red: '#DC2626',
  paleRed: '#FEE2E2',
};

type LabStatus = 'Available' | 'Occupied';

type Device = {
  nama: string;
  jumlah: number;
};

type Lab = {
  id: string;
  name: string;
  location: string;
  room: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  description: string;
  laboran: string;
  perangkat: Device[];
  status: LabStatus;
};

type StatusBadgeProps = {
  status: LabStatus;
};

type LabCardProps = {
  lab: Lab;
  onPress: () => void;
};

type NavigationRoute =
  | 'Dashboard'
  | 'JadwalLab'
  | 'DaftarLab'
  | 'BuatPeminjaman';

const LABS: Lab[] = [
  {
    id: 'LAB-001',
    name: 'Lab Pemrograman',
    location: 'Gedung Informatika',
    room: 'Ruang Lab 1',
    icon: 'monitor',
    description:
      'Laboratorium untuk praktikum pemrograman dan pengembangan aplikasi.',
    laboran: 'Andi Setiawan, S.Kom.',
    perangkat: [
      { nama: 'Komputer', jumlah: 30 },
      { nama: 'Proyektor', jumlah: 1 },
      { nama: 'Switch', jumlah: 2 },
    ],
    status: 'Available',
  },
  {
    id: 'LAB-002',
    name: 'Lab Jaringan',
    location: 'Gedung Teknik ',
    room: 'Ruang Lab 2',
    icon: 'lan',
    description: 'Laboratorium untuk praktikum jaringan komputer.',
    laboran: 'Budi Santoso, S.Kom.',
    perangkat: [
      { nama: 'Komputer', jumlah: 25 },
      { nama: 'Router', jumlah: 5 },
      { nama: 'Switch', jumlah: 8 },
      { nama: 'Access Point', jumlah: 3 },
    ],
    status: 'Occupied',
  },
  {
    id: 'LAB-003',
    name: 'Lab Fiber Optik',
    location: 'Gedung Informatika',
    room: 'Ruang Lab 3',
    icon: 'access-point',
    description: 'Laboratorium untuk praktikum jaringan fiber optik.',
    laboran: 'Siti Rahmawati, S.Kom.',
    perangkat: [
      { nama: 'Komputer', jumlah: 20 },
      { nama: 'Perangkat Fiber Optik', jumlah: 10 },
      { nama: 'Proyektor', jumlah: 1 },
    ],
    status: 'Available',
  },
];

function LabCard({ lab, onPress }: LabCardProps) {
  const totalDevices = lab.perangkat.reduce(
    (total, item) => total + item.jumlah,
    0,
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.labCard,
        Platform.OS !== 'web' && pressed && styles.pressedCard,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail ${lab.name}`}
    >
      <View style={styles.labIconCircle}>
        <MaterialCommunityIcons
          name={lab.icon}
          size={27}
          color={COLORS.navy}
        />
      </View>

      <View style={styles.labDetails}>
        <InfoLab
          name={lab.name}
          room={lab.room}
          totalDevices={totalDevices}
          status={lab.status}
          deviceTypes={lab.perangkat.length}
        />
      </View>
    </Pressable>
  );
}

export default function DaftarLabScreen() {
  const router = useRouter();
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  const isAvailable = selectedLab?.status === 'Available';

  const totalDevices = selectedLab
    ? selectedLab.perangkat.reduce(
        (total, item) => total + item.jumlah,
        0,
      )
    : 0;

  const handleNavigate = (route: NavigationRoute) => {
    const routes: Record<NavigationRoute, string> = {
      Dashboard: '/Guru/dashboard',
      JadwalLab: '/Guru/jadwal-lab',
      DaftarLab: '/Guru/daftar-lab',
      BuatPeminjaman: '/Guru/peminjaman',
    };

    if (route === 'DaftarLab') {
      setSelectedLab(null);
      return;
    }

    router.replace(routes[route] as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navy}
      />

      <View style={styles.screen}>
        <HeaderDaftarLab
          title="Daftar Laboratorium"
          description={
            selectedLab
              ? selectedLab.name
              : 'Informasi dan fasilitas laboratorium'
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!selectedLab ? (
            <View style={styles.labList}>
              {LABS.map((lab) => (
                <LabCard
                  key={lab.id}
                  lab={lab}
                  onPress={() => setSelectedLab(lab)}
                />
              ))}
            </View>
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

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={COLORS.muted}
                    />
                    <Text style={styles.infoText}>
                      {selectedLab.room}
                    </Text>
                  </View>

                  <Text style={styles.selectedLabDescription}>
                    {selectedLab.description}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusPanel,
                  {
                    backgroundColor: isAvailable
                      ? '#F0FDF4'
                      : '#FFF7F7',
                    borderColor: isAvailable
                      ? '#BBF7D0'
                      : '#FECACA',
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusLargeIcon,
                    {
                      backgroundColor: isAvailable
                        ? COLORS.paleGreen
                        : COLORS.paleRed,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      isAvailable
                        ? 'checkmark-circle'
                        : 'time-outline'
                    }
                    size={25}
                    color={isAvailable ? COLORS.green : COLORS.red}
                  />
                </View>

                <View style={styles.statusPanelText}>
                  <Text style={styles.statusPanelLabel}>
                    Status Laboratorium
                  </Text>

                  <Text
                    style={[
                      styles.statusPanelValue,
                      {
                        color: isAvailable ? COLORS.green : COLORS.red,
                      },
                    ]}
                  >
                    {selectedLab.status}
                  </Text>

                  <Text style={styles.statusPanelDescription}>
                    {isAvailable
                      ? 'Laboratorium sedang tidak digunakan.'
                      : 'Laboratorium sedang digunakan untuk kegiatan.'}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Ionicons
                    name="hardware-chip-outline"
                    size={21}
                    color={COLORS.blue}
                  />

                  <Text style={styles.statNumber}>
                    {totalDevices}
                  </Text>

                  <Text style={styles.statLabel}>
                    Total Perangkat
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Ionicons
                    name="layers-outline"
                    size={21}
                    color={COLORS.green}
                  />

                  <Text style={styles.statNumber}>
                    {selectedLab.perangkat.length}
                  </Text>

                  <Text style={styles.statLabel}>
                    Jenis Perangkat
                  </Text>
                </View>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.sectionTitle}>
                  Informasi Laboratorium
                </Text>

                <View style={styles.sectionDivider} />

                <InfoRowDaftarLab
                  icon="person-outline"
                  label="Laboran Penanggung Jawab"
                  value={selectedLab.laboran}
                />

                <InfoRowDaftarLab
                  icon="location-outline"
                  label="Ruang Laboratorium"
                  value={selectedLab.room}
                />

                <InfoRowDaftarLab
                  icon="checkmark-circle-outline"
                  label="Status Laboratorium"
                  value={selectedLab.status}
                />
              </View>

              <View style={styles.detailCard}>
                <View style={styles.deviceTitleRow}>
                  <View style={styles.deviceTitleText}>
                    <Text style={styles.sectionTitle}>
                      Daftar Perangkat
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                      Perangkat yang tersedia di laboratorium
                    </Text>
                  </View>

                  <View style={styles.deviceCountBadge}>
                    <Text style={styles.deviceCountText}>
                      {selectedLab.perangkat.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.sectionDivider} />

                {selectedLab.perangkat.map((item, index) => (
                  <View key={`${item.nama}-${index}`}>
                    <View style={styles.deviceRow}>
                      <View style={styles.deviceIcon}>
                        <MaterialCommunityIcons
                          name={
                            item.nama === 'Komputer'
                              ? 'desktop-classic'
                              : item.nama === 'Proyektor'
                                ? 'projector'
                                : item.nama === 'Router'
                                  ? 'router-wireless'
                                  : item.nama === 'Switch'
                                    ? 'lan'
                                    : item.nama === 'Access Point'
                                      ? 'access-point'
                                      : 'devices'
                          }
                          size={21}
                          color={COLORS.navy}
                        />
                      </View>

                      <View style={styles.deviceNameWrap}>
                        <Text style={styles.deviceName}>
                          {item.nama}
                        </Text>
                      </View>

                      <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>
                          {item.jumlah} unit
                        </Text>
                      </View>
                    </View>

                    {index < selectedLab.perangkat.length - 1 && (
                      <View style={styles.deviceDivider} />
                    )}
                  </View>
                ))}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.changeLabButton,
                  Platform.OS !== 'web' &&
                    pressed &&
                    styles.pressedButton,
                ]}
                onPress={() => setSelectedLab(null)}
                accessibilityRole="button"
                accessibilityLabel="Pilih laboratorium lain"
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

        <BottomNavigation
          activeRoute="DaftarLab"
          onNavigate={(route) =>
            handleNavigate(route as NavigationRoute)
          }
        />
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

  pressedCard: {
    opacity: 0.9,
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

  labTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 4,
  },

  labName: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
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

  viewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  viewDetailText: {
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
    minWidth: 0,
  },

  selectedLabName: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 7,
  },

  selectedLabDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  statusPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
  },

  statusLargeIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusPanelText: {
    flex: 1,
  },

  statusPanelLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 4,
  },

  statusPanelValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  statusPanelDescription: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
    lineHeight: 15,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
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

  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
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

  sectionTitle: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
    lineHeight: 15,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: '#EDF1F7',
    marginVertical: 15,
  },

  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginBottom: 16,
  },

  detailInfoIcon: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.paleBlue,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailInfoText: {
    flex: 1,
    paddingTop: 2,
  },

  detailInfoLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 4,
  },

  detailInfoValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },

  deviceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  deviceTitleText: {
    flex: 1,
  },

  deviceCountBadge: {
    width: 34,
    height: 34,
    backgroundColor: COLORS.paleBlue,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deviceCountText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
  },

  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
  },

  deviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deviceNameWrap: {
    flex: 1,
  },

  deviceName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },

  quantityBadge: {
    backgroundColor: COLORS.paleBlue,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  quantityText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '700',
  },

  deviceDivider: {
    height: 1,
    backgroundColor: '#EDF1F7',
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
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  pressedButton: {
    opacity: 0.85,
  },
});
