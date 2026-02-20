// Sprite drawing functions (procedural pixel art)
import { EGA_PALETTE } from './ega-renderer.js';
import { NATURAL } from './colors.js';

export const SPRITES = {
  // Player character - young wizard
  player: {
    draw(r, x, y, frame = 0, direction = 1) {
      r.drawSpriteShadow(x + 8, y + 24, 16);
      // Robe body
      r.drawRect(x + 4, y + 10, 8, 12, NATURAL.robeBlue);
      // Robe shadow on right side
      r.drawRect(x + 10, y + 10, 2, 12, NATURAL.robeShadow);
      // Robe shading on left
      r.drawRect(x + 4, y + 10, 2, 6, NATURAL.robeShadow);
      // Robe lower / triangle
      r.drawTriangle(x + 2, y + 22, x + 8, y + 10, x + 14, y + 22, NATURAL.robeBlue, true);
      // Face
      r.drawCircle(x + 8, y + 6, 5, NATURAL.skin, true);
      // Eyes
      const eo = direction > 0 ? 1 : -1;
      r.setPixel(x + 6 + eo, y + 5, EGA_PALETTE.black);
      r.setPixel(x + 10 + eo, y + 5, EGA_PALETTE.black);
      // Hat
      r.drawTriangle(x + 2, y + 2, x + 8, y - 8, x + 14, y + 2, NATURAL.robePurple, true);
      // Hat brim
      r.drawRect(x, y + 1, 16, 3, NATURAL.robePurple);
      // Hat star
      r.setPixel(x + 8, y - 4, NATURAL.magicGold);
      // Boots
      r.drawRect(x + 5, y + 20, 2, 4, NATURAL.barkDark);
      r.drawRect(x + 9, y + 20, 2, 4, NATURAL.barkDark);
    },
  },

  // Old wizard NPC
  oldWizard: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 10, y + 30, 22);
      // Robe
      r.drawRect(x + 4, y + 12, 12, 18, '#6644aa');
      r.drawTriangle(x, y + 30, x + 10, y + 12, x + 20, y + 30, '#6644aa', true);
      // Robe shadow on right
      r.drawRect(x + 14, y + 12, 2, 18, '#4a3388');
      // Belt
      r.drawRect(x + 4, y + 18, 12, 2, NATURAL.magicGold);
      // Face
      r.drawCircle(x + 10, y + 8, 6, NATURAL.skin, true);
      // Beard
      r.drawTriangle(x + 6, y + 10, x + 10, y + 24, x + 14, y + 10, '#d0d0d8', true);
      // Eyes
      r.setPixel(x + 8, y + 6, EGA_PALETTE.black);
      r.setPixel(x + 12, y + 6, EGA_PALETTE.black);
      // Hat
      r.drawTriangle(x + 2, y + 3, x + 10, y - 12, x + 18, y + 3, '#2a3388', true);
      // Hat brim
      r.drawRect(x, y + 2, 20, 3, '#2a3388');
      // Stars on hat
      r.setPixel(x + 8, y - 4, NATURAL.magicGold);
      r.setPixel(x + 12, y - 2, NATURAL.magicGold);
      // Staff
      r.drawRect(x + 18, y + 2, 2, 28, NATURAL.bark);
      // Orb
      r.drawCircle(x + 19, y, 3, frame % 6 < 3 ? EGA_PALETTE.lightCyan : NATURAL.magicCyan, true);
    },
  },

  // Sparkle fox (Melody)
  sparkleFox: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 12, y + 23, 20);
      // Body
      r.drawEllipse(x + 12, y + 14, 10, 6, '#ee8899', true);
      // Belly highlight
      r.drawEllipse(x + 12, y + 16, 6, 3, '#ffccdd', true);
      // Head
      r.drawCircle(x + 22, y + 10, 6, '#ee8899', true);
      // Ears
      r.drawTriangle(x + 18, y + 4, x + 20, y - 2, x + 22, y + 4, '#ee8899', true);
      r.drawTriangle(x + 24, y + 4, x + 26, y - 2, x + 28, y + 4, '#ee8899', true);
      // Inner ears
      r.drawTriangle(x + 19, y + 4, x + 20, y, x + 21, y + 4, EGA_PALETTE.white, true);
      r.drawTriangle(x + 25, y + 4, x + 26, y, x + 27, y + 4, EGA_PALETTE.white, true);
      // Eyes
      r.setPixel(x + 20, y + 9, NATURAL.magicCyan);
      r.setPixel(x + 25, y + 9, NATURAL.magicCyan);
      // Nose
      r.setPixel(x + 27, y + 11, EGA_PALETTE.black);
      // Tail
      const tailWave = Math.sin(frame * 0.2) * 3;
      r.drawLine(x + 2, y + 14, x - 6, y + 8 + tailWave, '#ee8899');
      r.drawLine(x - 6, y + 8 + tailWave, x - 8, y + 6 + tailWave, EGA_PALETTE.white);
      // Legs
      r.drawRect(x + 6, y + 18, 2, 5, '#ee8899');
      r.drawRect(x + 14, y + 18, 2, 5, '#ee8899');
      // Sparkles around
      r.drawSparkle(x + 30, y + 5, frame);
      r.drawSparkle(x - 4, y + 2, frame + 5);
    },
  },

  // DJ Bracket (frog with headphones)
  djBracket: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 10, y + 22, 18);
      // Body
      r.drawEllipse(x + 10, y + 16, 8, 6, '#44bb44', true);
      // Head
      r.drawCircle(x + 10, y + 8, 7, '#44bb44', true);
      // Eyes (big frog eyes)
      r.drawCircle(x + 6, y + 4, 4, EGA_PALETTE.white, true);
      r.drawCircle(x + 14, y + 4, 4, EGA_PALETTE.white, true);
      r.drawCircle(x + 6, y + 4, 2, EGA_PALETTE.black, true);
      r.drawCircle(x + 14, y + 4, 2, EGA_PALETTE.black, true);
      // Mouth
      r.drawLine(x + 5, y + 12, x + 15, y + 12, NATURAL.leafDark);
      // Headphones
      r.drawLine(x + 2, y + 4, x + 2, y + 10, EGA_PALETTE.darkGray);
      r.drawLine(x + 18, y + 4, x + 18, y + 10, EGA_PALETTE.darkGray);
      r.drawRect(x, y + 6, 4, 4, '#cc2222');
      r.drawRect(x + 16, y + 6, 4, 4, '#cc2222');
      r.drawLine(x + 2, y, x + 18, y, EGA_PALETTE.darkGray);
      // Musical notes
      const noteY = y - 6 - (frame % 4);
      r.setPixel(x + 22, noteY, EGA_PALETTE.yellow);
      r.setPixel(x + 22, noteY - 1, EGA_PALETTE.yellow);
      r.setPixel(x + 24, noteY + 2, EGA_PALETTE.lightCyan);
    },
  },

  // Terminal (magic computer)
  terminal: {
    draw(r, x, y, active = true, frame = 0) {
      r.drawRect(x, y, 32, 24, NATURAL.stoneDark);
      r.drawRect(x + 2, y + 2, 28, 18, active ? EGA_PALETTE.black : NATURAL.stoneDark);
      if (active) {
        r.drawRect(x + 3, y + 3, 26, 16, EGA_PALETTE.blue);
        const textY = (frame % 3) * 4;
        r.drawRect(x + 5, y + 5 + textY, 12, 2, EGA_PALETTE.lightGreen);
        if (frame % 10 < 5) r.drawRect(x + 5, y + 15, 4, 2, EGA_PALETTE.lightGreen);
      }
      r.drawRect(x + 8, y + 24, 16, 4, NATURAL.stoneDark);
      r.setPixel(x + 4, y + 21, active ? EGA_PALETTE.lightGreen : EGA_PALETTE.red);
      r.setPixel(x + 27, y + 21, EGA_PALETTE.yellow);
    },
  },

  // Crystal
  crystal: {
    draw(r, x, y, color = EGA_PALETTE.lightCyan, frame = 0) {
      r.drawPolygon([
        { x: x + 6, y }, { x: x + 10, y: y + 5 }, { x: x + 10, y: y + 12 },
        { x: x + 6, y: y + 16 }, { x: x + 2, y: y + 12 }, { x: x + 2, y: y + 5 },
      ], color, true);
      r.drawLine(x + 4, y + 3, x + 4, y + 8, EGA_PALETTE.white);
      if (frame % 10 < 5) r.setPixel(x + 6, y - 2, EGA_PALETTE.white);
    },
  },

  // Book
  book: {
    draw(r, x, y, color = EGA_PALETTE.red) {
      r.drawRect(x, y, 14, 12, color);
      r.drawRect(x + 2, y + 1, 10, 10, EGA_PALETTE.white);
      r.drawRect(x, y, 2, 12, EGA_PALETTE.darkGray);
      r.drawRect(x + 4, y + 3, 6, 1, EGA_PALETTE.yellow);
      r.drawRect(x + 5, y + 5, 4, 1, EGA_PALETTE.yellow);
    },
  },

  // Cauldron
  cauldron: {
    draw(r, x, y, bubbling = false, frame = 0) {
      r.drawSpriteShadow(x + 12, y + 22, 24);
      // Body
      r.drawEllipse(x + 12, y + 14, 11, 6, NATURAL.stoneDark, true);
      r.drawRect(x + 2, y + 6, 20, 10, NATURAL.stoneDark, true);
      // Rim
      r.drawEllipse(x + 12, y + 6, 10, 3, NATURAL.stone);
      // Liquid
      r.drawEllipse(x + 12, y + 7, 8, 2, '#44dd55');
      // Legs
      r.drawRect(x + 4, y + 18, 2, 4, NATURAL.stoneDark);
      r.drawRect(x + 18, y + 18, 2, 4, NATURAL.stoneDark);
      if (bubbling) {
        const by = y + 4 - (frame % 4);
        r.drawCircle(x + 8 + (frame % 3) * 3, by, 2, '#44dd55', true);
        r.drawCircle(x + 14 - (frame % 2) * 2, by - 2, 1, '#44dd55', true);
      }
    },
  },

  // Ember the fire dragon
  fireDragon: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 20, y + 32, 40);
      // Body
      r.drawEllipse(x + 20, y + 18, 16, 10, '#cc3322', true);
      // Neck
      r.drawRect(x + 32, y + 6, 8, 14, '#cc3322');
      // Head
      r.drawEllipse(x + 40, y + 4, 8, 6, '#cc3322', true);
      // Eye
      r.setPixel(x + 44, y + 3, EGA_PALETTE.yellow);
      // Nostril
      r.setPixel(x + 47, y + 5, EGA_PALETTE.darkGray);
      // Wings
      const wingY = y + 4 + Math.sin(frame * 0.15) * 3;
      r.drawTriangle(x + 14, y + 10, x + 24, wingY - 10, x + 30, y + 10, '#ee6644', true);
      // Legs
      r.drawRect(x + 10, y + 24, 4, 8, '#cc3322');
      r.drawRect(x + 26, y + 24, 4, 8, '#cc3322');
      // Tail
      r.drawLine(x + 4, y + 18, x - 6, y + 12, '#cc3322');
      r.drawTriangle(x - 8, y + 10, x - 6, y + 12, x - 4, y + 14, '#ee6644', true);
      // Fire breath
      if (frame % 20 < 10) {
        r.setPixel(x + 48, y + 4, EGA_PALETTE.yellow);
        r.setPixel(x + 49, y + 3, EGA_PALETTE.lightRed);
        r.setPixel(x + 50, y + 5, EGA_PALETTE.yellow);
      }
      // Belly scales
      r.drawEllipse(x + 20, y + 22, 8, 4, '#eebb44', true);
    },
  },

  // Tsunami the sea dragon
  seaDragon: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 20, y + 32, 40);
      // Body
      r.drawEllipse(x + 20, y + 18, 16, 10, '#2255aa', true);
      // Neck
      r.drawRect(x + 32, y + 6, 8, 14, '#2255aa');
      // Head
      r.drawEllipse(x + 40, y + 4, 8, 6, '#2255aa', true);
      // Eye
      r.setPixel(x + 44, y + 3, EGA_PALETTE.lightCyan);
      // Fins instead of wings
      const finY = Math.sin(frame * 0.1) * 2;
      r.drawTriangle(x + 14, y + 10, x + 20, y + finY, x + 26, y + 10, '#5588cc', true);
      // Legs
      r.drawRect(x + 10, y + 24, 4, 8, '#2255aa');
      r.drawRect(x + 26, y + 24, 4, 8, '#2255aa');
      // Water drops
      if (frame % 12 < 6) {
        r.setPixel(x + 38, y - 2, EGA_PALETTE.lightCyan);
        r.setPixel(x + 42, y - 4, '#5588cc');
      }
      // Belly
      r.drawEllipse(x + 20, y + 22, 8, 4, '#88ccdd', true);
    },
  },

  // Starflight the sky dragon
  skyDragon: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 20, y + 32, 40);
      // Body
      r.drawEllipse(x + 20, y + 18, 16, 10, '#7744aa', true);
      // Neck
      r.drawRect(x + 32, y + 6, 8, 14, '#7744aa');
      // Head
      r.drawEllipse(x + 40, y + 4, 8, 6, '#7744aa', true);
      // Eye
      r.setPixel(x + 44, y + 3, EGA_PALETTE.yellow);
      // Large wings
      const wingY = Math.sin(frame * 0.12) * 4;
      r.drawTriangle(x + 10, y + 10, x + 20, y + wingY - 14, x + 28, y + 10, '#aa66cc', true);
      r.drawTriangle(x + 28, y + 10, x + 36, y + wingY - 12, x + 40, y + 10, '#aa66cc', true);
      // Legs
      r.drawRect(x + 10, y + 24, 4, 8, '#7744aa');
      r.drawRect(x + 26, y + 24, 4, 8, '#7744aa');
      // Stars on body
      r.setPixel(x + 16, y + 14, EGA_PALETTE.yellow);
      r.setPixel(x + 22, y + 16, EGA_PALETTE.yellow);
      r.setPixel(x + 28, y + 13, EGA_PALETTE.yellow);
      // Books floating nearby
      if (frame % 8 < 4) {
        r.drawRect(x + 46, y + 8, 6, 4, EGA_PALETTE.brown);
      }
    },
  },

  // Luna the wolf girl
  wolfGirl: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 10, y + 29, 18);
      // Body/dress
      r.drawRect(x + 4, y + 12, 12, 14, '#3a3344');
      r.drawTriangle(x + 2, y + 26, x + 10, y + 14, x + 18, y + 26, '#3a3344', true);
      // Dress shadow on right
      r.drawRect(x + 14, y + 12, 2, 14, '#2a2233');
      // Face
      r.drawCircle(x + 10, y + 8, 6, NATURAL.skin, true);
      // Silver hair
      r.drawRect(x + 3, y + 2, 14, 6, '#c8c8d8');
      r.drawRect(x + 2, y + 6, 4, 10, '#c8c8d8');
      r.drawRect(x + 14, y + 6, 4, 10, '#c8c8d8');
      // Wolf ears
      r.drawTriangle(x + 3, y + 2, x + 5, y - 4, x + 7, y + 2, '#c8c8d8', true);
      r.drawTriangle(x + 13, y + 2, x + 15, y - 4, x + 17, y + 2, '#c8c8d8', true);
      // Inner ears
      r.drawTriangle(x + 4, y + 2, x + 5, y - 2, x + 6, y + 2, '#dd88aa', true);
      r.drawTriangle(x + 14, y + 2, x + 15, y - 2, x + 16, y + 2, '#dd88aa', true);
      // Glowing amber eyes
      r.setPixel(x + 8, y + 7, EGA_PALETTE.yellow);
      r.setPixel(x + 12, y + 7, EGA_PALETTE.yellow);
      // Spectral wolf beside her
      if (frame % 4 < 3) {
        r.drawEllipse(x + 28, y + 18, 8, 5, EGA_PALETTE.lightCyan, false);
        r.drawCircle(x + 34, y + 14, 3, EGA_PALETTE.lightCyan, false);
      }
      // Legs
      r.drawRect(x + 6, y + 24, 2, 5, '#3a3344');
      r.drawRect(x + 12, y + 24, 2, 5, '#3a3344');
    },
  },

  // Fang the elder wolf
  elderWolf: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 16, y + 28, 30);
      // Body
      r.drawEllipse(x + 16, y + 16, 14, 8, '#9898a0', true);
      // Head
      r.drawEllipse(x + 30, y + 10, 7, 5, '#9898a0', true);
      // Ears
      r.drawTriangle(x + 26, y + 6, x + 28, y + 2, x + 30, y + 6, '#9898a0', true);
      r.drawTriangle(x + 32, y + 6, x + 34, y + 2, x + 36, y + 6, '#9898a0', true);
      // Eyes (wise)
      r.setPixel(x + 29, y + 9, EGA_PALETTE.yellow);
      r.setPixel(x + 33, y + 9, EGA_PALETTE.yellow);
      // Scar
      r.drawLine(x + 27, y + 8, x + 29, y + 10, EGA_PALETTE.darkGray);
      // Nose
      r.setPixel(x + 36, y + 11, EGA_PALETTE.black);
      // Legs
      r.drawRect(x + 6, y + 22, 3, 6, '#9898a0');
      r.drawRect(x + 14, y + 22, 3, 6, '#9898a0');
      r.drawRect(x + 22, y + 22, 3, 6, '#9898a0');
      // Tail
      const tailWave = Math.sin(frame * 0.1) * 2;
      r.drawLine(x + 2, y + 16, x - 4, y + 10 + tailWave, '#9898a0');
      // Rune markings
      r.setPixel(x + 12, y + 12, EGA_PALETTE.lightCyan);
      r.setPixel(x + 18, y + 14, EGA_PALETTE.lightCyan);
    },
  },

  // Willow the tree spirit
  treeSpirit: {
    draw(r, x, y, frame = 0) {
      r.drawSpriteShadow(x + 10, y + 28, 18);
      // Ethereal body (branch-like)
      r.drawRect(x + 6, y + 8, 8, 20, NATURAL.leafGreen);
      // Head
      r.drawCircle(x + 10, y + 6, 6, NATURAL.leafGreen, true);
      // Glowing leaf hair
      const leafGlow = frame % 6 < 3 ? NATURAL.leafLight : NATURAL.leafGreen;
      r.drawTriangle(x + 4, y + 2, x + 10, y - 6, x + 16, y + 2, leafGlow, true);
      r.drawTriangle(x + 2, y + 4, x + 6, y - 2, x + 10, y + 4, NATURAL.leafLight, true);
      // Eyes (glowing)
      r.setPixel(x + 8, y + 5, EGA_PALETTE.white);
      r.setPixel(x + 12, y + 5, EGA_PALETTE.white);
      // Branch arms
      r.drawLine(x + 6, y + 12, x - 2, y + 8, NATURAL.bark);
      r.drawLine(x - 2, y + 8, x - 4, y + 4, NATURAL.leafGreen);
      r.drawLine(x + 14, y + 12, x + 22, y + 8, NATURAL.bark);
      r.drawLine(x + 22, y + 8, x + 24, y + 4, NATURAL.leafGreen);
      // Floating leaves
      const leafY = y + Math.sin(frame * 0.1) * 3;
      r.setPixel(x + 18, leafY, NATURAL.leafLight);
      r.setPixel(x - 2, leafY + 4, NATURAL.leafLight);
    },
  },

  // Flower
  flower: {
    draw(r, x, y, color = EGA_PALETTE.lightMagenta) {
      r.drawRect(x + 2, y + 6, 2, 8, NATURAL.leafGreen);
      r.drawCircle(x + 3, y + 4, 3, color, true);
      r.setPixel(x + 3, y + 4, EGA_PALETTE.yellow);
    },
  },

  // Mushroom (glowing)
  mushroom: {
    draw(r, x, y, color = EGA_PALETTE.lightCyan, frame = 0) {
      r.drawRect(x + 3, y + 6, 4, 6, EGA_PALETTE.white);
      r.drawEllipse(x + 5, y + 4, 5, 3, color, true);
      r.setPixel(x + 3, y + 3, EGA_PALETTE.white);
      r.setPixel(x + 7, y + 2, EGA_PALETTE.white);
      // Glow
      if (frame % 6 < 3) {
        r.setPixel(x + 5, y - 1, color);
      }
    },
  },
};
