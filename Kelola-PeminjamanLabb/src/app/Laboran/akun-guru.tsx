import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

import LaboranScreenLayout from '@/components/Organisms/LaboranScreenLayout';
import TeacherFormModal, {
  TeacherInput,
} from '@/components/Organisms/TeacherFormModal';
import TeacherCard, { Teacher } from '@/components/Molecules/TeacherCard';
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

const initialTeachers: Teacher[] = [
  { id: 'GRU-001', nama: 'Salwa Ayudia', nip: '198501012010012001', password: 'guru123' },
  { id: 'GRU-002', nama: 'Andi Pratama', nip: '198702152011011002', password: 'guru123' },
  { id: 'GRU-003', nama: 'Rina Marlina', nip: '199003202015022003', password: 'guru123' },
  { id: 'GRU-004', nama: 'Budi Hartono', nip: '198812052012011004', password: 'guru123' },
];

// Flowchart: Kelola Akun Guru -> daftar akun guru -> tambah / edit / hapus.
export default function KelolaAkunGuruScreen() {
  const toast = useToast();
  const wide = useWindowDimensions().width >= 768;

  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<Teacher | null>(null);

  const openAdd = () => {
    setFormMode('add');
    setEditing(null);
    setFormVisible(true);
  };

  const openEdit = (teacher: Teacher) => {
    setFormMode('edit');
    setEditing(teacher);
    setFormVisible(true);
  };

  const handleSubmit = (input: TeacherInput) => {
    if (formMode === 'add') {
      setTeachers((prev) => [...prev, { ...input, id: `GRU-${Date.now()}` }]);
      toast.show('Akun guru berhasil ditambahkan');
    } else if (editing) {
      setTeachers((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, ...input } : item,
        ),
      );
      toast.show('Akun guru berhasil diubah');
    }
    setFormVisible(false);
  };

  const handleConfirmDelete = () => {
    if (!deleting) return;
    setTeachers((prev) => prev.filter((item) => item.id !== deleting.id));
    setDeleting(null);
    toast.show('Akun guru berhasil dihapus');
  };

  return (
    <LaboranScreenLayout
      title="Kelola Akun Guru"
      description="Tambah, ubah, dan hapus akun guru"
      icon="account-multiple"
      activeRoute="AkunGuru"
      toastMessage={toast.message}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Daftar Akun Guru</Text>
          <Text style={styles.sectionDescription}>
            Akun yang dapat masuk ke aplikasi sebagai guru.
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{teachers.length} akun</Text>
        </View>
      </View>

      <ActionButton
        label="Tambah Akun Guru"
        icon="person-add-outline"
        onPress={openAdd}
        style={[styles.addButton, wide && styles.addButtonWide]}
      />

      {teachers.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="Belum ada akun guru"
          description='Tekan "Tambah Akun Guru" untuk membuat akun pertama.'
        />
      ) : (
        <ResponsiveGrid minItemWidth={340}>
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onEdit={() => openEdit(teacher)}
            onDelete={() => setDeleting(teacher)}
          />
        ))}
        </ResponsiveGrid>
      )}

      <TeacherFormModal
        visible={formVisible}
        mode={formMode}
        initial={editing}
        allTeachers={teachers}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        visible={!!deleting}
        title="Hapus Akun Guru?"
        message={`Apakah anda yakin ingin menghapus akun "${
          deleting?.nama ?? ''
        }"? Guru ini tidak bisa masuk lagi ke aplikasi.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </LaboranScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  sectionHeaderText: { flex: 1 },
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
