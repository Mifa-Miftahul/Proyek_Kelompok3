import React from 'react';
import { Text, StyleSheet } from 'react-native';

type Props = {
  message?: string;
};

export default function InputError({ message }: Props) {
  if (!message) return null;

  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 5,
  },
});