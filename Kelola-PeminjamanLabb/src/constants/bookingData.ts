import { Laboratory } from '../components/Molecules/LabDropdown';

export const LABORATORIES: Laboratory[] = [
  {
    id: 'LAB-001',
    name: 'Lab Pemrograman',
    capacity: 30,
  },
  {
    id: 'LAB-002',
    name: 'Lab Jaringan',
    capacity: 25,
  },
  {
    id: 'LAB-003',
    name: 'Lab Fiber Optik',
    capacity: 20,
  },
];

export type BookedSlot = {
  labId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Disetujui' | 'Pending';
};

// Data contoh untuk simulasi pengecekan jadwal.
// Nantinya diganti dengan data dari API.
export const BOOKED_SLOTS: BookedSlot[] = [
  {
    labId: 'LAB-001',
    date: '2026-11-02',
    startTime: '08:00',
    endTime: '10:00',
    status: 'Disetujui',
  },
  {
    labId: 'LAB-002',
    date: '2026-11-03',
    startTime: '10:00',
    endTime: '12:00',
    status: 'Pending',
  },
];

export type BookingStatus = 'Pending' | 'Disetujui' | 'Ditolak';

export type BookingRequest = {
  id: string;
  teacherName: string;
  labName: string;
  labId: string;
  date: string;
  startTime: string;
  endTime: string;
  className: string;
  subject: string;
  studentCount: number;
  purpose: string;
  status: BookingStatus;
  rejectionReason?: string;
};

export const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'PMJ-001',
    teacherName: 'Budi Santoso, S.Kom.',
    labName: 'Lab Pemrograman',
    labId: 'LAB-001',
    date: '2026-11-02',
    startTime: '08:00',
    endTime: '10:00',
    className: 'X RPL 1',
    subject: 'Pemrograman Dasar',
    studentCount: 28,
    purpose: 'Praktik membuat program menggunakan bahasa Python.',
    status: 'Pending',
  },
  {
    id: 'PMJ-002',
    teacherName: 'Siti Rahmawati, S.Kom.',
    labName: 'Lab Jaringan',
    labId: 'LAB-002',
    date: '2026-11-03',
    startTime: '10:00',
    endTime: '12:00',
    className: 'XI TKJ 2',
    subject: 'Administrasi Infrastruktur Jaringan',
    studentCount: 24,
    purpose: 'Praktik konfigurasi jaringan komputer.',
    status: 'Pending',
  },
  {
    id: 'PMJ-003',
    teacherName: 'Andi Pratama, S.Kom.',
    labName: 'Lab Fiber Optik',
    labId: 'LAB-003',
    date: '2026-11-04',
    startTime: '13:00',
    endTime: '15:00',
    className: 'XII TKJ 1',
    subject: 'Teknologi Jaringan Berbasis Luas',
    studentCount: 20,
    purpose: 'Praktik penyambungan kabel fiber optik.',
    status: 'Disetujui',
  },
  {
    id: 'PMJ-004',
    teacherName: 'Dewi Anggraini, S.Kom.',
    labName: 'Lab Pemrograman',
    labId: 'LAB-001',
    date: '2026-11-05',
    startTime: '08:00',
    endTime: '10:00',
    className: 'XI RPL 1',
    subject: 'Pemrograman Web',
    studentCount: 30,
    purpose: 'Praktik pembuatan website.',
    status: 'Ditolak',
    rejectionReason: 'Jadwal laboratorium sedang digunakan.',
  },
];