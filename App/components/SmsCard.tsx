// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

type Sms = {
  senderPhoneNumber?: string;
  messageBody?: string;
  time?: string;
};

// const CARD_HEIGHT = 96; // adjust this to make the card taller or shorter

// export default function SmsCard({ item }: { item: Sms }) {
//   return (
//     <View style={[styles.card, { height: CARD_HEIGHT }]}>
//       <View style={styles.headerRow}>
//         <Text style={styles.from} numberOfLines={5}>
//           {item.senderPhoneNumber ?? 'Unknown'}
//         </Text>
//         <Text style={styles.time}>{item.time}</Text>
//       </View>

//       <Text style={styles.body} numberOfLines={3}>
//         {item.messageBody ?? ''}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#071726',
//     padding: 12,
//     borderRadius: 12,
//     marginRight: 12,
//     minWidth: 260,
//     // elevation/shadow (android + ios)
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 8,
//     elevation: 3,
//     justifyContent: 'center',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   from: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
//   time: { color: '#64748B', fontSize: 11 },
//   body: { color: '#E6FFFA', fontSize: 14, lineHeight: 18 },
// });


// /App/components/NotificationCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// type Notification = {
//   packageName?: string;
//   title?: string;
//   text?: string;
//   time?: string;
// };

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
  card: { backgroundColor: '#071726', padding: 12, borderRadius: 12, width: 260, marginRight: 12 },
  app: { color: '#94A3B8', fontSize: 12 },
  title: { color: '#E6FFFA', fontWeight: '700', marginTop: 6 },
  text: { color: '#CBD5E1', marginTop: 6 },
  time: { color: '#64748B', fontSize: 11, marginTop: 8 },
});
