import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Emo, Logo, styles } from '../../src/components/ui';
import { orderSteps, useStore } from '../../src/store';
import { C, fmt } from '../../src/theme';

export default function Orders() {
  const insets = useSafeAreaInsets();
  const { orders, restaurant } = useStore();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 16, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: C.ink, marginBottom: 6 }}>Your orders</Text>
      {orders.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
          <Emo e="🍽️" size={64} kind="hop" />
          <Text style={{ color: C.mute, textAlign: 'center' }}>No orders yet. Pick a world and find something tasty.</Text>
        </View>
      )}
      {orders.map((o) => {
        const r = restaurant(o.restaurantId);
        if (!r) return null;
        const done = o.status >= 3;
        return (
          <Pressable key={o.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })}>
            <Card style={[styles.row, { padding: 12, gap: 12 }]}>
              <Logo r={r} size={46} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: C.ink }}>{r.name}</Text>
                <Text numberOfLines={1} style={styles.mute}>{o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.ink }}>{fmt(o.total)}</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: done ? '#EFEDF3' : C.brand }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: done ? C.mute : '#fff' }}>{orderSteps(o.mode)[o.status]}</Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
