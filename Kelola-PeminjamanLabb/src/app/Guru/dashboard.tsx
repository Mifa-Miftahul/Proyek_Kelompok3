  import React, { useState } from 'react';
  import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Pressable,
    StatusBar,
    Platform,
    Alert,
    FlatList,
    ListRenderItemInfo,
    useWindowDimensions,
  } from 'react-native';
  import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
  import { useRouter } from 'expo-router';

  import SummaryCard from '../../components/Molecules/SummaryCard';
  import BottomNavigation from '../../components/Organisms/BottomNavigation';

  // ==================== TYPES ====================

  type RequestStatus = 'Accepted' | 'Pending' | 'Reject';


  type RequestItem = {
    id: string;
    lab: string;
    date: string;
    time: string;
    status: RequestStatus;
    icon: React.ComponentProps<
      typeof MaterialCommunityIcons
    >['name'];
  };

  type SectionItem = {
    id: 'today' | 'history';
    title: string;
    items: RequestItem[];
  };

  type HoverableTouchableProps = {
    children: React.ReactNode;
    style?: any;
    hoverStyle?: any;
    onPress: () => void;
    accessibilityLabel?: string;
  };

  type RequestCardProps = {
    item: RequestItem;
    onPress: (item: RequestItem) => void;
  };

  // ==================== COLORS ====================

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

  // ==================== DUMMY DATA ====================

  const todayRequests: RequestItem[] = [
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

  const historyRequests: RequestItem[] = [
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

  const sections: SectionItem[] = [
    {
      id: 'today',
      title: 'Pengajuan Hari Ini',
      items: todayRequests,
    },
    {
      id: 'history',
      title: 'Riwayat Pengajuan Peminjaman',
      items: historyRequests,
    },
  ];

  // ==================== REUSABLE COMPONENTS ====================

  // Tombol dengan efek hover untuk web.
  function HoverableTouchable({
    children,
    style,
    hoverStyle,
    onPress,
    accessibilityLabel,
  }: HoverableTouchableProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Pressable
        style={[
          style,
          Platform.OS === 'web' && isHovered
            ? hoverStyle
            : null,
        ]}
        onPress={onPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    );
  }

  // Kartu yang dapat ditekan.
  function TouchableCard({
    children,
    style,
    onPress,
  }: {
    children: React.ReactNode;
    style?: any;
    onPress: () => void;
  }) {
    return (
      <Pressable
        style={style}
        onPress={onPress}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  // Badge status pengajuan.
  function StatusBadge({
    status,
  }: {
    status: RequestStatus;
  }) {
    const config =
      status === 'Accepted'
        ? {
            badge: styles.acceptedBadge,
            text: styles.acceptedText,
            label: 'Accepted',
          }
        : status === 'Reject'
          ? {
              badge: styles.rejectBadge,
              text: styles.rejectText,
              label: 'Reject',
            }
          : {
              badge: styles.pendingBadge,
              text: styles.pendingText,
              label: 'Pending',
            };

    return (
      <View style={[styles.statusBadge, config.badge]}>
        <Text style={[styles.statusText, config.text]}>
          {config.label}
        </Text>
      </View>
    );
  }

  // Kartu setiap pengajuan.
  function RequestCard({
    item,
    onPress,
  }: RequestCardProps) {
    return (
      <TouchableCard
        style={styles.requestCard}
        onPress={() => onPress(item)}
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
            <Text
              style={styles.labName}
              numberOfLines={1}
            >
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
            <Text style={styles.metaText}>
              {item.date}
            </Text>
          </View>

          <View style={styles.metaBottomRow}>
            <View style={styles.metaRow}>
              <Ionicons
                name="time-outline"
                size={12}
                color={COLORS.muted}
              />
              <Text style={styles.metaText}>
                {item.time}
              </Text>
            </View>

            <View style={styles.teacherMeta}>
              <Ionicons
                name="person"
                size={12}
                color={COLORS.muted}
              />
              <Text style={styles.metaText}>
                Salwa Ayudia
              </Text>
            </View>
          </View>
        </View>
      </TouchableCard>
    );
  }

  // Judul bagian dengan tombol panah.
  function SectionHeading({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) {
    return (
      <Pressable
        style={styles.sectionHeadingRow}
        onPress={onPress}
        accessibilityRole="button"
      >
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={17}
          color={COLORS.blue}
        />
      </Pressable>
    );
  }

  // Kartu ringkasan.


  // ==================== DASHBOARD SCREEN ====================

  export default function DashboardScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();

    const isWideScreen = width >= 700;

    // Daftar rute halaman.
    const routes: Record<string, string> = {
      Dashboard: '/Guru/dashboard',
      JadwalLab: '/Guru/jadwal-lab',
      DaftarLab: '/Guru/daftar-lab',
      BuatPeminjaman: '/Guru/peminjaman',
      Notifikasi: '/Guru/notifikasi',
      RiwayatPengajuan: '/Guru/riwayat',
      DetailPengajuan: '/Guru/detail-pengajuan',
    };

    // Navigasi ke halaman tujuan.
    const goTo = (
      screen: string,
      params: Record<string, string> = {},
    ) => {
      const path = routes[screen];

      if (!path) {
        Alert.alert(
          'Halaman belum tersedia',
          'Rute halaman belum ditentukan.',
        );
        return;
      }

      if (screen === 'Dashboard') {
        router.replace(path as never);
        return;
      }

      router.push({
        pathname: path as never,
        params,
      });
    };

    // Membuka detail pengajuan.
    const openRequest = (item: RequestItem) => {
      goTo('DetailPengajuan', {
        requestId: item.id,
        labName: item.lab,
        date: item.date,
        time: item.time,
        status: item.status,
      });
    };

    // Render setiap bagian daftar.
    const renderSection = ({
      item,
    }: ListRenderItemInfo<SectionItem>) => (
      <View style={styles.sectionCard}>
        <SectionHeading
          title={item.title}
          onPress={() =>
            goTo(
              'RiwayatPengajuan',
              item.id === 'today'
                ? { filter: 'Today' }
                : {},
            )
          }
        />

        {item.items.map((request) => (
          <RequestCard
            key={request.id}
            item={request}
            onPress={openRequest}
          />
        ))}
      </View>
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.navy}
        />

        <View style={styles.screen}>
          <View
            style={[
              styles.page,
              isWideScreen && styles.pageWide,
            ]}
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

            {/* KONTEN YANG BISA DI-SCROLL */}
            <FlatList<SectionItem>
              style={styles.list}
              contentContainerStyle={styles.listContent}
              data={sections}
              keyExtractor={(item) => item.id}
              renderItem={renderSection}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.summaryPanel}>
                  <Text style={styles.summarySectionTitle}>
                    Ringkasan
                  </Text>

                  <View style={styles.summaryContainer}>
                    <SummaryCard
                      icon="time-outline"
                      value={1}
                      label={'Pengajuan\nPending'}
                    />

                    <SummaryCard
                      icon="business-outline"
                      value={3}
                      label={'Total\nLaboratorium'}
                    />
                  </View>
                </View>
              }
              ListFooterComponent={
                <View style={styles.listBottomSpace} />
              }
            />

            {/* BOTTOM NAVIGATION */}
            <BottomNavigation
              activeRoute="Dashboard"
              onNavigate={(route) => goTo(route)}
            />
          </View>
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

    screen: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      backgroundColor: COLORS.background,
    },

    page: {
      flex: 1,
      width: '100%',
      maxWidth: 560,
      backgroundColor: COLORS.background,
    },

    pageWide: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#E2E8F0',
    },

    // HEADER
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

    // LIST
    list: {
      flex: 1,
    },

    listContent: {
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 4,
      gap: 10,
    },

    listBottomSpace: {
      height: 8,
    },

    // SUMMARY PANEL
    summaryPanel: {
      backgroundColor: COLORS.white,
      borderRadius: 17,
      paddingHorizontal: 13,
      paddingTop: 12,
      paddingBottom: 12,
      shadowColor: '#0F172A',
      shadowOffset: {
        width: 0,
        height: 3,
      },
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

    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 25,
      flexWrap: 'wrap',
    },

    // SECTION CARDS
    sectionCard: {
      backgroundColor: COLORS.white,
      borderRadius: 17,
      paddingHorizontal: 13,
      paddingTop: 12,
      paddingBottom: 8,
      marginTop: 10,
      shadowColor: '#0F172A',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
      shadowRadius: 5,
      elevation: 3,
      ...Platform.select({
        web: {
          boxShadow:
            '0px 3px 8px rgba(15, 23, 42, 0.10)',
        },
      }),
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
      marginRight: 8,
    },

    // REQUEST CARD
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
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      ...Platform.select({
        web: {
          boxShadow:
            '0px 2px 5px rgba(15, 23, 42, 0.08)',
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

    // STATUS BADGE
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

    // REQUEST METADATA
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

    // BOTTOM NAVIGATION
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
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.18,
      shadowRadius: 3,
      elevation: 4,
      ...Platform.select({
        web: {
          boxShadow:
            '0px 2px 5px rgba(15, 23, 42, 0.18)',
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

    // HOVER EFFECT
    hoverNotification: {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },

    hoverNavItem: {
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
  });