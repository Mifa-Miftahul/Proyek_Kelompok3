import { useEffect, useState } from "react";

import FormField from "../Molecules/FormField";
import FormModal from "../Molecules/FormModal";
import type { Teacher } from "../Molecules/TeacherCard";

export type TeacherInput = {
  nama: string;
  nip: string;
  email: string;
  password: string;
};

type TeacherFormModalProps = {
  visible: boolean;
  mode: "add" | "edit";
  initial: Teacher | null;
  allTeachers: Teacher[];
  onClose: () => void;
  onSubmit: (input: TeacherInput) => void;
};

type Errors = Partial<
  Record<"nama" | "nip" | "email" | "password", string>
>;

export default function TeacherFormModal({
  visible,
  mode,
  initial,
  allTeachers,
  onClose,
  onSubmit,
}: TeacherFormModalProps) {
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!visible) return;

    setNama(initial?.nama ?? "");
    setNip(initial?.nip ?? "");
    setEmail(initial?.email ?? "");
    setPassword("");
    setErrors({});
  }, [visible, initial]);

  const clearError = (key: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const validate = () => {
    const next: Errors = {};
    const normalizedEmail = email.trim().toLowerCase();

    if (!nama.trim()) {
      next.nama = "Nama guru wajib diisi";
    } else if (nama.trim().length < 2 || nama.trim().length > 100) {
      next.nama = "Nama harus terdiri dari 2 sampai 100 karakter";
    }

    if (!nip.trim()) {
      next.nip = "NIP wajib diisi";
    } else if (!/^\d{8,18}$/.test(nip.trim())) {
      next.nip = "NIP harus berupa angka, 8 sampai 18 digit";
    } else if (
      allTeachers.some(
        (item) => item.id !== initial?.id && item.nip === nip.trim(),
      )
    ) {
      next.nip = "NIP sudah terdaftar";
    }

    if (!normalizedEmail) {
      next.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      next.email = "Format email tidak valid";
    } else if (
      allTeachers.some(
        (item) =>
          item.id !== initial?.id &&
          item.email?.toLowerCase() === normalizedEmail,
      )
    ) {
      next.email = "Email sudah terdaftar";
    }

    if (mode === "add" && !password) {
      next.password = "Password wajib diisi";
    } else if (password && password.length < 8) {
      next.password = "Password minimal 8 karakter";
    } else if (password.length > 128) {
      next.password = "Password maksimal 128 karakter";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      nama: nama.trim(),
      nip: nip.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  };

  return (
    <FormModal
      visible={visible}
      title={mode === "add" ? "Tambah Akun Guru" : "Edit Akun Guru"}
      subtitle="Nama, NIP, email, dan password"
      submitLabel={mode === "add" ? "Simpan Akun" : "Simpan Perubahan"}
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
          clearError("nama");
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
          clearError("nip");
        }}
        error={errors.nip}
        keyboardType="number-pad"
        autoCapitalize="none"
      />

      <FormField
        label="Email Google"
        icon="mail-outline"
        placeholder="nama@gmail.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          clearError("email");
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FormField
        label="Password"
        icon="lock-closed-outline"
        placeholder={
          mode === "add"
            ? "Minimal 8 karakter"
            : "Kosongkan jika tidak ingin mengubah"
        }
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          clearError("password");
        }}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
      />
    </FormModal>
  );
}
