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
  text: '#1E293B',
  border: '#E2E8F0',
  green: '#059669',
  paleGreen: '#D1FAE5',
  red: '#DC2626',
  paleRed: '#FEE2E2',
};

const LABS = [
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
    status: 'Tersedia',
  },
  {
    id: 'LAB-002',
    name: 'Lab Jaringan',
    location: 'Gedung Informatika',
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
    status: 'Sedang Dipakai',
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
    status: 'Tersedia',
  },
];

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
  const isAvailable = status === 'Tersedia';

  return (
    <View
      style={[
        styles.statusBadge,
        isAvailable ? styles.availableBadge : styles.busyBadge,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: isAvailable ? COLORS.green : COLORS.red,
          },
        ]}
      />
      <Text
        style={[
          styles.statusText,
          { color: isAvailable ? COLORS.green : COLORS.red },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

function LabCard({ lab, onPress }) {
  const totalDevices = lab.perangkat.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.labCard,
        Platform.OS !== 'web' && pressed && styles.pressedCard,
      ]}
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
        <View style={styles.labTitleRow}>
          <Text style={styles.labName}>{lab.name}</Text>
          <StatusBadge status={lab.status} />
        </View>

        <Text style={styles.labId}>{lab.id}</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>
            {lab.room} · {lab.location}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="hardware-chip-outline"
            size={14}
            color={COLORS.muted}
          />
          <Text style={styles.infoText}>
            {totalDevices} unit perangkat
          </Text>
        </View>

        <View style={styles.labFooter}>
          <View style={styles.scheduleCount}>
            <Ionicons
              name="business-outline"
              size={14}
              color={COLORS.blue}
            />
            <Text style={styles.scheduleCountText}>
              {lab.perangkat.length} jenis perangkat
            </Text>
          </View>

          <View style={styles.viewDetail}>
            <Text style={styles.viewDetailText}>Lihat Detail</Text>
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

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.detailInfoRow}>
      <View style={styles.detailInfoIcon}>
        <Ionicons name={icon} size={19} color={COLORS.navy} />
      </View>

      <View style={styles.detailInfoText}>
        <Text style={styles.detailInfoLabel}>{label}</Text>
        <Text style={styles.detailInfoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function DaftarLabScreen() {
  const router = useRouter();
  const [selectedLab, setSelectedLab] = useState(null);

  const isAvailable = selectedLab?.status === 'Tersedia';

  const totalDevices = selectedLab
    ? selectedLab.perangkat.reduce(
        (total, item) => total + item.jumlah,
        0
      )
    : 0;

  const goBack = () => {
    if (selectedLab) {
      setSelectedLab(null);
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
            <Text style={styles.headerTitle}>Daftar Laboratorium</Text>
            <Text style={styles.headerSubtitle}>
              {selectedLab
                ? selectedLab.name
                : 'Informasi dan fasilitas laboratorium'}
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="business-outline"
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
                <Text style={styles.pageTitle}>Daftar Lab</Text>
                <Text style={styles.pageDescription}>
                  Pilih laboratorium untuk melihat informasi,
                  laboran penanggung jawab, dan perangkat yang tersedia.
                </Text>
              </View>

              <View style={styles.labList}>
                {LABS.map((lab) => (
                  <LabCard
                    key={lab.id}
                    lab={lab}
                    onPress={() => setSelectedLab(lab)}
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

                  <Text style={styles.selectedLabId}>
                    {selectedLab.id}
                  </Text>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={COLORS.muted}
                    />
                    <Text style={styles.infoText}>
                      {selectedLab.room} · {selectedLab.location}
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
                  <Text style={styles.statNumber}>{totalDevices}</Text>
                  <Text style={styles.statLabel}>Total Perangkat</Text>
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
                  <Text style={styles.statLabel}>Jenis Perangkat</Text>
                </View>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.sectionTitle}>
                  Informasi Laboratorium
                </Text>
                <View style={styles.sectionDivider} />

                <InfoRow
                  icon="person-outline"
                  label="Laboran Penanggung Jawab"
                  value={selectedLab.laboran}
                />

                <InfoRow
                  icon="location-outline"
                  label="Lokasi Laboratorium"
                  value={`${selectedLab.room}, ${selectedLab.location}`}
                />

                <InfoRow
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
                  Platform.OS !== 'web' && pressed && styles.pressedButton,
                ]}
                onPress={() => setSelectedLab(null)}
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
            <View style={styles.navIconWrap}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.navLabel}>Jadwal Lab</Text>
          </HoverableButton>

          <HoverableButton
            style={styles.navItem}
            hoverStyle={styles.hoverNavItem}
            onPress={() => router.replace('/Guru/daftar-lab')}
          >
            <View style={[styles.navIconWrap, styles.activeNavIcon]}>
              <Ionicons
                name="business"
                size={24}
                color={COLORS.navy}
              />
            </View>
            <Text style={[styles.navLabel, styles.activeNavLabel]}>
              Daftar Lab
            </Text>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 24,
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

  labId: {
    color: COLORS.muted,
    fontSize: 10,
    marginBottom: 7,
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

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  availableBadge: {
    backgroundColor: COLORS.paleGreen,
  },

  busyBadge: {
    backgroundColor: COLORS.paleRed,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '600',
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

  backToList: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EEF8',
    marginBottom: 14,
  },

  backToListText: {
    color: COLORS.navy,
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
    marginBottom: 4,
  },

  selectedLabId: {
    color: COLORS.muted,
    fontSize: 10,
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

  pressedButton: {
    opacity: 0.85,
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

  hoverNavItem: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});