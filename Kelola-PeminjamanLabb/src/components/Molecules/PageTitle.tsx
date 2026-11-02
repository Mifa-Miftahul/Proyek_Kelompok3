import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  description: string;
};

export default function PageTitle({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  title: {
    color: '#1E293B',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 5,
  },
  description: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
  },
});