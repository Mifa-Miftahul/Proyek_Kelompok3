
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import LaboranBottomNavigation from '../../components/Organisms/LaboranBottomNavigation';
import HeaderDashboard from '../../components/Molecules/HeaderDashboard';

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
};

const REQUESTS = [
  {
    id: 'PEM-001',
    teacher: 'Salwa Ayudia',
    lab: 'Lab Pemrograman',
    icon: 'monitor',
    date: '19 Oktober 2026',
    time: '10.00 - 12.30',
    status: 'Pending',
  },
  {
    id: 'PEM-002',
    teacher: 'Abdullah Fattah',
    lab: 'Lab Jaringan',
    icon: 'lan',
    date: '20 Oktober 2026',
    time: '08.00 - 10.00',
    status: 'Accepted',
  },
  {
    id: 'PEM-003',
    teacher: 'Nazwa Hummaimah',
    lab: 'Lab Fiber Optik',
    icon: 'access-point',
    date: '21 Oktober 2026',
    time: '12.30 - 15.30',
    status: 'Pending',
  },
];

export default function DashboardLaboran() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<(typeof REQUESTS)[number] | null>(null);

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.dismissTo('../login' as never);
  };

  const goToPeminjaman = () => {
    router.push('/Laboran/peminjaman-lab' as never);
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Accepted') {
      return {
        backgroundColor: COLORS.paleGreen,
        color: COLORS.green,
      };
    }

    return {
      backgroundColor: COLORS.paleOrange,
      color: COLORS.orange,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={COLORS.navy}
        barStyle="light-content"
      />

      {/* HEADER */}
      <HeaderDashboard
        greeting="Halo, Laboran 👋🏻"
        schoolName="Laboran - SMK Islamic Center Cirebon"
        onLogoutPress={() => setShowLogoutModal(true)}
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* CONTENT */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>
              Ringkasan Laboratorium
            </Text>

            <Text style={styles.sectionSubtitle}>
              Informasi pengelolaan laboratorium
            </Text>

            {/* SUMMARY */}
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIconBlue}>
                  <MaterialCommunityIcons
                    name="monitor"
                    size={23}
                    color={COLORS.navy}
                  />
                </View>

                <Text style={styles.summaryNumber}>3</Text>

                <Text style={styles.summaryLabel}>
                  Total Laboratorium
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

                <Text style={styles.summaryNumber}>2</Text>

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

                <Text style={styles.summaryNumber}>8</Text>

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

            {REQUESTS.map((item) => {
              const statusStyle = getStatusStyle(item.status);

              return (
                <View key={item.id} style={styles.requestCard}>
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
            })}
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

      {/* CUSTOM LOGOUT MODAL */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
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

  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },

  summaryCard: {
    flex: 1,
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

  /* DESAIN CARD PENGAJUAN TERBARU */
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

  /* MODAL DETAIL */
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
