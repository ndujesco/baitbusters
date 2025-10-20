// components/SmsCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Sms = {
  senderPhoneNumber?: string;
  messageBody?: string;
  time?: string;
};

export default function SmsCard({ item }: { item: Sms }) {
  return (
    <View style={styles.card}>
      <Text style={styles.app}>{item.senderPhoneNumber ?? 'Unknown'}</Text>
      <Text style={styles.text} numberOfLines={4}>{item.messageBody ?? ''}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    width: 260,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  app: { color: '#6b7280', fontSize: 12 },
  text: { color: '#374151', marginTop: 6 },
  time: { color: '#9ca3af', fontSize: 11, marginTop: 8 },
});
