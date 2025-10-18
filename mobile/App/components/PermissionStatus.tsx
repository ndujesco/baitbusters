// /App/components/PermissionStatus.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';

type Props = {
  title: string;
  granted: boolean;
  onRequest: () => void;
  subtitle?: string;
};

export default function PermissionStatus({ title, granted, onRequest, subtitle }: Props) {
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right Section */}
      <Pressable
        style={({ pressed }) => [
          styles.radioContainer,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={onRequest}
      >
        <View
          style={[
            styles.radioOuter,
            { borderColor: granted ? '#06b6a4' : '#64748b' },
          ]}
        >
          {granted && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.stateText, { color: granted ? '#06b6a4' : '#64748b' }]}>
          {granted ? 'Enabled' : 'Off'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1220',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#E6FFFA', fontWeight: '700', fontSize: 15 },
  subtitle: { color: '#94A3B8', fontSize: 12, marginTop: 3 },
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
    backgroundColor: '#06b6a4',
  },
  stateText: {
    fontWeight: '600',
    fontSize: 13,
  },
});
