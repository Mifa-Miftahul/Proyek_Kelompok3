
import React, { useEffect, useState } from 'react';
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

import { supabase } from '../../lib/supabase';

const COLORS = {
  navy: '#223F91',
  background: '#F5F7FB',
  white: '#FFFFFF',
  muted: '#64748B',
  divider: '#EDF1F7',
};

const CARD_SHADOW = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 5,
  elevation: 2,
  ...Platform.select({
    web: {
      boxShadow: '0px 3px 8px rgba(15, 23, 42, 0.08)',
    },
  }),
};

export default function KelolaDetailLabScreen() {
  const toast = useToast();
  const wide = useWindowDimensions().width >= 768;

  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLabId, setSelectedLabId] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [labFormVisible, setLabFormVisible] = useState(false);
  const [labFormMode, setLabFormMode] = useState<'add' | 'edit'>('add');
  const [deletingLab, setDeletingLab] = useState<Lab | null>(null);

  const [eqFormVisible, setEqFormVisible] = useState(false);
  const [eqFormMode, setEqFormMode] = useState<'add' | 'edit'>('add');
  const [editingEq, setEditingEq] = useState<Equipment | null>(null);
  const [deletingEq, setDeletingEq] = useState<Equipment | null>(null);

  const selectedLab =
    labs.find((lab) => lab.id === selectedLabId) ?? labs[0];

  const totalUnits = selectedLab
    ? selectedLab.perangkat.reduce(
        (sum, item) => sum + item.jumlah,
        0
      )
    : 0;

  // ==========================================
  // AMBIL DATA LAB DAN PERANGKAT
  // ==========================================

  const fetchLabs = async () => {
    try {
      setLoadError(false);

      const { data: labData, error: labError } = await supabase
        .from('laboratorium')
        .select(`
          id_lab,
          nama_lab,
          laboran,
          ruangan,
          kapasitas,
          status,
          icon
        `)
        .order('id_lab', { ascending: true });

      if (labError) throw labError;

      const { data: equipmentData, error: equipmentError } =
        await supabase
          .from('perangkat')
          .select(`
            id_perangkat,
            id_lab,
            nama_perangkat,
            jumlah
          `)
          .order('id_perangkat', { ascending: true });

      if (equipmentError) throw equipmentError;

      const formattedLabs: Lab[] = (labData ?? []).map((lab) => {
        const labEquipment: Equipment[] = (
          equipmentData ?? []
        )
          .filter(
            (equipment) =>
              String(equipment.id_lab) === String(lab.id_lab)
          )
          .map((equipment) => ({
            id: String(equipment.id_perangkat),
            nama: equipment.nama_perangkat,
            jumlah: Number(equipment.jumlah),
          }));

        // Mendukung data lama berbahasa Inggris.
        const normalizedStatus =
          lab.status === 'Available'
            ? 'Tersedia'
            : lab.status === 'Occupied'
              ? 'Dipakai'
              : lab.status;

        return {
          id: String(lab.id_lab),
          name: lab.nama_lab,
          laboran: lab.laboran ?? '',
          room: lab.ruangan ?? '',
          kapasitas: Number(lab.kapasitas ?? 0),
          status: normalizedStatus || 'Tersedia',
          icon: lab.icon || 'monitor',
          perangkat: labEquipment,
        };
      });

      setLabs(formattedLabs);

      setSelectedLabId((previousId) => {
        const stillExists = formattedLabs.some(
          (lab) => lab.id === previousId
        );

        if (stillExists) return previousId;

        return formattedLabs[0]?.id ?? '';
      });

    } catch (error: any) {
      console.error('Gagal mengambil data laboratorium:', error);
      setLoadError(true);

      toast.show(
        error?.message ?? 'Gagal mengambil data laboratorium.'
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REALTIME
  // ==========================================

  useEffect(() => {
    fetchLabs();

    const channel = supabase
      .channel('kelola-lab-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'laboratorium',
        },
        () => fetchLabs()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'perangkat',
        },
        () => fetchLabs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ==========================================
  // TAMBAH DAN EDIT LAB
  // ==========================================

  const openAddLab = () => {
    setLabFormMode('add');
    setLabFormVisible(true);
  };

  const openEditLab = () => {
    setLabFormMode('edit');
    setLabFormVisible(true);
  };

  const handleSubmitLab = async (input: LabInput) => {
    try {
      // Pastikan nilai yang dikirim ke Supabase
      // menggunakan status bahasa Indonesia.
      const statusIndonesia =
        input.status === 'Tersedia'
          ? 'Tersedia'
          : input.status === 'Dipakai'
            ? 'Dipakai'
            : input.status;

      if (labFormMode === 'add') {
        const { data, error } = await supabase
          .from('laboratorium')
          .insert({
            nama_lab: input.name,
            laboran: input.laboran,
            ruangan: input.room,
            kapasitas: input.kapasitas,
            status: statusIndonesia,
            icon: 'monitor',
          })
          .select('id_lab')
          .single();

        if (error) throw error;

        await fetchLabs();

        setSelectedLabId(String(data.id_lab));

        toast.show('Lab berhasil ditambahkan');

      } else if (selectedLab) {
        const { error } = await supabase
          .from('laboratorium')
          .update({
            nama_lab: input.name,
            laboran: input.laboran,
            ruangan: input.room,
            kapasitas: input.kapasitas,
            status: statusIndonesia,
          })
          .eq('id_lab', Number(selectedLab.id));

        if (error) throw error;

        await fetchLabs();

        toast.show('Data lab berhasil diubah');
      }

      setLabFormVisible(false);

    } catch (error: any) {
      console.error('Gagal menyimpan data lab:', error);

      toast.show(
        error?.message ?? 'Gagal menyimpan data laboratorium.'
      );
    }
  };

  // ==========================================
  // HAPUS LAB
  // ==========================================

  const handleConfirmDeleteLab = async () => {
    if (!deletingLab) return;

    try {
      const labId = Number(deletingLab.id);

      const { error: equipmentError } = await supabase
        .from('perangkat')
        .delete()
        .eq('id_lab', labId);

      if (equipmentError) throw equipmentError;

      const { error: labError } = await supabase
        .from('laboratorium')
        .delete()
        .eq('id_lab', labId);

      if (labError) throw labError;

      const deletedId = deletingLab.id;

      setLabs((previous) =>
        previous.filter((lab) => lab.id !== deletedId)
      );

      setSelectedLabId((previousId) => {
        if (previousId !== deletedId) return previousId;

        const remainingLabs = labs.filter(
          (lab) => lab.id !== deletedId
        );

        return remainingLabs[0]?.id ?? '';
      });

      setDeletingLab(null);

      await fetchLabs();

      toast.show('Lab berhasil dihapus');

    } catch (error: any) {
      console.error('Gagal menghapus lab:', error);

      toast.show(
        error?.message ?? 'Gagal menghapus laboratorium.'
      );
    }
  };

  // ==========================================
  // PERANGKAT
  // ==========================================

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

  const handleSubmitEquipment = async (input: EquipmentInput) => {
    if (!selectedLab) return;

    try {
      if (eqFormMode === 'add') {
        const { error } = await supabase
          .from('perangkat')
          .insert({
            id_lab: Number(selectedLab.id),
            nama_perangkat: input.nama,
            jumlah: input.jumlah,
          });

        if (error) throw error;

        await fetchLabs();

        toast.show('Perangkat berhasil ditambahkan');

      } else if (editingEq) {
        const { error } = await supabase
          .from('perangkat')
          .update({
            nama_perangkat: input.nama,
            jumlah: input.jumlah,
          })
          .eq('id_perangkat', Number(editingEq.id))
          .eq('id_lab', Number(selectedLab.id));

        if (error) throw error;

        await fetchLabs();

        toast.show('Perangkat berhasil diubah');
      }

      setEqFormVisible(false);
      setEditingEq(null);

    } catch (error: any) {
      console.error('Gagal menyimpan perangkat:', error);

      toast.show(
        error?.message ?? 'Gagal menyimpan data perangkat.'
      );
    }
  };

  // ==========================================
  // HAPUS PERANGKAT
  // ==========================================

  const handleConfirmDeleteEquipment = async () => {
    if (!selectedLab || !deletingEq) return;

    try {
      const { error } = await supabase
        .from('perangkat')
        .delete()
        .eq('id_perangkat', Number(deletingEq.id))
        .eq('id_lab', Number(selectedLab.id));

      if (error) throw error;

      setDeletingEq(null);

      await fetchLabs();

      toast.show('Perangkat berhasil dihapus');

    } catch (error: any) {
      console.error('Gagal menghapus perangkat:', error);

      toast.show(
        error?.message ?? 'Gagal menghapus perangkat.'
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <LaboranScreenLayout
      title="Kelola Detail Lab"
      description="Kelola data lab dan daftar perangkatnya"
      icon="monitor-edit"
      activeRoute="KelolaLab"
      toastMessage={toast.message}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>
            Daftar Laboratorium
          </Text>

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

      {loading ? (
        <EmptyState
          icon="hourglass-outline"
          title="Memuat laboratorium..."
          description="Mohon tunggu, data laboratorium sedang diambil."
        />
      ) : loadError ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Gagal memuat laboratorium"
          description="Periksa koneksi atau izin akses Supabase."
        />
      ) : labs.length === 0 ? (
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

      {/* DETAIL LAB */}
      {selectedLab && !loading && (
        <ResponsiveGrid minItemWidth={380} maxColumns={2}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Informasi Laboratorium
            </Text>

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
              icon="people-outline"
              label="Kapasitas Laboratorium"
              value={`${selectedLab.kapasitas} Siswa`}
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

          {/* DAFTAR PERANGKAT */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.cardTitle}>
                  Daftar Perangkat
                </Text>

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

      {/* FORM LAB */}
      <LabFormModal
        visible={labFormVisible}
        mode={labFormMode}
        initial={labFormMode === 'edit' ? selectedLab ?? null : null}
        allLabs={labs}
        onClose={() => setLabFormVisible(false)}
        onSubmit={handleSubmitLab}
      />

      {/* FORM PERANGKAT */}
      <EquipmentFormModal
        visible={eqFormVisible}
        mode={eqFormMode}
        labName={selectedLab?.name ?? ''}
        initial={editingEq}
        existing={selectedLab?.perangkat ?? []}
        onClose={() => setEqFormVisible(false)}
        onSubmit={handleSubmitEquipment}
      />

      {/* KONFIRMASI HAPUS LAB */}
      <ConfirmDialog
        visible={!!deletingLab}
        title="Hapus Lab?"
        message={`Apakah anda yakin ingin menghapus "${
          deletingLab?.name ?? ''
        }"? Semua perangkat lab ini ikut terhapus.`}
        onConfirm={handleConfirmDeleteLab}
        onCancel={() => setDeletingLab(null)}
      />

      {/* KONFIRMASI HAPUS PERANGKAT */}
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

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  sectionHeaderText: {
    flex: 1,
  },

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

  addButton: {
    marginBottom: 16,
  },

  addButtonWide: {
    alignSelf: 'flex-start',
    minWidth: 220,
  },

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

  cardTitle: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
  },

  cardSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 15,
  },

  labActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },

  equipmentAdd: {
    marginBottom: 6,
  },
});
