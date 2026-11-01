import React from 'react';
import { View, StyleSheet } from 'react-native';

import ActionButton from './ActionButton';

type RowActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

// Pasangan tombol Edit + Hapus untuk baris data (jadwal, perangkat, akun guru).
export default function RowActions({ onEdit, onDelete }: RowActionsProps) {
  return (
    <View style={styles.row}>
      <ActionButton
        label="Edit"
        icon="create-outline"
        variant="secondary"
        small
        onPress={onEdit}
      />
      <ActionButton
        label="Hapus"
        icon="trash-outline"
        variant="dangerSoft"
        small
        onPress={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
