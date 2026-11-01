import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';

import LaboranScreenLayout from '@/components/Organisms/LaboranScreenLayout';
import LabFormModal, {
  Lab,
  LabInput,
} from '@/components/Organisms/LabFormModal';
import EquipmentFormModal, {
  EquipmentInput,
} from '@/components/Organisms/EquipmentFormModal';
import LaboranLabCard from '@/components/Molecules/LaboranLabCard';
import EquipmentRow, { Equipment } from '@/components/Molecules/EquipmentRow';
import InfoRowDaftarLab from '@/components/Molecules/InfoRowDaftarLab';
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

const initialLabs: Lab[] = [
  {
    id: 'LAB-001',
    name: 'Lab Pemrograman',
    laboran: 'Andi Setiawan, S.Kom.',
    room: 'Ruang Lab 1',
    status: 'Available',
    icon: 'monitor',
    perangkat: [
      { id: 'EQP-001', nama: 'Komputer', jumlah: 30 },
      { id: 'EQP-002', nama: 'Proyektor', jumlah: 1 },
      { id: 'EQP-003', nama: 'Switch', jumlah: 2 },
    ],
  },
  {
    id: 'LAB-002',
    name: 'Lab Jaringan',
    laboran: 'Budi Santoso, S.Kom.',
    room: 'Ruang Lab 2',
    status: 'Occupied',
    icon: 'lan',
    perangkat: [
      { id: 'EQP-004', nama: 'Komputer', jumlah: 25 },
      { id: 'EQP-005', nama: 'Router', jumlah: 5 },
      { id: 'EQP-006', nama: 'Switch', jumlah: 8 },
      { id: 'EQP-007', nama: 'Access Point', jumlah: 3 },
    ],
  },
  {
    id: 'LAB-003',
    name: 'Lab Fiber Optik',
    laboran: 'Siti Rahmawati, S.Kom.',
    room: 'Ruang Lab 3',
    status: 'Available',
    icon: 'access-point',
    perangkat: [
      { id: 'EQP-008', nama: 'Komputer', jumlah: 20 },
      { id: 'EQP-009', nama: 'Perangkat Fiber Optik', jumlah: 10 },
      { id: 'EQP-010', nama: 'Proyektor', jumlah: 1 },
    ],
  },
];

const CARD_SHADOW = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 5,
  elevation: 2,
  ...Platform.select({
    web: { boxShadow: '0px 3px 8px rgba(15, 23, 42, 0.08)' },
  }),
};

