import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import LabDropdown, {
  Laboratory,
} from '../Molecules/LabDropdown';

import DateInput from '../Molecules/DateInput';
import TimeRangeInput from '../Molecules/TimeRangeInput';
import BookingTextInput from '../Molecules/BookingTextInput';

import {
  LABORATORIES,
  BOOKED_SLOTS,
} from '../../constants/bookingData';

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
  onSubmit: (data: BookingFormData) => void;
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
    const selectedDate = new Date(`${data.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime())) {
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

  // Cek bentrok dengan jadwal dummy
  if (
    data.lab &&
    data.date &&
    isValidTime(data.startTime) &&
    isValidTime(data.endTime) &&
    data.startTime < data.endTime
  ) {
    const conflict = BOOKED_SLOTS.some((slot) => {
      if (
        slot.labId !== data.lab?.id ||
        slot.date !== data.date
      ) {
        return false;
      }

      return (
        data.startTime < slot.endTime &&
        data.endTime > slot.startTime
      );
    });

    if (conflict) {
      errors.time =
        'Jadwal laboratorium sudah terisi pada waktu tersebut.';
    }
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


const handleSubmit = () => {
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

  onSubmit(formData);
};


  return (
    <View style={styles.container}>
      <LabDropdown
        laboratories={LABORATORIES}
        selectedLab={lab}
        onSelect={(value) => {
          setLab(value);
          setErrors((prev) => ({ ...prev, lab: '' }));
        }}
        error={errors.lab}
      />

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
        onChangeText={setClassName}
        placeholder="Contoh: XI TKJ 1"
        error={errors.className}
      />

      <BookingTextInput
        label="Mata Pelajaran"
        required
        value={subject}
        onChangeText={setSubject}
        placeholder="Contoh: Administrasi Sistem Jaringan"
        error={errors.subject}
      />

      <BookingTextInput
        label="Jumlah Siswa"
        required
        value={studentCount}
        onChangeText={(value) =>
          setStudentCount(value.replace(/[^0-9]/g, ''))
        }
        placeholder="Masukkan jumlah siswa"
        keyboardType="numeric"
        error={errors.studentCount}
      />

      <BookingTextInput
        label="Keperluan Peminjaman"
        required
        value={purpose}
        onChangeText={setPurpose}
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
  ]}
  onPress={handleSubmit}
>
        <Text style={styles.submitText}>Kirim Pengajuan</Text>
        <Text style={styles.submitIcon}>→</Text>
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
});