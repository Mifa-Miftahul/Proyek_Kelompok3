import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderDashboardProps = {
  onNotificationPress: () => void;
};

const COLORS = {
  navy: '#223F91',
  white: '#FFFFFF',
};

export default function HeaderDashboard({
  onNotificationPress,
}: HeaderDashboardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.headerTextWrap}>
        <Text style={styles.greeting}>
          Halo, Salwa Ayudia 👋🏻
        </Text>

        <Text style={styles.schoolName}>
          Guru - SMK Islamic Center Cirebon
        </Text>
      </View>

      <Pressable
        style={[
          styles.notificationButton,
          Platform.OS === 'web' && isHovered
            ? styles.hoverNotification
            : null,
        ]}
        onPress={onNotificationPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        accessibilityRole="button"
        accessibilityLabel="Buka notifikasi"
        hitSlop={8}
      >
        <Ionicons
          name="notifications-outline"
          size={28}
          color={COLORS.white}
        />

        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 85,
    backgroundColor: COLORS.navy,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  schoolName: {
    color: '#E0E7FF',
    fontSize: 10,
    fontWeight: '400',
  },

  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 20,
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
    borderWidth: 1,
    borderColor: COLORS.navy,
  },

  hoverNotification: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
