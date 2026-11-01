import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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



// Pesan singkat "berhasil" yang hilang sendiri setelah beberapa detik.
export function useToast(duration = 2200) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (text: string) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(text);
      timer.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { message, show };
}

type ToastProps = {
  message: string | null;
  // Jarak dari bawah layar (HP: di atas bottom nav, laptop/iPad: lebih rendah)
  bottom?: number;
};

// Pesan sukses, contoh: "Jadwal berhasil ditambahkan". Pakai bersama useToast().
export default function Toast({ message, bottom = 80 }: ToastProps) {
  if (!message) return null;

  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="none">
      <View style={styles.toast}>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={COLORS.paleGreen}
        />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  text: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
});
