import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  navy: '#223F91',
  white: '#FFFFFF',
  subtitle: '#DCE7FF',
};

type HeaderLabProps = {
  title?: string;
  description?: string;
};

export default function HeaderLab({
  title = 'Daftar Laboratorium',
  description = 'Informasi dan fasilitas laboratorium',
}: HeaderLabProps) {
  return (
    <View style={styles.header}>
      <MaterialCommunityIcons
        name="monitor"
        size={24}
        color={COLORS.white}
      />

      <View style={styles.headerTextWrap}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{description}</Text>
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

  headerTextWrap: {
    flex: 1,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: COLORS.subtitle,
    fontSize: 10,
    marginTop: 4,
  },
});