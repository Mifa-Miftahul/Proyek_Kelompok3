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
  white: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  background: '#F5F7FB',
};

type FormModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

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
  const wide = useWindowDimensions().width >= 768;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={wide ? 'fade' : 'slide'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={[styles.overlay, wide && styles.overlayWide]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Tutup modal"
        />

        <View
          style={[styles.sheet, wide && styles.sheetWide]}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>

              {!!subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
              )}
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Tutup form"
            >
              <Ionicons
                name="close"
                size={20}
                color={COLORS.muted}
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    zIndex: 0,
  },
  sheet: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    flexShrink: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    zIndex: 1,
    elevation: 8,
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
  headerText: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#DCE7FF',
    fontSize: 10,
    marginTop: 4,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  body: {
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 0,
  },
  bodyContent: {
    padding: 18,
    paddingBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  footerButton: {
    flex: 1,
  },
});
