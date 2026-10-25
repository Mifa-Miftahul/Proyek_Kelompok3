import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
  white: '#FFFFFF',
  text: '#1F2937',
  secondary: '#6B7280',
};

interface SummaryPanelProps {
  pendingCount: number;
  laboratoryCount: number;
  style?: ViewStyle;
}

export default function SummaryPanel({
  pendingCount,
  laboratoryCount,
  style,
}: SummaryPanelProps) {
  return (
    <View style={[styles.container, style]}>
      {/* PENGAJUAN PENDING */}
      <View style={styles.summaryCard}>
        <View
          style={[
            styles.iconContainer,
            styles.pendingIconContainer,
          ]}
        >
          <MaterialCommunityIcons
            name="clipboard-clock-outline"
            size={23}
            color={COLORS.navy}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.count}>
            {pendingCount}
          </Text>

          <Text style={styles.label}>
            Pengajuan Pending
          </Text>
        </View>
      </View>

      {/* TOTAL LABORATORIUM */}
      <View style={styles.summaryCard}>
        <View
          style={[
            styles.iconContainer,
            styles.laboratoryIconContainer,
          ]}
        >
          <MaterialCommunityIcons
            name="monitor"
            size={23}
            color={COLORS.navy}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.count}>
            {laboratoryCount}
          </Text>

          <Text style={styles.label}>
            Total Laboratorium
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  summaryCard: {
    flex: 1,
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  pendingIconContainer: {
    backgroundColor: '#EAF2FF',
  },

  laboratoryIconContainer: {
    backgroundColor: COLORS.paleBlue,
  },

  textContainer: {
    flex: 1,
  },

  count: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 3,
  },

  label: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
});
