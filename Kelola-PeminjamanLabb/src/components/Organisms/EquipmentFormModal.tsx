import React, { useEffect, useState } from 'react';

import type { Equipment } from '../Molecules/EquipmentRow';
import FormModal from '../Molecules/FormModal';
import FormField from '../Molecules/FormField';

export type EquipmentInput = {
  nama: string;
  jumlah: number;
};

type EquipmentFormModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  labName: string;
  initial: Equipment | null;
  // Perangkat lain di lab yang sama (cek nama ganda)
  existing: Equipment[];
  onClose: () => void;
  onSubmit: (input: EquipmentInput) => void;
};

type Errors = Partial<Record<'nama' | 'jumlah', string>>;

// Form "Tambah/Edit Perangkat: Nama Perangkat, Jumlah".
export default function EquipmentFormModal({
  visible,
  mode,
  labName,
  initial,
  existing,
  onClose,
  onSubmit,
}: EquipmentFormModalProps) {
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!visible) return;
    setNama(initial?.nama ?? '');
    setJumlah(initial ? String(initial.jumlah) : '');
    setErrors({});
  }, [visible, initial]);

  const validate = () => {
    const next: Errors = {};

    if (!nama.trim()) {
      next.nama = 'Nama perangkat wajib diisi';
    } else if (
      existing.some(
        (item) =>
          item.id !== initial?.id &&
          item.nama.toLowerCase() === nama.trim().toLowerCase(),
      )
    ) {
      next.nama = 'Perangkat ini sudah ada di lab';
    }

    if (!/^\d+$/.test(jumlah.trim()) || Number(jumlah) < 1) {
      next.jumlah = 'Jumlah harus berupa angka minimal 1';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ nama: nama.trim(), jumlah: Number(jumlah) });
  };

  return (
    <FormModal
      visible={visible}
      title={mode === 'add' ? 'Tambah Perangkat' : 'Edit Perangkat'}
      subtitle={labName}
      submitLabel={mode === 'add' ? 'Tambah Perangkat' : 'Simpan Perubahan'}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField
        label="Nama Perangkat"
        icon="hardware-chip-outline"
        placeholder="Contoh: Komputer"
        value={nama}
        onChangeText={(v) => {
          setNama(v);
          setErrors((prev) => ({ ...prev, nama: undefined }));
        }}
        error={errors.nama}
        autoCapitalize="words"
      />

      <FormField
        label="Jumlah"
        icon="layers-outline"
        placeholder="Contoh: 30"
        value={jumlah}
        onChangeText={(v) => {
          setJumlah(v);
          setErrors((prev) => ({ ...prev, jumlah: undefined }));
        }}
        error={errors.jumlah}
        keyboardType="number-pad"
      />
    </FormModal>
  );
}
