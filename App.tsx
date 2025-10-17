import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeModules } from 'react-native';

const {
  SmsListenerModule,
  NotificationListenerModule,
  NotificationSenderModule,
} = NativeModules;

const App = () => {
  const [smsPermission, setSmsPermission] = useState('');
  const [notificationPermission, setNotificationPermission] = useState(false);

  // 🔔 Startup notification
  useEffect(() => {
    NotificationSenderModule.sendNotification('App Ready', 'Listening for messages...');
  }, []);

  // ✅ Request SMS Permission
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

  // 🔔 Always prompt user to enable notifications
  const requestNotificationPermission = () => {
    // Open settings to ask user to enable notifications
    Alert.alert(
      'Enable Notifications',
      'To stay updated, please enable notifications for this app in your phone settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );

    // Start listening to notifications regardless
    NotificationListenerModule.requestPermission();
    NotificationListenerModule.startListening();
    setNotificationPermission(true);
  };

  // 📩 SMS Listener
  useEffect(() => {
    if (smsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      SmsListenerModule.startListeningToSMS();

      const smsSubscription = DeviceEventEmitter.addListener(
        'onSMSReceived',
        (message) => {
          try {
            const data =
              typeof message === 'string' ? JSON.parse(message) : message;

            Alert.alert(
              '📨 New SMS Received',
              `From: ${data.senderPhoneNumber}\n\n${data.messageBody}`
            );

            NotificationSenderModule.sendNotification(
              `SMS from ${data.senderPhoneNumber}`,
              data.messageBody
            );
          } catch (err) {
            console.error('Error parsing SMS:', err);
            Alert.alert(`Error parsing SMS: ${message}`);
          }
        }
      );

      return () => smsSubscription.remove();
    }
  }, [smsPermission]);

  // 🔔 Notification Listener
  useEffect(() => {
    if (notificationPermission) {
      const notificationSubscription = DeviceEventEmitter.addListener(
        'onNotificationReceived',
        (notification) => {
          try {
            const data =
              typeof notification === 'string' ? JSON.parse(notification) : notification;

            const pkg = data.packageName || 'Unknown App';
            const title = data.title || 'No Title';
            const text = data.text || 'No Text';

            console.log('🔔 Notification:', pkg, title, text);

            Alert.alert('🔔 New Notification', `${pkg}\n${title}\n${text}`);

            NotificationSenderModule.sendNotification(
              `${pkg}: ${title}`,
              text
            );
          } catch (err) {
            console.error('Error parsing notification:', err, notification);
          }
        }
      );

      return () => notificationSubscription.remove();
    }
  }, [notificationPermission]);

  // 🚀 Request all permissions on mount
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
            ? '✅ Waiting for SMS...'
            : 'Requesting SMS permission...'}
        </Text>
        <Text style={styles.subtitle}>
          {notificationPermission
            ? '✅ Waiting for Notifications...'
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
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#00ff9c',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default App;
