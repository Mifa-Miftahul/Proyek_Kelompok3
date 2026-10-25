import { View, Text, StyleSheet } from 'react-native';

type Props = {
  status: 'Berlangsung' | 'Terjadwal';
};

export default function StatusBadge({ status }: Props) {
  const isOngoing = status === 'Berlangsung';

  return (
    <View style={[styles.badge, isOngoing ? styles.ongoing : styles.scheduled]}>
      <Text style={[styles.text, isOngoing ? styles.ongoingText : styles.scheduledText]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ongoing: { backgroundColor: '#D1FAE5' },
  scheduled: { backgroundColor: '#DCEBFF' },
  text: { fontSize: 10, fontWeight: '700' },
  ongoingText: { color: '#059669' },
  scheduledText: { color: '#223F91' },
});