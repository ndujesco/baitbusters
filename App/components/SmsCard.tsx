import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Sms = {
  senderPhoneNumber?: string;
  messageBody?: string;
  time?: string;
};

const CARD_HEIGHT = 96; // adjust this to make the card taller or shorter

export default function SmsCard({ item }: { item: Sms }) {
  return (
    <View style={[styles.card, { height: CARD_HEIGHT }]}>
      <View style={styles.headerRow}>
        <Text style={styles.from} numberOfLines={1}>
          {item.senderPhoneNumber ?? 'Unknown'}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <Text style={styles.body} numberOfLines={3}>
        {item.messageBody ?? ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#071726',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 260,
    // elevation/shadow (android + ios)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 3,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  from: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  time: { color: '#64748B', fontSize: 11 },
  body: { color: '#E6FFFA', fontSize: 14, lineHeight: 18 },
});
