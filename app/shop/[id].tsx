import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Emo, emoKind, Logo } from '../../src/components/ui';
import type { MenuItem, Restaurant } from '../../src/data/types';
import { foodEmoji, worldById } from '../../src/data/worlds';
import { useStore } from '../../src/store';
import { fmt, mix, textOn } from '../../src/theme';

function QtyControl({ r, it }: { r: Restaurant; it: MenuItem }) {
  const { cart, add, remove } = useStore();
  const q = cart.restaurantId === r.id ? cart.lines[it.id] ?? 0 : 0;
  const atext = textOn(r.accent);
  if (!q) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={`Add ${it.name}`} onPress={() => add(r.id, it.id)}
        style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: r.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: atext, fontSize: 22, fontWeight: '700' }}>+</Text>
      </Pressable>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: r.accent, borderRadius: 22, height: 44 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Remove one ${it.name}`} onPress={() => remove(it.id)} style={{ width: 40, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: atext, fontSize: 20, fontWeight: '700' }}>−</Text>
      </Pressable>
      <Text style={{ color: atext, fontWeight: '700', minWidth: 14, textAlign: 'center' }}>{q}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Add one ${it.name}`} onPress={() => add(r.id, it.id)} style={{ width: 40, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: atext, fontSize: 20, fontWeight: '700' }}>+</Text>
      </Pressable>
    </View>
  );
}

export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string; from?: string }>();
  const insets = useSafeAreaInsets();
  const { restaurant, cart, cartCount, cartSubtotal, stamps } = useStore();
  const r = restaurant(id);
  if (!r) return null;

  const text = textOn(r.bg);
  const surface = mix(r.bg, text, 0.09);
  const stamp = stamps[r.id] ?? 0;
  const inCart = cart.restaurantId === r.id ? cartCount : 0;
  const popular = r.items.filter((x) => x.best);

  return (
    <View style={{ flex: 1, backgroundColor: r.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        {/* Cover */}
        <View style={{ height: 230, backgroundColor: mix(r.bg, r.accent, 0.6), overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -60, top: -60, width: 260, height: 260, borderRadius: 130, backgroundColor: r.accent }} />
          <View style={{ position: 'absolute', right: 44, top: 86 }}><Emo e={worldById(r.worlds[0])?.emoji ?? '🍽️'} size={84} kind="hop" /></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()}
            style={{ position: 'absolute', left: 16, top: insets.top + 8, width: 44, height: 44, borderRadius: 22, backgroundColor: r.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: text, fontSize: 20, fontWeight: '700' }}>‹</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -34, gap: 8 }}>
          <View style={{ borderWidth: 4, borderColor: r.bg, borderRadius: 40, alignSelf: 'flex-start' }}><Logo r={r} size={68} /></View>
          <Text style={{ color: text, fontSize: 36, fontWeight: '800', letterSpacing: -0.5 }}>{r.name}</Text>
          <Text style={{ color: text, opacity: 0.8, fontSize: 14 }}>{r.tagline} · {r.eta}</Text>
        </View>

        {r.games.stamps && (
          <View style={{ marginHorizontal: 20, marginTop: 16, backgroundColor: surface, borderRadius: 18, padding: 14, gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: text, fontWeight: '600', fontSize: 13 }}>Stamp card</Text>
              <Text style={{ color: text, opacity: 0.8, fontSize: 13 }}>
                {stamp >= r.stampsNeeded ? 'Reward unlocked on your next order' : `${r.stampsNeeded - stamp} more for a free item`}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: r.stampsNeeded }, (_, i) => (
                <View key={i} style={{ flex: 1, height: 24, borderRadius: 12, backgroundColor: i < stamp ? r.accent : 'transparent', borderWidth: i < stamp ? 0 : 1.5, borderColor: text, opacity: i < stamp ? 1 : 0.4 }} />
              ))}
            </View>
          </View>
        )}

        {popular.length > 0 && (
          <View style={{ marginTop: 20, gap: 10 }}>
            <Text style={{ color: text, fontSize: 22, fontWeight: '800', paddingHorizontal: 20 }}>Popular</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
              {popular.map((it, i) => (
                <View key={it.id} style={{ width: 150, backgroundColor: surface, borderRadius: 20, padding: 10, gap: 6 }}>
                  <View style={{ height: 100, borderRadius: 16, backgroundColor: mix(r.bg, r.accent, 0.3), alignItems: 'center', justifyContent: 'center' }}>
                    <Emo e={foodEmoji(it.name)} size={54} kind={emoKind(i)} delay={i * 300} />
                  </View>
                  <Text style={{ color: text, fontWeight: '700', fontSize: 14 }}>{it.name}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: text, fontWeight: '700', fontSize: 13 }}>{fmt(it.price)}</Text>
                    <QtyControl r={r} it={it} />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ paddingHorizontal: 20, marginTop: 8, gap: 12 }}>
          {r.cats.map((cat) => {
            const items = r.items.filter((x) => x.cat === cat);
            if (!items.length) return null;
            return (
              <View key={cat} style={{ gap: 10 }}>
                <Text style={{ color: text, fontSize: 22, fontWeight: '800', marginTop: 12 }}>{cat}</Text>
                {items.map((it, i) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: surface, borderRadius: 20, padding: 10 }}>
                    <View style={{ width: 84, height: 84, borderRadius: 18, backgroundColor: mix(r.bg, r.accent, 0.35), alignItems: 'center', justifyContent: 'center' }}>
                      <Emo e={foodEmoji(it.name)} size={42} delay={i * 300} />
                    </View>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={{ color: text, fontWeight: '700', fontSize: 15 }}>{it.name}{it.best ? '  ⭐' : ''}</Text>
                      <Text style={{ color: text, opacity: 0.75, fontSize: 12 }}>{it.desc}</Text>
                      <Text style={{ color: text, fontWeight: '700', fontSize: 14 }}>{fmt(it.price)}</Text>
                    </View>
                    <QtyControl r={r} it={it} />
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {inCart > 0 && (
        <Pressable accessibilityRole="button" onPress={() => router.push('/cart')}
          style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 16, height: 58, borderRadius: 20, backgroundColor: r.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
          <Text style={{ color: textOn(r.accent), fontWeight: '700', fontSize: 16 }}>View cart · {inCart} item{inCart > 1 ? 's' : ''}</Text>
          <Text style={{ color: textOn(r.accent), fontWeight: '700', fontSize: 16 }}>{fmt(cartSubtotal)}</Text>
        </Pressable>
      )}
    </View>
  );
}
