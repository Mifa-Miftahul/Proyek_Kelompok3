import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  BookingRequest,
} from '@/constants/bookingData';

import BookingStatusBadge from '@/components/Molecules/BookingStatusBadge';

type Props = {
  visible: boolean;
  booking: BookingRequest | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');

  const months = [
    'Januari', 'Februari', 'Maret', 'April',
    'Mei', 'Juni', 'Juli', 'Agustus',
    'September', 'Oktober', 'November', 'Desember',
  ];

  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
};

export default function BookingDetailModal({
  visible,
  booking,
  onClose,
  onApprove,
  onReject,
}: Props) {

  const [rejectionReason, setRejectionReason] = useState('');

useEffect(() => {
  if (visible) {
    setRejectionReason('');
  }
}, [visible, booking?.id]);

const submitRejection = () => {
  const reason = rejectionReason.trim();

  if (!reason) {
    Alert.alert('Perhatian', 'Alasan penolakan wajib diisi.');
    return;
  }

  if (booking) {
    onReject(booking.id, reason);
    setRejectionReason('');
  }
};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Detail Peminjaman</Text>
            <Pressable onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={27}
                color="#64748B"
              />
            </Pressable>
          </View>

          {booking && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.idRow}>
                <Text style={styles.bookingId}>{booking.id}</Text>
                <BookingStatusBadge status={booking.status} />
              </View>

              {[
                ['Nama Guru', booking.teacherName],
                ['Laboratorium', booking.labName],
                ['Tanggal', formatDate(booking.date)],
                ['Waktu', `${booking.startTime} - ${booking.endTime}`],
                ['Kelas', booking.className],
                ['Mata Pelajaran', booking.subject],
                ['Jumlah Siswa', `${booking.studentCount} siswa`],
                ['Tujuan Peminjaman', booking.purpose],
              ].map(([label, value]) => (
                <View key={label} style={styles.detailItem}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value}</Text>
                </View>
              ))}

              {booking.rejectionReason && (
                <View style={styles.rejectionInfo}>
                  <Text style={styles.label}>Alasan Penolakan</Text>
                  <Text style={styles.value}>
                    {booking.rejectionReason}
                  </Text>
                </View>
              )}

              {booking.status === 'Pending' && (
  <View style={styles.reasonContainer}>
    <Text style={styles.label}>Alasan Penolakan</Text>
    <TextInput
      style={styles.reasonInput}
      placeholder="Tuliskan alasan penolakan..."
      placeholderTextColor="#94A3B8"
      value={rejectionReason}
      onChangeText={setRejectionReason}
      multiline
      textAlignVertical="top"
    />
  </View>
)}

              {booking.status === 'Pending' && (
                <View style={styles.actions}>
                  <Pressable
                    style={styles.rejectButton}
                    onPress={submitRejection}
                  >
                    <Text style={styles.rejectText}>Tolak</Text>
                  </Pressable>

                  <Pressable
                    style={styles.approveButton}
                    onPress={() => onApprove(booking.id)}
                  >
                    <Text style={styles.approveText}>
                      Setujui Pengajuan
                    </Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 22,
    maxHeight: '85%',
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '700',
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bookingId: {
    color: '#223F91',
    fontWeight: '700',
    fontSize: 13,
  },
  detailItem: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 5,
  },
  value: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  rejectionInfo: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  rejectButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  rejectText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  approveButton: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#15803D',
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  reasonContainer: {
  marginTop: 16,
},

reasonInput: {
  borderWidth: 1,
  borderColor: '#CBD5E1',
  borderRadius: 10,
  padding: 12,
  minHeight: 90,
  fontSize: 13,
  color: '#1E293B',
  backgroundColor: '#FFFFFF',
},
});