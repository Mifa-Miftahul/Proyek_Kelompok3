
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import LaboranBottomNavigation from '../../components/Organisms/LaboranBottomNavigation';
import HeaderDashboard from '../../components/Molecules/HeaderDashboard';
import { supabase } from '../../lib/supabase';

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
  background: '#F5F7FB',
  white: '#FFFFFF',
  text: '#1E293B',
  secondary: '#64748B',
  green: '#16A34A',
  paleGreen: '#DCFCE7',
  orange: '#D97706',
  paleOrange: '#FEF3C7',
  border: '#E2E8F0',
  red: '#DC2626',
  paleRed: '#FEE2E2',
};

type RequestItem = {
  id: string;
  teacher: string;
  lab: string;
  icon: string;
  date: string;
  time: string;
  status: string;
};

type UserRow = {
  id: string;
  nama: string;
};

type LabRow = {
  id_lab: number;
  nama_lab: string;
  icon: string | null;
};

type PeminjamanRow = {
  id_peminjaman: number;
  id_user: string;
  id_lab: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
  created_at: string;
};

export default function DashboardLaboran() {
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<RequestItem | null>(null);

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [totalLab, setTotalLab] = useState(0);
  const [totalPerangkat, setTotalPerangkat] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // ==========================================
  // FORMAT TANGGAL
  // ==========================================

  const formatDate = (date: string) => {
    if (!date) return '-';

    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );
  };

  // ==========================================
  // HELPER QUERY SUPABASE
  // ==========================================

  const checkQuery = async <T,>(
    queryName: string,
    query: any
  ): Promise<T> => {
    const { data, error } = await query;

    if (error) {
      console.error(`QUERY GAGAL: ${queryName}`);

      console.error('Error asli:', error);

      console.error(
        'Detail error:',
        JSON.stringify(
          {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
            status: error?.status,
            name: error?.name,
          },
          null,
          2
        )
      );

      throw new Error(
        `${queryName}: ${
          error?.message ||
          error?.details ||
          error?.hint ||
          error?.code ||
          'Terjadi kesalahan pada Supabase.'
        }`
      );
    }

    return data as T;
  };

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoadError(false);

      // --------------------------------------
      // 1. CEK SESSION LOGIN
      // --------------------------------------

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          `Gagal memeriksa session: ${sessionError.message}`
        );
      }

      const user = session?.user ?? null;

      if (!user) {
        console.warn(
          'Session login tidak ditemukan. Dashboard berjalan dalam mode pengembangan.'
        );
      } else {
        // --------------------------------------
        // 2. VALIDASI PROFIL LABORAN
        // --------------------------------------

        const profile = await checkQuery<any>(
          'Memeriksa profil laboran',
          supabase
            .from('users')
            .select('id, role, is_active')
            .eq('id', user.id)
            .maybeSingle()
        );

        if (!profile) {
          throw new Error(
            'Data profil pengguna tidak ditemukan.'
          );
        }

        if (
          String(profile.role).toLowerCase() !== 'laboran' ||
          profile.is_active !== true
        ) {
          throw new Error(
            'Akun bukan laboran atau akun tidak aktif.'
          );
        }
      }

      // --------------------------------------
      // 3. TOTAL LABORATORIUM
      // --------------------------------------

      const labCountData = await checkQuery<any>(
        'Mengambil total laboratorium',
        supabase
          .from('laboratorium')
          .select('id_lab', {
            count: 'exact',
            head: true,
          })
      );

      // Count diperoleh melalui count pada response Supabase.
      // Query head tidak mengembalikan data baris.
      // Karena itu, gunakan query count terpisah di bawah.

      const { count: labCount, error: labCountError } =
        await supabase
          .from('laboratorium')
          .select('id_lab', {
            count: 'exact',
            head: true,
          });

      if (labCountError) {
        throw new Error(
          `Mengambil total laboratorium: ${
            labCountError.message || 'Gagal menghitung data.'
          }`
        );
      }

      setTotalLab(labCount ?? 0);

      // --------------------------------------
      // 4. TOTAL PERANGKAT
      // --------------------------------------

      const perangkatRows = await checkQuery<
        { jumlah: number | null }[]
      >(
        'Mengambil data perangkat',
        supabase
          .from('perangkat')
          .select('jumlah')
      );

      const jumlahPerangkat = (perangkatRows ?? []).reduce(
        (total, item) => total + Number(item.jumlah ?? 0),
        0
      );

      setTotalPerangkat(jumlahPerangkat);

      // --------------------------------------
      // 5. HITUNG STATUS PEMINJAMAN
      // --------------------------------------

      const statusRows = await checkQuery<
        { status: string }[]
      >(
        'Mengambil status peminjaman',
        supabase
          .from('peminjaman')
          .select('status')
      );

      const statuses = statusRows ?? [];

      setPendingCount(
        statuses.filter((item) => {
          const status = String(item.status).toLowerCase();
          return status === 'pending' || status === 'menunggu';
        }).length
      );

      setAcceptedCount(
        statuses.filter((item) => {
          const status = String(item.status).toLowerCase();

          return (
            status === 'accepted' ||
            status === 'approved' ||
            status === 'disetujui'
          );
        }).length
      );

      // --------------------------------------
      // 6. AMBIL 3 PENGAJUAN TERBARU
      // --------------------------------------

      const latestRows = await checkQuery<PeminjamanRow[]>(
        'Mengambil pengajuan terbaru',
        supabase
          .from('peminjaman')
          .select(`
            id_peminjaman,
            id_user,
            id_lab,
            tanggal,
            jam_mulai,
            jam_selesai,
            status,
            created_at
          `)
          .order('created_at', {
            ascending: false,
          })
          .limit(3)
      );

      const rows = latestRows ?? [];

      if (rows.length === 0) {
        setRequests([]);
        return;
      }

      // --------------------------------------
      // 7. AMBIL ID USER DAN ID LAB
      // --------------------------------------

      const userIds = [
        ...new Set(rows.map((item) => item.id_user)),
      ];

      const labIds = [
        ...new Set(rows.map((item) => item.id_lab)),
      ];

      // --------------------------------------
      // 8. AMBIL DATA GURU DAN LAB
      // --------------------------------------

      const [usersData, labsData] = await Promise.all([
        checkQuery<UserRow[]>(
          'Mengambil data guru',
          supabase
            .from('users')
            .select('id, nama')
            .in('id', userIds)
        ),

        checkQuery<LabRow[]>(
          'Mengambil data laboratorium pengajuan',
          supabase
            .from('laboratorium')
            .select('id_lab, nama_lab, icon')
            .in('id_lab', labIds)
        ),
      ]);

      // --------------------------------------
      // 9. MAP DATA GURU
      // --------------------------------------

      const userMap = new Map(
        (usersData ?? []).map((item) => [
          item.id,
          item.nama,
        ])
      );

      // --------------------------------------
      // 10. MAP DATA LABORATORIUM
      // --------------------------------------

      const labMap = new Map(
        (labsData ?? []).map((item) => [
          String(item.id_lab),
          item,
        ])
      );

      // --------------------------------------
      // 11. GABUNGKAN DATA PENGAJUAN
      // --------------------------------------

      const formattedRequests: RequestItem[] = rows.map(
        (item) => {
          const lab = labMap.get(String(item.id_lab));

          return {
            id: `PEM-${item.id_peminjaman}`,

            teacher:
              userMap.get(item.id_user) ??
              'Guru tidak ditemukan',

            lab:
              lab?.nama_lab ??
              'Laboratorium tidak ditemukan',

            icon: lab?.icon || 'monitor',

            date: formatDate(item.tanggal),

            time:
              `${String(item.jam_mulai).slice(0, 5)} - ` +
              `${String(item.jam_selesai).slice(0, 5)}`,

            status: item.status,
          };
        }
      );

      setRequests(formattedRequests);
    } catch (error: any) {
      console.error(
        'GAGAL MEMUAT DASHBOARD LABORAN'
      );
      console.error('Error asli:', error);

      console.error(
        'Pesan error:',
        error?.message || 'Tidak ada pesan error.'
      );

      setLoadError(true);

      Alert.alert(
        'Gagal memuat dashboard laboran',
        error?.message ||
          'Terjadi kesalahan saat mengambil data. Periksa koneksi dan konfigurasi Supabase.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // REFRESH DATA
  // ==========================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  // ==========================================
  // LOAD DATA DAN REALTIME
  // ==========================================

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel('dashboard-laboran-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'peminjaman',
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'laboratorium',
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'perangkat',
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe((status) => {
        console.log(
          'Status realtime dashboard:',
          status
        );
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDashboardData]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    setShowLogoutModal(false);

    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Logout gagal', error.message);
      return;
    }

    router.replace('/login' as never);
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goToPeminjaman = () => {
    router.push('/Laboran/peminjaman-lab' as never);
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status: string) => {
    const normalized = String(status).toLowerCase();

    if (
      normalized === 'accepted' ||
      normalized === 'approved' ||
      normalized === 'disetujui'
    ) {
      return {
        backgroundColor: COLORS.paleGreen,
        color: COLORS.green,
      };
    }

    if (
      normalized === 'reject' ||
      normalized === 'rejected' ||
      normalized === 'ditolak'
    ) {
      return {
        backgroundColor: COLORS.paleRed,
        color: COLORS.red,
      };
    }

    return {
      backgroundColor: COLORS.paleOrange,
      color: COLORS.orange,
    };
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <HeaderDashboard
        greeting="Halo, Laboran 👋🏻"
        schoolName="Laboran - SMK Islamic Center Cirebon"
        onLogoutPress={() => setShowLogoutModal(true)}
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.navy]}
            />
          }
        >
          <View style={styles.content}>
            {/* RINGKASAN */}

            <Text style={styles.sectionTitle}>
              Ringkasan Laboratorium
            </Text>

            <Text style={styles.sectionSubtitle}>
              Informasi pengelolaan laboratorium
            </Text>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIconBlue}>
                  <MaterialCommunityIcons
                    name="monitor"
                    size={23}
                    color={COLORS.navy}
                  />
                </View>

                <Text style={styles.summaryNumber}>
                  {totalLab}
                </Text>

                <Text style={styles.summaryLabel}>
                  Total Laboratorium
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIconPurple}>
                  <MaterialCommunityIcons
                    name="desktop-classic"
                    size={23}
                    color="#7C3AED"
                  />
                </View>

                <Text style={styles.summaryNumber}>
                  {totalPerangkat}
                </Text>

                <Text style={styles.summaryLabel}>
                  Total Perangkat
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIconOrange}>
                  <Ionicons
                    name="time-outline"
                    size={23}
                    color={COLORS.orange}
                  />
                </View>

                <Text style={styles.summaryNumber}>
                  {pendingCount}
                </Text>

                <Text style={styles.summaryLabel}>
                  Pengajuan Pending
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIconGreen}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={23}
                    color={COLORS.green}
                  />
                </View>

                <Text style={styles.summaryNumber}>
                  {acceptedCount}
                </Text>

                <Text style={styles.summaryLabel}>
                  Peminjaman Disetujui
                </Text>
              </View>
            </View>

            {/* MENU UTAMA */}

            <Text style={styles.sectionTitle}>
              Menu Utama
            </Text>

            <View style={styles.menuGrid}>
              <Pressable
                style={styles.menuCard}
                onPress={() =>
                  router.push('/Laboran/jadwal-lab' as never)
                }
              >
                <View style={styles.menuIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={25}
                    color={COLORS.blue}
                  />
                </View>

                <Text style={styles.menuTitle}>
                  Jadwal Lab
                </Text>

                <Text style={styles.menuDescription}>
                  Lihat jadwal penggunaan lab
                </Text>
              </Pressable>

              <Pressable
                style={styles.menuCard}
                onPress={() =>
                  router.push('/Laboran/kelola-lab' as never)
                }
              >
                <View style={styles.menuIcon}>
                  <Ionicons
                    name="business-outline"
                    size={25}
                    color={COLORS.blue}
                  />
                </View>

                <Text style={styles.menuTitle}>
                  Detail Lab
                </Text>

                <Text style={styles.menuDescription}>
                  Kelola informasi laboratorium
                </Text>
              </Pressable>

              <Pressable
                style={styles.menuCard}
                onPress={() =>
                  router.push('/Laboran/akun-guru' as never)
                }
              >
                <View style={styles.menuIcon}>
                  <Ionicons
                    name="people-outline"
                    size={25}
                    color={COLORS.blue}
                  />
                </View>

                <Text style={styles.menuTitle}>
                  Akun Guru
                </Text>

                <Text style={styles.menuDescription}>
                  Lihat data akun guru
                </Text>
              </Pressable>

              <Pressable
                style={styles.menuCard}
                onPress={goToPeminjaman}
              >
                <View style={styles.menuIcon}>
                  <Ionicons
                    name="clipboard-outline"
                    size={25}
                    color={COLORS.blue}
                  />
                </View>

                <Text style={styles.menuTitle}>
                  Peminjaman
                </Text>

                <Text style={styles.menuDescription}>
                  Kelola pengajuan peminjaman
                </Text>
              </Pressable>
            </View>

            {/* PENGAJUAN TERBARU */}

            <View style={styles.requestHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Pengajuan Terbaru
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Daftar pengajuan peminjaman laboratorium
                </Text>
              </View>

              <Pressable onPress={goToPeminjaman}>
                <Text style={styles.seeAll}>
                  Lihat Semua
                </Text>
              </Pressable>
            </View>

            {/* KONDISI PENGAJUAN */}

            {loading ? (
              <View style={styles.emptyRequestCard}>
                <Ionicons
                  name="sync-outline"
                  size={32}
                  color={COLORS.blue}
                />

                <Text style={styles.emptyRequestTitle}>
                  Memuat Pengajuan...
                </Text>

                <Text style={styles.emptyRequestDescription}>
                  Mohon tunggu, data pengajuan sedang diambil.
                </Text>
              </View>
            ) : loadError ? (
              <View style={styles.emptyRequestCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={38}
                    color="#9D9D9D"
                  />
                </View>

                <Text style={styles.emptyRequestTitle}>
                  Belum ada pengajuan
                </Text>

                <Text style={styles.emptyRequestDescription}>
                  Belum ada data pengajuan terbaru saat ini.
                </Text>

                <Pressable
                  onPress={handleRefresh}
                  style={styles.refreshButton}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={16}
                    color={COLORS.navy}
                  />
                  <Text style={styles.refreshButtonText}>
                    Muat Ulang
                  </Text>
                </Pressable>
              </View>
            ) : requests.length === 0 ? (
              <View style={styles.emptyRequestCard}>
                <View style={styles.emptyIllustration}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons
                      name="folder-open-outline"
                      size={46}
                      color="#94A3B8"
                    />
                  </View>
                </View>

                <Text style={styles.emptyRequestTitle}>
                  Belum ada data pengajuan terbaru saat ini.
                </Text>

                <View style={styles.emptyInfoBadge}>
                  <Ionicons
                    name="information-circle-outline"
                    size={15}
                    color="#94A3B8"
                  />

                  <Text style={styles.emptyInfoText}>
                    Menunggu pengajuan baru
                  </Text>
                </View>
              </View>
            ) : (
              requests.map((item) => {
                const statusStyle = getStatusStyle(item.status);

                return (
                  <View
                    key={item.id}
                    style={styles.requestCard}
                  >
                    <View style={styles.requestTop}>
                      <View style={styles.requestIdWrap}>
                        <View style={styles.requestIcon}>
                          <MaterialCommunityIcons
                            name={item.icon as any}
                            size={24}
                            color={COLORS.navy}
                          />
                        </View>

                        <View style={styles.requestTitleWrap}>
                          <Text style={styles.requestLab}>
                            {item.lab}
                          </Text>

                          <Text style={styles.requestId}>
                            {item.id}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              statusStyle.backgroundColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: statusStyle.color },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.requestDivider} />

                    <View style={styles.requestInfo}>
                      <Ionicons
                        name="person-outline"
                        size={16}
                        color={COLORS.secondary}
                      />

                      <Text style={styles.requestInfoText}>
                        {item.teacher}
                      </Text>
                    </View>

                    <View style={styles.requestInfo}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color={COLORS.secondary}
                      />

                      <Text style={styles.requestInfoText}>
                        {item.date}
                      </Text>
                    </View>

                    <View style={styles.requestInfo}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={COLORS.secondary}
                      />

                      <Text style={styles.requestInfoText}>
                        {item.time}
                      </Text>
                    </View>

                    <Pressable
                      style={styles.detailButton}
                      onPress={() => setSelectedRequest(item)}
                    >
                      <Text style={styles.detailButtonText}>
                        Lihat Detail
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={COLORS.blue}
                      />
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION */}

        <LaboranBottomNavigation activeRoute="Dashboard" />
      </View>

      {/* MODAL DETAIL PENGAJUAN */}

      <Modal
        visible={selectedRequest !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedRequest(null)}
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutModal}>
            {selectedRequest && (
              <>
                <View style={styles.detailModalIcon}>
                  <MaterialCommunityIcons
                    name={selectedRequest.icon as any}
                    size={30}
                    color={COLORS.navy}
                  />
                </View>

                <Text style={styles.detailModalTitle}>
                  {selectedRequest.lab}
                </Text>

                <Text style={styles.detailModalId}>
                  {selectedRequest.id}
                </Text>

                <View style={styles.detailModalDivider} />

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>
                    Nama Guru
                  </Text>

                  <Text style={styles.modalDetailValue}>
                    {selectedRequest.teacher}
                  </Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>
                    Tanggal
                  </Text>

                  <Text style={styles.modalDetailValue}>
                    {selectedRequest.date}
                  </Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>
                    Waktu
                  </Text>

                  <Text style={styles.modalDetailValue}>
                    {selectedRequest.time}
                  </Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>
                    Status
                  </Text>

                  <Text
                    style={[
                      styles.modalDetailValue,
                      {
                        color: getStatusStyle(
                          selectedRequest.status
                        ).color,
                      },
                    ]}
                  >
                    {selectedRequest.status}
                  </Text>
                </View>

                <Pressable
                  style={styles.closeDetailButton}
                  onPress={() => setSelectedRequest(null)}
                >
                  <Text style={styles.closeDetailText}>
                    Tutup
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL LOGOUT */}

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
        statusBarTranslucent
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutModal}>
            <View style={styles.logoutIcon}>
              <Ionicons
                name="log-out-outline"
                size={30}
                color={COLORS.navy}
              />
            </View>

            <Text style={styles.logoutTitle}>
              Konfirmasi Logout
            </Text>

            <Text style={styles.logoutMessage}>
              Apakah kamu yakin ingin keluar dari akun?
            </Text>

            <View style={styles.logoutActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>
                  Batal
                </Text>
              </Pressable>

              <Pressable
                style={styles.confirmLogoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmLogoutText}>
                  Logout
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

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
    paddingBottom: 20,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },

  sectionSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    marginBottom: 15,
  },

  // RINGKASAN

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },

  summaryCard: {
    width: '48%',
    flexGrow: 1,
    minHeight: 125,
    backgroundColor: COLORS.white,
    borderRadius: 13,
    padding: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  summaryIconBlue: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  summaryIconPurple: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  summaryIconOrange: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.paleOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  summaryIconGreen: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  summaryNumber: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 3,
  },

  summaryLabel: {
    fontSize: 10,
    color: COLORS.secondary,
    lineHeight: 14,
  },

  // MENU

  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
  },

  menuCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderRadius: 13,
    padding: 14,
    minHeight: 125,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },

  menuDescription: {
    fontSize: 10,
    color: COLORS.secondary,
    lineHeight: 15,
  },

  // PENGAJUAN

  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  seeAll: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.blue,
  },

  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  requestTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  requestIdWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },

  requestIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  requestTitleWrap: {
    flex: 1,
  },

  requestLab: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },

  requestId: {
    fontSize: 11,
    color: COLORS.secondary,
  },

  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  requestDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 11,
  },

  requestInfoText: {
    fontSize: 12,
    color: COLORS.secondary,
  },

  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.paleBlue,
    borderRadius: 9,
    paddingVertical: 10,
    marginTop: 5,
  },

  detailButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },

  // EMPTY STATE

  emptyRequestCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 22,
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  emptyIllustration: {
    width: 85,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  emptyIconCircle: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyRequestTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 21,
  },

  emptyRequestDescription: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
    marginBottom: 15,
  },

  emptyInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  emptyInfoText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },

  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.paleBlue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
  },

  refreshButtonText: {
    fontSize: 12,
    color: COLORS.navy,
    fontWeight: '600',
  },

  // MODAL DETAIL

  detailModalIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.paleBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  detailModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
  },

  detailModalId: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 5,
  },

  detailModalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },

  modalDetailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    gap: 12,
  },

  modalDetailLabel: {
    fontSize: 12,
    color: COLORS.secondary,
  },

  modalDetailValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
  },

  closeDetailButton: {
    width: '100%',
    backgroundColor: COLORS.navy,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  closeDetailText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },

  // MODAL LOGOUT

  logoutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  logoutModal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  logoutIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.paleBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  logoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 8,
  },

  logoutMessage: {
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  logoutActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },

  confirmLogoutButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmLogoutText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
