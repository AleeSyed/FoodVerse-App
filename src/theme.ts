// FoodVerse brand colors and small color helpers.
export const C = {
  brand: '#6B2FE0',
  brandSoft: '#F1EAFE',
  bg: '#F5F2FB',
  ink: '#1B1530',
  mute: '#6E6880',
  card: '#FFFFFF',
  line: '#ECE7F5',
  danger: '#B42318',
};

export const shadow = {
  shadowColor: '#3C1E78',
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

function rgb(h: string): [number, number, number] {
  let s = h.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

/** Relative luminance, 0 (black) to 1 (white). */
export function lum(h: string) {
  const c = rgb(h).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** Readable text color on a given background. */
export const textOn = (bg: string) => (lum(bg) > 0.4 ? '#17130F' : '#FAF7F2');

/** Blend color a toward b by t (0..1). */
export function mix(a: string, b: string, t: number) {
  const A = rgb(a), B = rgb(b);
  return hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}

export const fmt = (n: number) => 'Rs ' + Math.round(n).toLocaleString('en-PK');
