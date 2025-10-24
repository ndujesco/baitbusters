// App.tsx
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsProvider, useSettings } from './App/contexts';
import { APP_DICTIONARY } from './App/dictionary';

import ActivityPage from './App/ActivityPage';
import SettingsPage from './App/SettingsPage';
import { ACCENT, BACKGROUND, SCREEN_WIDTH } from './App/const';
import SubscriptionPage from './App/SubscriptionPage';

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <MainApp />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

function MainAppInner() {
  const insets = useSafeAreaInsets();
  const { language } = useSettings();
  const t = APP_DICTIONARY[language];

  const pagerRef = useRef<FlatList<any> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // small animated underline for the active tab
  const indicator = useRef(new Animated.Value(0)).current;
  const onChangeIndex = (idx: number) => {
    setActiveIndex(idx);
    Animated.spring(indicator, {
      toValue: idx,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t.app.title}</Text>
          <Text style={styles.subtitle}>{t.app.subtitle}</Text>
        </View>

        <View style={styles.rightHeader}>
          <Text style={styles.smallLabel}>v1.0</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        {[
          { key: 'activity', label: t.tabs.activity },
          { key: 'settings', label: t.tabs.settings },
          { key: 'subscriptions', label: 'Subscription' },
        ].map((tab, idx) => {
          const active = activeIndex === idx;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                pagerRef.current?.scrollToIndex({ index: idx, animated: true });
                onChangeIndex(idx);
              }}
              style={({ pressed }) => [
                styles.tab,
                active && styles.tabActive,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* subtle underline indicator (animated) */}
      <View style={styles.indicatorWrap}>
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                {
                  translateX: indicator.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, 112, 224], // roughly tab widths (tweak if you change tab padding)
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <FlatList
        data={[{ key: 'activity' }, { key: 'settings' }, { key: 'subscriptions' }]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={pagerRef}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / ev.nativeEvent.layoutMeasurement.width);
          onChangeIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            {item.key === 'activity' ? <ActivityPage /> : item.key === 'settings' ? <SettingsPage /> : <SubscriptionPage />}
          </View>
        )}
        keyExtractor={(i) => i.key}
      />
    </SafeAreaView>
  );
}
function MainApp() {
  return <MainAppInner />;
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 20 : 6, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 2 },
  rightHeader: { alignItems: 'flex-end' },
  smallLabel: { color: '#94a3b8', fontSize: 12 },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef2f6',
    marginRight: 8,
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  tabText: { color: '#334155', fontWeight: '700' },
  tabTextActive: { color: '#fff' },

  indicatorWrap: { height: 6, marginHorizontal: 16, marginBottom: 12 },
  indicator: {
    width: 96,
    height: 6,
    borderRadius: 6,
    backgroundColor: ACCENT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
