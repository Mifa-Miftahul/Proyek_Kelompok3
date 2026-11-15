import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// === IMPORT FROM COMPONENTS MOLECULES AND ORGANISMS ===
import EmptyState from "../../components/Molecules/EmptyState";
import HeaderDashboard from "../../components/Molecules/HeaderDashboard";
import SectionHeaderDashboard from "../../components/Molecules/SectionHeaderDashboard";
import StatTile from "../../components/Molecules/StatTile";
import StatusBadgeDashboard from "../../components/Molecules/StatusBadgeDashboard";
import BottomNavigation from "../../components/Organisms/BottomNavigation";
import GuruRequestDetailModal from "../../components/Organisms/GuruRequestDetailModal";
import RequestSectionDashboard from "../../components/Organisms/RequestSectionDashboard";
import {
  fetchGuruRequests,
  toDateKey,
  toTimeKey,
  type GuruRequest,
} from "../../lib/guruRequests";

// === COLORS ===
const COLORS = {
  navy: "#223F91",
  blue: "#3B82F6",
  paleBlue: "#DCEBFF",
  background: "#F5F7FB",
  white: "#FFFFFF",
  muted: "#64748B",
};

// Jumlah riwayat yang ditampilkan di dashboard (selebihnya di halaman Riwayat).
const HISTORY_PREVIEW_LIMIT = 3;

// Aksi cepat di dashboard.
const QUICK_ACTIONS = [
  {
    route: "BuatPeminjaman",
    label: "Pinjam Lab",
    icon: "calendar-plus",
  },
  {
    route: "JadwalLab",
    label: "Jadwal Lab",
    icon: "calendar-month-outline",
  },
  {
    route: "DaftarLab",
    label: "Daftar Lab",
    icon: "monitor-multiple",
  },
] as const;

