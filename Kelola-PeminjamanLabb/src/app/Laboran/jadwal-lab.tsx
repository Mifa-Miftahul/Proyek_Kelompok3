import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

import LaboranScreenLayout from '@/components/Organisms/LaboranScreenLayout';
import ScheduleFormModal, {
  DAYS,
  ScheduleInput,
} from '@/components/Organisms/ScheduleFormModal';
import LaboranLabCard, {
  LabIcon,
  LabStatus,
} from '@/components/Molecules/LaboranLabCard';
import LaboranScheduleCard, {
  Schedule,
} from '@/components/Molecules/LaboranScheduleCard';
import ChipSelector from '@/components/Molecules/ChipSelector';
import ActionButton from '@/components/Molecules/ActionButton';
import ConfirmDialog from '@/components/Molecules/ConfirmDialog';
import EmptyState from '@/components/Molecules/EmptyState';
import ResponsiveGrid from '@/components/Molecules/ResponsiveGrid';
import { useToast } from '@/components/Molecules/Toast';

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


// ==================== DATA DUMMY (tanpa database) ====================

type LabItem = {
  id: string;
  name: string;
  room: string;
  icon: LabIcon;
  status: LabStatus;
};

const labs: LabItem[] = [
  { id: 'LAB-001', name: 'Lab Pemrograman', room: 'Ruang Lab 1', icon: 'monitor', status: 'Available' },
  { id: 'LAB-002', name: 'Lab Jaringan', room: 'Ruang Lab 2', icon: 'lan', status: 'Occupied' },
  { id: 'LAB-003', name: 'Lab Fiber Optik', room: 'Ruang Lab 3', icon: 'access-point', status: 'Available' },
];

const initialSchedules: Schedule[] = [
  { id: 'JAD-001', labId: 'LAB-001', day: 'Senin', date: '19 Oktober 2026', time: '07.30 - 10.00', subject: 'Praktikum Pemrograman', teacher: 'Salwa Ayudia', className: 'X RPL 1', status: 'Berlangsung' },
  { id: 'JAD-002', labId: 'LAB-001', day: 'Senin', date: '19 Oktober 2026', time: '10.00 - 12.30', subject: 'Pemrograman Web', teacher: 'Bapak Andi', className: 'X RPL 2', status: 'Terjadwal' },
  { id: 'JAD-003', labId: 'LAB-001', day: 'Senin', date: '19 Oktober 2026', time: '12.30 - 15.30', subject: 'Praktikum Basis Data', teacher: 'Ibu Rina', className: 'XI RPL 1', status: 'Terjadwal' },
  { id: 'JAD-004', labId: 'LAB-001', day: 'Selasa', date: '20 Oktober 2026', time: '07.30 - 10.00', subject: 'Pemrograman Dasar', teacher: 'Salwa Ayudia', className: 'X RPL 1', status: 'Terjadwal' },
  { id: 'JAD-005', labId: 'LAB-002', day: 'Senin', date: '19 Oktober 2026', time: '07.30 - 10.00', subject: 'Jaringan Komputer', teacher: 'Bapak Budi', className: 'XI TKJ 1', status: 'Terjadwal' },
  { id: 'JAD-006', labId: 'LAB-002', day: 'Rabu', date: '21 Oktober 2026', time: '10.00 - 12.30', subject: 'Administrasi Jaringan', teacher: 'Ibu Rina', className: 'XI TKJ 2', status: 'Terjadwal' },
  { id: 'JAD-007', labId: 'LAB-002', day: 'Kamis', date: '22 Oktober 2026', time: '07.30 - 10.00', subject: 'Praktikum Router', teacher: 'Bapak Budi', className: 'XII TKJ 1', status: 'Terjadwal' },
  { id: 'JAD-008', labId: 'LAB-003', day: 'Selasa', date: '20 Oktober 2026', time: '10.00 - 12.30', subject: 'Praktikum Fiber Optik', teacher: 'Bapak Andi', className: 'XII TKJ 1', status: 'Terjadwal' },
  { id: 'JAD-009', labId: 'LAB-003', day: 'Jumat', date: '23 Oktober 2026', time: '07.30 - 10.00', subject: 'Instalasi Kabel Optik', teacher: 'Ibu Rina', className: 'XII TKJ 2', status: 'Terjadwal' },
];

const DAY_FILTERS = ['Semua', ...DAYS];

