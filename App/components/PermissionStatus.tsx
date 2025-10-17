// /App/components/PermissionStatus.tsx
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
            <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <View style={styles.right}>
                <View style={[styles.badge, { backgroundColor: granted ? '#06b6a4' : '#374151' }]}>
                    <Text style={styles.badgeText}>{granted ? 'Enabled' : 'Off'}</Text>
                </View>

                {!granted && (
                    <Pressable style={styles.btn} onPress={onRequest}>
                        <Text style={styles.btnText}>Enable</Text>
                    </Pressable>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1220',
        padding: 12,
        borderRadius: 12,
        marginRight: 8,
        minWidth: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { color: '#E6FFFA', fontWeight: '700', fontSize: 14 },
    subtitle: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
    right: { alignItems: 'flex-end', marginTop: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
    badgeText: { color: '#07121A', fontWeight: '700' },
    btn: { backgroundColor: '#0f1724', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    btnText: { color: '#E6FFFA', fontWeight: '600' },
});
