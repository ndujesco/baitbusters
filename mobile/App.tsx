// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  Modal,
  NativeModules,
  Platform,
  PermissionsAndroid,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  EmitterSubscription,
  Dimensions,
  AppStateStatus,
  AppState,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from './App/contexts';
import { APP_DICTIONARY } from './App/constants';
import PermissionStatus from './App/components/PermissionStatus';

const { SmsListenerModule, NotificationListenerModule, NotificationSenderModule, SmsIntentModule } =
  (NativeModules as any) || {};

const SCREEN_WIDTH = Dimensions.get('window').width;
const GATEWAY_NUMBER = '07061217361';

const normalizePhone = (num: string) => {
  let n = num.replace(/[^\d]/g, '');
  if (n.startsWith('234')) n = '0' + n.slice(3);
  return n;
};

function checkSpamStatus(message: string) {
  if (message.includes("This is definitely a spam message")) { return 1; }
  else if (message.includes("This may be a spam message")) { return 0.5 }
  else { return 0 }
}

function safeJsonParse(input: string | null | undefined) {
  if (!input) return null;
  try {
    const sanitized = input.replace(/[\u0000-\u001F]+/g, '');
    return JSON.parse(sanitized);
  } catch {
    return null;
  }
}

const showToast = (msg: string) => {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else console.log('toast:', msg);
};

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
      </View>

      <FlatList
        data={[{ key: 'activity' }, { key: 'settings' }]}
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
            {item.key === 'activity' ? <ActivityPage /> : <SettingsPage />}
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

