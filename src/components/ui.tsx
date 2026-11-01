import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Restaurant } from '../data/types';
import { C, shadow, textOn } from '../theme';

type EmoKind = 'bob' | 'wiggle' | 'hop' | 'drive';
const KINDS: EmoKind[] = ['bob', 'wiggle', 'hop'];
export const emoKind = (i: number) => KINDS[i % KINDS.length];

/** An emoji with a gentle looping animation. Stand-in for the custom 3D animated icons. */
export function Emo({ e, size = 32, kind = 'bob', delay = 0 }: { e: string; size?: number; kind?: EmoKind; delay?: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const ease = Easing.inOut(Easing.quad);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: kind === 'hop' ? 600 : 1100, easing: ease, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: kind === 'hop' ? 600 : 1100, easing: ease, useNativeDriver: true }),
      ]),
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [v, kind, delay]);

  const transform =
    kind === 'wiggle'
      ? [{ rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['-9deg', '9deg'] }) }]
      : kind === 'hop'
        ? [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -9] }) }, { scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }]
        : kind === 'drive'
          ? [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) }, { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-4deg'] }) }]
          : [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }, { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-5deg'] }) }];

  return (
    <Animated.Text accessible={false} style={{ fontSize: size, lineHeight: size * 1.15, transform }}>
      {e}
    </Animated.Text>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Round logo badge. Shows initials until restaurants upload real logos. */
export function Logo({ r, size = 40 }: { r: Restaurant; size?: number }) {
  const initials = r.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: r.accent, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: textOn(r.accent), fontWeight: '800', fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress, style, disabled }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.primary, { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style]}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ children, color = C.ink }: { children: React.ReactNode; color?: string }) {
  return <Text style={[styles.section, { color }]}>{children}</Text>;
}

export const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 20, ...shadow },
  primary: { backgroundColor: C.brand, borderRadius: 18, minHeight: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  section: { fontSize: 19, fontWeight: '700' },
  mute: { color: C.mute, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
});
