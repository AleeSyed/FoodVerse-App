import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Emo, Logo, styles } from '../../src/components/ui';
import { worldById } from '../../src/data/worlds';
import { orderSteps, useStore } from '../../src/store';
import { C, fmt } from '../../src/theme';

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { orders, restaurant, advanceOrder } = useStore();
  const o = orders.find((x) => x.id === id);
  const r = o ? restaurant(o.restaurantId) : undefined;
  if (!o || !r) return null;

  const steps = orderSteps(o.mode);
  const done = o.status >= 3;
  const riding = o.mode === 'delivery' && o.status === 2;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Map placeholder: Google Maps with the live rider route arrives in milestone 3. */}
      <View style={{ height: 300, backgroundColor: r.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Emo e={riding ? '🛵' : done ? '✅' : worldById(r.worlds[0])?.emoji ?? '🍽️'} size={110} kind={riding ? 'drive' : 'hop'} />
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/orders'))}
          style={{ position: 'absolute', left: 16, top: insets.top + 8, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink }}>‹</Text>
        </Pressable>
        <Card style={[styles.row, { position: 'absolute', right: 16, bottom: 40, padding: 12, gap: 10 }]}>
          <Text style={{ fontSize: 24 }}>{done ? '✅' : '⏱️'}</Text>
          <View>
            <Text style={{ fontSize: 11, color: C.mute }}>{done ? 'Order' : 'Arriving in'}</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>{done ? steps[3] : r.eta}</Text>
          </View>
        </Card>
      </View>

      <ScrollView style={{ marginTop: -26, backgroundColor: C.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26 }} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: insets.bottom + 24 }}>
        <View style={[styles.row, { gap: 12 }]}>
          <Logo r={r} size={46} />
          <View>
            <Text style={{ fontWeight: '700', fontSize: 16, color: C.ink }}>{r.name}</Text>
            <Text style={styles.mute}>Order #{o.id} · {o.mode === 'delivery' ? 'Delivery' : 'Pickup'}</Text>
          </View>
        </View>

        <Card style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
          <View style={{ position: 'absolute', left: '12.5%', right: '12.5%', top: 30, height: 4, borderRadius: 2, backgroundColor: '#E6E0F2' }}>
            <View style={{ height: 4, borderRadius: 2, width: `${(o.status / 3) * 100}%` as const, backgroundColor: C.brand }} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            {steps.map((s, i) => (
              <View key={s} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: i <= o.status ? C.brand : '#fff', borderWidth: i <= o.status ? 0 : 2, borderColor: '#D9D1EC' }}>
                  <Text style={{ color: i <= o.status ? '#fff' : C.mute, fontWeight: '700', fontSize: 13 }}>{i < o.status ? '✓' : i + 1}</Text>
                </View>
                <Text style={{ fontSize: 11, textAlign: 'center', fontWeight: i === o.status ? '700' : '500', color: i <= o.status ? C.ink : C.mute }}>{s}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ padding: 16, gap: 8 }}>
          {o.lines.map((l) => (
            <View key={l.itemId} style={[styles.row, { justifyContent: 'space-between' }]}>
              <Text style={{ color: C.ink }}>{l.qty} × {l.name}</Text>
              <Text style={{ color: C.ink }}>{fmt(l.price * l.qty)}</Text>
            </View>
          ))}
          {o.deliveryFee > 0 && (
            <View style={[styles.row, { justifyContent: 'space-between' }]}><Text style={{ color: C.mute }}>Delivery fee</Text><Text style={{ color: C.mute }}>{fmt(o.deliveryFee)}</Text></View>
          )}
          <View style={[styles.row, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8 }]}>
            <Text style={{ fontWeight: '800', color: C.ink }}>Total (cash)</Text>
            <Text style={{ fontWeight: '800', color: C.ink }}>{fmt(o.total)}</Text>
          </View>
        </Card>

        {!done && (
          <Pressable accessibilityRole="button" onPress={() => advanceOrder(o.id)}
            style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B9A8E6', borderRadius: 14, minHeight: 46, alignItems: 'center', justifyContent: 'center', padding: 8 }}>
            <Text style={{ color: C.brand, fontSize: 13, textAlign: 'center' }}>Dev only: move to next step (restaurants will do this from their dashboard)</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
