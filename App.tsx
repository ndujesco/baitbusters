import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeModules } from 'react-native';

const { SmsListenerModule, NotificationListenerModule } = NativeModules;

const App = () => {
  const [smsPermission, setSmsPermission] = useState('');
  const [notificationPermission, setNotificationPermission] = useState(false);

  // Request SMS Permission
  const requestSmsPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
      );
      setSmsPermission(result);
    } catch (error) {
      console.error('SMS Permission error:', error);
    }
  };

  // Request Notification Permission
  const requestNotificationPermission = () => {
    // Opens Android settings to enable notification access
    NotificationListenerModule.requestPermission();
    setNotificationPermission(true);

    // Start listening to broadcast events from NotificationListenerService
    NotificationListenerModule.startListening();
  };

  // SMS Listener
  useEffect(() => {
    if (smsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      SmsListenerModule.startListeningToSMS();

      const smsSubscription = DeviceEventEmitter.addListener(
        'onSMSReceived',
        (message) => {
          try {
            const data = typeof message === 'string' ? JSON.parse(message) : message;
            Alert.alert(
              '📨 New SMS Received',
              `From: ${data.senderPhoneNumber}\n\n${data.messageBody}`
            );
          } catch (err) {
            console.error('Error parsing SMS:', err);
          }
        }
      );

      return () => smsSubscription.remove();
    }
  }, [smsPermission]);

  // Notification Listener
  useEffect(() => {
    if (notificationPermission) {
      const notificationSubscription = DeviceEventEmitter.addListener(
        'onNotificationReceived',
        (notification) => {
          try {
            const data =
              typeof notification === 'string' ? JSON.parse(notification) : notification;
            Alert.alert(
              '🔔 New Notification',
              `${data.packageName}\n${data.title}\n${data.text}`
            );
          } catch (err) {
            console.error('Error parsing notification:', err);
          }
        }
      );

      return () => notificationSubscription.remove();
    }
  }, [notificationPermission]);

  // Request both permissions on mount
  useEffect(() => {
    requestSmsPermission();
    requestNotificationPermission();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.container}>
        <Text style={styles.title}>📩 SMS & 🔔 Notification Listener</Text>
        <Text style={styles.subtitle}>
          {smsPermission === PermissionsAndroid.RESULTS.GRANTED
            ? 'Waiting for SMS...'
            : 'Requesting SMS permission...'}
        </Text>
        <Text style={styles.subtitle}>
          {notificationPermission
            ? 'Waiting for Notifications...'
            : 'Requesting Notification permission...'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: { fontSize: 28, fontWeight: '600', color: '#00ff9c', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', lineHeight: 22 },
});

export default App;
