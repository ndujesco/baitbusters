

// contexts.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, NativeModules, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_DICTIONARY, type LangKey } from './dictionary';
import { showToast } from './const';

type SettingsState = {
  language: LangKey;
  listenSms: boolean;
  listenNotifications: boolean;
  canSendNotifications: boolean;
  canDisplayOverApps: boolean;
  setLanguage: (l: LangKey) => void;
  refreshPermissions: () => Promise<void>;

  setCanDisplayOverApps: React.Dispatch<React.SetStateAction<boolean>>;
  setListenSms: React.Dispatch<React.SetStateAction<boolean>>;
  setListenNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setCanSendNotifications: React.Dispatch<React.SetStateAction<boolean>>;
};
const STORAGE_KEY = '@baitbusters_settings_v1';
const { NotificationListenerModule, OverlayPermissionModule } = NativeModules as any || {};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const useSettings = (): SettingsState => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LangKey>('english');
  const [listenSms, setListenSms] = useState(false);
  const [listenNotifications, setListenNotifications] = useState(false);
  const [canSendNotifications, setCanSendNotifications] = useState(false);
  const [canDisplayOverApps, setCanDisplayOverApps] = useState(false);


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
                  showToast(APP_DICTIONARY[language].permissions.needPermissions);
              } else {
                  showToast(APP_DICTIONARY[language].ui.permissionGrantedFeedback);
              }
          } catch (error) {
              console.error('SMS permission request failed:', error);
              showToast(APP_DICTIONARY[language].errors.permissionRequestFailed);
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

  // Load language only (persistent)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.language) setLanguage(parsed.language);
        }
      } catch (e) {
        console.warn('Failed to load language', e);
      }
    })();
  }, []);

  // Persist only language
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ language }));
      } catch (e) {
        console.warn('Failed to save language', e);
      }
    })();
  }, [language]);



  // Check real permissions (not stored)
  const refreshPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const smsGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
        );
        setListenSms(smsGranted);

        const postNotifGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        setCanSendNotifications(postNotifGranted);
      } else {
        setListenSms(true);
        setCanSendNotifications(true);
      }

      if (NotificationListenerModule?.isPermissionGranted) {
        const res = await NotificationListenerModule.isPermissionGranted();
        setListenNotifications(Boolean(res));
      } else {
        setListenNotifications(false);
      }

    const granted = await OverlayPermissionModule.isPermissionGranted();
        if (!granted) {
     setCanDisplayOverApps(false)
    } else {
      setCanDisplayOverApps(true)
    }
    } catch (e) {
      console.warn('Failed to refresh permissions', e);
    }
  };

  // Check once on mount
  useEffect(() => {
    refreshPermissions();
    requestPostNotification();
    requestSmsPermissions();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        language,
        listenSms,
        listenNotifications,
        canSendNotifications,
        canDisplayOverApps,
        setLanguage,
        refreshPermissions,
        setListenSms,
        setListenNotifications,
        setCanDisplayOverApps,
        setCanSendNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