// Flowchart: Kelola Jadwal Lab -> pilih lab -> tambah / edit / hapus jadwal.
export default function KelolaJadwalLabScreen() {
  const toast = useToast();
  const wide = useWindowDimensions().width >= 768;

  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [selectedLabId, setSelectedLabId] = useState<string>(labs[0].id);
  const [selectedDay, setSelectedDay] = useState('Semua');

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [deleting, setDeleting] = useState<Schedule | null>(null);

  const selectedLab = labs.find((lab) => lab.id === selectedLabId) ?? labs[0];
  const labSchedules = schedules.filter((item) => item.labId === selectedLab.id);
  const visibleSchedules =
    selectedDay === 'Semua'
      ? labSchedules
      : labSchedules.filter((item) => item.day === selectedDay);

  const openAdd = () => {
    setFormMode('add');
    setEditing(null);
    setFormVisible(true);
  };

  const openEdit = (schedule: Schedule) => {
    setFormMode('edit');
    setEditing(schedule);
    setFormVisible(true);
  };

  const handleSubmit = (input: ScheduleInput) => {
    if (formMode === 'add') {
      setSchedules((prev) => [
        ...prev,
        {
          ...input,
          id: `JAD-${Date.now()}`,
          labId: selectedLab.id,
          status: 'Terjadwal',
        },
      ]);
      toast.show('Jadwal berhasil ditambahkan');
    } else if (editing) {
      setSchedules((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, ...input } : item,
        ),
      );
      toast.show('Jadwal berhasil diedit');
    }

    setFormVisible(false);
  };

  const handleConfirmDelete = () => {
    if (!deleting) return;
    setSchedules((prev) => prev.filter((item) => item.id !== deleting.id));
    setDeleting(null);
    toast.show('Jadwal berhasil dihapus');
  };

  return (
    <LaboranScreenLayout
      title="Kelola Jadwal Lab"
      description="Tambah, ubah, dan hapus jadwal praktikum"
      icon="calendar-edit"
      activeRoute="JadwalLab"
      toastMessage={toast.message}
    >
      {/* PILIH LAB */}
      <Text style={styles.sectionTitle}>Pilih Laboratorium</Text>
      <Text style={styles.sectionDescription}>
        Pilih lab untuk mengelola jadwalnya.
      </Text>

      <ResponsiveGrid minItemWidth={300}>
      {labs.map((lab) => (
        <LaboranLabCard
          key={lab.id}
          name={lab.name}
          room={lab.room}
          icon={lab.icon}
          status={lab.status}
          meta={`${schedules.filter((item) => item.labId === lab.id).length} jadwal`}
          selected={lab.id === selectedLab.id}
          onPress={() => setSelectedLabId(lab.id)}
        />
      ))}
      </ResponsiveGrid>

      {/* JADWAL LAB TERPILIH */}
      <View style={styles.scheduleSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>Jadwal Penggunaan</Text>
            <Text style={styles.sectionDescription}>
              {selectedLab.name} · {selectedLab.room}
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {visibleSchedules.length} jadwal
            </Text>
          </View>
        </View>

        <ActionButton
          label="Tambah Jadwal"
          icon="add-circle-outline"
          onPress={openAdd}
          style={[styles.addButton, wide && styles.addButtonWide]}
        />

        <ChipSelector
          options={DAY_FILTERS}
          value={selectedDay}
          onChange={setSelectedDay}
        />

        {visibleSchedules.length === 0 ? (
          <EmptyState
            title="Belum ada jadwal"
            description={
              selectedDay === 'Semua'
                ? 'Lab ini belum punya jadwal. Tekan "Tambah Jadwal" untuk membuat.'
                : `Belum ada jadwal pada hari ${selectedDay}.`
            }
          />
        ) : (
          <ResponsiveGrid minItemWidth={400}>
          {visibleSchedules.map((schedule) => (
            <LaboranScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={() => openEdit(schedule)}
              onDelete={() => setDeleting(schedule)}
            />
          ))}
          </ResponsiveGrid>
        )}
      </View>

      <ScheduleFormModal
        visible={formVisible}
        mode={formMode}
        labName={selectedLab.name}
        initial={editing}
        existing={labSchedules}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        visible={!!deleting}
        title="Hapus Jadwal?"
        message={`Apakah anda yakin ingin menghapus jadwal "${
          deleting?.subject ?? ''
        }"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </LaboranScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  scheduleSection: { marginTop: 10 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sectionHeaderText: { flex: 1 },
  countBadge: {
    backgroundColor: COLORS.paleBlue,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginLeft: 8,
  },
  countText: { color: COLORS.navy, fontSize: 11, fontWeight: '700' },
  addButton: { marginBottom: 16 },
  addButtonWide: { alignSelf: 'flex-start', minWidth: 220 },
});
