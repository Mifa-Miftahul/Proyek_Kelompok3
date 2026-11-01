import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  value: number;
  icon: string;
  color: string;
  backgroundColor: string;
};

export default function HistorySummaryCard({
  title,
  value,
  icon,
  color,
  backgroundColor,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 112,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  value: {
    fontSize: 21,
    fontWeight: '800',
    color: '#223F91',
  },
  title: {
    fontSize: 11,
    color: '#7B8498',
    marginTop: 3,
  },
});