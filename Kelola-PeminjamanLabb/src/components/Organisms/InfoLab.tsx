import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import InfoRowDaftarLab from '../Molecules/InfoRowDaftarLab';
import StatusBadgeDaftarLab from '../Molecules/StatusBadgeDaftarLab';

type LabStatus = 'Available' | 'Occupied';

type InfoLabProps = {
  name: string;
  room: string;
  totalDevices: number;
  status: LabStatus;
  deviceTypes: number;
  onDetail: () => void;
};

export default function InfoLab({
  name,
  room,
  totalDevices,
  status,
  deviceTypes,
  onDetail,
}: InfoLabProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.labName}>{name}</Text>
        <StatusBadgeDaftarLab status={status} />
      </View>

      <InfoRowDaftarLab
        icon="location-outline"
        value={room}
        variant="compact"
      />

      <InfoRowDaftarLab
        icon="hardware-chip-outline"
        value={`${totalDevices} unit perangkat`}
        variant="compact"
      />

      <View style={styles.footer}>
        <View style={styles.deviceTypes}>
          <Ionicons
            name="desktop-outline"
            size={14}
            color="#3B82F6"
          />
          <Text style={styles.deviceTypesText}>
            {deviceTypes} jenis perangkat
          </Text>
        </View>

        <Pressable
          style={styles.detailButton}
          onPress={onDetail}
          accessibilityRole="button"
        >
          <Text style={styles.detailText}>Lihat Detail</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#3B82F6"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 4,
  },

  labName: {
    color: '#223F91',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 7,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F7',
  },

  deviceTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  deviceTypesText: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: '600',
  },

  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  detailText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '600',
  },
});