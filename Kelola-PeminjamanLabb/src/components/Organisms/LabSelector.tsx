import { View, Text, StyleSheet } from 'react-native';
import LabCard from '../Molecules/LabCard';

type Lab = {
  id: 'LAB-001' | 'LAB-002' | 'LAB-003';
  name: string;
  location: string;
  room: string;
  capacity: number;
  icon: 'monitor' | 'lan' | 'access-point';
  description: string;
};

type Props = {
  laboratories: Lab[];
  selectedLabId: string;
  onSelectLab: (lab: Lab) => void;
};

export default function LabSelector({
  laboratories,
  selectedLabId,
  onSelectLab,
}: Props) {
  return (
    <View style={styles.container}>

      {laboratories.map((lab) => (
        <LabCard
          key={lab.id}
          lab={lab}
          isSelected={selectedLabId === lab.id}
          onPress={() => onSelectLab(lab)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 14,
  },
});