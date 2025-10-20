// components/PermissionStatus.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  title: string;
  granted: boolean;
  onRequest: () => void;
  subtitle?: string;
};

export default function PermissionStatus({ title, granted, onRequest, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <Pressable
        style={({ pressed }) => [styles.radioContainer, { opacity: pressed ? 0.75 : 1 }]}
        onPress={onRequest}
      >
        <View style={[styles.radioOuter, { borderColor: granted ? '#16a34a' : '#ef4444' }]}>
          {granted && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.stateText, { color: granted ? '#16a34a' : '#ef4444' }]}>
          {granted ? 'Enabled' : 'Off'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  title: { color: '#111827', fontWeight: '700', fontSize: 15 },
  subtitle: { color: '#6b7280', fontSize: 12, marginTop: 3 },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16a34a',
  },
  stateText: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 8,
  },
});
