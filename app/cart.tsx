import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Emo, Logo, PrimaryButton, styles } from '../src/components/ui';
import { foodEmoji } from '../src/data/worlds';
import { DELIVERY, useStore } from '../src/store';
import { C, fmt, mix } from '../src/theme';

const notify = (msg: string) => (Platform.OS === 'web' ? (globalThis as any).alert?.(msg) : Alert.alert('FoodVerse', msg));

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, restaurant, cartCount, cartSubtotal, add, remove, removeAll, clearCart, setMode, setAddress, placeOrder } = useStore();
  const r = cart.restaurantId ? restaurant(cart.restaurantId) : undefined;

  if (!r || !cartCount) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        <Emo e="🛒" size={64} kind="hop" />
        <Text style={{ color: C.mute, fontSize: 15 }}>Your cart is empty.</Text>
        <PrimaryButton label="Find something tasty" onPress={() => router.back()} />
      </View>
    );
  }

  const fee = cart.mode === 'delivery' ? DELIVERY : 0;
  const total = cartSubtotal + fee;

  const submit = () => {
    if (cart.mode === 'delivery' && !cart.address.trim()) {
      notify('Add a delivery address first.');
      return;
    }
    const order = placeOrder();
    if (order) router.replace({ pathname: '/order/[id]', params: { id: order.id } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[styles.row, { paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 10, justifyContent: 'space-between' }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close cart" onPress={() => router.back()}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink }}>‹</Text>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink }}>Your cart</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Empty cart" onPress={clearCart}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 14 }}>
        <View style={[styles.row, { gap: 10 }]}>
          <Logo r={r} size={28} />
          <Text style={{ color: C.mute, fontSize: 13 }}>From <Text style={{ color: C.ink, fontWeight: '700' }}>{r.name}</Text></Text>
        </View>

        <Card style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
          {Object.entries(cart.lines).map(([itemId, qty], i) => {
            const it = r.items.find((x) => x.id === itemId);
            if (!it) return null;
            return (
              <View key={itemId} style={[styles.row, { gap: 12, paddingVertical: 10, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }]}>
                <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: mix(r.bg, '#FFFFFF', 0.6), alignItems: 'center', justifyContent: 'center' }}>
                  <Emo e={foodEmoji(it.name)} size={30} delay={i * 300} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontWeight: '700', fontSize: 14, color: C.ink }}>{it.name}</Text>
                  <Text style={{ color: C.mute, fontSize: 13 }}>{fmt(it.price)}</Text>
                </View>
                <View style={[styles.row, { borderWidth: 1, borderColor: '#E6E0F2', borderRadius: 22 }]}>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Remove one ${it.name}`} onPress={() => remove(itemId)} style={{ width: 36, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, color: C.ink }}>−</Text>
                  </Pressable>
                  <Text style={{ fontWeight: '700', color: C.ink }}>{qty}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Add one ${it.name}`} onPress={() => add(r.id, itemId)} style={{ width: 36, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, color: C.ink }}>+</Text>
                  </Pressable>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${it.name}`} onPress={() => removeAll(itemId)} style={{ width: 32, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: C.mute, fontSize: 16 }}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </Card>

        <View style={{ flexDirection: 'row', backgroundColor: '#EAE4F6', borderRadius: 16, padding: 4, gap: 4 }}>
          {(['delivery', 'pickup'] as const).map((m) => (
            <Pressable key={m} accessibilityRole="button" accessibilityState={{ selected: cart.mode === m }} onPress={() => setMode(m)}
              style={{ flex: 1, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: cart.mode === m ? '#fff' : 'transparent' }}>
              <Text style={{ fontWeight: '600', color: cart.mode === m ? C.brand : C.mute }}>{m === 'delivery' ? '🛵 Delivery' : '🛍️ Pickup'}</Text>
            </Pressable>
          ))}
        </View>

        {cart.mode === 'delivery' ? (
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>Delivery address</Text>
            <Card>
              <TextInput value={cart.address} onChangeText={setAddress} placeholder="House, street, area" placeholderTextColor={C.mute}
                accessibilityLabel="Delivery address" style={{ height: 50, paddingHorizontal: 16, fontSize: 15, color: C.ink }} />
            </Card>
          </View>
        ) : (
          <Text style={{ color: C.mute, fontSize: 14 }}>Pick up from {r.name} in about {r.eta}.</Text>
        )}

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>Payment</Text>
          <Card style={[styles.row, { padding: 14, justifyContent: 'space-between' }]}>
            <Text style={{ color: C.ink }}>💵 Cash on {cart.mode === 'delivery' ? 'delivery' : 'pickup'}</Text>
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 6, borderColor: C.brand }} />
          </Card>
          <Card style={[styles.row, { padding: 14, justifyContent: 'space-between', opacity: 0.55 }]}>
            <Text style={{ color: C.ink }}>📱 JazzCash / Easypaisa</Text>
            <Text style={{ color: C.mute, fontSize: 12 }}>Coming soon</Text>
          </Card>
        </View>

        <View style={{ gap: 8 }}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}><Text style={{ color: C.mute }}>Subtotal</Text><Text style={{ color: C.mute }}>{fmt(cartSubtotal)}</Text></View>
          {fee > 0 && <View style={[styles.row, { justifyContent: 'space-between' }]}><Text style={{ color: C.mute }}>Delivery fee</Text><Text style={{ color: C.mute }}>{fmt(fee)}</Text></View>}
          <View style={[styles.row, { justifyContent: 'space-between' }]}><Text style={{ fontWeight: '800', fontSize: 20, color: C.ink }}>Total</Text><Text style={{ fontWeight: '800', fontSize: 20, color: C.ink }}>{fmt(total)}</Text></View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton label={`Place order · ${fmt(total)} →`} onPress={submit} />
      </View>
    </View>
  );
}
