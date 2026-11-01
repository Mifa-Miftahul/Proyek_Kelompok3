import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LaboranHeader from '../Molecules/LaboranHeader';
import Toast from '../Molecules/Toast';
import LaboranBottomNavigation, { LaboranRoute } from './LaboranBottomNavigation';
import LaboranSidebar from './LaboranSidebar';

const COLORS = {
  navy: '#223F91',
  background: '#F5F7FB',
  border: '#E2E8F0',
};

// Batas lebar layar
const TABLET_MIN = 768; // iPad: sidebar ikon
const LAPTOP_MIN = 1024; // laptop / iPad landscape: sidebar penuh

type LaboranScreenLayoutProps = {
  title: string;
  description: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  activeRoute: LaboranRoute;
  toastMessage: string | null;
  children: React.ReactNode;
};

// Kerangka semua halaman laboran.
// HP: header + isi + bottom nav. iPad / laptop: sidebar + header + isi.
export default function LaboranScreenLayout({
  title,
  description,
  icon,
  activeRoute,
  toastMessage,
  children,
}: LaboranScreenLayoutProps) {
  const { width } = useWindowDimensions();
  const wide = width >= TABLET_MIN;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {wide ? (
        <View style={styles.row}>
          <LaboranSidebar
            activeRoute={activeRoute}
            compact={width < LAPTOP_MIN}
          />

          <View style={styles.main}>
            <LaboranHeader title={title} description={description} icon={icon} />

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.wideScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.wideContent}>{children}</View>
            </ScrollView>

            <Toast message={toastMessage} bottom={24} />
          </View>
        </View>
      ) : (
        <View style={styles.screen}>
          <View style={styles.page}>
            <LaboranHeader title={title} description={description} icon={icon} />

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            <Toast message={toastMessage} />
            <LaboranBottomNavigation activeRoute={activeRoute} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
  },

  // ----- HP -----
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    backgroundColor: COLORS.background,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 24 },

  // ----- iPad / laptop -----
  row: { flex: 1, flexDirection: 'row' },
  main: { flex: 1, minWidth: 0, backgroundColor: COLORS.background },
  wideScrollContent: { padding: 24, paddingBottom: 40 },
  wideContent: { width: '100%', maxWidth: 1180, alignSelf: 'center' },
});
