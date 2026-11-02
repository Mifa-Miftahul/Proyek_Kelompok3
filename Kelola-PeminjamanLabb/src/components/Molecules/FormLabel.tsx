import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  required?: boolean;
};

export default function FormLabel({
  label,
  required = false,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.required}>*</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 3,
  },
  label: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
  },
  required: {
    color: '#DC2626',
    fontSize: 13,
  },
});