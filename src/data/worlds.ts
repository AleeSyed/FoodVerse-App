import type { World } from './types';

export const WORLDS: World[] = [
  { id: 'burger', name: 'Burger World', emoji: '🍔', bg: '#FFB938', ink: '#2B1600', deco: ['🍟', '🥤', '🧀'], tag: 'Smash, stack, repeat', match: /burger|smash/i },
  { id: 'pizza', name: 'Pizza World', emoji: '🍕', bg: '#E8452C', ink: '#FFF6E8', deco: ['🧀', '🍅', '🌿'], tag: 'Wood-fired and cheesy', match: /pizza|pepperoni/i },
  { id: 'coffee', name: 'Coffee & Chai World', emoji: '☕', bg: '#3B2A22', ink: '#F6E7D3', deco: ['🥐', '🍪', '🫖'], tag: 'Slow sips, warm vibes', match: /chai|tea|coffee|latte|patti/i },
  { id: 'steak', name: 'Steak World', emoji: '🥩', bg: '#2A1B1B', ink: '#F7E3D7', deco: ['🔥', '🧂', '🥔'], tag: 'Fire, smoke and steak', match: /steak|ribeye|tenderloin/i },
  { id: 'desi', name: 'Desi World', emoji: '🍛', bg: '#6B3FD6', ink: '#FFF3D6', deco: ['🫓', '🌶️', '🧅'], tag: 'Karahi, biryani and more', match: /karahi|biryani|handi|naan|nihari|haleem/i },
  { id: 'bbq', name: 'BBQ World', emoji: '🍢', bg: '#3A3A3A', ink: '#FFE3B8', deco: ['🔥', '🌶️', '🍋'], tag: 'Straight off the coals', match: /kebab|bbq|boti|seekh|tikka(?! pizza)/i },
  { id: 'chicken', name: 'Chicken World', emoji: '🍗', bg: '#F27A1A', ink: '#2A1200', deco: ['🍟', '🌶️', '🍯'], tag: 'Crispy, saucy, golden', match: /fried chicken|broast|wings|hot honey|zinger/i },
  { id: 'rolls', name: 'Rolls & Shawarma World', emoji: '🌯', bg: '#2E8B57', ink: '#F2FFF4', deco: ['🧄', '🥗', '🌶️'], tag: 'Wrapped and ready', match: /roll|shawarma|wrap/i },
  { id: 'dessert', name: 'Dessert World', emoji: '🍰', bg: '#FF8FB8', ink: '#3A0B1E', deco: ['🍩', '🍦', '🍫'], tag: 'Sweet tooth headquarters', match: /cake|dessert|sweet|ice cream|brownie|lava/i },
];

export const worldById = (id: string) => WORLDS.find((w) => w.id === id);

const EMOJI: [RegExp, string][] = [
  [/steak|ribeye|tenderloin/i, '🥩'], [/mash|potato/i, '🥔'], [/veggies|salad/i, '🥗'],
  [/fries/i, '🍟'], [/shake|drink|soda/i, '🥤'], [/naan/i, '🫓'], [/knots|garlic bread/i, '🥖'],
  [/roll|shawarma|wrap/i, '🌯'], [/pizza|pepperoni/i, '🍕'], [/burger|smash/i, '🍔'],
  [/cheesecake|cake/i, '🍰'], [/lava|brownie|chocolate|nutella/i, '🍫'], [/karahi|curry|handi/i, '🍛'],
  [/kebab|boti|tikka|seekh|bbq/i, '🍢'], [/chicken/i, '🍗'], [/chai|tea|patti/i, '☕'], [/paratha/i, '🫓'],
];

/** Emoji stand-in for a dish until real photos are uploaded. */
export const foodEmoji = (text: string) => EMOJI.find(([re]) => re.test(text))?.[1] ?? '🍽️';
