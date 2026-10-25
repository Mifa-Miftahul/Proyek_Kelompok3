
import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import SectionHeaderDashboard from '../Molecules/SectionHeaderDashboard';
import RequestCard from './RequestCardDahboard';

type RequestStatus = 'Accepted' | 'Pending' | 'Reject';

type RequestItem = {
  id: string;
  lab: string;
  date: string;
  time: string;
  status: RequestStatus;
  icon: React.ComponentProps<
    typeof import('@expo/vector-icons').MaterialCommunityIcons
  >['name'];
};

interface RequestSectionDashboardProps {
  title: string;
  items: RequestItem[];
  onRequestPress: (item: RequestItem) => void;
  onHeaderPress?: () => void;
  showArrow?: boolean;
  style?: ViewStyle;
}

export default function RequestSectionDashboard({
  title,
  items,
  onRequestPress,
  onHeaderPress,
  showArrow = false,
  style,
}: RequestSectionDashboardProps) {
  return (
    <View style={[styles.sectionCard, style]}>
      <SectionHeaderDashboard
        title={title}
        onPress={showArrow ? onHeaderPress : undefined}
        showArrow={showArrow}
      />

      <View style={styles.requestList}>
        {items.map((item) => (
          <RequestCard
            key={item.id}
            item={item}
            onPress={onRequestPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  requestList: {
    width: '100%',
    marginTop: 8,
  },
});
