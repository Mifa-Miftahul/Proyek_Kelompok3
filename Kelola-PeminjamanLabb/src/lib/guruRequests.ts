import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { supabase } from './supabase';

// ==================== TYPES ====================

// Status untuk badge di kartu (sama seperti sebelumnya).
export type RequestStatus = 'Accepted' | 'Pending' | 'Reject';

// Status asli dari tabel peminjaman (sama dengan sisi Laboran).
export type BookingStatus = 'Pending' | 'Disetujui' | 'Ditolak';

export type GuruRequest = {
  id: string; // contoh: PEM-12
  databaseId: string; // id_peminjaman
  lab: string;
  labRoom: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  date: string; // 2 November 2026
  dateRaw: string; // 2026-11-02
  time: string; // 08:00 - 10:00
  startTime: string;
  endTime: string;
  teacherName: string;
  className: string;
  subject: string;
  studentCount: number;
  purpose: string;
  status: RequestStatus;
  bookingStatus: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
};

export type GuruRequestsResult = {
  teacherName: string;
  requests: GuruRequest[];
  laboratoryCount: number;
};

// ==================== HELPERS ====================

export const formatDate = (date: string, withWeekday = false) => {
  if (!date) return '-';

  const [year, month, day] = date.slice(0, 10).split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString('id-ID', {
    ...(withWeekday ? { weekday: 'long' as const } : {}),
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return `${date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}, ${String(date.getHours()).padStart(2, '0')}.${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
};

export const toDateKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

export const toTimeKey = (date: Date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;

export const normalizeStatus = (status: string): BookingStatus => {
  const value = String(status ?? '').toLowerCase();

  if (['accepted', 'approved', 'disetujui'].includes(value)) {
    return 'Disetujui';
  }

  if (['rejected', 'reject', 'ditolak'].includes(value)) {
    return 'Ditolak';
  }

  return 'Pending';
};

export const toBadgeStatus = (status: BookingStatus): RequestStatus => {
  if (status === 'Disetujui') return 'Accepted';
  if (status === 'Ditolak') return 'Reject';
  return 'Pending';
};

// ==================== FETCH ====================

// Mengambil seluruh pengajuan milik Guru yang sedang login.
// Dipakai bersama oleh Dashboard dan Riwayat supaya datanya selalu sama.
export async function fetchGuruRequests(): Promise<GuruRequestsResult> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const user = session?.user;

  if (!user) {
    throw new Error('Sesi login tidak ditemukan. Silakan login kembali.');
  }

  // Pastikan akun merupakan Guru aktif.
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, nama, role, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  if (
    !profile ||
    String(profile.role).toLowerCase() !== 'guru' ||
    profile.is_active !== true
  ) {
    throw new Error('Akun Guru tidak ditemukan atau tidak aktif.');
  }

  // Pengajuan milik Guru + data laboratorium dalam satu query.
  const { data, error } = await supabase
    .from('peminjaman')
    .select(
      `
      id_peminjaman,
      id_lab,
      tanggal,
      jam_mulai,
      jam_selesai,
      kelas,
      mata_pelajaran,
      jumlah_siswa,
      keperluan,
      status,
      alasan_penolakan,
      created_at,
      laboratorium!fk_peminjaman_laboratorium (
        nama_lab,
        ruangan,
        icon
      )
    `,
    )
    .eq('id_user', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const { count: labCount, error: labCountError } = await supabase
    .from('laboratorium')
    .select('id_lab', { count: 'exact', head: true });

  if (labCountError) throw labCountError;

  const requests: GuruRequest[] = (data ?? []).map((item: any) => {
    const lab = Array.isArray(item.laboratorium)
      ? item.laboratorium[0]
      : item.laboratorium;

    const bookingStatus = normalizeStatus(item.status);
    const startTime = String(item.jam_mulai ?? '').slice(0, 5);
    const endTime = String(item.jam_selesai ?? '').slice(0, 5);
    const dateRaw = String(item.tanggal ?? '').slice(0, 10);

    return {
      id: `PEM-${item.id_peminjaman}`,
      databaseId: String(item.id_peminjaman),
      lab: lab?.nama_lab ?? 'Laboratorium tidak ditemukan',
      labRoom: lab?.ruangan ?? '-',
      icon: (lab?.icon || 'monitor') as GuruRequest['icon'],
      date: formatDate(dateRaw),
      dateRaw,
      time: `${startTime} - ${endTime}`,
      startTime,
      endTime,
      teacherName: profile.nama ?? 'Guru',
      className: item.kelas ?? '-',
      subject: item.mata_pelajaran ?? '-',
      studentCount: Number(item.jumlah_siswa ?? 0),
      purpose: item.keperluan ?? '-',
      status: toBadgeStatus(bookingStatus),
      bookingStatus,
      rejectionReason: item.alasan_penolakan || undefined,
      createdAt: String(item.created_at ?? ''),
    };
  });

  return {
    teacherName: profile.nama ?? 'Guru',
    requests,
    laboratoryCount: labCount ?? 0,
  };
}