/* ------------------ Activity Page ------------------ */
function ActivityPage() {
  const { language, listenSms, listenNotifications, canSendNotifications } = useSettings();
  const t = APP_DICTIONARY[language];

  type Log = {
    id: string;
    source: string;
    from?: string | null;
    packageName?: string;
    body: string;
    spamStatus: number;
    receivedAt: number;
  };

  const [logs, setLogs] = useState<Log[]>([]);

  const smsSubRef = useRef<EmitterSubscription | null>(null);
  const notifSubRef = useRef<EmitterSubscription | null>(null);
  const recentBodiesRef = useRef<Set<string>>(new Set());

  const inferAppLabel = (pkg?: string) => {
    if (!pkg) return t.ui.unknown;
    const p = pkg.toLowerCase();
    if (p.includes('whatsapp')) return 'WhatsApp';
    if (p.includes('gmail') || p.includes('google')) return 'Gmail';
    if (p.includes('yahoo')) return 'Yahoo Mail';
    if (p.includes('messenger') || p.includes('facebook')) return 'Messenger';
    if (p.includes('telegram')) return 'Telegram';
    if (p.includes('mail') || p.includes('outlook')) return 'Mail';
    return pkg;
  };

  const checkMessage = (entry: Omit<Log, 'id' | 'spamStatus'>) => {
    const { body, from } = entry;
    if (!body) return;

    if (recentBodiesRef.current.has(body)) return;
    recentBodiesRef.current.add(body);

    if (logs.some((log) => log.body === body)) return;

    const spamStatus = checkSpamStatus(body);

    if (spamStatus === 0) return;

    const id = `${Date.now()}`;

    if (spamStatus === 0.5) {
      if (canSendNotifications && NotificationSenderModule) {
        const smsBody = JSON.stringify({ id, body })
        try {
          NotificationSenderModule?.sendNotificationWithSmsAction?.(
            `From ${from}`,
            `"${t.activity.potentialSpam}`,
            'REPORT',
            GATEWAY_NUMBER,
            smsBody,
          );
        } catch {
          // ignore
        }
      }
    }

    if (spamStatus === 1) {
      try {
        NotificationSenderModule?.sendHighPriorityAlert?.(
          `${t.activity.spamDetected}`,
          `From: ${from} — "${body}"`,
        );
      } catch {
        // ignore
      }
    }

    const log: Log = {
      id,
      ...entry,
      receivedAt: entry.receivedAt ?? Date.now(),
      spamStatus,
    };

    setLogs((prev) => {
      if (prev.some((l) => l.body === body)) return prev;
      return [log, ...prev].slice(0, 200);
    });
  };

  const updateSpamStatus = (messageBody: string) => {
    const data = safeJsonParse(messageBody);

    if (!data || typeof data !== 'object') {
      try {
        NotificationSenderModule?.sendHighPriorityAlert?.(t.errors.invalidMessageBody);
      } catch {}
      return;
    }

    const { id, spamStatus } = data as any;

    if (typeof id !== 'string' || (typeof spamStatus !== 'number' && typeof spamStatus !== 'string')) {
      try {
        NotificationSenderModule?.sendHighPriorityAlert?.(t.errors.invalidMessageStructure);
      } catch {}
      return;
    }

    const numericSpamStatus = typeof spamStatus === 'string' ? parseFloat(spamStatus) : spamStatus;

    const foundLog = logs.find((log) => log.id === id);

    if (!foundLog) {
      try {
        NotificationSenderModule?.sendHighPriorityAlert?.(t.errors.messageIdNotFound);
      } catch {}
      return;
    }

    const { from, body } = foundLog;

    setLogs((prevLogs) =>
      prevLogs.map((log) => (log.id === id ? { ...log, spamStatus: numericSpamStatus } : log))
    );

    try {
      if (numericSpamStatus === 0) {
        // optionally notify safe
      } else if (numericSpamStatus === 1) {
        NotificationSenderModule?.sendHighPriorityAlert?.(
          `${t.activity.spamDetected}`,
          `From: ${from} — "${body}"`
        );
      }
    } catch {}
  };

  useEffect(() => {
    if (!listenSms) {
      try { SmsListenerModule?.stopListeningToSMS(); } catch { }
      if (smsSubRef.current) {
        try { smsSubRef.current.remove(); } catch { }
        smsSubRef.current = null;
      }
      return;
    }

    try { SmsListenerModule?.startListeningToSMS(); } catch (err) { console.warn('SmsListenerModule.startListeningToSMS error', err); }

    const sub = DeviceEventEmitter.addListener('onSMSReceived', (message: any) => {
      const data = typeof message === 'string' ? safeJsonParse(message) : message;
      if (!data) return;
      const { senderPhoneNumber: from, messageBody: body } = data;

      if (normalizePhone(from) === GATEWAY_NUMBER) {
        updateSpamStatus(body)
      }

      checkMessage({
        source: 'SMS',
        packageName: 'com.sms',
        from,
        body,
        receivedAt: Date.now(),
      });
    });

    smsSubRef.current = sub;

    return () => {
      try { SmsListenerModule?.stopListeningToSMS(); } catch { }
      if (smsSubRef.current) {
        try { smsSubRef.current.remove(); } catch { }
        smsSubRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listenSms, language, canSendNotifications, logs]);

  useEffect(() => {
    if (!listenNotifications) {
      if (notifSubRef.current) {
        try { notifSubRef.current.remove(); } catch { }
        notifSubRef.current = null;
      }
      return;
    }

    const sub = DeviceEventEmitter.addListener('onNotificationReceived', (notification: any) => {
      const data = typeof notification === 'string' ? safeJsonParse(notification) : notification;
      if (!data) return;
      const { packageName, title, text } = data;
      const messagingApps = ['whatsapp', 'gmail', 'yahoo', 'messenger', 'telegram', 'mail'];
      if (!messagingApps.some(app => packageName?.toLowerCase().includes(app))) return;

      const skipTitle = ['WhatsApp', 'Gmail', 'Yahoo Mail', 'Messenger', 'Telegram', 'Mail'];
      const skipTextPatterns = [
        /\d+\smessages?\sfrom\s\d+\schats?/i,
        /new email/i,
        /new message/i,
        /notification/i,
      ];
      if (skipTitle.includes(title)) return;
      if (skipTextPatterns.some(pattern => pattern.test(text))) return;

      checkMessage({
        source: inferAppLabel(packageName),
        from: title ?? null,
        packageName,
        body: text,
        receivedAt: Date.now(),
      });
    });

    notifSubRef.current = sub;
    return () => {
      if (notifSubRef.current) {
        try { notifSubRef.current.remove(); } catch { }
        notifSubRef.current = null;
      }
    };
  }, [listenNotifications, language]);

  const renderLogItem = ({ item }: { item: Log }) => {
    const time = new Date(item.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const label = item.source;
    const from = item.from ?? t.ui.unknown;
    const spamStatus = (item as any).spamStatus ?? 0;
    const { id, body } = item

    const bodyColor = spamStatus === 1 ? '#b91c1c' : spamStatus === 0.5 ? '#f59e0b' : '#16a34a';
    const pillText = spamStatus === 1 ? t.activity.pill.spam : spamStatus === 0.5 ? t.activity.pill.potential : t.activity.pill.ok;
    const pillColor = bodyColor;

    return (
      <View style={styles.logCard}>
        <View style={styles.logHeader}>
          <Text style={styles.logFrom}>{`${label} • ${from}`}</Text>
          <Text style={{ color: '#6b7280' }}>{time}</Text>
        </View>

        <Text style={[styles.logBody, { color: bodyColor }]} numberOfLines={3}>
          {body}
        </Text>

        <View style={styles.logFooter}>
          <View style={[styles.statusPill, { backgroundColor: pillColor }]}>
            <Text style={styles.statusPillText}>{pillText}</Text>
          </View>

          {spamStatus === 0.5 ? (
            <Pressable
              onPress={() => {
                try {
                  SmsIntentModule.openSmsApp(GATEWAY_NUMBER, JSON.stringify({ id, body }))
                } catch {
                  // ignore if not defined yet
                }
              }}
              style={({ pressed }) => [styles.reportButton, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.reportButtonText}>{t.activity.reportButton}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.centerCard}>
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.statusLabel}>{t.listeningLabel}</Text>
          </View>
        </View>

        <View style={styles.statusItems}>
          <View style={styles.statusRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.indicator, listenSms ? styles.indicatorOn : styles.indicatorOff]} />
              <Text style={styles.statusRowLabel}>{t.statusLabels.canListenSms}</Text>
            </View>
            <View style={[styles.badge, listenSms ? styles.badgeOn : styles.badgeOff]}>
              <Text style={[styles.badgeText, listenSms ? styles.badgeTextOn : styles.badgeTextOff]}>
                {listenSms ? t.ui.yes : t.ui.no}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.indicator, listenNotifications ? styles.indicatorOn : styles.indicatorOff]} />
              <Text style={styles.statusRowLabel}>{t.statusLabels.canListenNotifications}</Text>
            </View>
            <View style={[styles.badge, listenNotifications ? styles.badgeOn : styles.badgeOff]}>
              <Text style={[styles.badgeText, listenNotifications ? styles.badgeTextOn : styles.badgeTextOff]}>
                {listenNotifications ? t.ui.yes : t.ui.no}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.indicator, canSendNotifications ? styles.indicatorOn : styles.indicatorOff]} />
              <Text style={styles.statusRowLabel}>{t.statusLabels.canPostNotifications}</Text>
            </View>
            <View style={[styles.badge, canSendNotifications ? styles.badgeOn : styles.badgeOff]}>
              <Text style={[styles.badgeText, canSendNotifications ? styles.badgeTextOn : styles.badgeTextOff]}>
                {canSendNotifications ? t.ui.yes : t.ui.no}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 50 }} />

      <View style={styles.logList}>
        <View style={styles.logHeaderRow}>
          <Text style={styles.logTitle}>{t.activity.logTitle}</Text>
          <View style={styles.logCount}>
            <Text style={styles.logCountText}>{logs.length}</Text>
          </View>
        </View>

        <FlatList
          data={logs}
          keyExtractor={(i) => i.id}
          renderItem={renderLogItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: '#6b7280' }}>{t.activity.noMessages}</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      </View>
    </View>
  );
}

