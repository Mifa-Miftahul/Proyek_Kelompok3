import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import FormLabel from './FormLabel';
import InputError from './InputError';

type Props = {
  startTime: string;
  endTime: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  error?: string;
};

export default function TimeRangeInput({
  startTime,
  endTime,
  onChangeStart,
  onChangeEnd,
  error,
}: Props) {
  return (
    <View style={styles.container}>
      <FormLabel label="Waktu Peminjaman" required />

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.caption}>Mulai</Text>
          <TextInput
            value={startTime}
            onChangeText={onChangeStart}
            placeholder="08:00"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <Text style={styles.separator}>-</Text>

        <View style={styles.field}>
          <Text style={styles.caption}>Selesai</Text>
          <TextInput
            value={endTime}
            onChangeText={onChangeEnd}
            placeholder="10:00"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>
      </View>

      <InputError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  field: {
    flex: 1,
  },
  caption: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#1E293B',
    fontSize: 13,
  },
  separator: {
    color: '#64748B',
    marginTop: 19,
  },
});