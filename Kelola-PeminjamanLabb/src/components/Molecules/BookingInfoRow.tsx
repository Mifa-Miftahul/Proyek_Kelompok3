import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
};

export default function BookingInfoRow({ icon, text }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={16} color="#64748B" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7,
  },
  text: {
    color: '#64748B',
    fontSize: 12,
    flexShrink: 1,
  },
});