import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormLabel from './FormLabel';
import InputError from './InputError';

export type Laboratory = {
  id: string;
  name: string;
  capacity: number;
};

type Props = {
  laboratories: Laboratory[];
  selectedLab: Laboratory | null;
  onSelect: (lab: Laboratory) => void;
  error?: string;
};

export default function LabDropdown({
  laboratories,
  selectedLab,
  onSelect,
  error,
}: Props) {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <FormLabel label="Laboratorium" required />

      <Pressable
        style={[styles.trigger, error && styles.errorBorder]}
        onPress={() => setVisible(!visible)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.selectedText}>
            {selectedLab?.name || 'Pilih laboratorium'}
          </Text>
          {selectedLab && (
            <Text style={styles.capacity}>
              Kapasitas maksimal {selectedLab.capacity} siswa
            </Text>
          )}
        </View>

        <Ionicons
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#64748B"
        />
      </Pressable>

      {visible && (
        <View style={styles.dropdown}>
          {laboratories.map((lab) => (
            <Pressable
              key={lab.id}
              style={styles.option}
              onPress={() => {
                onSelect(lab);
                setVisible(false);
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.optionName}>{lab.name}</Text>
                <Text style={styles.capacity}>
                  {lab.id} • Kapasitas {lab.capacity} siswa
                </Text>
              </View>

              {selectedLab?.id === lab.id && (
                <Ionicons name="checkmark-circle" size={20} color="#223F91" />
              )}
            </Pressable>
          ))}
        </View>
      )}

      <InputError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 5,
  },
  trigger: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBorder: {
    borderColor: '#DC2626',
  },
  selectedText: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '500',
  },
  capacity: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 4,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionName: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '600',
  },
});