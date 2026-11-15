
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import LabDropdown, {
  Laboratory,
} from '../Molecules/LabDropdown';

import DateInput from '../Molecules/DateInput';
import TimeRangeInput from '../Molecules/TimeRangeInput';
import BookingTextInput from '../Molecules/BookingTextInput';

import { supabase } from '../../lib/supabase';

// ==================== TYPES ====================

export type BookingFormData = {
  lab: Laboratory | null;
  date: string;
  startTime: string;
  endTime: string;
  className: string;
  subject: string;
  studentCount: string;
  purpose: string;
};

type BookingErrors = {
  [key: string]: string;
};

type Props = {
  onSubmit: (data: BookingFormData) => void | Promise<void>;
};

// ==================== VALIDATION ====================

const isValidTime = (time: string) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

function validateBooking(data: BookingFormData): BookingErrors {
  const errors: BookingErrors = {};

  if (!data.lab) {
    errors.lab = 'Pilih laboratorium terlebih dahulu.';
  }

  if (!data.date) {
    errors.date = 'Tanggal peminjaman wajib diisi.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.date = 'Gunakan format YYYY-MM-DD.';
  } else {
    const [year, month, day] = data.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);

    const validDate =
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month - 1 &&
      selectedDate.getDate() === day;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!validDate) {
      errors.date = 'Tanggal tidak valid.';
    } else if (selectedDate < today) {
      errors.date = 'Tanggal tidak boleh sudah lewat.';
    }
  }

  if (!isValidTime(data.startTime)) {
    errors.time = 'Jam mulai harus menggunakan format HH:MM.';
  } else if (!isValidTime(data.endTime)) {
    errors.time = 'Jam selesai harus menggunakan format HH:MM.';
  } else if (data.startTime >= data.endTime) {
    errors.time = 'Jam selesai harus setelah jam mulai.';
  }

  if (!data.className.trim()) {
    errors.className = 'Kelas wajib diisi.';
  }

  if (!data.subject.trim()) {
    errors.subject = 'Mata pelajaran wajib diisi.';
  }

  const count = Number(data.studentCount);

  if (
    !data.studentCount ||
    !Number.isInteger(count) ||
    count < 1
  ) {
    errors.studentCount = 'Masukkan jumlah siswa yang valid.';
  } else if (data.lab && count > data.lab.capacity) {
    errors.studentCount =
      `Kapasitas laboratorium maksimal ${data.lab.capacity} siswa.`;
  }

  if (!data.purpose.trim()) {
    errors.purpose = 'Keperluan peminjaman wajib diisi.';
  }

  return errors;
}

// ==================== BOOKING FORM ====================

