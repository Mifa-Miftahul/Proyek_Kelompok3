import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

import type { Schedule } from '../Molecules/LaboranScheduleCard';
import FormModal from '../Molecules/FormModal';
import FormField from '../Molecules/FormField';
import ChipSelector from '../Molecules/ChipSelector';

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
  background: '#F5F7FB',
  white: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  placeholder: '#94A3B8',
  border: '#E2E8F0',
  divider: '#EDF1F7',
  green: '#059669',
  paleGreen: '#D1FAE5',
  red: '#DC2626',
  paleRed: '#FEE2E2',
};


export const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;

export type ScheduleInput = {
  day: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  className: string;
};

type ScheduleFormModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  labName: string;
  initial: Schedule | null;
  // Jadwal lab yang sama, dipakai untuk cek bentrok jam
  existing: Schedule[];
  onClose: () => void;
  onSubmit: (input: ScheduleInput) => void;
};

type Errors = Partial<
  Record<'subject' | 'className' | 'teacher' | 'day' | 'date' | 'start' | 'end', string>
>;

const TIME_RE = /^([01]?\d|2[0-3])[.:]([0-5]\d)$/;

const toMinutes = (value: string) => {
  const match = TIME_RE.exec(value.trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}.${String(
    minutes % 60,
  ).padStart(2, '0')}`;

const splitTime = (time: string) => {
  const [start = '', end = ''] = time.split(' - ');
  return { start, end };
};

export default function ScheduleFormModal({
  visible,
  mode,
  labName,
  initial,
  existing,
  onClose,
  onSubmit,
}: ScheduleFormModalProps) {
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  // Isi ulang form setiap kali dibuka
  useEffect(() => {
    if (!visible) return;
    const time = splitTime(initial?.time ?? '');
    setSubject(initial?.subject ?? '');
    setClassName(initial?.className ?? '');
    setTeacher(initial?.teacher ?? '');
    setDay(initial?.day ?? '');
    setDate(initial?.date ?? '');
    setStart(time.start);
    setEnd(time.end);
    setErrors({});
  }, [visible, initial]);

  const clearError = (key: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  // Kotak "Data Valid?" pada flowchart
  const validate = () => {
    const next: Errors = {};

    if (!subject.trim()) next.subject = 'Mata pelajaran wajib diisi';
    if (!className.trim()) next.className = 'Kelas wajib diisi';
    if (!teacher.trim()) next.teacher = 'Nama guru wajib diisi';
    if (!day) next.day = 'Pilih hari terlebih dahulu';
    if (!date.trim()) next.date = 'Tanggal wajib diisi';

    const startMin = toMinutes(start);
    const endMin = toMinutes(end);

    if (startMin === null) next.start = 'Format jam salah (contoh 07.30)';
    if (endMin === null) next.end = 'Format jam salah (contoh 10.00)';

    if (startMin !== null && endMin !== null) {
      if (endMin <= startMin) {
        next.end = 'Jam selesai harus setelah jam mulai';
      } else {
        const clash = existing.find((item) => {
          if (item.id === initial?.id) return false;
          if (item.date.trim().toLowerCase() !== date.trim().toLowerCase()) {
            return false;
          }
          const other = splitTime(item.time);
          const otherStart = toMinutes(other.start);
          const otherEnd = toMinutes(other.end);
          if (otherStart === null || otherEnd === null) return false;
          return startMin < otherEnd && endMin > otherStart;
        });

        if (clash) {
          next.start = `Bentrok dengan "${clash.subject}" (${clash.time})`;
        }
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0 && startMin !== null && endMin !== null;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      subject: subject.trim(),
      className: className.trim(),
      teacher: teacher.trim(),
      day,
      date: date.trim(),
      time: `${formatTime(toMinutes(start) as number)} - ${formatTime(
        toMinutes(end) as number,
      )}`,
    });
  };

  return (
    <FormModal
      visible={visible}
      title={mode === 'add' ? 'Tambah Jadwal' : 'Edit Jadwal'}
      subtitle={labName}
      submitLabel={mode === 'add' ? 'Tambah Jadwal' : 'Simpan Perubahan'}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField
        label="Mata Pelajaran"
        icon="book-outline"
        placeholder="Contoh: Praktikum Pemrograman"
        value={subject}
        onChangeText={(v) => {
          setSubject(v);
          clearError('subject');
        }}
        error={errors.subject}
      />

      <FormField
        label="Kelas"
        icon="people-outline"
        placeholder="Contoh: X RPL 1"
        value={className}
        onChangeText={(v) => {
          setClassName(v);
          clearError('className');
        }}
        error={errors.className}
        autoCapitalize="characters"
      />

      <FormField
        label="Guru Pengampu"
        icon="person-outline"
        placeholder="Nama guru"
        value={teacher}
        onChangeText={(v) => {
          setTeacher(v);
          clearError('teacher');
        }}
        error={errors.teacher}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Hari</Text>
      <ChipSelector
        wrap
        options={DAYS}
        value={day}
        onChange={(v) => {
          setDay(v);
          clearError('day');
        }}
      />
      {!!errors.day && <Text style={styles.error}>{errors.day}</Text>}

      <FormField
        label="Tanggal"
        icon="calendar-outline"
        placeholder="Contoh: 19 Oktober 2026"
        value={date}
        onChangeText={(v) => {
          setDate(v);
          clearError('date');
        }}
        error={errors.date}
      />

      <FormField
        label="Jam Mulai"
        icon="time-outline"
        placeholder="07.30"
        value={start}
        onChangeText={(v) => {
          setStart(v);
          clearError('start');
        }}
        error={errors.start}
        keyboardType="numbers-and-punctuation"
      />

      <FormField
        label="Jam Selesai"
        icon="time-outline"
        placeholder="10.00"
        value={end}
        onChangeText={(v) => {
          setEnd(v);
          clearError('end');
        }}
        error={errors.end}
        keyboardType="numbers-and-punctuation"
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
  error: {
    color: COLORS.red,
    fontSize: 11,
    marginTop: 6,
    marginBottom: 16,
  },
});
