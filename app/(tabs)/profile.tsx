import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Emo, emoKind, styles } from '../../src/components/ui';
import { WORLDS } from '../../src/data/worlds';
import { playerStats, useStore } from '../../src/store';
import { C } from '../../src/theme';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { orders, worldShops, worldTried } = useStore();
  const s = playerStats(orders);
  const badges: [string, string, boolean][] = [
    ['🍽️', 'First bite', s.orders >= 1],
    ['🧭', '3 places', s.worlds >= 3],
    ['🔥', '3-day streak', s.streak >= 3],
    ['👑', '10 orders', s.orders >= 10],
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 16, padding: 20, gap: 16 }}>
      <View style={[styles.row, { gap: 14 }]}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#EDE5FD', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' }}>
          <Emo e="😎" size={38} kind="wiggle" />
        </View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: C.ink }}>Guest</Text>
          <Text style={styles.mute}>Sign-in arrives in milestone 2 · Level {s.level}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: C.brand, borderRadius: 22, padding: 16, gap: 10 }}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17 }}>Level {s.level}</Text>
          <Text style={{ color: '#fff', opacity: 0.85 }}>{s.xp} XP</Text>
        </View>
        <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.25)' }}>
          <View style={{ height: 10, borderRadius: 5, width: `${s.into / 2}%` as const, backgroundColor: '#FFD54A' }} />
        </View>
        <Text style={{ color: '#fff', opacity: 0.85, fontSize: 12 }}>{200 - s.into} XP to level {s.level + 1}. Every order earns 40 XP, delivered orders +20.</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {([['🧾', s.orders, 'Orders'], ['🌍', s.worlds, 'Places tried'], ['🔥', s.streak, 'Day streak']] as const).map(([e, n, l]) => (
          <Card key={l} style={{ flex: 1, padding: 12, gap: 2 }}>
            <Text style={{ fontSize: 20 }}>{e}</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: C.ink }}>{n}</Text>
            <Text style={{ fontSize: 11, color: C.mute }}>{l}</Text>
          </Card>
        ))}
      </View>

      <Card style={{ padding: 14, gap: 10 }}>
        <Text style={{ fontWeight: '700', fontSize: 15, color: C.ink }}>Badges</Text>
        <View style={{ flexDirection: 'row' }}>
          {badges.map(([e, l, ok], i) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', gap: 4, opacity: ok ? 1 : 0.3 }}>
              {ok ? <Emo e={e} size={30} kind={emoKind(i)} /> : <Text style={{ fontSize: 30 }}>{e}</Text>}
              <Text style={{ fontSize: 11, color: C.ink, textAlign: 'center' }}>{l}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={{ padding: 14, gap: 10 }}>
        <Text style={{ fontWeight: '700', fontSize: 15, color: C.ink }}>World badges</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 }}>
          {WORLDS.map((w, i) => {
            const shops = worldShops(w).length;
            const ok = shops > 0 && worldTried(w) >= Math.max(1, Math.min(3, shops));
            return (
              <View key={w.id} style={{ width: '25%', alignItems: 'center', gap: 4, opacity: ok ? 1 : 0.3 }}>
                {ok ? <Emo e={w.emoji} size={28} kind={emoKind(i)} /> : <Text style={{ fontSize: 28 }}>{w.emoji}</Text>}
                <Text style={{ fontSize: 10, color: C.ink, textAlign: 'center' }}>{w.name.replace(' World', '')}</Text>
              </View>
            );
          })}
        </View>
      </Card>
    </ScrollView>
  );
}
