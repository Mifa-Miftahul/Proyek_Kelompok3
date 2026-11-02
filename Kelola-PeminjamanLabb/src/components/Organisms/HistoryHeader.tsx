import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HistoryHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Peminjaman</Text>
      <Text style={styles.subtitle}>
        Pantau seluruh riwayat pengajuan peminjaman laboratorium.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#223F91',
  },
  subtitle: {
    fontSize: 12,
    color: '#7B8498',
    lineHeight: 18,
    marginTop: 5,
  },
});