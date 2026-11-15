import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    formatDate,
    formatDateTime,
    type GuruRequest,
} from "../../lib/guruRequests";
import HistoryInfoRow from "../Molecules/HistoryInfoRow";
import HistoryStatusBadge from "../Molecules/HistoryStatusBadge";

type Props = {
  visible: boolean;
  request: GuruRequest | null;
  onClose: () => void;
};

const STATUS_NOTE = {
  Pending: {
    bg: "#FFF4D6",
    fg: "#B7791F",
    text: "Pengajuan kamu sedang menunggu persetujuan laboran.",
  },
  Disetujui: {
    bg: "#DCFCE7",
    fg: "#15803D",
    text: "Pengajuan disetujui. Gunakan laboratorium sesuai tanggal dan jam yang diajukan.",
  },
  Ditolak: {
    bg: "#FEE2E2",
    fg: "#B91C1C",
    text: "Pengajuan ditolak oleh laboran.",
  },
} as const;

// Detail pengajuan peminjaman milik Guru (bottom sheet).
export default function GuruRequestDetailModal({
  visible,
  request,
  onClose,
}: Props) {
  if (!request) return null;

  const note = STATUS_NOTE[request.bookingStatus];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modal}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Detail Pengajuan</Text>
              <Text style={styles.id}>{request.id}</Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Tutup detail"
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* LAB + STATUS */}
            <View style={styles.labBox}>
              <View style={styles.labIcon}>
                <MaterialCommunityIcons
                  name={request.icon}
                  size={24}
                  color="#223F91"
                />
              </View>

              <View style={styles.labText}>
                <Text style={styles.labName}>{request.lab}</Text>
                <Text style={styles.labRoom}>{request.labRoom}</Text>
              </View>

              <HistoryStatusBadge status={request.bookingStatus} />
            </View>

            {/* CATATAN STATUS */}
            <View style={[styles.noteBox, { backgroundColor: note.bg }]}>
              <Text style={[styles.noteText, { color: note.fg }]}>
                {note.text}
              </Text>
            </View>

            {/* ALASAN PENOLAKAN */}
            {request.bookingStatus === "Ditolak" && (
              <View style={styles.rejectionBox}>
                <Text style={styles.rejectionTitle}>Alasan Penolakan</Text>
                <Text style={styles.rejectionText}>
                  {request.rejectionReason ??
                    "Laboran tidak menuliskan alasan."}
                </Text>
              </View>
            )}

            {/* INFORMASI */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informasi Peminjaman</Text>

              <HistoryInfoRow
                label="Tanggal"
                value={formatDate(request.dateRaw, true)}
              />
              <HistoryInfoRow label="Waktu" value={request.time} />
              <HistoryInfoRow label="Kelas" value={request.className} />
              <HistoryInfoRow label="Mata Pelajaran" value={request.subject} />
              <HistoryInfoRow
                label="Jumlah Siswa"
                value={`${request.studentCount} siswa`}
              />
              <HistoryInfoRow label="Keperluan" value={request.purpose} />
              <HistoryInfoRow
                label="Diajukan Pada"
                value={formatDateTime(request.createdAt)}
              />
            </View>
          </ScrollView>

          <Pressable style={styles.closeAction} onPress={onClose}>
            <Text style={styles.closeActionText}>Tutup</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdrop: {
    flex: 1,
  },
  modal: {
    maxHeight: "88%",
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 5,
    backgroundColor: "#D8DCE5",
    alignSelf: "center",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#223F91",
  },
  id: {
    fontSize: 11,
    color: "#8991A3",
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F3F8",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 23,
    color: "#59647A",
    lineHeight: 26,
  },
  labBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    backgroundColor: "#F7F8FC",
    borderRadius: 12,
    marginBottom: 12,
  },
  labIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DCEBFF",
    alignItems: "center",
    justifyContent: "center",
  },
  labText: {
    flex: 1,
    minWidth: 0,
  },
  labName: {
    color: "#223F91",
    fontSize: 14,
    fontWeight: "800",
  },
  labRoom: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
  },
  noteBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  rejectionBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  rejectionTitle: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 5,
  },
  rejectionText: {
    color: "#7F1D1D",
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    paddingTop: 4,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#35415B",
    marginBottom: 13,
  },
  closeAction: {
    backgroundColor: "#223F91",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  closeActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
