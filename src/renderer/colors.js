// Color utility module — natural palette and color manipulation helpers

// Parse hex color to {r, g, b}
function parseHex(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

// Convert {r,g,b} to hex string
function toHex({r, g, b}) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

// HSL to hex string (h: 0-360, s: 0-100, l: 0-100)
export function hsl(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return toHex({ r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 });
}

// Darken a hex color by amount (0-1)
export function darken(hex, amount) {
  const c = parseHex(hex);
  return toHex({ r: c.r * (1 - amount), g: c.g * (1 - amount), b: c.b * (1 - amount) });
}

// Lighten a hex color by amount (0-1)
export function lighten(hex, amount) {
  const c = parseHex(hex);
  return toHex({
    r: c.r + (255 - c.r) * amount,
    g: c.g + (255 - c.g) * amount,
    b: c.b + (255 - c.b) * amount,
  });
}

// Desaturate a hex color by amount (0-1) — blend toward gray of same lightness
export function desaturate(hex, amount) {
  const c = parseHex(hex);
  const gray = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
  return toHex({
    r: c.r + (gray - c.r) * amount,
    g: c.g + (gray - c.g) * amount,
    b: c.b + (gray - c.b) * amount,
  });
}

// Linear interpolation between two hex colors
export function lerp(colorA, colorB, t) {
  const a = parseHex(colorA);
  const b = parseHex(colorB);
  return toHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
}

// Convert hex to rgba string
export function rgba(hex, alpha) {
  const c = parseHex(hex);
  return `rgba(${c.r},${c.g},${c.b},${alpha})`;
}

// Curated natural color palette
export const NATURAL = {
  // Skies
  skyDay:     '#4a90d9',
  skyHorizon: '#87ceeb',
  skyNight:   '#0a0e2a',
  skySunset:  '#e8734a',
  skyDawn:    '#d4a574',

  // Ground
  grass:      '#4a8c3f',
  grassDark:  '#2d6b2e',
  grassLight: '#6aad5a',
  dirt:       '#8b6b4a',
  dirtLight:  '#a5845e',
  stone:      '#6b6b6b',
  stoneDark:  '#4a4a4a',
  sand:       '#d4b896',

  // Wood
  bark:       '#6b4226',
  barkDark:   '#4a2e1a',
  wood:       '#8b6b4a',
  woodLight:  '#a5845e',

  // Water
  waterDeep:    '#1a4a7a',
  waterShallow: '#3a7abd',
  waterFoam:    '#c8e0f0',

  // Lava
  lavaGlow:   '#ff6622',
  lavaDark:   '#aa2200',
  lavaCore:   '#ffcc44',

  // Foliage
  leafGreen:  '#3d8b37',
  leafDark:   '#2a6625',
  leafLight:  '#5aad50',
  pine:       '#2a5a3a',
  pineDark:   '#1a3a2a',
  autumn:     '#c87830',

  // Atmosphere
  fog:        '#c8c8d0',
  haze:       '#9898a8',
  mist:       '#b8c8d8',

  // Character
  skin:       '#c4956a',
  skinShadow: '#a07050',
  hair:       '#4a3020',
  robeBlue:   '#2244aa',
  robeShadow: '#1a2277',
  robePurple: '#772288',
  robePurpleShadow: '#551166',

  // Cave / Dark
  caveWall:   '#3a3040',
  caveDark:   '#1a1520',
  caveFloor:  '#2a2530',

  // Magic
  magicCyan:  '#44ddee',
  magicPink:  '#ee66bb',
  magicGold:  '#ffdd44',

  // Night forest
  nightGrass:  '#1a3318',
  nightSky:    '#000822',
  moonGlow:    '#e8e8f0',
};
