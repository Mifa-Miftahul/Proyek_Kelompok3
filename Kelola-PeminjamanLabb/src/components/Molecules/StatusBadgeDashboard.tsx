import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type StatusType = 'Pending' | 'Accepted' | 'Reject';

type StatusBadgeProps = {
  status: StatusType;
  style?: ViewStyle;
};

const STATUS_COLORS = {
  Pending: {
    background: '#FEF3C7',
    text: '#D97706',
  },
  Accepted: {
    background: '#D1FAE5',
    text: '#059669',
  },
  Reject: {
    background: '#FEE2E2',
    text: '#EF4444',
  },
};

export default function StatusBadge({
  status,
  style,
}: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.background },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${status}`}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    minHeight: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
