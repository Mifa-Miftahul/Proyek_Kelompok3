import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  BookingRequest,
} from '@/constants/bookingData';

import BookingStatusBadge from '@/components/Molecules/BookingStatusBadge';
import BookingInfoRow from '@/components/Molecules/BookingInfoRow';

type Props = {
  booking: BookingRequest;
  onDetail: (booking: BookingRequest) => void;
  onApprove: (id: string) => void;
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

export default function BookingCard({
  booking,
  onDetail,
  onApprove,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.idWrap}>
          <Text style={styles.id}>{booking.id}</Text>
          <Text style={styles.date}>{formatDate(booking.date)}</Text>
        </View>

        <BookingStatusBadge status={booking.status} />
      </View>

      <View style={styles.divider} />

      <Text style={styles.teacher}>{booking.teacherName}</Text>
      <Text style={styles.lab}>{booking.labName}</Text>

      <BookingInfoRow
        icon="time-outline"
        text={`${booking.startTime} - ${booking.endTime}`}
      />

      <BookingInfoRow
        icon="people-outline"
        text={`${booking.className} • ${booking.studentCount} siswa`}
      />

      <View style={styles.actions}>
        <Pressable
          style={styles.detailButton}
          onPress={() => onDetail(booking)}
        >
          <Ionicons name="eye-outline" size={17} color="#223F91" />
          <Text style={styles.detailText}>Lihat Detail</Text>
        </Pressable>

        {booking.status === 'Pending' && (
          <View style={styles.actionGroup}>
            <Pressable
  style={styles.rejectButton}
  onPress={() => onDetail(booking)}
>
              <Ionicons name="close" size={18} color="#DC2626" />
            </Pressable>

            <Pressable
              style={styles.approveButton}
              onPress={() => onApprove(booking.id)}
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              <Text style={styles.approveText}>Setujui</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 10px rgba(15, 23, 42, 0.05)',
      },
      default: {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  idWrap: {
    flex: 1,
  },
  id: {
    color: '#223F91',
    fontSize: 12,
    fontWeight: '700',
  },
  date: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 13,
  },
  teacher: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  lab: {
    color: '#223F91',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 12,
    paddingTop: 12,
    gap: 8,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  detailText: {
    color: '#223F91',
    fontSize: 12,
    fontWeight: '700',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7F7',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#15803D',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});