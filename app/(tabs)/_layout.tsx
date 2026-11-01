import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../src/store';
import { C } from '../../src/theme';

const ICONS: Record<string, string> = { index: '🏠', map: '📍', orders: '🧾', profile: '👤' };
const LABELS: Record<string, string> = { index: 'Home', map: 'Map', orders: 'Orders', profile: 'Profile' };

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { cartCount } = useStore();
  const routes = state.routes;
  const tab = (i: number) => {
    const route = routes[i];
    const focused = state.index === i;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        onPress={() => navigation.navigate(route.name as never)}
        style={{ alignItems: 'center', justifyContent: 'center', minWidth: 60, minHeight: 48, gap: 2 }}
      >
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.55 }}>{ICONS[route.name]}</Text>
        <Text style={{ fontSize: 11, fontWeight: focused ? '700' : '500', color: focused ? C.brand : '#8A8499' }}>{LABELS[route.name]}</Text>
      </Pressable>
    );
  };
  const openCart = () => {
    if (!cartCount) {
      const msg = 'Your cart is empty. Add something tasty first.';
      Platform.OS === 'web' ? (globalThis as any).alert?.(msg) : Alert.alert('Cart', msg);
      return;
    }
    router.push('/cart');
  };
  return (
    <View
      style={{
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start',
        backgroundColor: '#fff', paddingTop: 8, paddingBottom: Math.max(insets.bottom, 10),
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        shadowColor: '#3C1E78', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: -6 }, elevation: 12,
      }}
    >
      {tab(0)}
      {tab(1)}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Cart, ${cartCount} items`}
        onPress={openCart}
        style={{
          width: 62, height: 62, borderRadius: 31, marginTop: -28, backgroundColor: C.brand, borderWidth: 4, borderColor: '#fff',
          alignItems: 'center', justifyContent: 'center',
          shadowColor: C.brand, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8,
        }}
      >
        <Text style={{ fontSize: 24 }}>🛒</Text>
        {cartCount > 0 && (
          <View style={{ position: 'absolute', top: -6, right: -6, minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 5, backgroundColor: '#FF5A36', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{cartCount}</Text>
          </View>
        )}
      </Pressable>
      {tab(2)}
      {tab(3)}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
