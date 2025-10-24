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
StyleSheet
} from 'react-native';

import { useSettings } from './contexts';
import { APP_DICTIONARY } from './dictionary';
import PermissionStatus from './components/PermissionStatus';
// import { styles } from '../App';
import { BACKGROUND, showToast } from './const';

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


const styles = StyleSheet.create({

      settingsPage: {
        flex: 1,
        backgroundColor: BACKGROUND,
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
      }

});