/* ------------------ Settings Page ------------------ */
function SettingsPage() {
  const { language, setLanguage, listenSms, setListenSms, listenNotifications, setListenNotifications, canSendNotifications, setCanSendNotifications } =
    useSettings();
  const t = APP_DICTIONARY[language];

  const [langOpen, setLangOpen] = useState(false);

  async function requestSmsPermissions() {
    if (Platform.OS !== 'android') {
      setListenSms(true);
      return;
    }
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    );
    const granted =
      result === PermissionsAndroid.RESULTS.GRANTED;
    setListenSms(granted);
    if (!granted) showToast(t.permissions.needPermissions);
    else showToast(t.ui.yes);
  }

  async function requestPostNotification() {
    if (Platform.OS !== 'android') {
      setCanSendNotifications(true);
      return;
    }
    if (!PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
      setCanSendNotifications(true);
      return;
    }
    const r = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const ok = r === PermissionsAndroid.RESULTS.GRANTED;
    setCanSendNotifications(ok);
  }

  const selectLanguage = (key: string) => {
    setLanguage(key as any);
    setLangOpen(false);
    showToast(`Language set to ${key}`);
  };

  return (
    <View style={styles.settingsPage}>
      <View style={styles.settingsTopSpace} />

      <View style={[styles.section, styles.sectionWithSpace]}>
        <Text style={styles.sectionLabel}>{t.settings.languageLabel}</Text>

        <View style={styles.pickerWrapper}>
          <Pressable
            onPress={() => setLangOpen(true)}
            style={({ pressed }) => [styles.pickerBox, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.pickerText}>
              {APP_DICTIONARY[language].languageOptionsDisplay.find((o) => o.key === language)?.label ?? language}
            </Text>
            <Text style={styles.caret}>{'▼'}</Text>
          </Pressable>
        </View>

        <Text style={styles.hintText}>{t.settings.persistNotice}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t.permissions.title}</Text>

        <PermissionStatus
          title={t.permissions.smsTitle}
          subtitle={listenSms ? '': t.permissions.needPermissions}
          granted={listenSms}
          onRequest={requestSmsPermissions}
        />

        <PermissionStatus
          title={t.permissions.notificationsTitle}
          subtitle={listenNotifications ? '' : t.permissions.needPermissions}
          granted={listenNotifications}
          onRequest={async () => {
            await NotificationListenerModule?.requestPermission();

            const handleAppStateChange = async (nextAppState: AppStateStatus) => {
              if (nextAppState === 'active') {
                subscription.remove();

                const granted = await NotificationListenerModule?.isPermissionGranted();
                if (granted) {
                  setListenNotifications(true);
                  NotificationListenerModule?.startListening();
                  showToast('Notification Listener Enabled');
                } else {
                  setListenNotifications(false);
                  showToast('Permission still not granted');
                }
              }
            };

            const subscription = AppState.addEventListener('change', handleAppStateChange);
          }}
        />

        <PermissionStatus
          title={APP_DICTIONARY[language].permissions.postNotificationsTitle}
          subtitle={canSendNotifications ? '' : t.permissions.needPermissions}
          granted={canSendNotifications}
          onRequest={requestPostNotification}
        />
      </View>

      <Modal visible={langOpen} animationType="fade" transparent onRequestClose={() => setLangOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setLangOpen(false)}>
          <View style={styles.modalCentered}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{t.settings.languageLabel}</Text>
              <View style={{ height: 8 }} />
              {APP_DICTIONARY[language].languageOptionsDisplay.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => selectLanguage(opt.key as any)}
                  style={({ pressed }) => [styles.modalItem, pressed && { opacity: 0.7 }]}
                >
                  <Text style={[styles.modalItemText, opt.key === language && styles.modalItemTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/* ------------------ Styles ------------------ */
// (unchanged — kept your original styles)
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
    backgroundColor: '#2563eb',
    borderColor: '#1d4ed8',
  },
  tabText: { color: '#334155', fontWeight: '700' },
  tabTextActive: { color: '#fff' },

  centerCard: {
    marginHorizontal: 16,
    backgroundColor: '#fbfbff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },

  verticalStatusList: {
    marginTop: 10,
    gap: 8,
  },
  verticalStatusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  statusItemLabel: {
    color: '#0f172a',
    fontWeight: '600',
  },
  statusItemValue: {
    fontWeight: '700',
  },

  statusLabel: { color: '#64748b', fontSize: 12 },

  controls: { flexDirection: 'row', marginTop: 12, alignItems: 'center', flexWrap: 'wrap' },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  ghostButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 110,
    marginTop: 8,
  },
  ghostText: { color: '#333' },

  logList: { flex: 1, paddingHorizontal: 16, marginTop: 8 },
  logHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  logTitle: { fontWeight: '700', fontSize: 16 },
  logCount: { backgroundColor: '#fff5f5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  logCountText: { color: '#dc2626', fontWeight: '700' },

  empty: { padding: 16, alignItems: 'center' },

  logCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f3f6f8',
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  logFrom: { fontWeight: '700' },
  logBody: { color: '#222', marginBottom: 8 },
  logFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  replyText: { color: '#666', marginLeft: 8 },

  sendingBadge: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 10,
  },
  languageButtonActive: {
    backgroundColor: '#16a34a',
    borderColor: '#15803d',
  },
  languageButtonText: { color: '#374151', fontWeight: '700' },
  languageButtonTextActive: { color: '#fff' },

  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  toggleOn: { backgroundColor: '#16a34a' },
  toggleOff: { backgroundColor: '#ef4444' },

  settingsPage: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  settingsTopSpace: {
    height: 6,
  },
  section: {
    marginTop: 6,
  },
  sectionWithSpace: {
    marginBottom: 60,
  },
  sectionLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 8,
  },
  hintText: {
    color: '#64748b',
    marginTop: 8,
    fontSize: 12,
  },

  pickerWrapper: {
    zIndex: 1000,
  },
  pickerBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6edf3',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  pickerText: { color: '#0f172a', fontWeight: '600' },
  caret: { color: '#64748b', marginLeft: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8,12,20,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCentered: {
    width: '100%',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  modalTitle: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    fontSize: 16,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalItemText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  modalItemTextActive: {
    color: '#16a34a',
    fontWeight: '800',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 8,
  },
  statusHint: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 6,
    maxWidth: '86%',
  },
  statusItems: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eef2f6',
    paddingTop: 10,
  },
  reportButton: {
    backgroundColor: '#ffffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  reportButtonText: {
    color: '#8c1212ff',
    fontWeight: '700',
    fontSize: 13,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f7fa',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  indicatorOn: { backgroundColor: '#16a34a' },
  indicatorOff: { backgroundColor: '#ef4444' },
  statusRowLabel: {
    color: '#0f172a',
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOn: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  badgeOff: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 13,
  },
  badgeTextOn: { color: '#065f46' },
  badgeTextOff: { color: '#7f1d1d' },
  dropdownList: {},
  dropdownItem: {},
  dropdownItemText: {},
  dropdownItemTextActive: {},
});
