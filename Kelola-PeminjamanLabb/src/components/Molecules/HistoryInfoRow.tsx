import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string;
};

export default function HistoryInfoRow({ label, value }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 13,
  },
  label: {
    fontSize: 12,
    color: '#8991A3',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#26334D',
    fontWeight: '600',
  },
});