// Flowchart: Kelola Daftar Lab -> pilih lab -> info lab + daftar perangkat
// -> tambah lab / edit lab / hapus lab / kelola perangkat.
export default function KelolaDetailLabScreen() {
  const toast = useToast();
  const wide = useWindowDimensions().width >= 768;

  const [labs, setLabs] = useState<Lab[]>(initialLabs);
  const [selectedLabId, setSelectedLabId] = useState<string>(initialLabs[0].id);

  // Form lab
  const [labFormVisible, setLabFormVisible] = useState(false);
  const [labFormMode, setLabFormMode] = useState<'add' | 'edit'>('add');
  const [deletingLab, setDeletingLab] = useState<Lab | null>(null);

  // Form perangkat
  const [eqFormVisible, setEqFormVisible] = useState(false);
  const [eqFormMode, setEqFormMode] = useState<'add' | 'edit'>('add');
  const [editingEq, setEditingEq] = useState<Equipment | null>(null);
  const [deletingEq, setDeletingEq] = useState<Equipment | null>(null);

  const selectedLab = labs.find((lab) => lab.id === selectedLabId) ?? labs[0];
  const totalUnits = selectedLab
    ? selectedLab.perangkat.reduce((sum, item) => sum + item.jumlah, 0)
    : 0;

  // Ubah satu lab saja (dipakai oleh aksi perangkat)
  const changeLab = (labId: string, change: (lab: Lab) => Lab) =>
    setLabs((prev) => prev.map((lab) => (lab.id === labId ? change(lab) : lab)));

  // ---------- LAB ----------
  const openAddLab = () => {
    setLabFormMode('add');
    setLabFormVisible(true);
  };

  const openEditLab = () => {
    setLabFormMode('edit');
    setLabFormVisible(true);
  };

  const handleSubmitLab = (input: LabInput) => {
    if (labFormMode === 'add') {
      const created: Lab = {
        ...input,
        id: `LAB-${Date.now()}`,
        icon: 'monitor',
        perangkat: [],
      };
      setLabs((prev) => [...prev, created]);
      setSelectedLabId(created.id);
      toast.show('Lab berhasil ditambahkan');
    } else if (selectedLab) {
      changeLab(selectedLab.id, (lab) => ({ ...lab, ...input }));
      toast.show('Data lab berhasil diubah');
    }
    setLabFormVisible(false);
  };

  const handleConfirmDeleteLab = () => {
    if (!deletingLab) return;
    setLabs((prev) => prev.filter((lab) => lab.id !== deletingLab.id));
    setDeletingLab(null);
    toast.show('Lab berhasil dihapus');
  };

  // ---------- PERANGKAT ----------
  const openAddEquipment = () => {
    setEqFormMode('add');
    setEditingEq(null);
    setEqFormVisible(true);
  };

  const openEditEquipment = (item: Equipment) => {
    setEqFormMode('edit');
    setEditingEq(item);
    setEqFormVisible(true);
  };

  const handleSubmitEquipment = (input: EquipmentInput) => {
    if (!selectedLab) return;

    if (eqFormMode === 'add') {
      changeLab(selectedLab.id, (lab) => ({
        ...lab,
        perangkat: [...lab.perangkat, { ...input, id: `EQP-${Date.now()}` }],
      }));
      toast.show('Perangkat berhasil ditambahkan');
    } else if (editingEq) {
      changeLab(selectedLab.id, (lab) => ({
        ...lab,
        perangkat: lab.perangkat.map((item) =>
          item.id === editingEq.id ? { ...item, ...input } : item,
        ),
      }));
      toast.show('Perangkat berhasil diubah');
    }
    setEqFormVisible(false);
  };

  const handleConfirmDeleteEquipment = () => {
    if (!selectedLab || !deletingEq) return;
    changeLab(selectedLab.id, (lab) => ({
      ...lab,
      perangkat: lab.perangkat.filter((item) => item.id !== deletingEq.id),
    }));
    setDeletingEq(null);
    toast.show('Perangkat berhasil dihapus');
  };

  return (
    <LaboranScreenLayout
      title="Kelola Detail Lab"
      description="Kelola data lab dan daftar perangkatnya"
      icon="monitor-edit"
      activeRoute="KelolaLab"
      toastMessage={toast.message}
    >
      {/* DAFTAR LAB */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Daftar Laboratorium</Text>
          <Text style={styles.sectionDescription}>
            Pilih lab untuk melihat dan mengelola detailnya.
          </Text>
        </View>
      </View>

      <ActionButton
        label="Tambah Lab"
        icon="add-circle-outline"
        onPress={openAddLab}
        style={[styles.addButton, wide && styles.addButtonWide]}
      />

      {labs.length === 0 ? (
        <EmptyState
          icon="business-outline"
          title="Belum ada laboratorium"
          description='Tekan "Tambah Lab" untuk membuat lab pertama.'
        />
      ) : (
        <ResponsiveGrid minItemWidth={300}>
        {labs.map((lab) => (
          <LaboranLabCard
            key={lab.id}
            name={lab.name}
            room={lab.room}
            icon={lab.icon}
            status={lab.status}
            meta={`${lab.perangkat.length} jenis perangkat`}
            selected={lab.id === selectedLab?.id}
            onPress={() => setSelectedLabId(lab.id)}
          />
        ))}
        </ResponsiveGrid>
      )}

      {/* DETAIL LAB TERPILIH */}
      {selectedLab && (
        <ResponsiveGrid minItemWidth={380} maxColumns={2}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informasi Laboratorium</Text>
            <View style={styles.divider} />

            <InfoRowDaftarLab
              icon="business-outline"
              label="Nama Lab"
              value={selectedLab.name}
            />
            <InfoRowDaftarLab
              icon="person-outline"
              label="Laboran Penanggung Jawab"
              value={selectedLab.laboran}
            />
            <InfoRowDaftarLab
              icon="location-outline"
              label="Ruang Laboratorium"
              value={selectedLab.room}
            />
            <InfoRowDaftarLab
              icon="checkmark-circle-outline"
              label="Status Laboratorium"
              value={selectedLab.status}
            />

            <View style={styles.labActions}>
              <ActionButton
                label="Edit Lab"
                icon="create-outline"
                variant="secondary"
                onPress={openEditLab}
                style={styles.flex}
              />
              <ActionButton
                label="Hapus Lab"
                icon="trash-outline"
                variant="dangerSoft"
                onPress={() => setDeletingLab(selectedLab)}
                style={styles.flex}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.cardTitle}>Daftar Perangkat</Text>
                <Text style={styles.cardSubtitle}>
                  {selectedLab.perangkat.length} jenis · {totalUnits} unit
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <ActionButton
              label="Tambah Perangkat"
              icon="add-circle-outline"
              onPress={openAddEquipment}
              style={styles.equipmentAdd}
            />

            {selectedLab.perangkat.length === 0 ? (
              <EmptyState
                icon="hardware-chip-outline"
                title="Belum ada perangkat"
                description="Tambahkan perangkat yang tersedia di lab ini."
              />
            ) : (
              selectedLab.perangkat.map((item) => (
                <EquipmentRow
                  key={item.id}
                  item={item}
                  onEdit={() => openEditEquipment(item)}
                  onDelete={() => setDeletingEq(item)}
                />
              ))
            )}
          </View>
        </ResponsiveGrid>
      )}

      <LabFormModal
        visible={labFormVisible}
        mode={labFormMode}
        initial={labFormMode === 'edit' ? selectedLab ?? null : null}
        allLabs={labs}
        onClose={() => setLabFormVisible(false)}
        onSubmit={handleSubmitLab}
      />

      <EquipmentFormModal
        visible={eqFormVisible}
        mode={eqFormMode}
        labName={selectedLab?.name ?? ''}
        initial={editingEq}
        existing={selectedLab?.perangkat ?? []}
        onClose={() => setEqFormVisible(false)}
        onSubmit={handleSubmitEquipment}
      />

      <ConfirmDialog
        visible={!!deletingLab}
        title="Hapus Lab?"
        message={`Apakah anda yakin ingin menghapus "${
          deletingLab?.name ?? ''
        }"? Semua perangkat lab ini ikut terhapus.`}
        onConfirm={handleConfirmDeleteLab}
        onCancel={() => setDeletingLab(null)}
      />

      <ConfirmDialog
        visible={!!deletingEq}
        title="Hapus Perangkat?"
        message={`Apakah anda yakin ingin menghapus perangkat "${
          deletingEq?.nama ?? ''
        }" dari lab ini?`}
        onConfirm={handleConfirmDeleteEquipment}
        onCancel={() => setDeletingEq(null)}
      />
    </LaboranScreenLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  addButton: { marginBottom: 16 },
  addButtonWide: { alignSelf: 'flex-start', minWidth: 220 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EEF8',
    ...CARD_SHADOW,
  },
  cardTitle: { color: COLORS.navy, fontSize: 14, fontWeight: '700' },
  cardSubtitle: { color: COLORS.muted, fontSize: 10, marginTop: 5 },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 15,
  },
  labActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  equipmentAdd: { marginBottom: 6 },
});
