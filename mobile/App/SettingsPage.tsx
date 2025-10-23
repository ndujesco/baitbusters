// App.tsx
import React, { useState } from 'react';
import {
    Modal,
    NativeModules,
    Platform,
    PermissionsAndroid,
    Pressable,
    Text,
    View,
    AppStateStatus,
    AppState,

} from 'react-native';

import { useSettings } from './contexts';
import { APP_DICTIONARY } from './dictionary';
import PermissionStatus from './components/PermissionStatus';
import { styles } from '../App';
import { showToast } from './const';

const { NotificationListenerModule, OverlayPermissionModule } =
    (NativeModules as any) || {};


export default function SettingsPage() {
    const { language, setLanguage, listenSms, setListenSms, listenNotifications, setListenNotifications, canSendNotifications, setCanSendNotifications, canDisplayOverApps, setCanDisplayOverApps } =
        useSettings();
    const t = APP_DICTIONARY[language];

    const [langOpen, setLangOpen] = useState(false);

    async function requestSmsPermissions() {
        if (Platform.OS !== 'android') {
            setListenSms(true);
            return;
        }

        try {
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
            ]);

            const receiveGranted =
                result[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
                PermissionsAndroid.RESULTS.GRANTED;

            const sendGranted =
                result[PermissionsAndroid.PERMISSIONS.SEND_SMS] ===
                PermissionsAndroid.RESULTS.GRANTED;

            const allGranted = receiveGranted && sendGranted;

            setListenSms(allGranted);

            if (!allGranted) {
                showToast(t.permissions.needPermissions);
            } else {
                showToast(t.ui.yes);
            }
        } catch (error) {
            console.error('SMS permission request failed:', error);
            showToast('Permission request failed');
        }
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
                    subtitle={listenSms ? '' : t.permissions.needPermissions}
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
                                    showToast("❤️❤️");
                                } else {
                                    setListenNotifications(false);
                                    showToast('😒😒');
                                }
                            }
                        };

                        const subscription = AppState.addEventListener('change', handleAppStateChange);
                    }}
                />

                <PermissionStatus
                    title={'Can display'}
                    subtitle={canDisplayOverApps ? '' : t.permissions.needPermissions}
                    granted={canDisplayOverApps}
                    onRequest={async () => {
                        await OverlayPermissionModule?.requestPermission();

                        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
                            if (nextAppState === 'active') {
                                subscription.remove();

                                const granted = await OverlayPermissionModule?.isPermissionGranted();
                                if (granted) {
                                    setCanDisplayOverApps(true);
                                    showToast("❤️❤️");
                                } else {
                                    setCanDisplayOverApps(false);
                                    showToast('😒😒');
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
