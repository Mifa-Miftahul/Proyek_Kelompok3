import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';

type Schedule = {
  id: string;
  day: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  className: string;
  status: 'Berlangsung' | 'Terjadwal';
};

type Props = {
  schedule: Schedule;
};

export default function ScheduleCard({ schedule }: Props) {
  const isOngoing = schedule.status === 'Berlangsung';

  return (
    <View style={styles.card}>
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={20} color="#223F91" />
        <Text style={styles.time}>{schedule.time}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subject}>{schedule.subject}</Text>
          <StatusBadge status={schedule.status} />
        </View>

        <Text style={styles.className}>{schedule.className}</Text>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={15} color="#64748B" />
          <Text style={styles.detailText}>{schedule.teacher}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={15} color="#64748B" />
          <Text style={styles.detailText}>
            {schedule.day}, {schedule.date}
          </Text>
        </View>

        {isOngoing && (
          <View style={styles.ongoing}>
            <View style={styles.dot} />
            <Text style={styles.ongoingText}>
              Praktikum sedang berlangsung
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 15,
    marginBottom: 13,
  },
  timeContainer: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 9,
  },
  time: {
    color: '#223F91',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 8,
  },
  divider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginRight: 13,
  },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 9,
  },
  subject: {
    flex: 1,
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  className: {
    color: '#223F91',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 9,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 7,
  },
  detailText: { color: '#64748B', fontSize: 11, flexShrink: 1 },
  ongoing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  ongoingText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '600',
    flexShrink: 1,
  },
});