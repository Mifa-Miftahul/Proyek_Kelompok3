import { FlatList, Text, StyleSheet } from 'react-native';
import ScheduleCard from '../Molecules/ScheduleCard';

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
  schedules: Schedule[];
  selectedDay: string;
};

export default function ScheduleList({ schedules, selectedDay }: Props) {
  if (schedules.length === 0) {
    return (
      <Text style={styles.empty}>
        Belum ada jadwal untuk hari {selectedDay}.
      </Text>
    );
  }

  return (
    <FlatList
      data={schedules}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ScheduleCard schedule={item} />}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center',
    color: '#64748B',
    paddingVertical: 24,
    fontSize: 13,
  },
});