// === DASHBOARD SCREEN ===
export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 700;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [teacherName, setTeacherName] = useState("Guru");
  const [requests, setRequests] = useState<GuruRequest[]>([]);
  const [laboratoryCount, setLaboratoryCount] = useState(0);
  const [selected, setSelected] = useState<GuruRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const result = await fetchGuruRequests();

      setTeacherName(result.teacherName);
      setRequests(result.requests);
      setLaboratoryCount(result.laboratoryCount);
    } catch (error) {
      console.error("Gagal memuat dashboard Guru:", error);

      Alert.alert(
        "Gagal Memuat Dashboard",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Muat ulang setiap dashboard kembali terlihat
  // (mis. setelah membuat pengajuan atau kembali dari Riwayat).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // === DATA TURUNAN ===
  const summary = useMemo(() => {
    const todayKey = toDateKey(new Date());
    const nowKey = `${todayKey} ${toTimeKey(new Date())}`;

    const pending = requests.filter((r) => r.bookingStatus === "Pending");
    const approved = requests.filter((r) => r.bookingStatus === "Disetujui");
    const rejected = requests.filter((r) => r.bookingStatus === "Ditolak");

    // Pengajuan yang DIBUAT hari ini.
    const createdToday = requests.filter((r) => {
      const created = new Date(r.createdAt);
      return (
        !Number.isNaN(created.getTime()) && toDateKey(created) === todayKey
      );
    });
    const createdTodayIds = new Set(createdToday.map((r) => r.id));

    // Riwayat = pengajuan lain selain yang dibuat hari ini.
    const history = requests.filter((r) => !createdTodayIds.has(r.id));

    // Peminjaman terdekat: belum lewat dan tidak ditolak.
    const upcoming =
      requests
        .filter(
          (r) =>
            r.bookingStatus !== "Ditolak" &&
            `${r.dateRaw} ${r.endTime}` >= nowKey,
        )
        .sort((a, b) =>
          `${a.dateRaw} ${a.startTime}`.localeCompare(
            `${b.dateRaw} ${b.startTime}`,
          ),
        )[0] ?? null;

    return {
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      createdToday,
      history,
      upcoming,
    };
  }, [requests]);

  // === NAVIGASI ===
  const routes: Record<string, string> = {
    Dashboard: "/Guru/dashboard",
    JadwalLab: "/Guru/jadwal-lab",
    DaftarLab: "/Guru/daftar-lab",
    BuatPeminjaman: "/Guru/peminjaman",
    RiwayatPengajuan: "/Guru/riwayat",
  };

  const goTo = (screen: string, params: Record<string, string> = {}) => {
    const path = routes[screen];

    if (!path) {
      Alert.alert("Halaman belum tersedia", "Rute halaman belum ditentukan.");
      return;
    }

    if (screen === "Dashboard") {
      router.replace(path as never);
      return;
    }

    router.push({ pathname: path as never, params });
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.dismissTo("../login" as never);
  };

  // Kartu pengajuan ditekan -> tampilkan detail.
  const openRequest = (item: { id: string }) => {
    const full = requests.find((r) => r.id === item.id);
    if (full) setSelected(full);
  };

  const openHistory = (filter?: string) =>
    goTo("RiwayatPengajuan", filter ? { filter } : {});

  const historyPreview = summary.history.slice(0, HISTORY_PREVIEW_LIMIT);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        <View style={[styles.page, isWideScreen && styles.pageWide]}>
          <HeaderDashboard
            onLogoutPress={() => setShowLogoutModal(true)}
            greeting={`Halo, ${teacherName} 👋🏻`}
          />

          {/* MODAL LOGOUT */}
          <Modal
            visible={showLogoutModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowLogoutModal(false)}
          >
            <View style={styles.logoutOverlay}>
              <View style={styles.logoutModal}>
                <View style={styles.logoutIcon}>
                  <Ionicons name="log-out-outline" size={30} color="#223F91" />
                </View>

                <Text style={styles.logoutTitle}>Konfirmasi Logout</Text>

                <Text style={styles.logoutMessage}>
                  Apakah kamu yakin ingin keluar dari akun?
                </Text>

                <View style={styles.logoutActions}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setShowLogoutModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Batal</Text>
                  </Pressable>

                  <Pressable
                    style={styles.confirmLogoutButton}
                    onPress={handleLogout}
                  >
                    <Text style={styles.confirmLogoutText}>Logout</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {loading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={COLORS.navy} />
              <Text style={styles.loadingText}>Memuat dashboard...</Text>
            </View>
          )}

          {/* KONTEN YANG BISA DI-SCROLL */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  load(true);
                }}
                tintColor={COLORS.navy}
              />
            }
          >
            {/* AKSI CEPAT */}
            <View style={styles.quickRow}>
              {QUICK_ACTIONS.map((action) => (
                <Pressable
                  key={action.route}
                  style={({ pressed }) => [
                    styles.quickButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => goTo(action.route)}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                >
                  <View style={styles.quickIcon}>
                    <MaterialCommunityIcons
                      name={action.icon}
                      size={22}
                      color={COLORS.navy}
                    />
                  </View>
                  <Text style={styles.quickLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* PEMINJAMAN TERDEKAT */}
            <View style={styles.card}>
              <SectionHeaderDashboard title="Peminjaman Terdekat" />

              {summary.upcoming ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.upcoming,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => openRequest(summary.upcoming!)}
                  accessibilityRole="button"
                  accessibilityLabel={`Detail peminjaman ${summary.upcoming.lab}`}
                >
                  <View style={styles.upcomingTop}>
                    <View style={styles.upcomingIcon}>
                      <MaterialCommunityIcons
                        name={summary.upcoming.icon}
                        size={24}
                        color={COLORS.white}
                      />
                    </View>

                    <View style={styles.upcomingText}>
                      <Text style={styles.upcomingLab} numberOfLines={1}>
                        {summary.upcoming.lab}
                      </Text>
                      <Text style={styles.upcomingRoom} numberOfLines={1}>
                        {summary.upcoming.labRoom}
                      </Text>
                    </View>

                    <StatusBadgeDashboard status={summary.upcoming.status} />
                  </View>

                  <View style={styles.upcomingMeta}>
                    <View style={styles.upcomingMetaItem}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#E0E7FF"
                      />
                      <Text style={styles.upcomingMetaText}>
                        {summary.upcoming.date}
                      </Text>
                    </View>

                    <View style={styles.upcomingMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#E0E7FF" />
                      <Text style={styles.upcomingMetaText}>
                        {summary.upcoming.time}
                      </Text>
                    </View>

                    <View style={styles.upcomingMetaItem}>
                      <Ionicons
                        name="people-outline"
                        size={14}
                        color="#E0E7FF"
                      />
                      <Text style={styles.upcomingMetaText}>
                        {summary.upcoming.className}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ) : (
                <View style={styles.upcomingEmpty}>
                  <Text style={styles.upcomingEmptyText}>
                    Belum ada peminjaman yang akan datang.
                  </Text>
                  <Pressable
                    style={styles.upcomingEmptyButton}
                    onPress={() => goTo("BuatPeminjaman")}
                  >
                    <Text style={styles.upcomingEmptyButtonText}>
                      Buat Peminjaman
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* RINGKASAN */}
            <View style={styles.card}>
              <SectionHeaderDashboard title="Ringkasan" />

              <View style={styles.statGrid}>
                <StatTile
                  icon="clipboard-clock-outline"
                  value={summary.pending}
                  label="Pengajuan Pending"
                  tone="yellow"
                  onPress={() => openHistory("Pending")}
                />
                <StatTile
                  icon="check-circle-outline"
                  value={summary.approved}
                  label="Pengajuan Disetujui"
                  tone="green"
                  onPress={() => openHistory("Disetujui")}
                />
                <StatTile
                  icon="close-circle-outline"
                  value={summary.rejected}
                  label="Pengajuan Ditolak"
                  tone="red"
                  onPress={() => openHistory("Ditolak")}
                />
                <StatTile
                  icon="monitor"
                  value={laboratoryCount}
                  label="Total Laboratorium"
                  tone="blue"
                  onPress={() => goTo("DaftarLab")}
                />
              </View>
            </View>

            {/* PENGAJUAN HARI INI */}
            {summary.createdToday.length > 0 && (
              <RequestSectionDashboard
                title="Pengajuan Hari Ini"
                items={summary.createdToday}
                onRequestPress={openRequest}
                style={styles.sectionNoMargin}
              />
            )}

            {/* RIWAYAT TERBARU */}
            {historyPreview.length > 0 ? (
              <RequestSectionDashboard
                title="Riwayat Pengajuan Peminjaman"
                items={historyPreview}
                onRequestPress={openRequest}
                showArrow
                onHeaderPress={() => openHistory()}
                style={styles.sectionNoMargin}
              />
            ) : (
              !loading &&
              summary.createdToday.length === 0 && (
                <EmptyState
                  icon="time-outline"
                  title="Belum ada riwayat"
                  description="Pengajuan peminjaman laboratorium yang kamu buat akan muncul di sini."
                />
              )
            )}

            {/* LIHAT SEMUA */}
            {requests.length > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.seeAllButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => openHistory()}
                accessibilityRole="button"
              >
                <Text style={styles.seeAllText}>
                  Lihat Semua Riwayat ({requests.length})
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.navy}
                />
              </Pressable>
            )}
          </ScrollView>

          {/* BOTTOM NAVIGATION */}
          <BottomNavigation
            activeRoute="Dashboard"
            onNavigate={(route) => goTo(route)}
          />
        </View>
      </View>

      <GuruRequestDetailModal
        visible={selected !== null}
        request={selected}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  page: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    backgroundColor: COLORS.background,
  },
  pageWide: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E2E8F0",
  },
  pressed: {
    opacity: 0.75,
  },

  // LIST
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 12,
  },
  loading: {
    position: "absolute",
    top: 85,
    left: 0,
    right: 0,
    bottom: 64,
    zIndex: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 12,
  },

  // AKSI CEPAT
  quickRow: {
    flexDirection: "row",
    gap: 10,
  },
  quickButton: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F4FA",
    paddingVertical: 14,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: "700",
  },

  // KARTU SECTION
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 13,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: "0px 3px 8px rgba(15, 23, 42, 0.10)",
      },
    }),
  },
  sectionNoMargin: {
    marginBottom: 0,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // PEMINJAMAN TERDEKAT
  upcoming: {
    backgroundColor: COLORS.navy,
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  upcomingTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  upcomingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  upcomingText: {
    flex: 1,
    minWidth: 0,
  },
  upcomingLab: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  upcomingRoom: {
    color: "#E0E7FF",
    fontSize: 10,
    marginTop: 2,
  },
  upcomingMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  upcomingMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  upcomingMetaText: {
    color: "#E0E7FF",
    fontSize: 11,
    fontWeight: "600",
  },
  upcomingEmpty: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  upcomingEmptyText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
  },
  upcomingEmptyButton: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  upcomingEmptyButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  // LIHAT SEMUA
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCEBFF",
    paddingVertical: 13,
  },
  seeAllText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "700",
  },

  // LOGOUT MODAL
  logoutOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logoutModal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoutIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DCEBFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#223F91",
    marginBottom: 8,
  },
  logoutMessage: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  logoutActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmLogoutButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#223F91",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmLogoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
