// App.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DeviceEventEmitter,
  NativeModules,
  Pressable,
  Text,
  View,
  EmitterSubscription,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';

import { useSettings } from './contexts';
import { APP_DICTIONARY } from './dictionary';
import { checkPhishing } from './model';
import { styles } from '../App';
import { GATEWAY_NUMBER, type Log, STORAGE_KEY, normalizePhone, safeJsonParse, showToast  } from './const';

const { SmsListenerModule, NotificationListenerModule, SmsSenderModule, NotificationPopupModule} =
  (NativeModules as any) || {};






export default function ActivityPage() {
  const { language, listenSms, listenNotifications, canSendNotifications, canDisplayOverApps } =
    useSettings();
  const t = APP_DICTIONARY[language];

  const [logs, setLogs] = useState<Log[]>([]);
  const smsSubRef = useRef<EmitterSubscription | null>(null);
  const notifSubRef = useRef<EmitterSubscription | null>(null);
  const recentBodiesRef = useRef<Set<string>>(new Set());

  // REMOVED rowRefs
  // const rowRefs = useRef<Record<string, Swipeable | null>>({});

  // Load logs from storage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = safeJsonParse(saved);
          if (Array.isArray(parsed)) setLogs(parsed);
        }
      } catch (err) {
        console.warn('Failed to load saved logs:', err);
      }
    })();
  }, []);

  // Save logs (REMOVED rowRefs cleanup)
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs)).catch(() =>
      console.warn('Failed to persist logs'),
    );
  }, [logs]);

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

  const persistLog = useCallback((log: Log) => {
    setLogs((prev) => {
      if (prev.some((l) => l.body === log.body)) {
        return prev;
      }
      const updated = [log, ...prev].slice(0, 200);
      return updated;
    });
  }, []);

  const checkMessage = useCallback(
    async (entry: Omit<Log, 'id' | 'spamStatus'>) => {
      const { body, from } = entry;
      if (!body) return;

      if (recentBodiesRef.current.has(body)) return;
      recentBodiesRef.current.add(body);

      const spamStatus = await checkPhishing(body);
      if (spamStatus === 0) return;

      const id = `${Date.now()}`;

      if (
        spamStatus === 0.5 &&
        canDisplayOverApps
      ) {
        try {
          const smsBody = JSON.stringify({ id, body });
          showToast(body)
          SmsSenderModule?.sendSMS(GATEWAY_NUMBER, smsBody)
        } catch { }
      }

      if (spamStatus === 1) {
        try {
          NotificationPopupModule?.showOverlayPopup?.(
            `${t.activity.spamDetected}`,
            `${t.general.from}: ${from} — "${body}"`,
            "CLOSE"
          );
        } catch { }
      }

      const log: Log = {
        id,
        ...entry,
        receivedAt: entry.receivedAt ?? Date.now(),
        spamStatus,
      };

      persistLog(log);
    },
    [canSendNotifications, language, persistLog, t],
  );

  const updateSpamStatus = useCallback(
    (messageBody: string) => {
      if (messageBody == "-1") { return }
      const data = safeJsonParse(messageBody);
      if (!data || typeof data !== 'object') return;

      const { id, spam_status: spamStatus } = data as any;
      if (typeof id !== 'string') return;

      const numericSpamStatus =
        typeof spamStatus === 'string' ? parseFloat(spamStatus) : spamStatus;

      setLogs((prevLogs) => {
        let foundLog: Log | undefined;
        const updated = prevLogs.map((log) => {
          if (log.id === id) {
            const newLog = { ...log, spamStatus: numericSpamStatus };
            if (numericSpamStatus === 1) {
              foundLog = newLog;
            }
            return newLog;
          }
          return log;
        });

        const logWasFound = prevLogs.some((log) => log.id === id);

        if (logWasFound) {
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() =>
            console.warn('Failed to update spam status'),
          );
        }

        if (foundLog) {
          try {
            NotificationPopupModule?.showOverlayPopup?.(
              `${t.activity.spamDetected}`,
              `${t.general.from}: ${foundLog.from} — "${foundLog.body}"`,
            "CLOSE"

            );
         
          } catch { }
        }

        return logWasFound ? updated : prevLogs;
      });
    },
    [language, t],
  );

  // --- Delete and Clear Handlers (Unchanged) ---
  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const handleClearAllLogs = () => {
    Alert.alert(
      t.controls.clearLogs,
      t.controls.confirmClearLogs,
      [
        { text: t.ui.no, style: 'cancel' },
        {
          text: t.ui.yes,
          style: 'destructive',
          onPress: () => {
            setLogs([]);
          },
        },
      ],
    );
  };

  // --- REMOVED renderRightActions ---

  // --- SMS Listener Effect (Unchanged) ---
  useEffect(() => {
    if (!listenSms) {
      try {
        SmsListenerModule?.stopListeningToSMS();
      } catch { }
      smsSubRef.current?.remove?.();
      smsSubRef.current = null;
      return;
    }
    // ... (rest of effect is unchanged)
    try {
      SmsListenerModule?.startListeningToSMS();
    } catch (err) {
      console.warn('SmsListenerModule.startListeningToSMS error', err);
    }

    const sub = DeviceEventEmitter.addListener(
      'onSMSReceived',
      (message: any) => {
        const data =
          typeof message === 'string' ? safeJsonParse(message) : message;
        if (!data) return;
        const { senderPhoneNumber: from, messageBody: body } = data;


        if (normalizePhone(from) === GATEWAY_NUMBER) {
          updateSpamStatus(body);
          return;
        }

        checkMessage({
          source: 'SMS',
          packageName: 'com.sms',
          from,
          body,
          receivedAt: Date.now(),
        });
      },
    );

    smsSubRef.current = sub;

    return () => {
      try {
        SmsListenerModule?.stopListeningToSMS();
      } catch { }
      smsSubRef.current?.remove?.();
      smsSubRef.current = null;
    };
  }, [listenSms, checkMessage, updateSpamStatus]);

  // --- Notification Listener Effect (Unchanged) ---
  useEffect(() => {
    if (!listenNotifications) {
      notifSubRef.current?.remove?.();
      notifSubRef.current = null;
      return;
    } 

    NotificationListenerModule?.ensureServiceRunning?.();

    const sub = DeviceEventEmitter.addListener(
      'onNotificationReceived',
      (notification: any) => {

        const data =
          typeof notification === 'string'
            ? safeJsonParse(notification)
            : notification;
        if (!data) return;

        const { packageName, title, text } = data;
        showToast(text)
        const messagingApps = [
          'whatsapp',
          'gmail',
          'yahoo',
          'messenger',
          'telegram',
          'mail',
        ];
        if (
          !messagingApps.some((app) => packageName?.toLowerCase().includes(app))
        )
          return;

        const skipTitle = [
          'WhatsApp',
          'Gmail',
          'Yahoo Mail',
          'Messenger',
          'Telegram',
          'Mail',
        ];
        const skipTextPatterns = [
          /\d+\smessages?\sfrom\s\d+\schats?/i,
          /new email/i,
          /new message/i,
          /notification/i,
        ];

        if (skipTitle.includes(title)) return;
        if (skipTextPatterns.some((pattern) => pattern.test(text))) return;

        checkMessage({
          source: inferAppLabel(packageName),
          from: title ?? null,
          packageName,
          body: text,
          receivedAt: Date.now(),
        });
      },
    );

    notifSubRef.current = sub;

    return () => {
      notifSubRef.current?.remove?.();
      notifSubRef.current = null;
    };
  }, [listenNotifications, checkMessage]);

  // --- RENAMED renderLogItem to renderVisibleItem ---
  // --- REMOVED Swipeable wrapper ---
  const renderVisibleItem = ({ item }: { item: Log }) => {
    const time = new Date(item.receivedAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const spamStatus = item.spamStatus ?? 0;
    const { id, body, from, source } = item;

    const bodyColor =
      spamStatus === 1 ? '#b91c1c' : spamStatus === 0.5 ? '#f59e0b' : '#16a34a';
    const pillText =
      spamStatus === 1
        ? t.activity.pill.spam
        : spamStatus === 0.5
          ? t.activity.pill.potential
          : t.activity.pill.ok;

    return (
      <View style={styles.logCard}>
        <View style={styles.logHeader}>
          <Text
            style={styles.logFrom}
          >{`${source} • ${from ?? t.ui.unknown}`}</Text>
          <Text style={{ color: '#6b7280' }}>{time}</Text>
        </View>

        <Text style={[styles.logBody, { color: bodyColor }]} numberOfLines={3}>
          {body}
        </Text>

        <View style={styles.logFooter}>
          <View style={[styles.statusPill, { backgroundColor: bodyColor }]}>
            <Text style={styles.statusPillText}>{pillText}</Text>
          </View>

          {spamStatus === 0.5 ? (
            <Pressable
              onPress={() => {
                try {
                  SmsSenderModule.sendSMS(
                    GATEWAY_NUMBER,
                    JSON.stringify({ id, body }),
                  );
                } catch { }
              }}
              style={({ pressed }) => [
                styles.reportButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.reportButtonText}>
                {t.activity.reportButton}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  // --- ADDED renderHiddenItem for SwipeListView ---
  // const renderHiddenItem = (
  //   data: { item: Log },
  //   rowMap: Record<string, { closeRow: () => void }>,
  // ) => {
  //   const onDelete = () => {
  //     if (rowMap[data.item.id]) {
  //       rowMap[data.item.id].closeRow();
  //     }
  //     handleDeleteLog(data.item.id);
  //   };

  //   return (
  //     <View style={styles.hiddenButtonContainer}>
  //       <TouchableOpacity style={styles.hiddenButton} onPress={onDelete}>
  //         <Text style={styles.hiddenButtonText}>{t.controls.deleted}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  return (
    <View style={{ flex: 1 }}>
      {/* --- Status Card (Unchanged) --- */}
      <View style={styles.centerCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusLabel}>{t.listeningLabel}</Text>
        </View>

        <View style={styles.statusItems}>
          {[
            { label: t.statusLabels.canListenSms, state: listenSms },
            {
              label: t.statusLabels.canListenNotifications,
              state: listenNotifications,
            },
            {
              label: t.statusLabels.canPostNotifications,
              state: canSendNotifications,
            },
          ].map((item, index) => (
            <View key={index} style={styles.statusRow}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.indicator,
                    item.state ? styles.indicatorOn : styles.indicatorOff,
                  ]}
                />
                <Text style={styles.statusRowLabel}>{item.label}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  item.state ? styles.badgeOn : styles.badgeOff,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.state ? styles.badgeTextOn : styles.badgeTextOff,
                  ]}
                >
                  {item.state ? t.ui.yes : t.ui.no}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 50 }} />

      <View style={styles.logList}>
        {/* --- Log Header Row (Unchanged) --- */}
        <View style={styles.logHeaderRow}>
          <View style={styles.logTitleContainer}>
            <Text style={styles.logTitle}>{t.activity.logTitle}</Text>

          </View>

          <View style={styles.logHeaderRight}>

            <TouchableOpacity
              onPress={handleClearAllLogs}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>{t.controls.clearLogs}</Text>
            </TouchableOpacity>
            <View style={styles.logCount}>
              <Text style={styles.logCountText}>{logs.length}</Text>
            </View>
          </View>
        </View>

        {/* --- REPLACED FlatList with SwipeListView --- */}
        <SwipeListView
          data={logs}
          renderItem={renderVisibleItem}
          // renderHiddenItem={renderHiddenItem}
          keyExtractor={(i) => i.id}
          rightOpenValue={80} // Width of the delete button
          disableLeftSwipe
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: '#6b7280' }}>{t.activity.noMessages}</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 60 }}
          // Prevents list scroll while swiping a row
          onRowOpen={() => { }}
          onRowClose={() => { }}
          // Stops keyboard from dismissing on tap (if applicable)
          keyboardShouldPersistTaps={'handled'}
        />
      </View>
    </View>
  );
}