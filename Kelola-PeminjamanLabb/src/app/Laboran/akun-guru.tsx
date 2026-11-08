import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import ActionButton from "@/components/Molecules/ActionButton";
import ConfirmDialog from "@/components/Molecules/ConfirmDialog";
import EmptyState from "@/components/Molecules/EmptyState";
import ResponsiveGrid from "@/components/Molecules/ResponsiveGrid";
import TeacherCard, { Teacher } from "@/components/Molecules/TeacherCard";
import { useToast } from "@/components/Molecules/Toast";
import LaboranScreenLayout from "@/components/Organisms/LaboranScreenLayout";
import TeacherFormModal, {
  TeacherInput,
} from "@/components/Organisms/TeacherFormModal";
import { supabase } from "@/lib/supabase";

const COLORS = {
  navy: "#223F91",
  blue: "#3B82F6",
  paleBlue: "#DCEBFF",
  background: "#F5F7FB",
  white: "#FFFFFF",
  text: "#1E293B",
  muted: "#64748B",
  placeholder: "#94A3B8",
  border: "#E2E8F0",
  divider: "#EDF1F7",
  green: "#059669",
  paleGreen: "#D1FAE5",
  red: "#DC2626",
  paleRed: "#FEE2E2",
};

export default function KelolaAkunGuruScreen() {
  const toast = useToast();
  const wide = useWindowDimensions().width >= 768;

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<Teacher | null>(null);

  // Mengambil daftar Guru dari Supabase.
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select("id, nama, nip")
        .eq("role", "guru")
        .eq("is_active", true)
        .order("nama", { ascending: true });

      if (error) {
        console.error("Gagal mengambil data Guru:", error);
        toast.show("Gagal mengambil daftar akun Guru");
        return;
      }

      const teacherData: Teacher[] = (data ?? []).map((item) => ({
        id: item.id,
        nama: item.nama,
        nip: item.nip,
        password: "",
      }));

      setTeachers(teacherData);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      toast.show("Terjadi kesalahan saat mengambil data Guru");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const openAdd = () => {
    setFormMode("add");
    setEditing(null);
    setFormVisible(true);
  };

  const openEdit = (teacher: Teacher) => {
    setFormMode("edit");
    setEditing(teacher);
    setFormVisible(true);
  };

  // Menambahkan akun Guru melalui Supabase Edge Function.
  const handleSubmit = async (input: TeacherInput) => {
    if (submitting) return;

    if (formMode === "add") {
      try {
        setSubmitting(true);

        const { data, error } = await supabase.functions.invoke(
          "create-teacher",
          {
            body: {
              nama: input.nama.trim(),
              nip: input.nip.trim(),
              password: input.password,
            },
          },
        );

        if (error) {
          console.error("Gagal memanggil Edge Function:", error);

          let errorMessage = "Gagal membuat akun Guru. Silakan coba kembali.";

          if (error.context instanceof Response) {
            try {
              const responseData = await error.context.json();

              if (responseData?.message) {
                errorMessage = responseData.message;
              }
            } catch {
              // Menggunakan pesan default jika respons tidak dapat dibaca.
            }
          }

          toast.show(errorMessage);
          return;
        }

        if (data?.status !== "success") {
          toast.show(data?.message ?? "Gagal membuat akun Guru.");
          return;
        }

        setFormVisible(false);
        setEditing(null);

        toast.show(data.message ?? "Akun Guru berhasil ditambahkan.");

        // Memuat ulang daftar Guru dari database.
        await fetchTeachers();
      } catch (error) {
        console.error("Terjadi kesalahan saat menambahkan Guru:", error);
        toast.show("Terjadi kesalahan saat membuat akun Guru.");
      } finally {
        setSubmitting(false);
      }

      return;
    }

    // Memperbarui akun Guru melalui Supabase Edge Function.
    if (editing) {
      try {
        setSubmitting(true);

        const { data, error } = await supabase.functions.invoke(
          "update-teacher",
          {
            body: {
              id: editing.id,
              nama: input.nama.trim(),
              nip: input.nip.trim(),
              password: input.password,
            },
          },
        );

        if (error) {
          console.error("Gagal memperbarui akun Guru:", error);

          let errorMessage = "Gagal memperbarui akun Guru. Silakan coba kembali.";

          if (error.context instanceof Response) {
            try {
              const responseData = await error.context.json();

              if (responseData?.message) {
                errorMessage = responseData.message;
              }
            } catch {
              // Menggunakan pesan default jika respons tidak dapat dibaca.
            }
          }

          toast.show(errorMessage);
          return;
        }

        if (!data?.data?.id) {
          toast.show(data?.message ?? "Gagal memperbarui akun Guru.");
          return;
        }

        setFormVisible(false);
        setEditing(null);

        toast.show(data.message ?? "Akun Guru berhasil diperbarui.");

        await fetchTeachers();
      } catch (error) {
        console.error("Terjadi kesalahan saat mengedit Guru:", error);
        toast.show("Terjadi kesalahan saat memperbarui akun Guru.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Menonaktifkan akun Guru melalui Supabase Edge Function.
  const handleConfirmDelete = async () => {
    if (!deleting || submitting) return;

    try {
      setSubmitting(true);

      const { data, error } = await supabase.functions.invoke(
        "delete-teacher",
        {
          body: {
            id: deleting.id,
          },
        },
      );

      if (error) {
        console.error("Gagal menghapus akun Guru:", error);

        let errorMessage = "Gagal menghapus akun Guru. Silakan coba kembali.";

        if (error.context instanceof Response) {
          try {
            const responseData = await error.context.json();

            if (responseData?.message) {
              errorMessage = responseData.message;
            }
          } catch {
            // Menggunakan pesan default jika respons tidak dapat dibaca.
          }
        }

        toast.show(errorMessage);
        return;
      }

      if (!data?.data?.id) {
        toast.show(data?.message ?? "Gagal menghapus akun Guru.");
        return;
      }

      setDeleting(null);
      toast.show(data.message ?? "Akun Guru berhasil dinonaktifkan.");

      await fetchTeachers();
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus Guru:", error);
      toast.show("Terjadi kesalahan saat menghapus akun Guru.");
    } finally {
      setSubmitting(false);
    }
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.navy} />

          <Text style={styles.loadingText}>Memuat daftar akun Guru...</Text>
        </View>
      ) : teachers.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="Belum ada akun Guru"
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
        onClose={() => {
          if (!submitting) {
            setFormVisible(false);
          }
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        visible={!!deleting}
        title="Hapus Akun Guru?"
        message={`Apakah anda yakin ingin menghapus akun "${
          deleting?.nama ?? ""
        }"? Guru ini tidak bisa masuk lagi ke aplikasi.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </LaboranScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "700",
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

  countText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: "700",
  },

  addButton: {
    marginBottom: 16,
  },

  addButtonWide: {
    alignSelf: "flex-start",
    minWidth: 220,
  },

  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 12,
  },
});
