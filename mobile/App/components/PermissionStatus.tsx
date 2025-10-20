// components/PermissionStatus.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  AccessibilityRole,
  Platform,
} from 'react-native';

type Props = {
  title: string;
  granted: boolean;
  onRequest: () => void;
  subtitle?: string;
};

export default function PermissionStatus({ title, granted, onRequest, subtitle }: Props) {
  // animated value: 0 (off) -> 1 (on)
  const anim = useRef(new Animated.Value(granted ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: granted ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [granted, anim]);

  // knob translateX interpolation
  const knobTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18], // knob moves 18 px on our track
  });

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(239, 68, 68, 0.12)', 'rgba(22, 183, 129, 0.12)'],
  });

  const accessibilityState = { checked: granted };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <Pressable
        onPress={onRequest}
        android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        accessibilityRole={'switch' as AccessibilityRole}
        accessibilityLabel={title}
        accessibilityState={accessibilityState}
        style={({ pressed }) => [
          styles.toggleWrapper,
          pressed && Platform.OS === 'ios' ? { opacity: 0.7 } : {},
        ]}
      >
        <Animated.View style={[styles.track, { backgroundColor: trackBg as any }]}>
          <Animated.View
            style={[
              styles.knob,
              {
                transform: [{ translateX: knobTranslate }],
                // subtle shadow/highlight
              },
            ]}
          />
        </Animated.View>

        <Text style={[styles.stateText, granted ? styles.stateOn : styles.stateOff]}>
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
  title: { color: '#0f172a', fontWeight: '700', fontSize: 15 },
  subtitle: { color: '#64748b', fontSize: 12, marginTop: 4 },

  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // track
  track: {
    width: 46,
    height: 28,
    borderRadius: 28,
    justifyContent: 'center',
    padding: 3,
  },

  // knob (circle)
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },

  stateText: {
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 8,
  },
  stateOn: { color: '#0c5440ff' }, // dark green
  stateOff: { color: '#7f1d1d' }, // dark red
});
