import React from 'react';
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



type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
};

export default function EmptyState({
  title,
  description,
  icon = 'calendar-outline',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={30} color={COLORS.navy} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 26,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleBlue,
    marginBottom: 14,
  },
  title: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
