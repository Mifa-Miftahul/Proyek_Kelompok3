import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import BackHeader from "../../components/Molecules/BackHeader";
import BookingFilter, {
  type BookingFilterType,
} from "../../components/Molecules/BookingFilter";
import EmptyState from "../../components/Molecules/EmptyState";
import StatTile from "../../components/Molecules/StatTile";
import BottomNavigation from "../../components/Organisms/BottomNavigation";
import GuruRequestDetailModal from "../../components/Organisms/GuruRequestDetailModal";
import RequestCard from "../../components/Organisms/RequestCardDahboard";
import { fetchGuruRequests, type GuruRequest } from "../../lib/guruRequests";

const COLORS = {
  navy: "#223F91",
  background: "#F5F7FB",
  white: "#FFFFFF",
  muted: "#64748B",
  red: "#DC2626",
};

const VALID_FILTERS: BookingFilterType[] = [
  "Semua",
  "Pending",
  "Disetujui",
  "Ditolak",
];

// Rute bottom navigation Guru.
const ROUTES: Record<string, string> = {
  Dashboard: "/Guru/dashboard",
  JadwalLab: "/Guru/jadwal-lab",
  DaftarLab: "/Guru/daftar-lab",
  BuatPeminjaman: "/Guru/peminjaman",
};

export default function RiwayatGuruScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 700;

  // Filter awal bisa dikirim dari dashboard, mis. ?filter=Pending
  const params = useLocalSearchParams<{ filter?: string }>();
  const initialFilter = VALID_FILTERS.includes(
    params.filter as BookingFilterType,
  )
    ? (params.filter as BookingFilterType)
    : "Semua";

  const [filter, setFilter] = useState<BookingFilterType>(initialFilter);
  const [requests, setRequests] = useState<GuruRequest[]>([]);
  const [selected, setSelected] = useState<GuruRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setErrorMessage("");

      const result = await fetchGuruRequests();
      setRequests(result.requests);
    } catch (error) {
      console.error("Gagal memuat riwayat Guru:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memuat riwayat.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Muat ulang setiap halaman ini dibuka kembali.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.bookingStatus === "Pending").length,
      approved: requests.filter((r) => r.bookingStatus === "Disetujui").length,
      rejected: requests.filter((r) => r.bookingStatus === "Ditolak").length,
    }),
    [requests],
  );

  const visibleRequests = useMemo(
    () =>
      filter === "Semua"
        ? requests
        : requests.filter((r) => r.bookingStatus === filter),
    [requests, filter],
  );

  // Kembali ke dashboard (atau halaman sebelumnya).
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.Dashboard as never);
    }
  };

  const handleNavigate = (route: string) => {
    const path = ROUTES[route];
    if (!path) return;

    if (route === "Dashboard") {
      router.replace(path as never);
      return;
    }

    router.push(path as never);
  };

  // Kartu yang ditekan -> buka detail lengkap.
  const handleOpen = (item: { id: string }) => {
    const full = requests.find((r) => r.id === item.id);
    if (full) setSelected(full);
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.statGrid}>
        <StatTile
          icon="clipboard-text-outline"
          value={counts.total}
          label="Total Pengajuan"
          tone="blue"
          onPress={() => setFilter("Semua")}
        />
        <StatTile
          icon="clipboard-clock-outline"
          value={counts.pending}
          label="Pending"
          tone="yellow"
          onPress={() => setFilter("Pending")}
        />
        <StatTile
          icon="check-circle-outline"
          value={counts.approved}
          label="Disetujui"
          tone="green"
          onPress={() => setFilter("Disetujui")}
        />
        <StatTile
          icon="close-circle-outline"
          value={counts.rejected}
          label="Ditolak"
          tone="red"
          onPress={() => setFilter("Ditolak")}
        />
      </View>

      <View style={styles.filterWrap}>
        <BookingFilter activeFilter={filter} onFilterChange={setFilter} />
      </View>

      <Text style={styles.resultText}>
        {visibleRequests.length} pengajuan
        {filter !== "Semua" ? ` · ${filter}` : ""}
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;

    if (errorMessage) {
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={() => load()}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <EmptyState
        icon="time-outline"
        title={
          filter === "Semua"
            ? "Belum ada riwayat"
            : `Tidak ada pengajuan ${filter}`
        }
        description={
          filter === "Semua"
            ? "Pengajuan peminjaman laboratorium yang kamu buat akan muncul di sini."
            : "Coba pilih filter lain untuk melihat pengajuan kamu."
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        <View style={[styles.page, isWideScreen && styles.pageWide]}>
          <BackHeader
            title="Riwayat Pengajuan"
            subtitle="Seluruh pengajuan peminjaman laboratorium kamu"
            onBackPress={handleBack}
          />

          {loading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={COLORS.navy} />
              <Text style={styles.loadingText}>Memuat riwayat...</Text>
            </View>
          )}

          <FlatList<GuruRequest>
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={visibleRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RequestCard item={item} onPress={handleOpen} />
            )}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
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
          />

          <BottomNavigation
            activeRoute="Dashboard"
            onNavigate={handleNavigate}
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  listHeader: {
    marginBottom: 6,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterWrap: {
    marginTop: 14,
  },
  resultText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 10,
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
  errorBox: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 22,
    ...Platform.select({ web: { cursor: "default" } }),
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
});
