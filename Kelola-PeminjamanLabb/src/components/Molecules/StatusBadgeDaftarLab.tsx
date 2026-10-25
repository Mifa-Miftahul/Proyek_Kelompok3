
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  green: '#059669',
  paleGreen: '#D1FAE5',
  red: '#DC2626',
  paleRed: '#FEE2E2',
};

type LabStatus = 'Available' | 'Occupied';

type StatusBadgeProps = {
  status: LabStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isAvailable = status === 'Available';

  return (
    <View
      style={[
        styles.statusBadge,
        isAvailable ? styles.availableBadge : styles.busyBadge,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: isAvailable ? COLORS.green : COLORS.red,
          },
        ]}
      />

      <Text
        style={[
          styles.statusText,
          { color: isAvailable ? COLORS.green : COLORS.red },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  availableBadge: {
    backgroundColor: COLORS.paleGreen,
  },

  busyBadge: {
    backgroundColor: COLORS.paleRed,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
});
