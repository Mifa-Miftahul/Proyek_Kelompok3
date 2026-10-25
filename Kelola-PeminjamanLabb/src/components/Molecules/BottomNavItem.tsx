import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  navy: '#223F91',
  white: '#FFFFFF',
  paleBlue: '#E0E7FF',
};

type BottomNavItemProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  active?: boolean;
  onPress: () => void;
};

export default function BottomNavItem({
  label,
  icon,
  active = false,
  onPress,
}: BottomNavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onHoverIn={() => {}}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          active && styles.activeIconContainer,
        ]}
      >
        <Ionicons
          name={icon}
          size={26}
          color={active ? COLORS.navy : COLORS.white}
        />
      </View>

      <Text
        style={[
          styles.label,
          active && styles.activeLabel,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    gap: 3,
    borderRadius: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },

  iconContainer: {
    width: 42,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },

  activeIconContainer: {
    backgroundColor: COLORS.white,
    width: 47,
    height: 39,
    marginTop: -15,
    borderRadius: 18,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.18)',
      },
    }),
  },

  label: {
    color: COLORS.paleBlue,
    fontSize: 8,
    fontWeight: '500',
    textAlign: 'center',
  },

  activeLabel: {
    color: COLORS.white,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.75,
  },
});