import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  navy: '#223F91',
  paleBlue: '#DCEBFF',
  muted: '#64748B',
  text: '#1E293B',
};

type InfoRowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label?: string;
  value: string;
  variant?: 'compact' | 'detail';
};

export default function InfoRow({
  icon,
  label,
  value,
  variant = 'detail',
}: InfoRowProps) {
  if (variant === 'compact') {
    return (
      <View style={styles.infoRow}>
        <Ionicons
          name={icon}
          size={14}
          color={COLORS.muted}
        />
        <Text style={styles.infoText}>{value}</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailInfoRow}>
      <View style={styles.detailInfoIcon}>
        <Ionicons name={icon} size={19} color={COLORS.navy} />
      </View>

      <View style={styles.detailInfoText}>
        {!!label && (
          <Text style={styles.detailInfoLabel}>{label}</Text>
        )}
        <Text style={styles.detailInfoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Tampilan ringkas pada kartu laboratorium
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  infoText: {
    color: COLORS.muted,
    fontSize: 11,
    flexShrink: 1,
  },

  // Tampilan detail pada Informasi Laboratorium
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginBottom: 16,
  },

  detailInfoIcon: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.paleBlue,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailInfoText: {
    flex: 1,
    paddingTop: 2,
  },

  detailInfoLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 4,
  },

  detailInfoValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
});
