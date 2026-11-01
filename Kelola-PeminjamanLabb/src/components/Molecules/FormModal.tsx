import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ActionButton from './ActionButton';

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


type FormModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit?: () => void;
  // Ganti tombol Batal/Simpan bawaan (contoh: tombol Setujui / Tolak)
  footer?: React.ReactNode;
  children: React.ReactNode;
};

// Wadah form berbentuk bottom sheet (judul + isi + tombol Batal/Simpan).
export default function FormModal({
  visible,
  title,
  subtitle,
  submitLabel = 'Simpan',
  onClose,
  onSubmit,
  footer,
  children,
}: FormModalProps) {
  // iPad / laptop: form tampil sebagai dialog di tengah, HP: bottom sheet
  const wide = useWindowDimensions().width >= 768;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={wide ? 'fade' : 'slide'}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.overlay, wide && styles.overlayWide]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, wide && styles.sheetWide]}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Tutup form"
            >
              <Ionicons name="close" size={20} color={COLORS.muted} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          <View style={styles.footer}>
            {footer ?? (
              <>
                <ActionButton
                  label="Batal"
                  variant="secondary"
                  onPress={onClose}
                  style={styles.footerButton}
                />
                <ActionButton
                  label={submitLabel}
                  icon="checkmark"
                  onPress={() => onSubmit?.()}
                  style={styles.footerButton}
                />
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayWide: {
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  sheet: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  sheetWide: {
    maxHeight: '88%',
    borderRadius: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  headerText: { flex: 1 },
  title: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  subtitle: { color: '#DCE7FF', fontSize: 10, marginTop: 4 },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  body: { flexGrow: 0 },
  bodyContent: { padding: 18, paddingBottom: 6 },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  footerButton: { flex: 1 },
});
