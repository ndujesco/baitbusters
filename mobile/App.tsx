// App.tsx
import React, { useRef, useState } from 'react';
import {

  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,

} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsProvider, useSettings } from './App/contexts';
import { APP_DICTIONARY } from './App/dictionary';

import ActivityPage from './App/ActivityPage';
import SettingsPage from './App/SettingsPage';
import { SCREEN_WIDTH } from './App/const';
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

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>{t.app.title}</Text>
        <Text style={styles.subtitle}>{t.app.subtitle}</Text>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          onPress={() => {
            setActiveIndex(0);
            pagerRef.current?.scrollToIndex({ index: 0, animated: true });
          }}
          style={[styles.tab, activeIndex === 0 && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeIndex === 0 && styles.tabTextActive]}>{t.tabs.activity}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setActiveIndex(1);
            pagerRef.current?.scrollToIndex({ index: 1, animated: true });
          }}
          style={[styles.tab, activeIndex === 1 && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeIndex === 1 && styles.tabTextActive]}>{t.tabs.settings}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setActiveIndex(2);
            pagerRef.current?.scrollToIndex({ index: 2, animated: true });
          }}
          style={[styles.tab, activeIndex === 2 && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeIndex === 2 && styles.tabTextActive]}>
            Subscription
          </Text>
        </Pressable>

      </View>

      <FlatList
        data={[{ key: 'activity' }, { key: 'settings' }, { key: 'subscriptions' }]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={pagerRef}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / ev.nativeEvent.layoutMeasurement.width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            {item.key === "activity" ? (
              <ActivityPage />
            ) : item.key === "settings" ? (
              <SettingsPage />
            ) : (
              <SubscriptionPage />

            )}
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#475569', marginTop: 4 },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 6,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6edf3',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#68ea7bff',
    borderColor: '#68ea7bff',
  },
  tabText: { color: '#334155', fontWeight: '700' },
  tabTextActive: { color: '#fff' },
});