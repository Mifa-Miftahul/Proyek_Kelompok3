import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InfoRowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  style?: ViewStyle;
};

const COLORS = {
  muted: '#64748B',
};

export default function InfoRow({
  icon,
  text,
  style,
}: InfoRowProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name={icon}
        size={12}
        color={COLORS.muted}
      />

      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
    marginVertical: 1,
  },
  text: {
    color: COLORS.muted,
    fontSize: 8,
    flexShrink: 1,
  },
});
