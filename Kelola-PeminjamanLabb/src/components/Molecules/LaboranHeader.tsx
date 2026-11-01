import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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



type LaboranHeaderProps = {
  title: string;
  description: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

// Header navy dengan sudut bawah membulat, sama seperti HeaderDaftarLab.
export default function LaboranHeader({
  title,
  description,
  icon = 'monitor',
}: LaboranHeaderProps) {
  return (
    <View style={styles.header}>
      <MaterialCommunityIcons name={icon} size={24} color={COLORS.white} />

      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 82,
    backgroundColor: COLORS.navy,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textWrap: { flex: 1 },
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
});
