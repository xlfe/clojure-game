// Scene rendering functions — maps scene.id → draw(renderer, frame, state)
import { EGA_PALETTE } from './ega-renderer.js';
import { SPRITES } from './sprites.js';
import { NATURAL, rgba, lerp, lighten, darken, desaturate } from './colors.js';

// Seeded random for consistent scene backgrounds
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// Common scene drawing helpers
function drawStars(r, frame, count = 30, seed = 42) {
  const rng = seededRandom(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rng() * 384);
    const y = Math.floor(rng() * 100);
    const twinkle = (frame + i * 7) % 20 < 15;
    if (twinkle) r.drawStar(x, y, rng() > 0.7 ? 2 : 1);
  }
}

function drawFlowers(r, frame, y, count = 12, seed = 77) {
  const rng = seededRandom(seed);
  const colors = [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightRed, EGA_PALETTE.yellow, EGA_PALETTE.lightCyan];
  for (let i = 0; i < count; i++) {
    const fx = Math.floor(rng() * 360) + 12;
    const fy = y + Math.floor(rng() * 30);
    SPRITES.flower.draw(r, fx, fy, colors[i % colors.length]);
  }
}

function drawSparkles(r, frame, count = 8, seed = 13) {
  const rng = seededRandom(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rng() * 360) + 12;
    const y = Math.floor(rng() * 200) + 20;
    r.drawSparkle(x, y, frame + i * 3);
  }
}

// ============= SCENE DRAW FUNCTIONS =============

