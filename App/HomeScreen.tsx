// HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    DeviceEventEmitter,
    Alert,
    Linking,
    StyleSheet,
    StatusBar,
    FlatList,
    AppState,
    AppStateStatus,
} from 'react-native';
import { NativeModules } from 'react-native';
import PermissionStatus from './components/PermissionStatus';
import NotificationCard from './components/NotificationCard';
import SmsCard from './components/SmsCard';

const { SmsListenerModule, NotificationListenerModule, NotificationSenderModule } = NativeModules;

function safeJsonParse(input: string | null | undefined) {
    if (!input) return null;
    try {
        const sanitized = input.replace(/[\u0000-\u001F]+/g, '');
        return JSON.parse(sanitized);
    } catch {
        return null;
    }
}

const HomeScreen = () => {
    const [smsPermission, setSmsPermission] = useState(false);
    const [notificationListenerPermission, setNotificationListenerPermission] = useState(false);
    const [postNotificationPermission, setPostNotificationPermission] = useState(false);

    const [smses, setSmses] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    // -------- Startup: check all permissions --------
    useEffect(() => {
        // SMS
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS).then(granted => {
            setSmsPermission(granted);
            if (granted) SmsListenerModule?.startListeningToSMS();
        });


        NotificationListenerModule?.isPermissionGranted?.().then((granted: boolean) => {
            setNotificationListenerPermission(granted);
            if (granted) NotificationListenerModule?.startListening();
        });

        // POST_NOTIFICATIONS (Android 13+)
        if (PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then(granted => {
                setPostNotificationPermission(granted);
            });
        }

        // Startup notification (optional)
        try {
            NotificationSenderModule?.sendNotification('App Ready', 'Listening...');
        } catch { }
    }, []);

    // -------- Actions --------
    const requestSmsPermission = async () => {
        try {
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
            const granted = result === PermissionsAndroid.RESULTS.GRANTED;
            setSmsPermission(granted);
            if (granted) SmsListenerModule?.startListeningToSMS();
        } catch (e) {
            console.error(e);
        }
    };

    const requestNotificationListener = async () => {
        await NotificationListenerModule?.requestPermission();

        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                // Remove listener immediately
                subscription.remove();

                const granted = await NotificationListenerModule?.isPermissionGranted();
                if (granted) {
                    setNotificationListenerPermission(true);
                    NotificationListenerModule?.startListening();
                    Alert.alert('Notification Listener Enabled');
                } else {
                    Alert.alert('Permission still not granted');
                }
            }
        };

        // Add listener and keep the subscription
        const subscription = AppState.addEventListener('change', handleAppStateChange);
    };

    const requestPostNotification = async () => {
        if (!PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
            // fallback for older Android
            setPostNotificationPermission(true);
            return;
        }
        try {
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            setPostNotificationPermission(result === PermissionsAndroid.RESULTS.GRANTED);
        } catch (e) {
            console.error(e);
        }
    };

    // -------- SMS Listener --------
    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('onSMSReceived', (message: any) => {
            const data = typeof message === 'string' ? safeJsonParse(message) : message;
            if (!data) return;
            const item = { ...data, time: new Date().toLocaleTimeString() };
            setSmses(prev => [item, ...prev].slice(0, 20));
            try {
                if (postNotificationPermission) NotificationSenderModule?.sendNotification('SMS', data.messageBody ?? '');
            } catch { }
        });
        return () => sub.remove();
    }, [postNotificationPermission]);

    // -------- Notification Listener --------
 useEffect(() => {
  const sub = DeviceEventEmitter.addListener('onNotificationReceived', (notification: any) => {
    const data = typeof notification === 'string' ? safeJsonParse(notification) : notification;
    if (!data) return;

    const { packageName, title, text } = data;

    // List of apps to watch
    const messagingApps = ['whatsapp', 'gmail', 'yahoo', 'messenger', 'telegram', 'mail'];

    // Only handle known messaging apps
    const isMessagingApp = messagingApps.some(app => packageName.toLowerCase().includes(app));
    if (!isMessagingApp) return;

    // Skip generic notifications
    const skipTitle = ['WhatsApp', 'Gmail', 'Yahoo Mail', 'Messenger', 'Telegram', 'Mail'];
    const skipTextPatterns = [
      /\d+\smessages?\sfrom\s\d+\schats?/i,
      /new email/i,
      /new message/i,
      /notification/i
    ];

    if (skipTitle.includes(title)) return;
    if (skipTextPatterns.some(pattern => pattern.test(text))) return;

    // Passed all filters — add to state
    const item = {
      packageName,
      title,
      text,
      time: new Date().toLocaleTimeString(),
    };

    setNotifications(prev => [item, ...prev].slice(0, 50));
  });

  return () => sub.remove();
}, []);


    return (
        <FlatList
            data={[]}
            keyExtractor={() => 'empty'}
            ListHeaderComponent={
                <>
                    <StatusBar barStyle="light-content" backgroundColor="#08101A" />
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>BaitBusters</Text>
                        <Text style={styles.headerSubtitle}>Messages & Notifications</Text>
                    </View>

                    <View style={styles.permissionsContainer}>
                        <PermissionStatus
                            title="SMS"
                            subtitle={smsPermission ? 'Access granted' : 'Requires permission'}
                            granted={smsPermission}
                            onRequest={requestSmsPermission}
                        />
                        <PermissionStatus
                            title="Notifications Listener"
                            subtitle={notificationListenerPermission ? 'Listener active' : 'Listener disabled'}
                            granted={notificationListenerPermission}
                            onRequest={requestNotificationListener}
                        />
                        <PermissionStatus
                            title="Can Send Notifications"
                            subtitle={postNotificationPermission ? 'Can post notifications' : 'Posting disabled'}
                            granted={postNotificationPermission}
                            onRequest={requestPostNotification}
                        />
                    </View>

                    {/* Notifications */}
                    <Text style={styles.sectionTitle}>Recent Notifications</Text>
                    <FlatList
                        data={notifications}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <NotificationCard item={item} />}
                        keyExtractor={(i, idx) => `${i.packageName ?? 'pkg'}-${idx}-${i.time}`}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
                        initialNumToRender={5}
                        windowSize={5}
                    />

                    {/* SMS */}
                    <Text style={styles.sectionTitle}>Recent SMS</Text>
                    <FlatList
                        data={smses}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <SmsCard item={item} />}
                        keyExtractor={(i, idx) => `${i.senderPhoneNumber ?? 'no'}-${idx}-${i.time}`}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
                        initialNumToRender={5}
                        windowSize={5}
                    />
                </>
            }
            renderItem={null}
            contentContainerStyle={{ paddingBottom: 140, backgroundColor: '#07121A' }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<View />}
            style={{ backgroundColor: '#07121A' }}
            ListFooterComponent={() => <View style={{ height: 40 }} />}
        />
    );
};

const styles = StyleSheet.create({
    header: { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#07121A' },
    headerTitle: { color: '#E6FFFA', fontSize: 28, fontWeight: '700' },
    headerSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 6 },
    permissionsContainer: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
    sectionTitle: { color: '#E2E8F0', fontSize: 16, marginTop: 16, marginBottom: 6, paddingHorizontal: 16 },
});

export default HomeScreen;
