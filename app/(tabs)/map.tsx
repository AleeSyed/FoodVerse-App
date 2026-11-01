import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Emo, Logo, styles } from '../../src/components/ui';
import { WORLDS } from '../../src/data/worlds';
import { useStore } from '../../src/store';
import { C } from '../../src/theme';

// Milestone 3 replaces the placeholder below with Google Maps (react-native-maps),
// custom-styled to the FoodVerse look, with logo pins and live rider routes.
export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { restaurants } = useStore();
  const [world, setWorld] = useState('');
  const list = restaurants.filter((r) => !world || r.worlds.includes(world)).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: 260, backgroundColor: '#E7E9DD', alignItems: 'center', justifyContent: 'center', paddingTop: insets.top, gap: 8 }}>
        <Emo e="🗺️" size={64} kind="hop" />
        <Text style={{ color: C.ink, fontWeight: '700' }}>Google Maps arrives in milestone 3</Text>
        <Text style={{ color: C.mute, fontSize: 12 }}>Nearby shops are listed below for now</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, padding: 16 }}>
        {[{ id: '', emoji: '', name: 'All' }, ...WORLDS].map((w) => {
          const on = world === w.id;
          return (
            <Pressable key={w.id || 'all'} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setWorld(w.id)}
              style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, justifyContent: 'center', backgroundColor: on ? C.brand : '#fff' }}>
              <Text style={{ color: on ? '#fff' : C.ink, fontWeight: '600', fontSize: 13 }}>{w.emoji} {w.name.replace(' World', '')}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}>
        {list.map((r) => (
          <Pressable key={r.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/shop/[id]', params: { id: r.id } })}>
            <Card style={[styles.row, { padding: 10, gap: 10 }]}>
              <Logo r={r} size={42} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: C.ink }}>{r.name}</Text>
                <Text style={styles.mute}>{r.distanceKm} km · {r.eta}</Text>
              </View>
              <Text style={{ color: C.brand, fontWeight: '700' }}>Enter ›</Text>
            </Card>
          </Pressable>
        ))}
        {!list.length && <Text style={{ color: C.mute, textAlign: 'center' }}>No shops in this world yet.</Text>}
      </ScrollView>
    </View>
  );
}
