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
  Alert,
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
  redText: '#EF4444',
};

const todayRequests = [
  {
    id: 'PEM-001',
    lab: 'Lab Pemrograman',
    date: '19 Oktober 2026',
    time: '10.00 - 12.30',
    status: 'Accepted',
    icon: 'monitor',
  },
  {
    id: 'PEM-002',
    lab: 'Lab Pemrograman',
    date: '19 Oktober 2026',
    time: '12.30 - 15.30',
    status: 'Pending',
    icon: 'monitor',
  },
];

const historyRequests = [
  {
    id: 'PEM-003',
    lab: 'Lab Jaringan',
    date: '17 Oktober 2026',
    time: '07.30 - 10.00',
    status: 'Accepted',
    icon: 'lan',
  },
  {
    id: 'PEM-004',
    lab: 'Lab Fiber Optik',
    date: '16 Oktober 2026',
    time: '12.30 - 15.30',
    status: 'Reject',
    icon: 'access-point',
  },
];

// Hover hanya untuk notifikasi dan navigasi bawah.
function HoverableTouchable({
  children,
  style,
  hoverStyle,
  onPress,
  accessibilityLabel,
  accessibilityRole = 'button',
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      {...props}
      style={[
        style,
        Platform.OS === 'web' && isHovered ? hoverStyle : null,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Pressable>
  );
}

// Card biasa tanpa efek hover.
function TouchableCard({ children, style, onPress, ...props }) {
  return (
    <Pressable
      {...props}
      style={style}
      onPress={onPress}
      accessibilityRole="button"
    >
      {children}
    </Pressable>
  );
}

function StatusBadge({ status }) {
  const badgeStyle =
    status === 'Accepted'
      ? styles.acceptedBadge
      : status === 'Reject'
        ? styles.rejectBadge
        : styles.pendingBadge;

  const textStyle =
    status === 'Accepted'
      ? styles.acceptedText
      : status === 'Reject'
        ? styles.rejectText
        : styles.pendingText;

  const label =
    status === 'Accepted'
      ? 'Disetujui'
      : status === 'Reject'
        ? 'Ditolak'
        : 'Pending';

  return (
    <View style={[styles.statusBadge, badgeStyle]}>
      <Text style={[styles.statusText, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

function RequestCard({ item, onPress }) {
  return (
    <TouchableCard
      style={styles.requestCard}
      onPress={onPress}
    >
      <View style={styles.labIconCircle}>
        <MaterialCommunityIcons
          name={item.icon}
          size={21}
          color={COLORS.navy}
        />
      </View>

      <View style={styles.requestDetails}>
        <View style={styles.requestTitleRow}>
          <Text style={styles.labName} numberOfLines={1}>
            {item.lab}
          </Text>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={COLORS.muted}
          />
          <Text style={styles.metaText}>{item.date}</Text>
        </View>

        <View style={styles.metaBottomRow}>
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={12}
              color={COLORS.muted}
            />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>

          <View style={styles.teacherMeta}>
            <Ionicons
              name="person-outline"
              size={12}
              color={COLORS.muted}
            />
            <Text style={styles.metaText}>Salwa Ayudia</Text>
          </View>
        </View>
      </View>
    </TouchableCard>
  );
}

// Judul section dengan ikon panah yang selalu terlihat.
function SectionHeading({ title, onPress }) {
  return (
    <Pressable
      style={styles.sectionHeadingRow}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={styles.sectionTitle} numberOfLines={1}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={17}
        color={COLORS.blue}
        style={styles.sectionChevron}
      />
    </Pressable>
  );
}

export default function DashboardScreen() {
  const router = useRouter();

  const routes = {
    Dashboard: '/Guru/dashboard',
    JadwalLab: '/Guru/jadwal-lab',
    DaftarLab: '/Guru/daftar-lab',
    BuatPeminjaman: '/Guru/peminjaman',
    Notifikasi: '/Guru/notifikasi',
    RiwayatPengajuan: '/Guru/riwayat',
    DetailPengajuan: '/Guru/detail-pengajuan',
  };

  const goTo = (screen, params = {}) => {
    const path = routes[screen];

    if (!path) {
      Alert.alert(
        'Halaman belum tersedia',
        'Rute halaman belum ditentukan.'
      );
      return;
    }

    if (screen === 'Dashboard') {
      router.replace(path);
      return;
    }

    router.push({
      pathname: path,
      params,
    });
  };

  const openRequest = (item) => {
    goTo('DetailPengajuan', {
      requestId: item.id,
      labName: item.lab,
      date: item.date,
      time: item.time,
      status: item.status,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navy}
      />

      <View style={styles.screen}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.greeting}>
                Halo, Salwa Ayudia
              </Text>
              <Text style={styles.schoolName}>
                Guru - SMK Islamic Center Cirebon
              </Text>
            </View>

            {/* HOVER NOTIFIKASI */}
            <HoverableTouchable
              style={styles.notificationButton}
              hoverStyle={styles.hoverNotification}
              onPress={() => goTo('Notifikasi')}
              accessibilityLabel="Buka notifikasi"
            >
              <Ionicons
                name="notifications-outline"
                size={28}
                color={COLORS.white}
              />
              <View style={styles.notificationDot} />
            </HoverableTouchable>
          </View>

          <View style={styles.content}>
            {/* RINGKASAN */}
            <View style={styles.sectionCard}>
              <Text style={styles.summarySectionTitle}>
                Ringkasan
              </Text>

              <View style={styles.summaryRow}>
                <TouchableCard
                  style={styles.summaryTile}
                  onPress={() =>
                    goTo('RiwayatPengajuan', {
                      filter: 'Pending',
                    })
                  }
                >
                  <Ionicons
                    name="calendar-clear-outline"
                    size={19}
                    color={COLORS.blue}
                  />
                  <Text style={styles.summaryNumber}>1</Text>
                  <Text style={styles.summaryLabel}>
                    Pengajuan{' \n'}Pending
                  </Text>
                </TouchableCard>

                <TouchableCard
                  style={styles.summaryTile}
                  onPress={() => goTo('DaftarLab')}
                >
                  <Ionicons
                    name="desktop-outline"
                    size={19}
                    color={COLORS.blue}
                  />
                  <Text style={styles.summaryNumber}>3</Text>
                  <Text style={styles.summaryLabel}>
                    Total{' \n'}Laboratorium
                  </Text>
                </TouchableCard>
              </View>
            </View>

            {/* PENGAJUAN HARI INI */}
            <View style={styles.sectionCard}>
              <SectionHeading
                title="Pengajuan Hari Ini"
                onPress={() => goTo('RiwayatPengajuan')}
              />

              {todayRequests.map((item) => (
                <RequestCard
                  key={item.id}
                  item={item}
                  onPress={() => openRequest(item)}
                />
              ))}
            </View>

            {/* RIWAYAT PENGAJUAN */}
            <View style={styles.sectionCard}>
              <SectionHeading
                title="Riwayat Pengajuan Peminjaman"
                onPress={() => goTo('RiwayatPengajuan')}
              />

              {historyRequests.map((item) => (
                <RequestCard
                  key={item.id}
                  item={item}
                  onPress={() => openRequest(item)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION */}
        <View style={styles.bottomBar}>
          <HoverableTouchable
            style={styles.navItem}
            hoverStyle={styles.hoverNavItem}
            onPress={() => goTo('Dashboard')}
          >
            <View
              style={[styles.navIconWrap, styles.activeNavIcon]}
            >
              <Ionicons
                name="home"
                size={26}
                color={COLORS.navy}
              />
            </View>
            <Text style={[styles.navLabel, styles.activeNavLabel]}>
              Dashboard
            </Text>
          </HoverableTouchable>

          <HoverableTouchable
            style={styles.navItem}
            hoverStyle={styles.hoverNavItem}
            onPress={() => goTo('JadwalLab')}
          >
            <View style={styles.navIconWrap}>
              <Ionicons
                name="calendar-outline"
                size={26}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.navLabel}>Jadwal Lab</Text>
          </HoverableTouchable>

          <HoverableTouchable
            style={styles.navItem}
            hoverStyle={styles.hoverNavItem}
            onPress={() => goTo('DaftarLab')}
          >
            <View style={styles.navIconWrap}>
              <Ionicons
                name="business-outline"
                size={26}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.navLabel}>Daftar Lab</Text>
          </HoverableTouchable>

          <HoverableTouchable
            style={styles.navItem}
            hoverStyle={styles.hoverNavItem}
            onPress={() => goTo('BuatPeminjaman')}
          >
            <View style={styles.navIconWrap}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={24}
                  color={COLORS.white}
                />
              </View>
            <Text style={styles.navLabel}>
              Peminjaman Lab
            </Text>
          </HoverableTouchable>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 10,
  },

  header: {
    minHeight: 85,
    backgroundColor: COLORS.navy,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  schoolName: {
    color: '#E0E7FF',
    fontSize: 10,
    fontWeight: '400',
  },

  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 20,
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
    borderWidth: 1,
    borderColor: COLORS.navy,
  },

  content: {
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 10,
  },

  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 8px rgba(15, 23, 42, 0.10)',
      },
    }),
  },

  summarySectionTitle: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 11,
  },

  sectionHeadingRow: {
    width: '100%',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderRadius: 8,
  },

  sectionTitle: {
    flex: 1,
    minWidth: 0,
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 0,
    marginRight: 8,
  },

  sectionChevron: {
    flexShrink: 0,
    marginLeft: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    marginBottom: 10,
  },

  summaryTile: {
    width: 88,
    minHeight: 88,
    borderRadius: 14,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.08)',
      },
    }),
  },

  summaryNumber: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.navy,
    marginTop: 1,
  },

  summaryLabel: {
    color: COLORS.blue,
    fontSize: 9,
    lineHeight: 12,
    textAlign: 'center',
  },

  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 9,
    minHeight: 79,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.08)',
      },
    }),
  },

  labIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  requestDetails: {
    flex: 1,
    minWidth: 0,
  },

  requestTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 5,
  },

  labName: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
  },

  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 48,
    alignItems: 'center',
  },

  statusText: {
    fontSize: 7,
    fontWeight: '600',
  },

  acceptedBadge: {
    backgroundColor: COLORS.greenBg,
  },

  acceptedText: {
    color: COLORS.greenText,
  },

  pendingBadge: {
    backgroundColor: COLORS.yellowBg,
  },

  pendingText: {
    color: COLORS.yellowText,
  },

  rejectBadge: {
    backgroundColor: COLORS.redBg,
  },

  rejectText: {
    color: COLORS.redText,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },

  metaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },

  teacherMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    color: COLORS.muted,
    fontSize: 8,
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
    borderRadius: 18,
    width: 47,
    height: 39,
    marginTop: -15,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.18)',
      },
    }),
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

  // Hover hanya untuk notifikasi dan navigasi bawah.
  hoverNotification: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  hoverNavItem: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});