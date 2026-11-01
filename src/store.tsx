import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SAMPLE_RESTAURANTS } from './data/restaurants';
import type { Order, OrderStatus, Restaurant } from './data/types';
import type { World } from './data/types';

// App state for milestone 1. Restaurants are sample data; orders, stamps and the
// cart are saved on the device. Milestone 2 moves restaurants and orders to Supabase.

type Cart = {
  restaurantId: string | null;
  lines: Record<string, number>;
  mode: 'delivery' | 'pickup';
  address: string;
};

type Store = {
  ready: boolean;
  restaurants: Restaurant[];
  restaurant: (id: string) => Restaurant | undefined;
  cart: Cart;
  cartCount: number;
  cartSubtotal: number;
  add: (restaurantId: string, itemId: string) => void;
  remove: (itemId: string) => void;
  removeAll: (itemId: string) => void;
  clearCart: () => void;
  setMode: (mode: Cart['mode']) => void;
  setAddress: (address: string) => void;
  placeOrder: () => Order | null;
  orders: Order[];
  advanceOrder: (id: string) => void;
  stamps: Record<string, number>;
  worldShops: (w: World) => Restaurant[];
  worldTried: (w: World) => number;
};

const DELIVERY_FEE = 150;
const EMPTY_CART: Cart = { restaurantId: null, lines: {}, mode: 'delivery', address: '' };
const KEY = 'foodverse:v1';

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [restaurants] = useState<Restaurant[]>(SAMPLE_RESTAURANTS);
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stamps, setStamps] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  // Load saved state once.
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (saved.orders) setOrders(saved.orders);
        if (saved.stamps) setStamps(saved.stamps);
        if (saved.cart) setCart(saved.cart);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // Save whenever it changes.
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ orders, stamps, cart })).catch(() => {});
  }, [ready, orders, stamps, cart]);

  const restaurant = useCallback((id: string) => restaurants.find((r) => r.id === id), [restaurants]);

  const cartRestaurant = cart.restaurantId ? restaurant(cart.restaurantId) : undefined;
  const cartCount = Object.values(cart.lines).reduce((a, b) => a + b, 0);
  const cartSubtotal = Object.entries(cart.lines).reduce((t, [id, q]) => {
    const it = cartRestaurant?.items.find((x) => x.id === id);
    return t + (it ? it.price * q : 0);
  }, 0);

  const add = useCallback((restaurantId: string, itemId: string) => {
    setCart((c) => {
      // A cart holds one restaurant at a time; adding from another starts a new cart.
      const lines = c.restaurantId === restaurantId ? { ...c.lines } : {};
      lines[itemId] = (lines[itemId] ?? 0) + 1;
      return { ...c, restaurantId, lines };
    });
  }, []);

  const remove = useCallback((itemId: string) => {
    setCart((c) => {
      const lines = { ...c.lines };
      if (!lines[itemId]) return c;
      lines[itemId] -= 1;
      if (!lines[itemId]) delete lines[itemId];
      return { ...c, lines };
    });
  }, []);

  const removeAll = useCallback((itemId: string) => {
    setCart((c) => {
      const lines = { ...c.lines };
      delete lines[itemId];
      return { ...c, lines };
    });
  }, []);

  const clearCart = useCallback(() => setCart((c) => ({ ...c, lines: {} })), []);
  const setMode = useCallback((mode: Cart['mode']) => setCart((c) => ({ ...c, mode })), []);
  const setAddress = useCallback((address: string) => setCart((c) => ({ ...c, address })), []);

  const placeOrder = useCallback((): Order | null => {
    if (!cartRestaurant || !cartCount) return null;
    const lines = Object.entries(cart.lines).flatMap(([itemId, qty]) => {
      const it = cartRestaurant.items.find((x) => x.id === itemId);
      return it ? [{ itemId, name: it.name, price: it.price, qty }] : [];
    });
    const deliveryFee = cart.mode === 'delivery' ? DELIVERY_FEE : 0;
    const order: Order = {
      id: Math.random().toString(36).slice(2, 7).toUpperCase(),
      restaurantId: cartRestaurant.id,
      lines,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartSubtotal + deliveryFee,
      mode: cart.mode,
      address: cart.address.trim(),
      status: 0,
      createdAt: Date.now(),
    };
    setOrders((o) => [order, ...o]);
    if (cartRestaurant.games.stamps) {
      setStamps((s) => {
        const cur = s[cartRestaurant.id] ?? 0;
        return { ...s, [cartRestaurant.id]: (cur >= cartRestaurant.stampsNeeded ? 0 : cur) + 1 };
      });
    }
    setCart((c) => ({ ...c, restaurantId: null, lines: {} }));
    return order;
  }, [cart, cartRestaurant, cartCount, cartSubtotal]);

  const advanceOrder = useCallback((id: string) => {
    setOrders((os) => os.map((o) => (o.id === id && o.status < 3 ? { ...o, status: (o.status + 1) as OrderStatus } : o)));
  }, []);

  const worldShops = useCallback((w: World) => restaurants.filter((r) => r.worlds.includes(w.id)), [restaurants]);
  const worldTried = useCallback(
    (w: World) => new Set(orders.filter((o) => restaurant(o.restaurantId)?.worlds.includes(w.id)).map((o) => o.restaurantId)).size,
    [orders, restaurant],
  );

  const value = useMemo<Store>(
    () => ({
      ready, restaurants, restaurant, cart, cartCount, cartSubtotal, add, remove, removeAll, clearCart,
      setMode, setAddress, placeOrder, orders, advanceOrder, stamps, worldShops, worldTried,
    }),
    [ready, restaurants, restaurant, cart, cartCount, cartSubtotal, add, remove, removeAll, clearCart,
      setMode, setAddress, placeOrder, orders, advanceOrder, stamps, worldShops, worldTried],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

export const DELIVERY = DELIVERY_FEE;

export function orderSteps(mode: Order['mode']) {
  return mode === 'delivery'
    ? ['Order placed', 'Preparing', 'On the way', 'Delivered']
    : ['Order placed', 'Preparing', 'Ready for pickup', 'Picked up'];
}

/** XP, level and streak, computed from real orders. */
export function playerStats(orders: Order[]) {
  const xp = orders.length * 40 + orders.filter((o) => o.status >= 3).length * 20;
  const level = Math.floor(xp / 200) + 1;
  const worlds = new Set(orders.map((o) => o.restaurantId)).size;
  const days = new Set(orders.map((o) => new Date(o.createdAt).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return { xp, level, into: xp % 200, worlds, streak, orders: orders.length };
}
