import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  name?: string;
  onNotificationPress?: () => void;
};

export default function BookingHeader({
  name = 'Laboran',
  onNotificationPress,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.textWrap}>
        <Text style={styles.greeting}>Halo, {name} 👋🏻</Text>
        <Text style={styles.subtitle}>
          Laboran - SMK Islamic Center Cirebon
        </Text>
      </View>

      <Pressable
        style={styles.notification}
        onPress={
          onNotificationPress ??
          (() => Alert.alert('Notifikasi', 'Belum ada notifikasi baru.'))
        }
      >
        <Ionicons
          name="notifications-outline"
          size={26}
          color="#FFFFFF"
        />
        <View style={styles.dot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 85,
    backgroundColor: '#223F91',
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    paddingHorizontal: 24,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrap: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#E0E7FF',
    fontSize: 11,
  },
  notification: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
  },
});