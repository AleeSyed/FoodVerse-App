import type { MenuItem, Restaurant } from './types';

// Sample restaurants for development. These move to the Supabase database in milestone 2.
let n = 0;
const item = (name: string, desc: string, price: number, cat: string, best = false): MenuItem => ({
  id: `i${++n}`, name, desc, price, cat, best,
});

export const SAMPLE_RESTAURANTS: Restaurant[] = [
  {
    id: 'stack', name: 'Stack House', tagline: 'Smash burgers, open till 2am', eta: '25 min',
    bg: '#FFC93C', accent: '#E8452C', worlds: ['burger', 'chicken'], games: { spin: true, stamps: true }, stampsNeeded: 6,
    cats: ['Smash', 'Chicken', 'Sides', 'Shakes'], distanceKm: 2.3,
    items: [
      item('Double Smash', 'Two patties, cheese, house sauce', 950, 'Smash', true),
      item('Classic Smash', 'Single patty, pickles, onions', 690, 'Smash'),
      item('Hot Honey Chicken', 'Crispy thigh, pickles, hot honey', 890, 'Chicken', true),
      item('Loaded Fries', 'Cheese sauce, jalapeños', 450, 'Sides'),
      item('Oreo Shake', 'Thick, cold, too much Oreo', 520, 'Shakes'),
    ],
  },
  {
    id: 'chai', name: 'Chai Khana', tagline: 'Slow chai and warm parathas', eta: '18 min',
    bg: '#1F3B33', accent: '#C98B3A', worlds: ['coffee', 'rolls'], games: { spin: false, stamps: true }, stampsNeeded: 6,
    cats: ['Chai', 'Rolls', 'Paratha'], distanceKm: 2.8,
    items: [
      item('Doodh Patti', 'Slow-brewed, extra strong', 150, 'Chai', true),
      item('Kashmiri Chai', 'Pink, pistachio, almond', 250, 'Chai'),
      item('Chicken Paratha Roll', 'Mint chutney, onions', 420, 'Rolls', true),
      item('Aloo Paratha', 'With butter and raita', 220, 'Paratha'),
      item('Nutella Paratha', 'Crispy, sweet, dangerous', 380, 'Paratha'),
    ],
  },
  {
    id: 'karahi', name: 'Karahi Point', tagline: 'Karahi and BBQ, made fresh', eta: '35 min',
    bg: '#24163A', accent: '#E9B949', worlds: ['desi', 'bbq'], games: { spin: true, stamps: false }, stampsNeeded: 6,
    cats: ['Karahi', 'BBQ', 'Naan'], distanceKm: 2.7,
    items: [
      item('Chicken Karahi (half)', 'Tomato, green chilli, ginger', 1450, 'Karahi', true),
      item('Mutton Karahi (half)', 'Slow cooked, desi ghee', 2600, 'Karahi'),
      item('Seekh Kebab (4 pc)', 'Charcoal grilled', 780, 'BBQ', true),
      item('Malai Boti', 'Creamy, smoky', 950, 'BBQ'),
      item('Garlic Naan', 'Fresh from the tandoor', 120, 'Naan'),
    ],
  },
  {
    id: 'slice', name: 'Slice Lab', tagline: 'Hand-stretched, wood-fired pizza', eta: '30 min',
    bg: '#E8452C', accent: '#FFE14D', worlds: ['pizza'], games: { spin: true, stamps: true }, stampsNeeded: 5,
    cats: ['Pizza', 'Sides'], distanceKm: 3.2,
    items: [
      item('Pepperoni Classic', 'Beef pepperoni, mozzarella', 1290, 'Pizza', true),
      item('Chicken Tikka Pizza', 'Tikka chunks, onions, green chilli', 1390, 'Pizza'),
      item('Garlic Knots', 'Butter, garlic, parmesan', 390, 'Sides'),
    ],
  },
  {
    id: 'sugar', name: 'Sugar Rush', tagline: 'Cakes, shakes, bad decisions', eta: '22 min',
    bg: '#FFE3EE', accent: '#D63A7A', worlds: ['dessert'], games: { spin: false, stamps: true }, stampsNeeded: 6,
    cats: ['Cakes', 'Shakes'], distanceKm: 1.3,
    items: [
      item('Lotus Cheesecake', 'Baked, biscoff crumb', 650, 'Cakes', true),
      item('Molten Lava Cake', 'Warm, gooey centre', 590, 'Cakes'),
      item('Strawberry Shake', 'Real strawberries', 480, 'Shakes'),
    ],
  },
  {
    id: 'prime', name: 'Prime Cut', tagline: 'Charcoal-grilled steaks, done right', eta: '40 min',
    bg: '#2A1B1B', accent: '#E0A458', worlds: ['steak'], games: { spin: false, stamps: true }, stampsNeeded: 5,
    cats: ['Steaks', 'Sides'], distanceKm: 1.2,
    items: [
      item('Ribeye Steak (300g)', 'Charcoal grilled, pepper sauce', 3900, 'Steaks', true),
      item('Tenderloin Steak (250g)', 'Butter-basted, mushroom sauce', 4200, 'Steaks'),
      item('Creamy Mash', 'Buttery potatoes', 450, 'Sides'),
      item('Grilled Veggies', 'Seasonal, charred', 420, 'Sides'),
    ],
  },
];
