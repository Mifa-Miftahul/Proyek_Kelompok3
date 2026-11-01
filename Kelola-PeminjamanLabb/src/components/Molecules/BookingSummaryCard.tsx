import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  count: number;
  label: string;
  color: string;
  background: string;
};

export default function BookingSummaryCard({
  icon,
  count,
  label,
  color,
  background,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: background }]}>
        <Ionicons name={icon} size={21} color={color} />
      </View>

      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  count: {
    color: '#1E293B',
    fontSize: 23,
    fontWeight: '700',
  },
  label: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 3,
  },
});