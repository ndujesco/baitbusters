// /App/components/NotificationCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Notification = {
  packageName?: string;
  title?: string;
  text?: string;
  time?: string;
};

export default function NotificationCard({ item }: { item: Notification }) {
  return (
    <View style={styles.card}>
      <Text style={styles.app}>{item.packageName}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text} numberOfLines={5}>{item.text}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#071726', padding: 12, borderRadius: 12, width: 260, marginRight: 12 },
  app: { color: '#94A3B8', fontSize: 12 },
  title: { color: '#E6FFFA', fontWeight: '700', marginTop: 6 },
  text: { color: '#CBD5E1', marginTop: 6 },
  time: { color: '#64748B', fontSize: 11, marginTop: 8 },
});
