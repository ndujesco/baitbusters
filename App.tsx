import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  StyleSheet,
  StatusBar,
  NativeModules,
} from 'react-native';

const { SmsListenerModule } = NativeModules;

const App = () => {
  const [permission, setPermission] = useState('');

  const requestPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setPermission(result);
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (permission === PermissionsAndroid.RESULTS.GRANTED) {
      SmsListenerModule.startListeningToSMS(); // 👈 Start native listener

      const subscription = DeviceEventEmitter.addListener('onSMSReceived', (message) => {
        console.log("The listener has been called!");
        
        try {
          console.log("Raw message:", message);
          
          const data = JSON.parse(message);
          console.log(data);
          
          Alert.alert(
            '📨 New SMS Received',
            `From: ${data.senderPhoneNumber}\n\n${data.messageBody}`,
          );
        } catch (error) {
          console.error('Error parsing SMS:', error);
        }
      });

      return () => subscription.remove();
    }
  }, [permission]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.container}>
        <Text style={styles.title}>📩 SMS Listener.</Text>
        <Text style={styles.subtitle}>
          {permission === PermissionsAndroid.RESULTS.GRANTED
            ? 'Waiting for incoming SMS...'
            : 'Requesting SMS permission...'}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.credit}>Built with ❤️ using React Native</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
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
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  credit: {
    fontSize: 12,
    color: '#555',
  },
});

export default App;
