import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    DeviceEventEmitter,
    Alert,
    StyleSheet,
    StatusBar,
    FlatList,
    AppState,
    AppStateStatus,
    TextInput,
    Button,
} from 'react-native';
import { NativeModules } from 'react-native';
import PermissionStatus from './components/PermissionStatus';
import NotificationCard from './components/NotificationCard';
import SmsCard from './components/SmsCard';

const { SmsListenerModule, SmsSenderModule, NotificationListenerModule, NotificationSenderModule } = NativeModules;

function safeJsonParse(input: string | null | undefined) {
    if (!input) return null;
    try {
        const sanitized = input.replace(/[\u0000-\u001F]+/g, '');
        return JSON.parse(sanitized);
    } catch {
        return null;
    }
}


const REPORT_SHORTCODE = '12345';
const REPORT_SMS_TEMPLATE = (notifText: string) =>
    `Reporting suspicious message: "${notifText}"`;

const HomeScreen = () => {
    // ---------- STATE ----------
    const [smsPermission, setSmsPermission] = useState(false);
    const [notificationListenerPermission, setNotificationListenerPermission] = useState(false);
    const [postNotificationPermission, setPostNotificationPermission] = useState(false);

    const [smses, setSmses] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');



    // ---------- INITIAL PERMISSION CHECK ----------
    useEffect(() => {

        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS).then(granted => {
            setSmsPermission(granted);
            if (granted) SmsListenerModule?.startListeningToSMS();
        });

        NotificationListenerModule?.isPermissionGranted?.().then((granted: boolean) => {
            setNotificationListenerPermission(granted);
            if (granted) NotificationListenerModule?.startListening();
        });

        if (PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then(granted => {
                setPostNotificationPermission(granted);
            });
        }

        try {
            NotificationSenderModule?.sendNotification('BaitBusters Active', 'Now listening for messages');
        } catch { }
    }, []);

    const requestSmsPermissions = async () => {
        const results = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        ]);

        const granted =
            results[PermissionsAndroid.PERMISSIONS.SEND_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
            results[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED;

        setSmsPermission(granted);

        if (granted) SmsListenerModule?.startListeningToSMS();
    };

    const requestNotificationListener = async () => {
        await NotificationListenerModule?.requestPermission();

        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                subscription.remove();

                const granted = await NotificationListenerModule?.isPermissionGranted();
                if (granted) {
                    setNotificationListenerPermission(true);
                    NotificationListenerModule?.startListening();
                    Alert.alert('Notification Listener Enabled');
                } else {
                    setNotificationListenerPermission(false);
                    Alert.alert('Permission still not granted');
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
    };

    const requestPostNotification = async () => {
        if (!PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
            setPostNotificationPermission(true);
            return;
        }
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        setPostNotificationPermission(result === PermissionsAndroid.RESULTS.GRANTED);
    };

    // ---------- SMS LISTENER ----------
    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('onSMSReceived', (message: any) => {
            const data = typeof message === 'string' ? safeJsonParse(message) : message;
            if (!data) return;

            const item = { ...data, time: new Date().toLocaleTimeString() };
            setSmses(prev => [item, ...prev].slice(0, 20));

            try {
                if (postNotificationPermission) {
                    NotificationSenderModule?.sendNotification(
                        `SMS from ${data.senderPhoneNumber ?? 'Unknown'}`,
                        data.messageBody ?? '',
                    );
                }
            } catch { }
        });
        return () => sub.remove();
    }, [postNotificationPermission]);




    // ---------- NOTIFICATION LISTENER ----------
    useEffect(() => {
        const seenNotifications = new Set<string>();

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

            const uniqueKey = `${packageName}-${title}-${text}`;
            if (seenNotifications.has(uniqueKey)) return;

            seenNotifications.add(uniqueKey);

            const item = {
                packageName,
                title,
                text,
                time: new Date().toLocaleTimeString(),
            };

            setNotifications(prev => [item, ...prev].slice(0, 50));

            try {
                // Detect the exact phishing prompt "send your bvn" (also allows "send me your bvn")
                const notifText = (text || '').toString();
                const isBvnPrompt = /\bsend(?:\sme)?\syour\s+bvn\b/i.test(notifText);

                if (postNotificationPermission) {
                    if (notifText == 'send your bvn') {
                        // Show a notification that includes a button to open the SMS app,
                        // prefilled with REPORT_SHORTCODE and a templated message.
                        NotificationSenderModule?.sendNotificationWithSmsAction(
                            `From ${title || packageName}`,
                            `"${notifText}" keh? Na spam oooooo! Report am.`,
                            'REPORT',               // button text shown in the notification
                            REPORT_SHORTCODE,               // phone/short-code to send to
                            REPORT_SMS_TEMPLATE(notifText), // body to prefill in SMS app
                        );

                    } else {
                        // Normal behavior for other notifications
                        return
                        //   NotificationSenderModule?.sendNotification(
                        //     `From ${title || packageName}`,
                        //     text || 'New message',
                        //   );
                    }
                }
            } catch (err) {
                // silent fail; optionally log
                console.warn('Notification handling error', err);
            }
        });

        return () => sub.remove();
    }, [postNotificationPermission]);


    // ---------- SEND SMS HANDLER ----------
    const handleSendSMS = () => {
        if (!smsPermission) {
            Alert.alert('Permission required', 'Enable SMS permission first');
            return;
        }
        if (!phone || !message) {
            Alert.alert('Missing fields', 'Enter phone number and message');
            return;
        }

        SmsSenderModule.sendSMS(phone, message)
            .then((res: any) => Alert.alert('Success', res))
            .catch((err: any) => Alert.alert('Error', err.message || 'Failed to send SMS'));
    };

    // ---------- RENDER ----------
    return (
        <FlatList
            data={[]}
            keyExtractor={() => 'empty'}
            ListHeaderComponent={
                <>
                    <StatusBar barStyle="light-content" backgroundColor="#0B121A" />
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>BaitBusters</Text>
                        <Text style={styles.headerSubtitle}>Catch spam before it bites 🕵🏾‍♂️</Text>
                    </View>

                    <View style={styles.permissionsContainer}>
                        <PermissionStatus
                            title="SMS"
                            subtitle={smsPermission ? 'Access granted' : 'Needs permission'}
                            granted={smsPermission}
                            onRequest={requestSmsPermissions}
                        />
                        <PermissionStatus
                            title="Notifications Listener"
                            subtitle={notificationListenerPermission ? 'Active' : 'Disabled'}
                            granted={notificationListenerPermission}
                            onRequest={requestNotificationListener}
                        />
                        <PermissionStatus
                            title="Can Send Notifications"
                            subtitle={postNotificationPermission ? 'Enabled' : 'Disabled'}
                            granted={postNotificationPermission}
                            onRequest={requestPostNotification}
                        />
                    </View>

                    {/* --- Send SMS Section --- */}
                    {/* --- Send SMS Section --- */}
                    {smsPermission && (
                        <View style={styles.sendSmsContainer}>
                            <TextInput
                                placeholder="Phone number"
                                placeholderTextColor="#7DD3FC"
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                placeholder="Message"
                                placeholderTextColor="#7DD3FC"
                                style={[styles.input, { height: 80 }]}
                                value={message}
                                onChangeText={setMessage}
                                multiline
                            />
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Button title="Send SMS" onPress={handleSendSMS} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Button
                                        title="Open in SMS App"
                                        onPress={() => {
                                            const { SmsIntentModule } = NativeModules;
                                            SmsIntentModule.openSmsApp(phone, message)
                                                .then((res: any) => console.log(res))
                                                .catch((err: any) => console.error(err));
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}


                    <Text style={styles.sectionTitle}>📩 Recent Notifications</Text>
                    <FlatList
                        data={notifications}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <NotificationCard item={item} />}
                        keyExtractor={(i, idx) => `${i.packageName ?? 'pkg'}-${idx}-${i.time}`}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    />

                    <Text style={styles.sectionTitle}>📱 Recent SMS</Text>
                    <FlatList
                        data={smses}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <SmsCard item={item} />}
                        keyExtractor={(i, idx) => `${i.senderPhoneNumber ?? 'no'}-${idx}-${i.time}`}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
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
    header: {
        paddingTop: 30,
        paddingHorizontal: 18,
        paddingBottom: 12,
        backgroundColor: '#07121A',
        borderBottomColor: '#13202D',
        borderBottomWidth: 1,
    },
    headerTitle: { color: '#E6FFFA', fontSize: 30, fontWeight: '700' },
    headerSubtitle: { color: '#7DD3FC', fontSize: 13, marginTop: 4 },
    permissionsContainer: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
    sectionTitle: {
        color: '#C7D2FE',
        fontSize: 17,
        marginTop: 16,
        marginBottom: 6,
        paddingHorizontal: 16,
        fontWeight: '600',
    },
    // sendSmsContainer: {
    //     paddingHorizontal: 16,
    //     paddingVertical: 12,
    //     gap: 8,
    // },
    sendSmsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12, // slightly bigger gap for clarity
    },

    input: {
        backgroundColor: '#13202D',
        color: '#E6FFFA',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },

});

export default HomeScreen;
