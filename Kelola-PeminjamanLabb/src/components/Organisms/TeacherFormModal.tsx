import React, { useEffect, useState } from 'react';

import type { Teacher } from '../Molecules/TeacherCard';
import FormModal from '../Molecules/FormModal';
import FormField from '../Molecules/FormField';

export type TeacherInput = {
  nama: string;
  nip: string;
  password: string;
};

type TeacherFormModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  initial: Teacher | null;
  allTeachers: Teacher[];
  onClose: () => void;
  onSubmit: (input: TeacherInput) => void;
};

type Errors = Partial<Record<'nama' | 'nip' | 'password', string>>;

// Form "Input Data Guru / Ubah Data Guru (Nama, NIP, Password)" + "Data Valid?".
export default function TeacherFormModal({
  visible,
  mode,
  initial,
  allTeachers,
  onClose,
  onSubmit,
}: TeacherFormModalProps) {
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!visible) return;
    setNama(initial?.nama ?? '');
    setNip(initial?.nip ?? '');
    setPassword(initial?.password ?? '');
    setErrors({});
  }, [visible, initial]);

  const clearError = (key: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const validate = () => {
    const next: Errors = {};

    if (!nama.trim()) next.nama = 'Nama guru wajib diisi';

    if (!nip.trim()) {
      next.nip = 'NIP wajib diisi';
    } else if (!/^\d{8,18}$/.test(nip.trim())) {
      next.nip = 'NIP harus berupa angka, 8 sampai 18 digit';
    } else if (
      allTeachers.some(
        (item) => item.id !== initial?.id && item.nip === nip.trim(),
      )
    ) {
      next.nip = 'NIP sudah terdaftar';
    }

    if (!password) {
      next.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      next.password = 'Password minimal 6 karakter';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ nama: nama.trim(), nip: nip.trim(), password });
  };

  return (
    <FormModal
      visible={visible}
      title={mode === 'add' ? 'Tambah Akun Guru' : 'Edit Akun Guru'}
      subtitle="Nama, NIP, dan password"
      submitLabel={mode === 'add' ? 'Simpan Akun' : 'Simpan Perubahan'}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField
        label="Nama Guru"
        icon="person-outline"
        placeholder="Nama lengkap"
        value={nama}
        onChangeText={(v) => {
          setNama(v);
          clearError('nama');
        }}
        error={errors.nama}
        autoCapitalize="words"
      />

      <FormField
        label="NIP"
        icon="card-outline"
        placeholder="Nomor Induk Pegawai"
        value={nip}
        onChangeText={(v) => {
          setNip(v);
          clearError('nip');
        }}
        error={errors.nip}
        keyboardType="number-pad"
        autoCapitalize="none"
      />

      <FormField
        label="Password"
        icon="lock-closed-outline"
        placeholder="Minimal 6 karakter"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          clearError('password');
        }}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
      />
    </FormModal>
  );
}
