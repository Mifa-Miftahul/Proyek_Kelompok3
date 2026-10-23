import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
  paleBlue: '#DCEBFF',
};

type SummaryCardProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: number | string;
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function SummaryCard({
  icon,
  value,
  label,
  onPress,
  style,
}: SummaryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={19}
          color={COLORS.blue}
        />
      </View>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 88,
    minHeight: 88,
    borderRadius: 14,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 7,
    flexShrink: 0,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.08)',
      },
    }),
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },

  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
    marginTop: 1,
  },

  label: {
    color: COLORS.blue,
    fontSize: 9,
    lineHeight: 12,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.8,
  },
});