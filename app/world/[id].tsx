import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShopFront } from '../../src/components/ShopFront';
import { Card, Emo, emoKind, Logo } from '../../src/components/ui';
import { foodEmoji, worldById } from '../../src/data/worlds';
import { useStore } from '../../src/store';
import { C, fmt, lum, mix } from '../../src/theme';

const DECO: [number, number, number, number][] = [[8, 30, 30, 0], [78, 20, 26, 500], [14, 140, 24, 1000], [82, 140, 30, 1400], [46, 10, 22, 800]];

export default function WorldScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { worldShops, worldTried } = useStore();
  const w = worldById(id);
  if (!w) return null;

  const shops = worldShops(w).sort((a, b) => a.distanceKm - b.distanceKm);
  const tint = mix(w.bg, '#FFFFFF', 0.86);
  const accent = lum(w.bg) < 0.2 ? mix(w.bg, '#FFFFFF', 0.15) : w.bg;
  const goal = Math.max(1, Math.min(3, shops.length));
  const tried = worldTried(w);
  const dishes = shops
    .flatMap((r) => r.items.filter((it) => w.match.test(it.name + ' ' + it.cat + ' ' + r.tagline)).map((it) => ({ r, it })))
    .sort((a, b) => Number(!!b.it.best) - Number(!!a.it.best))
    .slice(0, 8);

  // Pair shops into rows of two for the grid.
  const rows: (typeof shops)[] = [];
  for (let i = 0; i < shops.length + 1; i += 2) rows.push(shops.slice(i, i + 2));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: tint }} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
      <View style={{ backgroundColor: w.bg, paddingTop: insets.top + 8, paddingBottom: 40, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' }}>
        {DECO.map(([x, y, size, delay], k) => (
          <View key={k} style={{ position: 'absolute', left: `${x}%` as const, top: insets.top + y + 40 }}>
            <Emo e={w.deco[k % 3]} size={size} delay={delay} />
          </View>
        ))}
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()}
          style={{ marginLeft: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: w.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: w.bg, fontSize: 20, fontWeight: '700' }}>‹</Text>
        </Pressable>
        <View style={{ alignItems: 'center', gap: 4, paddingHorizontal: 20 }}>
          <Emo e={w.emoji} size={88} kind="hop" />
          <Text style={{ color: w.ink, fontSize: 32, fontWeight: '800', textAlign: 'center', marginTop: 6 }}>{w.name}</Text>
          <Text style={{ color: w.ink, opacity: 0.85, fontSize: 14 }}>{w.tag} · {shops.length} shop{shops.length === 1 ? '' : 's'}</Text>
        </View>
      </View>

      <View style={{ padding: 20, gap: 20 }}>
        {shops.length > 0 && (
          <Card style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
            <Emo e="🏆" size={32} kind="wiggle" />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontWeight: '700', fontSize: 14, color: C.ink }}>World challenge: try {goal} place{goal > 1 ? 's' : ''} here</Text>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: tint }}>
                <View style={{ height: 8, borderRadius: 4, width: `${Math.min(100, (tried / goal) * 100)}%` as const, backgroundColor: accent }} />
              </View>
              <Text style={{ fontSize: 12, color: C.mute }}>
                {tried >= goal ? `Done! ${w.emoji} badge unlocked in your profile` : `${Math.min(tried, goal)} of ${goal} · unlock the ${w.emoji} badge`}
              </Text>
            </View>
          </Card>
        )}

        {dishes.length > 0 && (
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.ink }}>Popular in {w.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 20 }}>
              {dishes.map(({ r, it }, i) => (
                <Pressable key={it.id} accessibilityRole="button" accessibilityLabel={`${it.name} from ${r.name}`}
                  onPress={() => router.push({ pathname: '/shop/[id]', params: { id: r.id, from: w.id } })}>
                  <Card style={{ width: 150, padding: 10, gap: 6 }}>
                    <View style={{ height: 120, borderRadius: 30, backgroundColor: mix(r.bg, '#FFFFFF', 0.6), alignItems: 'center', justifyContent: 'center' }}>
                      <Emo e={foodEmoji(it.name)} size={58} kind={emoKind(i)} delay={i * 250} />
                    </View>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: C.ink }}>{it.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Logo r={r} size={18} /><Text style={{ fontSize: 11, color: C.mute }}>{r.name}</Text></View>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: C.ink }}>{fmt(it.price)}</Text>
                  </Card>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.ink }}>Shops in this world</Text>
          {rows.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', gap: 14 }}>
              {row.map((r, i) => <ShopFront key={r.id} r={r} index={ri * 2 + i} fromWorld={w.id} />)}
              {row.length < 2 && (
                <View style={{ flex: 1, minHeight: 220, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: '#C9BCEB', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12 }}>
                  <Emo e="🏪" size={32} kind="hop" />
                  <Text style={{ fontWeight: '700', fontSize: 13, color: C.ink }}>Your shop here</Text>
                  <Text style={{ fontSize: 11, color: C.mute, textAlign: 'center' }}>Restaurant owner? Open a shop in {w.name}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
