import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BookingRequest } from '../../constants/bookingData';
import HistoryStatusBadge from '../Molecules/HistoryStatusBadge';

type Props = {
  booking: BookingRequest;
  onPress: () => void;
};

export default function HistoryCard({ booking, onPress }: Props) {
  const formattedDate = new Date(
    `${booking.date}T00:00:00`,
  ).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.id}>{booking.id}</Text>
        <HistoryStatusBadge status={booking.status} />
      </View>

      <Text style={styles.labName}>{booking.labName}</Text>
      <Text style={styles.teacher}>{booking.teacherName}</Text>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Tanggal</Text>
        <Text style={styles.infoValue}>{formattedDate}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Waktu</Text>
        <Text style={styles.infoValue}>
          {booking.startTime} - {booking.endTime}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.className}>{booking.className}</Text>
        <Text style={styles.detail}>Lihat detail ›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  id: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8991A3',
  },
  labName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#26334D',
    marginTop: 12,
  },
  teacher: {
    fontSize: 12,
    color: '#7B8498',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF0F5',
    marginVertical: 13,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8991A3',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#35415B',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  className: {
    fontSize: 11,
    fontWeight: '700',
    color: '#223F91',
    backgroundColor: '#E8EDFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },
  detail: {
    fontSize: 11,
    fontWeight: '700',
    color: '#223F91',
  },
});