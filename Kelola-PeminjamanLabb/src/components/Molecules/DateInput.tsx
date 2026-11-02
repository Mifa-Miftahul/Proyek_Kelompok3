import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormLabel from './FormLabel';
import InputError from './InputError';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function DateInput({ value, onChange, error }: Props) {
  return (
    <View style={styles.container}>
      <FormLabel label="Tanggal Peminjaman" required />

      <View style={[styles.inputWrapper, error && styles.errorBorder]}>
        <Ionicons name="calendar-outline" size={19} color="#64748B" />

        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />
      </View>

      <InputError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  errorBorder: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    color: '#1E293B',
    fontSize: 13,
  },
});