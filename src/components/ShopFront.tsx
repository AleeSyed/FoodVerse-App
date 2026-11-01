import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Restaurant } from '../data/types';
import { foodEmoji } from '../data/worlds';
import { C, mix, shadow, textOn } from '../theme';
import { Emo, Logo } from './ui';

/** A restaurant drawn as a little shop inside a food world. */
export function ShopFront({ r, index, fromWorld }: { r: Restaurant; index: number; fromWorld?: string }) {
  const dish = r.items.find((x) => x.best) ?? r.items[0];
  const signBg = mix(r.bg, '#000000', 0.28);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Enter ${r.name}`}
      onPress={() => router.push({ pathname: '/shop/[id]', params: { id: r.id, from: fromWorld ?? '' } })}
      style={({ pressed }) => ({ flex: 1, backgroundColor: C.card, borderRadius: 20, overflow: 'hidden', opacity: pressed ? 0.9 : 1, ...shadow })}
    >
      {/* Striped awning */}
      <View style={{ flexDirection: 'row', height: 22, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: i % 2 ? mix(r.accent, '#FFFFFF', 0.8) : r.accent }} />
        ))}
      </View>
      <View style={{ height: 132, backgroundColor: r.bg, padding: 10, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', maxWidth: '100%', backgroundColor: signBg, borderRadius: 14, paddingVertical: 4, paddingLeft: 4, paddingRight: 10 }}>
          <Logo r={r} size={24} />
          <Text numberOfLines={1} style={{ color: textOn(signBg), fontWeight: '700', fontSize: 13, flexShrink: 1 }}>{r.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, flex: 1 }}>
          <View style={{ flex: 1, height: 66, borderRadius: 12, backgroundColor: mix(r.bg, '#FFFFFF', 0.72), borderWidth: 3, borderColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center' }}>
            <Emo e={foodEmoji(dish?.name ?? r.tagline)} size={34} delay={index * 300} />
          </View>
          <View style={{ width: 30, height: 74, borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: mix(r.bg, '#000000', 0.5) }}>
            <View style={{ position: 'absolute', right: 6, top: 34, width: 5, height: 5, borderRadius: 3, backgroundColor: r.accent }} />
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12, gap: 2 }}>
        <Text style={{ fontWeight: '700', fontSize: 14, color: C.ink }} numberOfLines={1}>{r.name}</Text>
        <Text style={{ fontSize: 11, color: C.mute }}>{r.distanceKm} km · {r.eta}{r.games.spin ? ' · Spin & win' : ''}</Text>
      </View>
    </Pressable>
  );
}
