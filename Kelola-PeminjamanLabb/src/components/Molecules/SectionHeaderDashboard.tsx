import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SectionHeaderProps = {
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
  style?: ViewStyle;
};

const COLORS = {
  navy: '#223F91',
  blue: '#3B82F6',
};

export default function SectionHeaderDashboard({
  title,
  onPress,
  showArrow = false,
  style,
}: SectionHeaderProps) {
  const isClickable = showArrow && !!onPress;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && isClickable ? styles.pressed : null,
      ]}
      onPress={isClickable ? onPress : undefined}
      disabled={!isClickable}
      accessibilityRole={isClickable ? 'button' : undefined}
      accessibilityLabel={
        isClickable ? `${title}, buka halaman riwayat` : title
      }
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={17}
          color={COLORS.blue}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  title: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
