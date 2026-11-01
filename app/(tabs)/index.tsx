import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Emo, emoKind, Logo, SectionTitle, styles } from '../../src/components/ui';
import { WORLDS, worldById } from '../../src/data/worlds';
import { useStore } from '../../src/store';
import { C, shadow } from '../../src/theme';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { restaurants, orders, restaurant, worldShops } = useStore();
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return restaurants
      .filter((r) => !s || (r.name + ' ' + r.tagline + ' ' + r.items.map((i) => i.name).join(' ')).toLowerCase().includes(s))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [restaurants, q]);

  const last = orders.find((o) => restaurant(o.restaurantId));
  const lastR = last ? restaurant(last.restaurantId) : undefined;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32, gap: 18 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={[styles.row, { gap: 8 }]}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>🛍️</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.ink }}>FoodVerse</Text>
        </View>
        <View style={{ height: 170, marginTop: 8 }}>
          <Text style={{ fontSize: 34, lineHeight: 37, fontWeight: '800', color: C.ink, letterSpacing: -1 }}>Good food.{'\n'}Good vibes.</Text>
          <Text style={{ marginTop: 8, fontSize: 13, color: C.mute, maxWidth: 190 }}>Pick a food world, step into a shop, and order.</Text>
          <View style={{ position: 'absolute', right: 0, bottom: 0 }}><Emo e="🛵" size={92} kind="drive" /></View>
          <View style={{ position: 'absolute', right: 118, top: 4 }}><Emo e="🍔" size={28} /></View>
          <View style={{ position: 'absolute', right: 14, top: 0 }}><Emo e="🍕" size={26} delay={600} /></View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <Card style={[styles.row, { paddingHorizontal: 16, height: 52, gap: 10 }]}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search restaurants or dishes…"
            placeholderTextColor={C.mute}
            accessibilityLabel="Search restaurants or dishes"
            style={{ flex: 1, fontSize: 15, color: C.ink }}
          />
        </Card>
      </View>

      {last && lastR && !q && (
        <View style={{ paddingHorizontal: 20 }}>
          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/shop/[id]', params: { id: lastR.id } })}>
            <Card style={[styles.row, { padding: 10, gap: 10 }]}>
              <Logo r={lastR} size={36} />
              <Text numberOfLines={1} style={{ flex: 1, fontSize: 13, color: C.ink }}>
                <Text style={{ fontWeight: '700' }}>Order again</Text> · {lastR.name} · {last.lines.map((l) => l.name).join(', ')}
              </Text>
              <Text style={{ color: C.brand, fontWeight: '700' }}>Go</Text>
            </Card>
          </Pressable>
        </View>
      )}

      {!q && (
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <SectionTitle>Choose a world</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {WORLDS.map((w, i) => {
              const count = worldShops(w).length;
              return (
                <Pressable
                  key={w.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Enter ${w.name}, ${count} shops`}
                  onPress={() => router.push({ pathname: '/world/[id]', params: { id: w.id } })}
                  style={({ pressed }) => ({ width: '47.5%', minHeight: 170, borderRadius: 24, padding: 14, backgroundColor: w.bg, overflow: 'hidden', opacity: pressed ? 0.9 : 1, ...shadow })}
                >
                  <View style={{ position: 'absolute', right: 10, top: 8 }}><Emo e={w.deco[0]} size={18} delay={i * 300} /></View>
                  <View style={{ alignSelf: 'center', marginTop: 10, marginBottom: 6 }}><Emo e={w.emoji} size={54} kind={emoKind(i)} delay={i * 200} /></View>
                  <Text style={{ color: w.ink, fontWeight: '800', fontSize: 15 }}>{w.name}</Text>
                  <Text style={{ color: w.ink, opacity: 0.85, fontSize: 12 }}>{count ? `${count} shop${count > 1 ? 's' : ''}` : 'Opening soon'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        <SectionTitle>{q ? 'Results' : 'Quick order ⚡'}</SectionTitle>
        {list.map((r, i) => (
          <Pressable key={r.id} accessibilityRole="button" accessibilityLabel={`Open ${r.name}`} onPress={() => router.push({ pathname: '/shop/[id]', params: { id: r.id } })}>
            <Card style={[styles.row, { padding: 10, gap: 12 }]}>
              <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: r.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Emo e={worldById(r.worlds[0])?.emoji ?? '🍽️'} size={30} kind={emoKind(i + 1)} delay={i * 400} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: C.ink }}>{r.name}</Text>
                <Text numberOfLines={1} style={styles.mute}>{r.worlds.map((id) => worldById(id)?.emoji).join(' ')} {r.tagline}</Text>
                <Text style={styles.mute}>{r.distanceKm} km · {r.eta}</Text>
              </View>
              <Logo r={r} size={34} />
            </Card>
          </Pressable>
        ))}
        {!list.length && <Text style={{ color: C.mute, textAlign: 'center' }}>No restaurants match that.</Text>}
      </View>
    </ScrollView>
  );
}
