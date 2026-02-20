// EGA-Style Graphics Renderer (refactored as ES module)
// Authentic 16-color EGA palette and pixel art rendering
// Enhanced with gradient, glow, and natural color support

import { rgba, NATURAL } from './colors.js';

export const EGA_PALETTE = {
  black: '#000000',
  blue: '#0000aa',
  green: '#00aa00',
  cyan: '#00aaaa',
  red: '#aa0000',
  magenta: '#aa00aa',
  brown: '#aa5500',
  lightGray: '#aaaaaa',
  darkGray: '#555555',
  lightBlue: '#5555ff',
  lightGreen: '#55ff55',
  lightCyan: '#55ffff',
  lightRed: '#ff5555',
  lightMagenta: '#ff55ff',
  yellow: '#ffff55',
  white: '#ffffff',
};

export class EGARenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 384;
    this.height = 240;

    this.ctx.imageSmoothingEnabled = false;

    this.buffer = document.createElement('canvas');
    this.buffer.width = this.width;
    this.buffer.height = this.height;
    this.bufferCtx = this.buffer.getContext('2d');
    this.bufferCtx.imageSmoothingEnabled = false;
  }

  clear(color = EGA_PALETTE.black) {
    this.bufferCtx.fillStyle = color;
    this.bufferCtx.fillRect(0, 0, this.width, this.height);
  }

  setPixel(x, y, color) {
    this.bufferCtx.fillStyle = color;
    this.bufferCtx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
  }

  drawRect(x, y, w, h, color, filled = true) {
    this.bufferCtx.fillStyle = color;
    this.bufferCtx.strokeStyle = color;
    if (filled) {
      this.bufferCtx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    } else {
      this.bufferCtx.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(w) - 1, Math.floor(h) - 1);
    }
  }

  drawLine(x1, y1, x2, y2, color) {
    x1 = Math.floor(x1); y1 = Math.floor(y1);
    x2 = Math.floor(x2); y2 = Math.floor(y2);
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      this.setPixel(x1, y1, color);
      if (x1 === x2 && y1 === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x1 += sx; }
      if (e2 < dx) { err += dx; y1 += sy; }
    }
  }

  drawCircle(cx, cy, r, color, filled = false) {
    cx = Math.floor(cx); cy = Math.floor(cy); r = Math.floor(r);
    let x = r, y = 0, err = 0;
    while (x >= y) {
      if (filled) {
        this.drawLine(cx - x, cy + y, cx + x, cy + y, color);
        this.drawLine(cx - x, cy - y, cx + x, cy - y, color);
        this.drawLine(cx - y, cy + x, cx + y, cy + x, color);
        this.drawLine(cx - y, cy - x, cx + y, cy - x, color);
      } else {
        this.setPixel(cx + x, cy + y, color); this.setPixel(cx - x, cy + y, color);
        this.setPixel(cx + x, cy - y, color); this.setPixel(cx - x, cy - y, color);
        this.setPixel(cx + y, cy + x, color); this.setPixel(cx - y, cy + x, color);
        this.setPixel(cx + y, cy - x, color); this.setPixel(cx - y, cy - x, color);
      }
      y++;
      err += 1 + 2 * y;
      if (2 * (err - x) + 1 > 0) { x--; err += 1 - 2 * x; }
    }
  }

  drawEllipse(cx, cy, rx, ry, color, filled = false) {
    for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      if (filled) {
        this.drawLine(cx, Math.floor(y), Math.floor(x), Math.floor(y), color);
      } else {
        this.setPixel(x, y, color);
      }
    }
  }

  drawPolygon(points, color, filled = false) {
    if (filled) {
      this.bufferCtx.fillStyle = color;
      this.bufferCtx.beginPath();
      this.bufferCtx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.bufferCtx.lineTo(points[i].x, points[i].y);
      }
      this.bufferCtx.closePath();
      this.bufferCtx.fill();
    } else {
      for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length;
        this.drawLine(points[i].x, points[i].y, points[next].x, points[next].y, color);
      }
    }
  }

  drawTriangle(x1, y1, x2, y2, x3, y3, color, filled = true) {
    this.drawPolygon([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], color, filled);
  }

  drawDitheredRect(x, y, w, h, color1, color2, pattern = 'checker') {
    for (let py = y; py < y + h; py++) {
      for (let px = x; px < x + w; px++) {
        let useColor1;
        if (pattern === 'checker') useColor1 = (px + py) % 2 === 0;
        else if (pattern === 'horizontal') useColor1 = py % 2 === 0;
        else if (pattern === 'vertical') useColor1 = px % 2 === 0;
        else { const ratio = (py - y) / h; useColor1 = Math.random() > ratio; }
        this.setPixel(px, py, useColor1 ? color1 : color2);
      }
    }
  }

  drawText(text, x, y, color, size = 1) {
    this.bufferCtx.fillStyle = color;
    this.bufferCtx.font = `${8 * size}px monospace`;
    this.bufferCtx.fillText(text, x, y + 7 * size);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.buffer, 0, 0, this.width, this.height, 0, 0, this.canvas.width, this.canvas.height);
  }

  // ========== NEW: Gradient and glow methods ==========

  drawGradientRect(x, y, w, h, topColor, bottomColor) {
    const grad = this.bufferCtx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    this.bufferCtx.fillStyle = grad;
    this.bufferCtx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  drawMultiGradient(x, y, w, h, stops) {
    const grad = this.bufferCtx.createLinearGradient(x, y, x, y + h);
    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }
    this.bufferCtx.fillStyle = grad;
    this.bufferCtx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  drawRadialGlow(cx, cy, innerR, outerR, innerColor, outerColor) {
    const grad = this.bufferCtx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(1, outerColor);
    this.bufferCtx.fillStyle = grad;
    this.bufferCtx.fillRect(cx - outerR, cy - outerR, outerR * 2, outerR * 2);
  }

  drawSpriteShadow(x, y, width) {
    const ctx = this.bufferCtx;
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(Math.floor(x), Math.floor(y), Math.floor(width / 2), Math.floor(width / 6), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ========== Scene helpers (enhanced) ==========

  drawSky(topColor, bottomColor, horizon = 100) {
    this.drawGradientRect(0, 0, this.width, horizon, topColor, bottomColor);
  }

  drawGround(color, startY, bottomColor = null) {
    if (bottomColor) {
      this.drawGradientRect(0, startY, this.width, this.height - startY, color, bottomColor);
    } else {
      this.drawRect(0, startY, this.width, this.height - startY, color);
    }
  }

  drawMountain(x, height, width, color, snowColor = null) {
    const baseY = 120;
    const peakY = baseY - height;
    // Main face
    this.drawTriangle(x, baseY, x + width / 2, peakY, x + width, baseY, color, true);
    // Shadow side (right half darker)
    const shadowColor = rgba(color, 0.3);
    const ctx = this.bufferCtx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + width / 2, peakY);
    ctx.lineTo(x + width, baseY);
    ctx.lineTo(x + width / 2, baseY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
    ctx.restore();
    if (snowColor) {
      const snowH = height * 0.3;
      this.drawTriangle(x + width * 0.3, baseY - height + snowH, x + width / 2, peakY, x + width * 0.7, baseY - height + snowH, snowColor, true);
    }
  }

  drawTree(x, y, size = 1) {
    const trunkW = 4 * size, trunkH = 12 * size;
    this.drawRect(x - trunkW / 2, y - trunkH, trunkW, trunkH, NATURAL.bark);
    // Shadow side of trunk
    this.drawRect(x, y - trunkH, trunkW / 2, trunkH, NATURAL.barkDark);
    for (let i = 0; i < 3; i++) {
      const layerY = y - trunkH - i * 8 * size;
      const layerW = (20 - i * 4) * size;
      // Dark base layer
      this.drawTriangle(x - layerW / 2, layerY, x, layerY - 12 * size, x + layerW / 2, layerY, NATURAL.leafDark, true);
      // Lighter highlight on left
      this.drawTriangle(x - layerW / 2, layerY, x, layerY - 12 * size, x, layerY, NATURAL.leafGreen, true);
      // Bright tip
      this.drawTriangle(x - layerW * 0.2, layerY - 6 * size, x, layerY - 12 * size, x + layerW * 0.1, layerY - 4 * size, NATURAL.leafLight, true);
    }
  }

  drawCloud(x, y, size = 1) {
    // Shadow beneath
    const shadow = rgba('#000000', 0.08);
    this.drawCircle(x, y + 3 * size, 8 * size, shadow, true);
    this.drawCircle(x - 8 * size, y + 5 * size, 6 * size, shadow, true);
    this.drawCircle(x + 8 * size, y + 5 * size, 6 * size, shadow, true);
    // Main cloud (off-white)
    const c = '#eef0ff';
    this.drawCircle(x, y, 8 * size, c, true);
    this.drawCircle(x - 8 * size, y + 3 * size, 6 * size, c, true);
    this.drawCircle(x + 8 * size, y + 3 * size, 6 * size, c, true);
    this.drawCircle(x + 4 * size, y - 3 * size, 5 * size, c, true);
    // Highlight
    this.drawCircle(x + 2 * size, y - 2 * size, 3 * size, '#ffffff', true);
  }

  drawStar(x, y, size = 1) {
    this.setPixel(x, y, '#fffff8');
    if (size > 1) {
      this.setPixel(x - 1, y, '#ccccdd');
      this.setPixel(x + 1, y, '#ccccdd');
      this.setPixel(x, y - 1, '#ccccdd');
      this.setPixel(x, y + 1, '#ccccdd');
    }
  }

  drawWater(startY, endY, frame = 0) {
    // Gradient base
    this.drawGradientRect(0, startY, this.width, endY - startY, NATURAL.waterShallow, NATURAL.waterDeep);
    // Animated wave stripes
    const ctx = this.bufferCtx;
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let y = startY; y < endY; y += 3) {
      const offset = Math.sin((y + (frame || 0)) * 0.12) * 20;
      ctx.fillStyle = NATURAL.waterFoam;
      ctx.fillRect(offset, y, this.width, 1);
    }
    ctx.restore();
  }

  drawSparkle(x, y, frame) {
    const colors = ['#ffffff', '#ffee66', '#66eeff'];
    const color = colors[frame % colors.length];
    const size = (frame % 3) + 1;
    // Soft glow halo
    this.drawRadialGlow(x, y, 0, size + 2, rgba(color, 0.3), rgba(color, 0));
    // Core pixel
    this.setPixel(x, y, color);
    if (size > 1) {
      this.setPixel(x - size, y, color); this.setPixel(x + size, y, color);
      this.setPixel(x, y - size, color); this.setPixel(x, y + size, color);
    }
  }
}