export default function BookingForm({ onSubmit }: Props) {
  const [lab, setLab] = useState<Laboratory | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [purpose, setPurpose] = useState('');

  const [errors, setErrors] = useState<BookingErrors>({});

  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==================== FETCH LABORATORIES ====================

  useEffect(() => {
    let mounted = true;

    async function fetchLaboratories() {
      try {
        const { data, error } = await supabase
          .from('laboratorium')
          .select('id_lab, nama_lab, kapasitas')
          .order('nama_lab', { ascending: true });

        if (error) {
          throw error;
        }

        if (mounted) {
          const mappedLabs: Laboratory[] = (data ?? []).map((item) => ({
            id: String(item.id_lab),
            name: item.nama_lab,
            capacity: Number(item.kapasitas),
          }));

          setLaboratories(mappedLabs);
        }
      } catch (error) {
        console.error('Gagal mengambil laboratorium:', error);

        if (mounted) {
          Alert.alert(
            'Gagal Memuat Laboratorium',
            'Daftar laboratorium tidak dapat dimuat. Silakan coba lagi.',
          );
        }
      } finally {
        if (mounted) {
          setLoadingLabs(false);
        }
      }
    }

    fetchLaboratories();

    return () => {
      mounted = false;
    };
  }, []);

  // ==================== HANDLE SUBMIT ====================

  const handleSubmit = async () => {
    if (submitting) return;

    if (loadingLabs) {
      Alert.alert(
        'Mohon Tunggu',
        'Daftar laboratorium masih dimuat.',
      );
      return;
    }

    if (laboratories.length === 0) {
      Alert.alert(
        'Laboratorium Tidak Tersedia',
        'Belum ada data laboratorium yang dapat dipilih.',
      );
      return;
    }

    const formData: BookingFormData = {
      lab,
      date,
      startTime,
      endTime,
      className,
      subject,
      studentCount,
      purpose,
    };

    const validationErrors = validateBooking(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert(
        'Periksa Kembali Formulir',
        'Masih ada data yang belum sesuai. Silakan periksa bagian yang ditandai.',
      );
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch {
      // Error sudah ditangani dan ditampilkan oleh halaman peminjaman.
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <View style={styles.container}>
      {loadingLabs ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#223F91" />
          <Text style={styles.loadingText}>
            Memuat daftar laboratorium...
          </Text>
        </View>
      ) : (
        <LabDropdown
          laboratories={laboratories}
          selectedLab={lab}
          onSelect={(value) => {
            setLab(value);
            setErrors((prev) => ({ ...prev, lab: '' }));

            const count = Number(studentCount);

            if (count > value.capacity) {
              setErrors((prev) => ({
                ...prev,
                studentCount:
                  `Kapasitas laboratorium maksimal ${value.capacity} siswa.`,
              }));
            } else {
              setErrors((prev) => ({
                ...prev,
                studentCount: '',
              }));
            }
          }}
          error={errors.lab}
        />
      )}

      <DateInput
        value={date}
        onChange={(value) => {
          setDate(value);
          setErrors((prev) => ({ ...prev, date: '' }));
        }}
        error={errors.date}
      />

      <TimeRangeInput
        startTime={startTime}
        endTime={endTime}
        onChangeStart={(value) => {
          setStartTime(value);
          setErrors((prev) => ({ ...prev, time: '' }));
        }}
        onChangeEnd={(value) => {
          setEndTime(value);
          setErrors((prev) => ({ ...prev, time: '' }));
        }}
        error={errors.time}
      />

      <BookingTextInput
        label="Kelas"
        required
        value={className}
        onChangeText={(value) => {
          setClassName(value);
          setErrors((prev) => ({ ...prev, className: '' }));
        }}
        placeholder="Contoh: XI TKJ 1"
        error={errors.className}
      />

      <BookingTextInput
        label="Mata Pelajaran"
        required
        value={subject}
        onChangeText={(value) => {
          setSubject(value);
          setErrors((prev) => ({ ...prev, subject: '' }));
        }}
        placeholder="Contoh: Administrasi Sistem Jaringan"
        error={errors.subject}
      />

      <BookingTextInput
        label="Jumlah Siswa"
        required
        value={studentCount}
        onChangeText={(value) => {
          const numericValue = value.replace(/[^0-9]/g, '');
          setStudentCount(numericValue);

          const count = Number(numericValue);

          if (
            numericValue &&
            lab &&
            count > lab.capacity
          ) {
            setErrors((prev) => ({
              ...prev,
              studentCount:
                `Kapasitas laboratorium maksimal ${lab.capacity} siswa.`,
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              studentCount: '',
            }));
          }
        }}
        placeholder="Masukkan jumlah siswa"
        keyboardType="numeric"
        error={errors.studentCount}
      />

      <BookingTextInput
        label="Keperluan Peminjaman"
        required
        value={purpose}
        onChangeText={(value) => {
          setPurpose(value);
          setErrors((prev) => ({ ...prev, purpose: '' }));
        }}
        placeholder="Jelaskan keperluan penggunaan laboratorium..."
        multiline
        numberOfLines={4}
        error={errors.purpose}
      />

      <View style={styles.note}>
        <Text style={styles.noteText}>
          Pastikan seluruh informasi sudah benar sebelum mengirim pengajuan.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.pressed,
          (submitting || loadingLabs || laboratories.length === 0) &&
            styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={
          submitting ||
          loadingLabs ||
          laboratories.length === 0
        }
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.submitText}>
              Kirim Pengajuan
            </Text>
            <Text style={styles.submitIcon}>→</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  loadingContainer: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 12,
  },
  note: {
    backgroundColor: '#F8FAFC',
    padding: 11,
    borderRadius: 9,
    marginBottom: 16,
  },
  noteText: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 17,
  },
  submitButton: {
    minHeight: 48,
    backgroundColor: '#223F91',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  submitIcon: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
