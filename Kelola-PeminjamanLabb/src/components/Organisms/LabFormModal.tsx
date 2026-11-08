
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

import type { Equipment } from '../Molecules/EquipmentRow';
import type { LabIcon, LabStatus } from '../Molecules/LaboranLabCard';
import FormModal from '../Molecules/FormModal';
import FormField from '../Molecules/FormField';
import ChipSelector from '../Molecules/ChipSelector';

const COLORS = {
  text: '#1E293B',
};

export type Lab = {
  id: string;
  name: string;
  laboran: string;
  room: string;
  kapasitas: number;
  status: LabStatus;
  icon: LabIcon;
  perangkat: Equipment[];
};

export type LabInput = {
  name: string;
  laboran: string;
  room: string;
  kapasitas: number;
  status: LabStatus;
};

type LabFormModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  initial: Lab | null;
  allLabs: Lab[];
  onClose: () => void;
  onSubmit: (input: LabInput) => void;
};

type Errors = Partial<
  Record<'name' | 'laboran' | 'room' | 'kapasitas', string>
>;

const STATUS_OPTIONS: readonly LabStatus[] = [
  'Tersedia',
  'Dipakai',
];

export default function LabFormModal({
  visible,
  mode,
  initial,
  allLabs,
  onClose,
  onSubmit,
}: LabFormModalProps) {
  const [name, setName] = useState('');
  const [laboran, setLaboran] = useState('');
  const [room, setRoom] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [status, setStatus] = useState<LabStatus>('Tersedia');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!visible) return;

    setName(initial?.name ?? '');
    setLaboran(initial?.laboran ?? '');
    setRoom(initial?.room ?? '');
    setKapasitas(
      initial?.kapasitas != null
        ? String(initial.kapasitas)
        : ''
    );

    setStatus(initial?.status ?? 'Tersedia');
    setErrors({});
  }, [visible, initial]);

  const clearError = (key: keyof Errors) => {
    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const validate = () => {
    const next: Errors = {};

    const others = allLabs.filter(
      (lab) => lab.id !== initial?.id
    );

    if (!name.trim()) {
      next.name = 'Nama lab wajib diisi';
    } else if (
      others.some(
        (lab) =>
          lab.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      next.name = 'Nama lab sudah digunakan';
    }

    if (!laboran.trim()) {
      next.laboran = 'Laboran wajib diisi';
    }

    if (!room.trim()) {
      next.room = 'Ruangan wajib diisi';
    } else if (
      others.some(
        (lab) =>
          lab.room.toLowerCase() === room.trim().toLowerCase()
      )
    ) {
      next.room = 'Ruangan sudah dipakai lab lain';
    }

    const capacityNumber = Number(kapasitas);

    if (!kapasitas.trim()) {
      next.kapasitas = 'Kapasitas wajib diisi';
    } else if (
      !Number.isInteger(capacityNumber) ||
      capacityNumber <= 0
    ) {
      next.kapasitas =
        'Kapasitas harus berupa angka lebih dari 0';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      laboran: laboran.trim(),
      room: room.trim(),
      kapasitas: Number(kapasitas),
      status,
    });
  };

  return (
    <FormModal
      visible={visible}
      title={mode === 'add' ? 'Tambah Lab' : 'Edit Lab'}
      subtitle="Nama lab, laboran, ruangan, kapasitas, dan status"
      submitLabel={
        mode === 'add' ? 'Tambah Lab' : 'Simpan Perubahan'
      }
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField
        label="Nama Lab"
        icon="business-outline"
        placeholder="Contoh: Lab Multimedia"
        value={name}
        onChangeText={(v) => {
          setName(v);
          clearError('name');
        }}
        error={errors.name}
        autoCapitalize="words"
      />

      <FormField
        label="Laboran Penanggung Jawab"
        icon="person-outline"
        placeholder="Contoh: Andi Setiawan, S.Kom."
        value={laboran}
        onChangeText={(v) => {
          setLaboran(v);
          clearError('laboran');
        }}
        error={errors.laboran}
        autoCapitalize="words"
      />

      <FormField
        label="Ruangan"
        icon="location-outline"
        placeholder="Contoh: Ruang Lab 4"
        value={room}
        onChangeText={(v) => {
          setRoom(v);
          clearError('room');
        }}
        error={errors.room}
        autoCapitalize="words"
      />

      <FormField
        label="Kapasitas Laboratorium"
        icon="people-outline"
        placeholder="Contoh: 36 siswa"
        value={kapasitas}
        onChangeText={(v) => {
          setKapasitas(v.replace(/[^0-9]/g, ''));
          clearError('kapasitas');
        }}
        error={errors.kapasitas}
      />

      <Text style={styles.label}>Status</Text>

      <ChipSelector
        wrap
        options={STATUS_OPTIONS}
        value={status}
        onChange={(v) => setStatus(v as LabStatus)}
      />
    </FormModal>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
});