import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Platform,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import StatusBadgeDashboard from '../Molecules/StatusBadgeDashboard';
import InfoRowDashboard from '../Molecules/InfoRowDashboard';

// ==================== TYPES ====================

type RequestStatus = 'Accepted' | 'Pending' | 'Reject';

type RequestItem = {
  id: string;
  lab: string;
  date: string;
  time: string;
  status: RequestStatus;
  icon: React.ComponentProps<
    typeof MaterialCommunityIcons
  >['name'];
};

interface RequestCardProps {
  item: RequestItem;
  onPress: (item: RequestItem) => void;
  style?: ViewStyle;
}

// ==================== COLORS ====================

const COLORS = {
  navy: '#223F91',
  paleBlue: '#DCEBFF',
  white: '#FFFFFF',
};

// ==================== COMPONENT ====================

export default function RequestCard({
  item,
  onPress,
  style,
}: RequestCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.requestCard,
        style,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Pengajuan ${item.id}, ${item.lab}, status ${item.status}`}
    >
      {/* IKON LABORATORIUM */}
      <View style={styles.labIconCircle}>
        <MaterialCommunityIcons
          name={item.icon}
          size={21}
          color={COLORS.navy}
        />
      </View>

      {/* INFORMASI PENGAJUAN */}
      <View style={styles.requestDetails}>
        {/* NAMA LAB DAN STATUS */}
        <View style={styles.requestTitleRow}>
          <Text
            style={styles.labName}
            numberOfLines={1}
          >
            {item.lab}
          </Text>

          <StatusBadgeDashboard status={item.status} />
        </View>

        {/* TANGGAL */}
        <InfoRowDashboard
          icon="calendar-outline"
          text={item.date}
        />

        {/* WAKTU DAN NAMA GURU */}
        <View style={styles.metaBottomRow}>
          <InfoRowDashboard
            icon="time-outline"
            text={item.time}
          />

          <InfoRowDashboard
            icon="person"
            text="Salwa Ayudia"
            style={styles.teacherMeta}
          />
        </View>
      </View>
    </Pressable>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 9,
    minHeight: 79,
    borderWidth: 1,
    borderColor: '#F0F4FA',
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(15, 23, 42, 0.08)',
      },
    }),
  },

  labIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  requestDetails: {
    flex: 1,
    minWidth: 0,
  },

  requestTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 1,
  },

  labName: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
  },

  metaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },

  teacherMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  pressed: {
    opacity: 0.75,
  },
});
