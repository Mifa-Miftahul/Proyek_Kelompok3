import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
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



type Variant = 'primary' | 'secondary' | 'danger' | 'dangerSoft';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  small?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const VARIANTS: Record<
  Variant,
  { bg: string; border: string; text: string }
> = {
  primary: {
    bg: COLORS.navy,
    border: COLORS.navy,
    text: COLORS.white,
  },
  secondary: {
    bg: COLORS.white,
    border: COLORS.border,
    text: COLORS.navy,
  },
  danger: {
    bg: COLORS.red,
    border: COLORS.red,
    text: COLORS.white,
  },
  dangerSoft: {
    bg: COLORS.paleRed,
    border: COLORS.paleRed,
    text: COLORS.red,
  },
};

export default function ActionButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  small = false,
  disabled = false,
  style,
}: ActionButtonProps) {
  const colors = VARIANTS[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        small && styles.small,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && (
        <Ionicons name={icon} size={small ? 14 : 18} color={colors.text} />
      )}
      <Text
        style={[
          styles.text,
          small && styles.smallText,
          { color: colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  small: {
    minHeight: 34,
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  text: { fontSize: 14, fontWeight: '600' },
  smallText: { fontSize: 11 },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
