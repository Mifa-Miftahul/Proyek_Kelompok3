import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoNotice() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="information-circle-outline"
        size={21}
        color="#223F91"
      />

      <Text style={styles.text}>
        Pastikan jadwal dan laboratorium yang dipilih sesuai dengan
        kebutuhan praktikum. Pengajuan akan diperiksa oleh laboran.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  text: {
    flex: 1,
    color: '#1E40AF',
    fontSize: 11,
    lineHeight: 18,
  },
});