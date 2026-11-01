export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  cat: string;
  best?: boolean;
  /** Optional 3D model type or URL, used in a later milestone. */
  model?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  tagline: string;
  eta: string;
  bg: string;
  accent: string;
  /** IDs of the food worlds this restaurant has a shop in. */
  worlds: string[];
  games: { spin: boolean; stamps: boolean };
  stampsNeeded: number;
  cats: string[];
  items: MenuItem[];
  /** Real coordinates arrive with the Google Maps milestone. */
  location?: { lat: number; lng: number };
  /** Demo-only distance until real locations exist. */
  distanceKm: number;
};

export type World = {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  ink: string;
  deco: string[];
  tag: string;
  match: RegExp;
};

export type OrderLine = { itemId: string; name: string; price: number; qty: number };

export type OrderStatus = 0 | 1 | 2 | 3;

export type Order = {
  id: string;
  restaurantId: string;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  mode: 'delivery' | 'pickup';
  address: string;
  status: OrderStatus;
  createdAt: number;
};