const SCENE_RENDERERS = {
  // ---- WORLD 1: ENCHANTED GROVE ----

  'cottage': (r, frame, state) => {
    // Interior — wooden walls
    r.clear(NATURAL.bark);
    r.drawRect(0, 0, 384, 180, NATURAL.barkDark);
    // Floor
    for (let x = 0; x < 384; x += 16) {
      r.drawRect(x, 180, 16, 60, (x / 16) % 2 === 0 ? NATURAL.wood : NATURAL.bark);
    }
    // Bookshelf
    r.drawRect(10, 30, 80, 120, NATURAL.wood);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const colors = [EGA_PALETTE.red, EGA_PALETTE.blue, EGA_PALETTE.green, EGA_PALETTE.magenta, EGA_PALETTE.lightBlue];
        r.drawRect(14 + col * 18, 36 + row * 28, 14, 20, colors[(row + col) % colors.length]);
      }
    }
    // Window
    r.drawRect(290, 40, 60, 50, NATURAL.skyHorizon);
    r.drawRect(290, 40, 60, 2, NATURAL.wood);
    r.drawRect(290, 88, 60, 2, NATURAL.wood);
    r.drawRect(319, 40, 2, 50, NATURAL.wood);
    // Sunbeam
    r.drawMultiGradient(300, 90, 40, 90, [[0, rgba('#ffdd88', 0.3)], [1, rgba('#ffdd88', 0)]]);
    // Cauldron
    SPRITES.cauldron.draw(r, 200, 140, true, frame);
    // Fire under cauldron — radial glow
    const fireFlicker = frame % 4;
    r.drawRadialGlow(212, 171, 2, 10, rgba('#ff5555', 0.4), rgba('#ff5555', 0));
    r.drawRect(206, 168, 12, 6, fireFlicker < 2 ? EGA_PALETTE.lightRed : EGA_PALETTE.yellow);
    // Desk
    r.drawRect(110, 130, 70, 8, NATURAL.wood);
    r.drawRect(115, 138, 6, 42, NATURAL.wood);
    r.drawRect(170, 138, 6, 42, NATURAL.wood);
    // Spellbook on desk
    SPRITES.book.draw(r, 130, 118, EGA_PALETTE.magenta);
    // Floating parentheses
    const pColors = [EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta, EGA_PALETTE.yellow];
    for (let i = 0; i < 5; i++) {
      const px = 100 + i * 50 + Math.sin(frame * 0.05 + i) * 10;
      const py = 30 + Math.cos(frame * 0.03 + i * 2) * 15;
      r.drawText(i % 2 === 0 ? '(' : ')', px, py, pColors[i % 3]);
    }
    // Wizard
    SPRITES.oldWizard.draw(r, 140, 100, frame);
    // Door (east)
    r.drawRect(360, 80, 24, 100, NATURAL.wood);
    r.drawCircle(366, 130, 2, EGA_PALETTE.yellow, true);
  },

  'garden': (r, frame, state) => {
    // Outdoor garden
    r.drawSky(NATURAL.skyDay, NATURAL.skyHorizon, 140);
    // Sun
    r.drawCircle(320, 30, 15, EGA_PALETTE.yellow, true);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + frame * 0.02;
      r.drawLine(320, 30, 320 + Math.cos(angle) * 22, 30 + Math.sin(angle) * 22, EGA_PALETTE.yellow);
    }
    // Clouds
    r.drawCloud(80, 25, 1);
    r.drawCloud(220, 35, 0.8);
    // Mountains — distant, desaturated
    const farMountain = lerp(NATURAL.stone, NATURAL.fog, 0.3);
    r.drawMountain(0, 60, 120, farMountain, NATURAL.moonGlow);
    r.drawMountain(100, 45, 100, farMountain);
    r.drawMountain(280, 55, 110, farMountain, NATURAL.moonGlow);
    // Ground
    r.drawGround(NATURAL.grass, 140, NATURAL.grassDark);
    // Path
    r.drawRect(170, 140, 40, 100, NATURAL.dirt);
    // Cottage (background, west)
    r.drawRect(10, 100, 60, 50, NATURAL.wood);
    r.drawTriangle(5, 100, 40, 70, 75, 100, EGA_PALETTE.red, true);
    r.drawRect(30, 120, 15, 30, NATURAL.wood);
    // Flowers
    drawFlowers(r, frame, 150, 20, 88);
    // Signpost
    r.drawRect(290, 130, 4, 30, NATURAL.bark);
    r.drawRect(270, 125, 50, 12, NATURAL.bark);
    r.drawText('E->MEADOW', 273, 126, EGA_PALETTE.white);
    // Butterflies
    const bx = 200 + Math.sin(frame * 0.08) * 30;
    const by = 120 + Math.cos(frame * 0.06) * 10;
    r.setPixel(bx, by, EGA_PALETTE.yellow);
    r.setPixel(bx + 2, by - 1, EGA_PALETTE.yellow);
    r.setPixel(bx - 2, by - 1, EGA_PALETTE.yellow);
    // Player
    SPRITES.player.draw(r, 180, 160, frame);
  },

  'sparkle-meadow': (r, frame, state) => {
    r.drawSky(NATURAL.skyDay, NATURAL.skyHorizon, 130);
    r.drawCloud(60, 20, 0.8);
    r.drawCloud(250, 30, 1);
    r.drawGround(NATURAL.grassLight, 130, NATURAL.grass);
    // Sparkly grass
    drawSparkles(r, frame, 15, 22);
    // Terminal on crystal pedestal
    r.drawRect(168, 130, 48, 6, EGA_PALETTE.lightCyan);
    r.drawRect(176, 118, 32, 12, EGA_PALETTE.lightCyan);
    SPRITES.terminal.draw(r, 176, 90, true, frame);
    // Glowing runes around terminal
    const runeColors = [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightCyan, EGA_PALETTE.yellow];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + frame * 0.03;
      const rx = 192 + Math.cos(angle) * 40;
      const ry = 105 + Math.sin(angle) * 20;
      r.setPixel(rx, ry, runeColors[i % 3]);
    }
    // Sparkle dust particles
    for (let i = 0; i < 10; i++) {
      const sx = 50 + i * 35 + Math.sin(frame * 0.04 + i) * 5;
      const sy = 100 + Math.cos(frame * 0.05 + i * 2) * 30;
      r.drawSparkle(sx, sy, frame + i * 4);
    }
    // Melody fox
    SPRITES.sparkleFox.draw(r, 60, 145, frame);
    drawFlowers(r, frame, 150, 8, 33);
    SPRITES.player.draw(r, 140, 160, frame);
  },

  'friendship-bridge': (r, frame, state) => {
    r.drawSky(EGA_PALETTE.lightMagenta, NATURAL.skyHorizon, 200);
    r.drawCloud(100, 20, 1);
    // Stream
    r.drawWater(160, 200, frame);
    // Bridge
    for (let i = 0; i < 7; i++) {
      const bColor = [EGA_PALETTE.lightRed, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.lightCyan, EGA_PALETTE.lightBlue, EGA_PALETTE.lightMagenta, EGA_PALETTE.white][i];
      r.drawRect(80, 130 + i * 2, 220, 3, bColor);
    }
    // Railings
    r.drawRect(80, 110, 4, 36, NATURAL.bark);
    r.drawRect(296, 110, 4, 36, NATURAL.bark);
    // Hanging bracelets
    for (let i = 0; i < 5; i++) {
      const bx2 = 100 + i * 45;
      r.drawCircle(bx2, 118 + Math.sin(frame * 0.05 + i) * 2, 4, [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightCyan, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.lightRed][i], false);
    }
    // Terminal
    SPRITES.terminal.draw(r, 170, 100, true, frame);
    // Banks
    r.drawGround(NATURAL.grass, 200, NATURAL.grassDark);
    r.drawRect(0, 130, 82, 70, NATURAL.grass);
    r.drawRect(298, 130, 86, 70, NATURAL.grass);
    drawSparkles(r, frame, 6, 55);
  },

  'crystal-cave': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    // Cave walls
    r.drawRect(0, 0, 384, 20, NATURAL.stoneDark);
    r.drawRect(0, 220, 384, 20, NATURAL.stoneDark);
    // Crystals
    const crystalColors = [EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta, EGA_PALETTE.lightGreen, EGA_PALETTE.yellow, EGA_PALETTE.lightBlue, EGA_PALETTE.lightRed];
    for (let i = 0; i < 8; i++) {
      const cx = 30 + i * 45;
      const cy = 20 + (i % 2) * 10;
      SPRITES.crystal.draw(r, cx, cy, crystalColors[i % 6], frame + i * 3);
      // Inverted crystals from ceiling
      SPRITES.crystal.draw(r, cx + 20, 210 - (i % 2) * 10, crystalColors[(i + 3) % 6], frame + i * 5);
    }
    // Rainbow light refractions
    for (let i = 0; i < 12; i++) {
      const lx = 20 + i * 30;
      const ly = 50 + Math.sin(i * 0.8) * 20;
      r.drawLine(lx, ly, lx + 15, ly + 40, crystalColors[i % 6]);
    }
    // Terminal growing from crystal
    r.drawRect(168, 100, 48, 4, EGA_PALETTE.lightCyan);
    SPRITES.terminal.draw(r, 176, 72, true, frame);
    // Large crystal shard (pickable)
    if (!state.inventory?.some(i => i.id === 'crystal-shard')) {
      SPRITES.crystal.draw(r, 90, 120, EGA_PALETTE.lightCyan, frame);
    }
    drawSparkles(r, frame, 12, 99);
  },

  'melody-clearing': (r, frame, state) => {
    r.drawSky(NATURAL.skyDay, NATURAL.skyHorizon, 140);
    r.drawGround(NATURAL.grass, 140, NATURAL.grassDark);
    // Tree stumps (amphitheater)
    for (let i = 0; i < 5; i++) {
      r.drawRect(40 + i * 70, 150, 20, 12, NATURAL.bark);
      r.drawEllipse(50 + i * 70, 150, 12, 4, NATURAL.bark, true);
    }
    // Stage area
    r.drawRect(140, 130, 100, 6, NATURAL.wood);
    // Terminal center stage
    SPRITES.terminal.draw(r, 176, 100, true, frame);
    // Floating musical notes
    const noteColors = [EGA_PALETTE.yellow, EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta];
    for (let i = 0; i < 6; i++) {
      const nx = 100 + i * 40 + Math.sin(frame * 0.06 + i) * 15;
      const ny = 50 + Math.cos(frame * 0.04 + i * 2) * 20;
      r.drawText(i % 2 === 0 ? '\u266a' : '\u266b', nx, ny, noteColors[i % 3]);
    }
    // DJ Bracket
    SPRITES.djBracket.draw(r, 300, 140, frame);
    // DJ booth
    r.drawRect(290, 162, 40, 20, NATURAL.stoneDark);
    r.drawRect(295, 165, 30, 4, EGA_PALETTE.lightGreen);
    drawSparkles(r, frame, 5, 44);
  },

  'enchanted-stage': (r, frame, state) => {
    r.drawSky(NATURAL.skyNight, '#9966aa', 150);
    drawStars(r, frame, 20, 88);
    r.drawGround(NATURAL.grass, 150, NATURAL.grassDark);
    // Stage
    r.drawRect(60, 130, 260, 20, NATURAL.wood);
    r.drawRect(60, 126, 260, 6, EGA_PALETTE.yellow);
    // Stage lights
    for (let i = 0; i < 6; i++) {
      const lightColor = [EGA_PALETTE.lightRed, EGA_PALETTE.lightGreen, EGA_PALETTE.lightBlue, EGA_PALETTE.lightMagenta, EGA_PALETTE.yellow, EGA_PALETTE.lightCyan][i];
      const blink = (frame + i * 5) % 12 < 8;
      if (blink) r.drawCircle(80 + i * 46, 118, 5, lightColor, true);
    }
    // Terminal on stage
    SPRITES.terminal.draw(r, 176, 98, true, frame);
    // Poster
    r.drawRect(30, 60, 60, 40, EGA_PALETTE.white);
    r.drawText('CONCERT', 35, 66, EGA_PALETTE.magenta);
    r.drawText('TONIGHT', 35, 80, EGA_PALETTE.lightMagenta);
    drawSparkles(r, frame, 10, 66);
  },

  'starlight-pool': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    r.drawSky(NATURAL.skyNight, '#000000', 100);
    drawStars(r, frame, 40, 111);
    // Ground around pool (drawn first so pool sits on top)
    r.drawRect(0, 100, 384, 95, NATURAL.nightGrass);
    r.drawGround(NATURAL.nightGrass, 195, '#0a1a0a');
    // Pool of starlight
    r.drawEllipse(192, 170, 80, 30, NATURAL.waterShallow, true);
    r.drawEllipse(192, 170, 70, 25, NATURAL.waterDeep, true);
    // Stars reflected in pool
    for (let i = 0; i < 8; i++) {
      const sx = 140 + i * 12 + Math.sin(frame * 0.03 + i) * 3;
      const sy = 165 + Math.cos(frame * 0.04 + i) * 5;
      r.drawStar(sx, sy, 1);
    }
    // Pool border
    r.drawEllipse(192, 170, 82, 32, NATURAL.nightGrass, false);
    // Terminal floating above pool
    SPRITES.terminal.draw(r, 176, 80, true, frame);
    // Portal gate (north)
    if (state.flags?.solvedNestedExpressions) {
      r.drawRadialGlow(192, 50, 10, 35, rgba('#ff55ff', 0.4), rgba('#ff55ff', 0));
      r.drawEllipse(192, 50, 25, 35, EGA_PALETTE.lightMagenta, false);
      r.drawEllipse(192, 50, 23, 33, EGA_PALETTE.lightCyan, false);
      // Swirling portal
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + frame * 0.05;
        r.setPixel(192 + Math.cos(angle) * 15, 50 + Math.sin(angle) * 20, EGA_PALETTE.lightMagenta);
      }
    } else {
      r.drawEllipse(192, 50, 25, 35, NATURAL.stoneDark, false);
    }
    // Starlight gem
    if (!state.inventory?.some(i => i.id === 'starlight-gem') && state.flags?.solvedNestedExpressions) {
      SPRITES.crystal.draw(r, 260, 140, EGA_PALETTE.yellow, frame);
    }
    drawSparkles(r, frame, 15, 77);
  },

  // ---- WORLD 2: DRAGON HIGHLANDS ----

  'dragon-gate': (r, frame, state) => {
    // Fiery sky
    r.drawSky(NATURAL.skySunset, NATURAL.skyDawn, 80);
    r.drawGradientRect(0, 80, 384, 80, NATURAL.skyDawn, NATURAL.dirt);
    // Volcanic peaks
    const farVolcanic = lerp(NATURAL.stone, NATURAL.fog, 0.3);
    r.drawMountain(0, 80, 150, farVolcanic);
    r.drawMountain(250, 90, 140, farVolcanic);
    // Lava glow at peaks
    r.setPixel(75, 42, EGA_PALETTE.lightRed);
    r.setPixel(320, 32, EGA_PALETTE.yellow);
    // Ground
    r.drawGround(NATURAL.dirt, 160, NATURAL.barkDark);
    // Massive gate
    r.drawRect(140, 60, 20, 100, NATURAL.stoneDark);
    r.drawRect(224, 60, 20, 100, NATURAL.stoneDark);
    r.drawRect(140, 50, 104, 15, NATURAL.stoneDark);
    // Gate arch
    r.drawEllipse(192, 70, 42, 20, NATURAL.stoneDark, true);
    // Dragon carvings on gate
    r.drawText('\ud83d\udc09', 148, 80, EGA_PALETTE.yellow);
    r.drawText('\ud83d\udc09', 228, 80, EGA_PALETTE.yellow);
    // Inscription
    r.drawText('IF YOU ARE BRAVE', 155, 54, EGA_PALETTE.lightRed);
    // Ember
    SPRITES.fireDragon.draw(r, 60, 118, frame);
    // Embers floating
    for (let i = 0; i < 8; i++) {
      const ex = 50 + i * 45 + Math.sin(frame * 0.03 + i) * 5;
      const ey = 140 - (frame + i * 20) % 60;
      r.setPixel(ex, ey, i % 2 === 0 ? EGA_PALETTE.yellow : EGA_PALETTE.lightRed);
    }
  },

  'fire-ridge': (r, frame, state) => {
    r.drawSky('#cc3300', NATURAL.lavaGlow, 100);
    // Lava river below — gradient base + animated wave stripes
    r.drawGradientRect(0, 180, 384, 60, NATURAL.lavaGlow, NATURAL.lavaDark);
    const ctx1 = r.bufferCtx;
    ctx1.save();
    ctx1.globalAlpha = 0.3;
    for (let y = 180; y < 240; y += 2) {
      const offset = Math.sin((y + frame * 0.5) * 0.06) * 30;
      ctx1.fillStyle = NATURAL.lavaCore;
      ctx1.fillRect(offset, y, 384, 1);
    }
    ctx1.restore();
    // Rocky ridge
    r.drawRect(0, 100, 384, 80, NATURAL.stoneDark);
    r.drawRect(0, 100, 384, 5, NATURAL.dirt);
    // Fire geysers
    if (frame % 40 < 15) {
      for (let i = 0; i < 5; i++) {
        const gy = 95 - i * 4;
        r.setPixel(300 + i * 2, gy, EGA_PALETTE.yellow);
        r.setPixel(302 - i, gy, EGA_PALETTE.lightRed);
      }
    }
    // Terminal (obsidian)
    r.drawRect(168, 108, 48, 6, EGA_PALETTE.black);
    SPRITES.terminal.draw(r, 176, 80, true, frame);
    // Fire scale
    if (!state.inventory?.some(i => i.id === 'fire-scale')) {
      r.drawRadialGlow(90, 130, 2, 10, rgba('#ff5555', 0.4), rgba('#ff5555', 0));
      r.drawCircle(90, 130, 5, EGA_PALETTE.lightRed, true);
      r.drawCircle(90, 130, 3, EGA_PALETTE.yellow, true);
    }
  },

  'sky-nest': (r, frame, state) => {
    // Above the clouds
    r.drawSky(NATURAL.skyDay, '#ffffff', 200);
    // Clouds below
    for (let i = 0; i < 8; i++) {
      r.drawCloud(i * 55 - 10, 170 + (i % 3) * 15, 1.5);
    }
    // Nest platform
    r.drawEllipse(192, 140, 60, 20, NATURAL.bark, true);
    r.drawEllipse(192, 135, 55, 15, EGA_PALETTE.yellow, true);
    // Baby dragons
    for (let i = 0; i < 3; i++) {
      const bx = 160 + i * 30;
      const by = 120 + Math.sin(frame * 0.1 + i) * 3;
      r.drawCircle(bx, by, 4, [EGA_PALETTE.lightRed, EGA_PALETTE.lightBlue, EGA_PALETTE.lightGreen][i], true);
      r.setPixel(bx + 2, by - 1, EGA_PALETTE.black);
    }
    // Terminal
    SPRITES.terminal.draw(r, 176, 90, true, frame);
    // Sky feather
    if (!state.inventory?.some(i => i.id === 'sky-feather')) {
      r.drawLine(300, 100, 310, 90, EGA_PALETTE.lightBlue);
      r.drawLine(300, 100, 310, 95, EGA_PALETTE.lightCyan);
      r.drawLine(300, 100, 310, 100, EGA_PALETTE.lightBlue);
    }
  },

  'sea-caves': (r, frame, state) => {
    r.clear(NATURAL.waterDeep);
    // Cave ceiling
    r.drawRect(0, 0, 384, 30, NATURAL.stoneDark);
    // Stalactites
    for (let i = 0; i < 10; i++) {
      const sx = 20 + i * 38;
      r.drawTriangle(sx, 30, sx + 5, 50 + (i % 3) * 10, sx + 10, 30, NATURAL.stone, true);
    }
    // Underground river — gradient base + animated wave stripes
    r.drawGradientRect(0, 170, 384, 70, NATURAL.waterShallow, NATURAL.waterDeep);
    const ctx2 = r.bufferCtx;
    ctx2.save();
    ctx2.globalAlpha = 0.15;
    for (let y = 170; y < 240; y += 3) {
      const offset = Math.sin((y + frame * 0.3) * 0.08) * 20;
      ctx2.fillStyle = NATURAL.waterFoam;
      ctx2.fillRect(offset, y, 384, 1);
    }
    ctx2.restore();
    // Bioluminescent coral
    const coralColors = [EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta, EGA_PALETTE.lightGreen];
    for (let i = 0; i < 6; i++) {
      const cx = 30 + i * 65;
      r.drawRadialGlow(cx, 165, 2, 12, rgba(coralColors[i % 3], 0.3), rgba(coralColors[i % 3], 0));
      r.drawCircle(cx, 165, 6, coralColors[i % 3], true);
      r.drawRect(cx - 1, 165, 2, 10, coralColors[i % 3]);
    }
    // Terminal (coral)
    SPRITES.terminal.draw(r, 176, 100, true, frame);
    // Tsunami
    SPRITES.seaDragon.draw(r, 60, 100, frame);
    // Sea pearl
    if (!state.inventory?.some(i => i.id === 'sea-pearl')) {
      r.drawCircle(300, 140, 5, EGA_PALETTE.lightCyan, true);
      r.drawCircle(300, 139, 2, EGA_PALETTE.white, true);
    }
  },

  'prophecy-chamber': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    // Stone walls with glowing carvings — subtle gradient for depth
    r.drawMultiGradient(0, 0, 384, 240, [[0, '#2a1010'], [1, '#180808']]);
    // Glowing prophecy text on walls
    const glowColor = frame % 10 < 5 ? EGA_PALETTE.lightRed : EGA_PALETTE.red;
    r.drawText('THE PROPHECY FORETELLS...', 100, 20, glowColor);
    r.drawText('(defn power [x] ...)', 120, 40, EGA_PALETTE.yellow);
    // Candles
    for (let i = 0; i < 6; i++) {
      const cx = 40 + i * 60;
      r.drawRect(cx, 150, 4, 12, EGA_PALETTE.yellow);
      r.drawRadialGlow(cx + 2, 148, 1, 8, rgba('#ffff55', 0.3), rgba('#ffff55', 0));
      r.setPixel(cx + 2, 148, frame % 4 < 2 ? EGA_PALETTE.yellow : EGA_PALETTE.lightRed);
    }
    // Altar with terminal
    r.drawRect(150, 130, 80, 20, NATURAL.stoneDark);
    SPRITES.terminal.draw(r, 176, 100, true, frame);
    // Starflight
    SPRITES.skyDragon.draw(r, 280, 100, frame);
    // Prophecy scroll
    if (!state.inventory?.some(i => i.id === 'prophecy-scroll')) {
      r.drawRect(60, 130, 16, 12, EGA_PALETTE.white);
    }
  },

  'lava-bridge': (r, frame, state) => {
    // Lava river
    r.clear(EGA_PALETTE.black);
    r.drawSky('#cc3300', NATURAL.lavaGlow, 140);
    // Lava below — gradient base + animated wave stripes
    r.drawGradientRect(0, 140, 384, 100, NATURAL.lavaGlow, NATURAL.lavaDark);
    const ctx3 = r.bufferCtx;
    ctx3.save();
    ctx3.globalAlpha = 0.3;
    for (let y = 140; y < 240; y += 2) {
      const offset = Math.sin((y + frame * 0.5) * 0.06) * 30;
      ctx3.fillStyle = NATURAL.lavaCore;
      ctx3.fillRect(offset, y, 384, 1);
    }
    ctx3.restore();
    // Cooled lava bridge
    r.drawRect(120, 110, 144, 14, NATURAL.stoneDark);
    r.drawRect(120, 112, 144, 2, EGA_PALETTE.red);
    // Glowing edges
    r.drawLine(120, 110, 264, 110, frame % 6 < 3 ? EGA_PALETTE.lightRed : EGA_PALETTE.yellow);
    r.drawLine(120, 124, 264, 124, frame % 6 < 3 ? EGA_PALETTE.yellow : EGA_PALETTE.lightRed);
    // Terminal at midpoint
    SPRITES.terminal.draw(r, 176, 82, true, frame);
    // Cave walls
    r.drawRect(0, 60, 122, 180, NATURAL.stoneDark);
    r.drawRect(262, 60, 122, 180, NATURAL.stoneDark);
    // Lava crystal
    if (!state.inventory?.some(i => i.id === 'lava-crystal')) {
      SPRITES.crystal.draw(r, 90, 90, EGA_PALETTE.lightRed, frame);
    }
  },

  'crystal-hoard': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    r.drawRect(0, 0, 384, 240, '#110011');
    // Piles of gems
    const gemColors = [EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.lightRed, EGA_PALETTE.lightBlue];
    for (let i = 0; i < 20; i++) {
      const gx = 20 + (i * 37) % 340;
      const gy = 160 + (i * 13) % 60;
      r.drawCircle(gx, gy, 3, gemColors[i % 6], true);
    }
    // Terminal on gem pile
    r.drawRect(160, 120, 64, 10, EGA_PALETTE.yellow);
    SPRITES.terminal.draw(r, 176, 90, true, frame);
    // Dragon key
    if (!state.inventory?.some(i => i.id === 'dragon-key') && state.flags?.solvedCombinedLogic) {
      r.drawCircle(300, 120, 3, EGA_PALETTE.yellow, false);
      r.drawRect(303, 119, 8, 2, EGA_PALETTE.yellow);
      r.drawRect(309, 120, 1, 3, EGA_PALETTE.yellow);
    }
    // Large crystals
    for (let i = 0; i < 4; i++) {
      SPRITES.crystal.draw(r, 30 + i * 90, 100 + i * 10, gemColors[i], frame + i * 4);
    }
    drawSparkles(r, frame, 10, 123);
  },

  'dragon-council': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    // Open ceiling showing stars
    drawStars(r, frame, 30, 200);
    // Council chamber
    r.drawRect(0, 80, 384, 160, NATURAL.stoneDark);
    // Three thrones
    r.drawRect(40, 90, 50, 60, EGA_PALETTE.red); // Ember's
    r.drawRect(167, 90, 50, 60, NATURAL.waterDeep); // Tsunami's
    r.drawRect(294, 90, 50, 60, EGA_PALETTE.magenta); // Starflight's
    // Council ring floor
    r.drawEllipse(192, 190, 80, 30, EGA_PALETTE.yellow, false);
    // Terminal at center
    SPRITES.terminal.draw(r, 176, 160, true, frame);
    // Portal
    if (state.flags?.solvedDragonClassifier) {
      r.drawRadialGlow(192, 50, 8, 30, rgba('#55ff55', 0.4), rgba('#55ff55', 0));
      r.drawEllipse(192, 50, 20, 30, EGA_PALETTE.lightGreen, false);
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + frame * 0.06;
        r.setPixel(192 + Math.cos(angle) * 12, 50 + Math.sin(angle) * 18, EGA_PALETTE.lightGreen);
      }
    }
  },

  // ---- WORLD 3: SHADOW FOREST ----

  'forest-edge': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    r.drawSky(NATURAL.skyNight, '#000000', 80);
    // Moon
    r.drawCircle(300, 30, 15, EGA_PALETTE.white, true);
    r.drawCircle(305, 28, 12, EGA_PALETTE.black, true); // Crescent
    drawStars(r, frame, 25, 300);
    // Dark trees
    r.drawGround(NATURAL.nightGrass, 140, '#0a1a0a');
    for (let i = 0; i < 6; i++) {
      const tx = 20 + i * 65;
      r.drawRect(tx + 8, 100, 8, 40, NATURAL.barkDark);
      r.drawTriangle(tx, 120, tx + 12, 60, tx + 24, 120, NATURAL.pineDark, true);
      r.drawTriangle(tx - 4, 130, tx + 12, 80, tx + 28, 130, NATURAL.pine, true);
    }
    // Moonbeams
    r.drawMultiGradient(280, 60, 40, 180, [[0, rgba(NATURAL.moonGlow, 0.15)], [1, rgba(NATURAL.moonGlow, 0)]]);
    // Luna
    SPRITES.wolfGirl.draw(r, 160, 150, frame);
    // Moon pendant on branch
    if (!state.inventory?.some(i => i.id === 'moon-pendant')) {
      r.drawCircle(100, 110, 4, EGA_PALETTE.yellow, false);
      r.drawLine(100, 106, 100, 100, EGA_PALETTE.lightGray);
    }
    // Wolves howling (distant)
    r.drawText('Awooo...', 20, 80, EGA_PALETTE.lightCyan);
  },

  'moonlit-path': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    r.drawSky(NATURAL.nightSky, EGA_PALETTE.black, 60);
    drawStars(r, frame, 15, 310);
    // Path lit by moonlight
    r.drawGround(NATURAL.nightGrass, 130, '#0a1a0a');
    r.drawRect(160, 130, 60, 110, '#222200');
    // Glowing mushrooms
    for (let i = 0; i < 5; i++) {
      SPRITES.mushroom.draw(r, 30 + i * 80, 140 + (i % 2) * 20,
        [EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta, EGA_PALETTE.lightGreen][i % 3], frame + i * 4);
    }
    // Ancient trees
    for (let i = 0; i < 4; i++) {
      const tx = 10 + i * 100;
      r.drawRect(tx + 10, 80, 12, 60, NATURAL.barkDark);
      r.drawTriangle(tx, 110, tx + 16, 40, tx + 32, 110, NATURAL.pineDark, true);
    }
    // Terminal in stump
    r.drawRect(170, 110, 40, 20, NATURAL.bark);
    r.drawEllipse(190, 110, 22, 6, NATURAL.bark, true);
    SPRITES.terminal.draw(r, 174, 82, true, frame);
    drawSparkles(r, frame, 4, 320);
  },

  'wolf-den': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    // Cave interior — subtle gradient for depth
    r.drawMultiGradient(0, 0, 384, 240, [[0, '#2a1010'], [1, '#180808']]);
    // Oak tree roots forming ceiling
    for (let i = 0; i < 8; i++) {
      r.drawLine(i * 50, 0, i * 50 + 30, 40, NATURAL.bark);
    }
    // Fire pit
    r.drawCircle(192, 180, 15, NATURAL.stoneDark, true);
    const fireColor = frame % 4 < 2 ? EGA_PALETTE.yellow : EGA_PALETTE.lightRed;
    r.drawRadialGlow(192, 178, 4, 20, rgba('#ff5555', 0.3), rgba('#ff5555', 0));
    r.drawCircle(192, 178, 8, fireColor, true);
    r.setPixel(190, 172, EGA_PALETTE.yellow);
    r.setPixel(194, 170, EGA_PALETTE.lightRed);
    // Fang
    SPRITES.elderWolf.draw(r, 60, 140, frame);
    // Boulder
    r.drawEllipse(80, 140, 20, 12, NATURAL.stone, true);
    // Terminal by fire
    SPRITES.terminal.draw(r, 240, 150, true, frame);
    // Wolf pups
    for (let i = 0; i < 3; i++) {
      const px = 130 + i * 30;
      const py = 190 + Math.sin(frame * 0.15 + i) * 3;
      r.drawCircle(px, py, 4, EGA_PALETTE.lightGray, true);
      r.setPixel(px + 2, py - 1, EGA_PALETTE.black);
    }
    // Runestones
    for (let i = 0; i < 3; i++) {
      r.drawRect(300 + i * 20, 170, 12, 16, NATURAL.stoneDark);
      r.setPixel(305 + i * 20, 175, EGA_PALETTE.lightCyan);
    }
  },

  'ancient-tree': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    r.drawSky(NATURAL.nightSky, NATURAL.nightGrass, 60);
    drawStars(r, frame, 10, 330);
    r.drawGround(NATURAL.nightGrass, 160, '#0a1a0a');
    // Massive ancient tree (center)
    r.drawRect(140, 40, 100, 160, NATURAL.bark);
    // Bark texture
    for (let i = 0; i < 20; i++) {
      r.drawLine(150 + i * 5, 50, 148 + i * 5, 190, NATURAL.wood);
    }
    // Enormous canopy
    r.drawCircle(192, 20, 80, NATURAL.pineDark, true);
    r.drawCircle(192, 30, 70, NATURAL.pine, true);
    // Glowing symbols on bark
    const symbolGlow = frame % 8 < 4 ? EGA_PALETTE.lightCyan : EGA_PALETTE.cyan;
    r.drawText('{:wisdom}', 160, 80, symbolGlow);
    r.drawText('(get)', 170, 100, symbolGlow);
    // Willow
    SPRITES.treeSpirit.draw(r, 280, 120, frame);
    // Root terminal
    r.drawRect(100, 170, 40, 12, NATURAL.bark);
    SPRITES.terminal.draw(r, 104, 142, true, frame);
    // Ancient acorn
    if (!state.inventory?.some(i => i.id === 'ancient-acorn')) {
      r.drawCircle(300, 160, 4, NATURAL.bark, true);
      r.setPixel(300, 155, NATURAL.leafGreen);
    }
  },

  'transformation-spring': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    r.drawSky(NATURAL.skyNight, NATURAL.nightSky, 80);
    // Moon
    r.drawCircle(80, 30, 12, EGA_PALETTE.white, true);
    drawStars(r, frame, 15, 340);
    r.drawGround(NATURAL.nightGrass, 150, '#0a1a0a');
    // Mystical spring
    r.drawRadialGlow(192, 180, 15, 55, rgba('#55ffff', 0.2), rgba('#55ffff', 0));
    r.drawEllipse(192, 180, 50, 20, NATURAL.waterShallow, true);
    r.drawEllipse(192, 180, 40, 15, EGA_PALETTE.lightCyan, true);
    // Glowing silver water
    for (let i = 0; i < 6; i++) {
      const wx = 165 + i * 10 + Math.sin(frame * 0.05 + i) * 3;
      const wy = 178 + Math.cos(frame * 0.04 + i) * 3;
      r.setPixel(wx, wy, EGA_PALETTE.white);
    }
    // Terminal (waterfall shaped)
    r.drawRect(280, 100, 36, 50, NATURAL.waterShallow);
    r.drawRect(282, 102, 32, 46, NATURAL.waterDeep);
    SPRITES.terminal.draw(r, 284, 105, true, frame);
    // Transformation particles
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + frame * 0.04;
      const tx = 192 + Math.cos(angle) * (30 + Math.sin(frame * 0.02) * 10);
      const ty = 180 + Math.sin(angle) * (12 + Math.cos(frame * 0.03) * 5);
      r.setPixel(tx, ty, [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightCyan, EGA_PALETTE.yellow][i % 3]);
    }
    // Potion
    if (!state.inventory?.some(i => i.id === 'transformation-potion')) {
      r.drawRect(60, 160, 6, 12, EGA_PALETTE.lightBlue);
      r.drawRect(61, 165, 4, 6, EGA_PALETTE.lightGreen);
      r.drawRect(61, 159, 4, 2, NATURAL.bark);
    }
  },

  'shadow-maze': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    // Maze walls
    r.drawRect(0, 0, 384, 240, '#050505');
    // Hedge walls (maze pattern)
    const mazeColor = '#002200';
    r.drawRect(0, 0, 384, 10, mazeColor);
    r.drawRect(0, 230, 384, 10, mazeColor);
    r.drawRect(0, 0, 10, 240, mazeColor);
    r.drawRect(374, 0, 10, 240, mazeColor);
    // Internal walls
    r.drawRect(60, 0, 10, 80, mazeColor);
    r.drawRect(120, 60, 10, 120, mazeColor);
    r.drawRect(60, 160, 70, 10, mazeColor);
    r.drawRect(200, 40, 10, 100, mazeColor);
    r.drawRect(260, 0, 10, 60, mazeColor);
    r.drawRect(260, 100, 10, 80, mazeColor);
    r.drawRect(310, 60, 10, 100, mazeColor);
    r.drawRect(200, 180, 120, 10, mazeColor);
    // Shadows that move
    for (let i = 0; i < 5; i++) {
      const sx = 100 + i * 60 + Math.sin(frame * 0.02 + i) * 20;
      const sy = 80 + Math.cos(frame * 0.03 + i * 2) * 30;
      r.drawCircle(sx, sy, 10, '#111111', true);
    }
    // Center clearing with terminal
    r.drawRect(150, 100, 80, 50, '#0a0a0a');
    SPRITES.terminal.draw(r, 176, 105, true, frame);
    // Shadow cloak
    if (!state.inventory?.some(i => i.id === 'shadow-cloak')) {
      r.drawRect(50, 100, 12, 20, NATURAL.stoneDark);
    }
  },

  'pack-summit': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    r.drawSky(NATURAL.nightSky, EGA_PALETTE.black, 60);
    // Full moon (large)
    r.drawCircle(192, 35, 25, EGA_PALETTE.white, true);
    r.drawCircle(192, 35, 23, EGA_PALETTE.lightGray, true);
    drawStars(r, frame, 30, 350);
    // Summit rock
    r.drawGround('#111111', 160);
    r.drawTriangle(100, 160, 192, 100, 284, 160, NATURAL.stoneDark, true);
    // Terminal on moonlit rock
    SPRITES.terminal.draw(r, 176, 72, true, frame);
    // Wolves gathered
    for (let i = 0; i < 6; i++) {
      const wx = 40 + i * 55;
      const wy = 170 + (i % 2) * 10;
      r.drawEllipse(wx, wy, 8, 5, EGA_PALETTE.lightGray, true);
      r.drawCircle(wx + 8, wy - 4, 3, EGA_PALETTE.lightGray, true);
      // Howl lines
      if ((frame + i * 5) % 20 < 8) {
        r.drawLine(wx + 10, wy - 8, wx + 14, wy - 14, EGA_PALETTE.lightCyan);
      }
    }
    // Moonbeams
    r.drawMultiGradient(172, 55, 40, 185, [[0, rgba(NATURAL.moonGlow, 0.15)], [1, rgba(NATURAL.moonGlow, 0)]]);
  },

  'final-tower': (r, frame, state) => {
    r.clear(EGA_PALETTE.black);
    // Aurora borealis
    for (let x = 0; x < 384; x++) {
      const wave1 = Math.sin(x * 0.02 + frame * 0.03) * 20;
      const wave2 = Math.cos(x * 0.015 + frame * 0.02) * 15;
      const y1 = 30 + wave1;
      const y2 = 40 + wave2;
      r.setPixel(x, y1, EGA_PALETTE.lightGreen);
      r.setPixel(x, y2, EGA_PALETTE.lightCyan);
      r.setPixel(x, (y1 + y2) / 2, EGA_PALETTE.lightMagenta);
    }
    drawStars(r, frame, 20, 400);
    // Tower
    r.drawRect(150, 60, 84, 180, NATURAL.stoneDark);
    r.drawTriangle(140, 60, 192, 20, 244, 60, NATURAL.stone, true);
    // Tower windows
    for (let i = 0; i < 4; i++) {
      r.drawRect(170, 80 + i * 35, 10, 15, EGA_PALETTE.yellow);
      r.drawRect(204, 80 + i * 35, 10, 15, EGA_PALETTE.yellow);
    }
    // Glowing vines
    for (let i = 0; i < 8; i++) {
      const vx = 150 + (i % 2) * 84;
      const vy = 60 + i * 20;
      r.drawLine(vx, vy, vx + (i % 2 === 0 ? -8 : 8), vy + 15, EGA_PALETTE.lightGreen);
    }
    // Curse orb at top
    if (!state.flags?.solvedFinalCurseBreaker) {
      r.drawRadialGlow(192, 35, 4, 18, rgba('#ff55ff', 0.4), rgba('#ff55ff', 0));
      r.drawCircle(192, 35, 10, EGA_PALETTE.magenta, true);
      r.drawCircle(192, 35, 8, EGA_PALETTE.lightMagenta, false);
      // Dark energy pulses
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + frame * 0.08;
        r.setPixel(192 + Math.cos(angle) * 14, 35 + Math.sin(angle) * 14, EGA_PALETTE.lightMagenta);
      }
    } else {
      // Curse broken — golden light!
      r.drawRadialGlow(192, 35, 4, 20, rgba('#ffff55', 0.5), rgba('#ffff55', 0));
      r.drawCircle(192, 35, 12, EGA_PALETTE.yellow, true);
      drawSparkles(r, frame, 20, 444);
    }
    // Master terminal
    SPRITES.terminal.draw(r, 176, 100, true, frame);
    // Ground
    r.drawGround(NATURAL.nightGrass, 200, '#0a1a0a');
  },
};

// Fallback renderer for scenes without custom art
function defaultRenderer(r, frame, state) {
  r.drawSky(NATURAL.skyDay, NATURAL.skyHorizon, 140);
  r.drawCloud(100, 25, 1);
  r.drawCloud(280, 35, 0.8);
  r.drawGround(NATURAL.grass, 140, NATURAL.grassDark);
  r.drawText('Scene', 170, 110, EGA_PALETTE.white);
  SPRITES.player.draw(r, 180, 155, frame);
}

export function renderScene(renderer, sceneId, frame, state) {
  const drawFn = SCENE_RENDERERS[sceneId];
  if (drawFn) {
    drawFn(renderer, frame, state);
  } else {
    defaultRenderer(renderer, frame, state);
  }
  renderer.render();
}
