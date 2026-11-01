import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { BookingRequest } from '../../constants/bookingData';
import HistoryStatusBadge from '../Molecules/HistoryStatusBadge';
import HistoryInfoRow from '../Molecules/HistoryInfoRow';

type Props = {
  visible: boolean;
  booking: BookingRequest | null;
  onClose: () => void;
};

export default function HistoryDetailModal({
  visible,
  booking,
  onClose,
}: Props) {
  if (!booking) return null;

  const formattedDate = new Date(
    `${booking.date}T00:00:00`,
  ).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Detail Peminjaman</Text>
              <Text style={styles.id}>{booking.id}</Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.statusContainer}>
              <Text style={styles.sectionTitle}>Status Pengajuan</Text>
              <HistoryStatusBadge status={booking.status} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informasi Pengajuan</Text>

              <HistoryInfoRow
                label="Nama Guru"
                value={booking.teacherName}
              />
              <HistoryInfoRow
                label="Laboratorium"
                value={booking.labName}
              />
              <HistoryInfoRow
                label="Tanggal"
                value={formattedDate}
              />
              <HistoryInfoRow
                label="Waktu"
                value={`${booking.startTime} - ${booking.endTime}`}
              />
              <HistoryInfoRow
                label="Kelas"
                value={booking.className}
              />
              <HistoryInfoRow
                label="Mata Pelajaran"
                value={booking.subject}
              />
              <HistoryInfoRow
                label="Jumlah Siswa"
                value={`${booking.studentCount} siswa`}
              />
              <HistoryInfoRow
                label="Keperluan"
                value={booking.purpose}
              />

              {booking.status === 'Ditolak' && booking.rejectionReason ? (
                <View style={styles.rejectionBox}>
                  <Text style={styles.rejectionTitle}>Alasan Penolakan</Text>
                  <Text style={styles.rejectionText}>
                    {booking.rejectionReason}
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <Pressable style={styles.closeAction} onPress={onClose}>
            <Text style={styles.closeActionText}>Tutup</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modal: {
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 5,
    backgroundColor: '#D8DCE5',
    alignSelf: 'center',
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#223F91',
  },
  id: {
    fontSize: 11,
    color: '#8991A3',
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 23,
    color: '#59647A',
    lineHeight: 26,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 13,
    backgroundColor: '#F7F8FC',
    borderRadius: 12,
    marginBottom: 18,
  },
  section: {
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#35415B',
    marginBottom: 13,
  },
  rejectionBox: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginTop: 3,
  },
  rejectionTitle: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
  },
  rejectionText: {
    color: '#7F1D1D',
    fontSize: 12,
    lineHeight: 18,
  },
  closeAction: {
    backgroundColor: '#223F91',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});