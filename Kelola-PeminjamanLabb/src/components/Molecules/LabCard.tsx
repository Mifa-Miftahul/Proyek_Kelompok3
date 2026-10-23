import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Lab = {
  id: string;
  name: string;
  room: string;
  capacity: number;
  icon: 'monitor' | 'lan' | 'access-point';
  description: string;
};

type Props = {
  lab: Lab;
  isSelected: boolean;
  onPress: () => void;
};

export default function LabCard({ lab, isSelected, onPress }: Props) {
  const color = isSelected ? '#FFFFFF' : '#223F91';

  const renderIcon = () => {
    switch (lab.icon) {
      case 'monitor':
        return <MaterialCommunityIcons name="monitor" size={27} color={color} />;
      case 'lan':
        return <MaterialCommunityIcons name="lan" size={27} color={color} />;
      case 'access-point':
        return <MaterialCommunityIcons name="access-point" size={27} color={color} />;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      <View style={[styles.iconBox, isSelected && styles.selectedIconBox]}>
        {renderIcon()}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, isSelected && styles.selectedText]}>
          {lab.name}
        </Text>

        <Text style={[styles.description, isSelected && styles.selectedText]}>
          {lab.description}
        </Text>

        <View style={styles.info}>
          <Ionicons name="location-outline" size={14} color={color} />
          <Text style={[styles.capacity, isSelected && styles.selectedText]}>
            {lab.room} · {lab.capacity} orang
          </Text>
        </View>
      </View>

      <Ionicons
        name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
        size={22}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  selectedCard: {
    backgroundColor: '#223F91',
    borderColor: '#223F91',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DCEBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: { flex: 1 },
  name: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  description: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 7,
  },
  info: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  capacity: { color: '#64748B', fontSize: 11 },
  selectedText: { color: '#FFFFFF' },
});