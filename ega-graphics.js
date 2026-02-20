// EGA-Style Graphics Renderer
// Authentic 16-color EGA palette and pixel art rendering

const EGA_PALETTE = {
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
    white: '#ffffff'
};

class EGARenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 384;  // 16:10 aspect ratio
        this.height = 240;
        this.scale = 2;
        
        // Disable image smoothing for crisp pixels
        this.ctx.imageSmoothingEnabled = false;
        
        // Create off-screen buffer for pixel-perfect rendering
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
        // Bresenham's line algorithm for pixel-perfect lines
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        x2 = Math.floor(x2);
        y2 = Math.floor(y2);
        
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
        cx = Math.floor(cx);
        cy = Math.floor(cy);
        r = Math.floor(r);
        
        let x = r;
        let y = 0;
        let err = 0;
        
        while (x >= y) {
            if (filled) {
                this.drawLine(cx - x, cy + y, cx + x, cy + y, color);
                this.drawLine(cx - x, cy - y, cx + x, cy - y, color);
                this.drawLine(cx - y, cy + x, cx + y, cy + x, color);
                this.drawLine(cx - y, cy - x, cx + y, cy - x, color);
            } else {
                this.setPixel(cx + x, cy + y, color);
                this.setPixel(cx - x, cy + y, color);
                this.setPixel(cx + x, cy - y, color);
                this.setPixel(cx - x, cy - y, color);
                this.setPixel(cx + y, cy + x, color);
                this.setPixel(cx - y, cy + x, color);
                this.setPixel(cx + y, cy - x, color);
                this.setPixel(cx - y, cy - x, color);
            }
            y++;
            err += 1 + 2 * y;
            if (2 * (err - x) + 1 > 0) {
                x--;
                err += 1 - 2 * x;
            }
        }
    }
    
    drawEllipse(cx, cy, rx, ry, color, filled = false) {
        for (let angle = 0; angle < Math.PI * 2; angle += 0.02) {
            const x = cx + Math.cos(angle) * rx;
            const y = cy + Math.sin(angle) * ry;
            if (filled) {
                this.drawLine(cx, cy, x, y, color);
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
        this.drawPolygon([{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}], color, filled);
    }
    
    // Draw dithered gradient for sky effects
    drawDitheredRect(x, y, w, h, color1, color2, pattern = 'checker') {
        for (let py = y; py < y + h; py++) {
            for (let px = x; px < x + w; px++) {
                let useColor1;
                if (pattern === 'checker') {
                    useColor1 = (px + py) % 2 === 0;
                } else if (pattern === 'horizontal') {
                    useColor1 = py % 2 === 0;
                } else if (pattern === 'vertical') {
                    useColor1 = px % 2 === 0;
                } else {
                    // Gradient dither
                    const ratio = (py - y) / h;
                    useColor1 = Math.random() > ratio;
                }
                this.setPixel(px, py, useColor1 ? color1 : color2);
            }
        }
    }
    
    // Draw text using a simple pixel font
    drawText(text, x, y, color, size = 1) {
        this.bufferCtx.fillStyle = color;
        this.bufferCtx.font = `${8 * size}px monospace`;
        this.bufferCtx.fillText(text, x, y + 7 * size);
    }
    
    // Render buffer to main canvas with scaling
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.buffer, 0, 0, this.width, this.height, 
                          0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Scene drawing helpers
    drawSky(topColor, bottomColor, horizon = 100) {
        // Dithered sky gradient
        for (let y = 0; y < horizon; y++) {
            const ratio = y / horizon;
            for (let x = 0; x < this.width; x++) {
                const useTop = Math.random() > ratio;
                this.setPixel(x, y, useTop ? topColor : bottomColor);
            }
        }
    }
    
    drawGround(color, startY) {
        this.drawRect(0, startY, this.width, this.height - startY, color);
    }
    
    drawMountain(x, height, width, color, snowColor = null) {
        const baseY = 120;
        const peakY = baseY - height;
        
        // Main mountain
        this.drawTriangle(x, baseY, x + width / 2, peakY, x + width, baseY, color, true);
        
        // Snow cap
        if (snowColor) {
            const snowHeight = height * 0.3;
            this.drawTriangle(
                x + width * 0.3, baseY - height + snowHeight,
                x + width / 2, peakY,
                x + width * 0.7, baseY - height + snowHeight,
                snowColor, true
            );
        }
    }
    
    drawTree(x, y, size = 1) {
        // Trunk
        const trunkW = 4 * size;
        const trunkH = 12 * size;
        this.drawRect(x - trunkW / 2, y - trunkH, trunkW, trunkH, EGA_PALETTE.brown);
        
        // Foliage layers
        const layers = 3;
        for (let i = 0; i < layers; i++) {
            const layerY = y - trunkH - (i * 8 * size);
            const layerW = (20 - i * 4) * size;
            const layerH = 12 * size;
            this.drawTriangle(
                x - layerW / 2, layerY,
                x, layerY - layerH,
                x + layerW / 2, layerY,
                EGA_PALETTE.green, true
            );
        }
    }
    
    drawCloud(x, y, size = 1) {
        const color = EGA_PALETTE.white;
        this.drawCircle(x, y, 8 * size, color, true);
        this.drawCircle(x - 8 * size, y + 3 * size, 6 * size, color, true);
        this.drawCircle(x + 8 * size, y + 3 * size, 6 * size, color, true);
        this.drawCircle(x + 4 * size, y - 3 * size, 5 * size, color, true);
    }
    
    drawStar(x, y, size = 1) {
        this.setPixel(x, y, EGA_PALETTE.white);
        if (size > 1) {
            this.setPixel(x - 1, y, EGA_PALETTE.lightGray);
            this.setPixel(x + 1, y, EGA_PALETTE.lightGray);
            this.setPixel(x, y - 1, EGA_PALETTE.lightGray);
            this.setPixel(x, y + 1, EGA_PALETTE.lightGray);
        }
    }
    
    drawWater(startY, endY) {
        for (let y = startY; y < endY; y++) {
            for (let x = 0; x < this.width; x++) {
                const wave = Math.sin((x + y * 2) * 0.1) > 0;
                this.setPixel(x, y, wave ? EGA_PALETTE.blue : EGA_PALETTE.lightBlue);
            }
        }
    }
    
    drawPath(startX, startY, endX, endY, width) {
        // Draw a winding path
        this.bufferCtx.strokeStyle = EGA_PALETTE.brown;
        this.bufferCtx.lineWidth = width;
        this.bufferCtx.beginPath();
        this.bufferCtx.moveTo(startX, startY);
        
        const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 40;
        const midY = (startY + endY) / 2;
        
        this.bufferCtx.quadraticCurveTo(midX, midY, endX, endY);
        this.bufferCtx.stroke();
    }
    
    // Animate sparkle effect
    drawSparkle(x, y, frame) {
        const colors = [EGA_PALETTE.white, EGA_PALETTE.yellow, EGA_PALETTE.lightCyan];
        const color = colors[frame % colors.length];
        const size = (frame % 3) + 1;
        
        this.setPixel(x, y, color);
        if (size > 1) {
            this.setPixel(x - size, y, color);
            this.setPixel(x + size, y, color);
            this.setPixel(x, y - size, color);
            this.setPixel(x, y + size, color);
        }
    }
}

// Sprite definitions for game objects
const SPRITES = {
    // Player character - young wizard
    player: {
        width: 16,
        height: 24,
        draw: function(renderer, x, y, frame = 0, direction = 1) {
            // Robe
            renderer.drawRect(x + 4, y + 10, 8, 12, EGA_PALETTE.blue);
            renderer.drawTriangle(x + 2, y + 22, x + 8, y + 10, x + 14, y + 22, EGA_PALETTE.blue, true);
            
            // Face
            renderer.drawCircle(x + 8, y + 6, 5, EGA_PALETTE.brown, true);
            
            // Eyes
            const eyeOffset = direction > 0 ? 1 : -1;
            renderer.setPixel(x + 6 + eyeOffset, y + 5, EGA_PALETTE.black);
            renderer.setPixel(x + 10 + eyeOffset, y + 5, EGA_PALETTE.black);
            
            // Wizard hat
            renderer.drawTriangle(x + 2, y + 2, x + 8, y - 8, x + 14, y + 2, EGA_PALETTE.magenta, true);
            renderer.drawRect(x, y + 1, 16, 3, EGA_PALETTE.magenta);
            
            // Star on hat
            renderer.setPixel(x + 8, y - 4, EGA_PALETTE.yellow);
            
            // Legs (animated)
            const legOffset = Math.sin(frame * 0.3) * 2;
            renderer.drawRect(x + 5, y + 20, 2, 4, EGA_PALETTE.brown);
            renderer.drawRect(x + 9, y + 20, 2, 4, EGA_PALETTE.brown);
        }
    },
    
    // Unicorn
    unicorn: {
        width: 32,
        height: 24,
        draw: function(renderer, x, y, frame = 0) {
            // Body
            renderer.drawEllipse(x + 16, y + 14, 14, 8, EGA_PALETTE.white);
            renderer.drawRect(x + 4, y + 8, 24, 12, EGA_PALETTE.white, true);
            
            // Legs
            renderer.drawRect(x + 6, y + 18, 3, 8, EGA_PALETTE.white);
            renderer.drawRect(x + 12, y + 18, 3, 8, EGA_PALETTE.white);
            renderer.drawRect(x + 18, y + 18, 3, 8, EGA_PALETTE.white);
            renderer.drawRect(x + 24, y + 18, 3, 8, EGA_PALETTE.white);
            
            // Hooves
            renderer.drawRect(x + 6, y + 24, 3, 2, EGA_PALETTE.lightGray);
            renderer.drawRect(x + 12, y + 24, 3, 2, EGA_PALETTE.lightGray);
            renderer.drawRect(x + 18, y + 24, 3, 2, EGA_PALETTE.lightGray);
            renderer.drawRect(x + 24, y + 24, 3, 2, EGA_PALETTE.lightGray);
            
            // Neck and head
            renderer.drawRect(x + 24, y + 4, 6, 12, EGA_PALETTE.white);
            renderer.drawEllipse(x + 30, y + 4, 5, 4, EGA_PALETTE.white);
            renderer.drawRect(x + 26, y + 0, 8, 8, EGA_PALETTE.white, true);
            
            // Eye
            renderer.setPixel(x + 31, y + 3, EGA_PALETTE.magenta);
            
            // Horn (rainbow sparkle)
            const hornColors = [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightCyan, EGA_PALETTE.yellow];
            const hornColor = hornColors[frame % hornColors.length];
            renderer.drawLine(x + 30, y + 0, x + 34, y - 8, hornColor);
            renderer.drawSparkle(x + 34, y - 8, frame);
            
            // Mane (rainbow)
            const maneColors = [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightCyan, EGA_PALETTE.lightGreen, EGA_PALETTE.yellow];
            for (let i = 0; i < 4; i++) {
                renderer.drawLine(x + 24 - i * 2, y + 2 + i * 2, x + 20 - i * 3, y + 4 + i * 3, maneColors[i]);
            }
            
            // Tail (rainbow)
            for (let i = 0; i < 4; i++) {
                const waveOffset = Math.sin(frame * 0.2 + i) * 2;
                renderer.drawLine(x + 2, y + 12, x - 6 + waveOffset, y + 10 + i * 2, maneColors[i]);
            }
        }
    },
    
    // Doughnut
    doughnut: {
        width: 16,
        height: 16,
        draw: function(renderer, x, y, type = 'pink') {
            const colors = {
                pink: { icing: EGA_PALETTE.lightMagenta, base: EGA_PALETTE.brown },
                chocolate: { icing: EGA_PALETTE.brown, base: EGA_PALETTE.brown },
                rainbow: { icing: EGA_PALETTE.yellow, base: EGA_PALETTE.brown },
                magic: { icing: EGA_PALETTE.lightCyan, base: EGA_PALETTE.magenta }
            };
            const c = colors[type] || colors.pink;
            
            // Doughnut base
            renderer.drawCircle(x + 8, y + 8, 7, c.base, true);
            renderer.drawCircle(x + 8, y + 8, 3, EGA_PALETTE.black, true);
            
            // Icing on top
            renderer.drawCircle(x + 8, y + 7, 6, c.icing, true);
            renderer.drawCircle(x + 8, y + 7, 3, EGA_PALETTE.black, true);
            
            // Sprinkles
            if (type === 'rainbow' || type === 'magic') {
                const sprinkleColors = [EGA_PALETTE.red, EGA_PALETTE.green, EGA_PALETTE.lightBlue, EGA_PALETTE.yellow];
                renderer.setPixel(x + 5, y + 5, sprinkleColors[0]);
                renderer.setPixel(x + 10, y + 4, sprinkleColors[1]);
                renderer.setPixel(x + 12, y + 7, sprinkleColors[2]);
                renderer.setPixel(x + 6, y + 9, sprinkleColors[3]);
            }
        }
    },
    
    // Magic crystal/gem
    crystal: {
        width: 12,
        height: 16,
        draw: function(renderer, x, y, color = EGA_PALETTE.lightCyan, frame = 0) {
            // Crystal shape
            renderer.drawPolygon([
                {x: x + 6, y: y},
                {x: x + 10, y: y + 5},
                {x: x + 10, y: y + 12},
                {x: x + 6, y: y + 16},
                {x: x + 2, y: y + 12},
                {x: x + 2, y: y + 5}
            ], color, true);
            
            // Highlight
            renderer.drawLine(x + 4, y + 3, x + 4, y + 8, EGA_PALETTE.white);
            
            // Sparkle
            if (frame % 10 < 5) {
                renderer.setPixel(x + 6, y - 2, EGA_PALETTE.white);
            }
        }
    },
    
    // Treasure chest
    chest: {
        width: 24,
        height: 18,
        draw: function(renderer, x, y, open = false) {
            // Base
            renderer.drawRect(x, y + 8, 24, 10, EGA_PALETTE.brown);
            renderer.drawRect(x + 2, y + 10, 20, 6, EGA_PALETTE.brown);
            
            // Metal bands
            renderer.drawRect(x, y + 8, 24, 2, EGA_PALETTE.yellow);
            renderer.drawRect(x + 10, y + 8, 4, 10, EGA_PALETTE.yellow);
            
            // Lid
            if (open) {
                renderer.drawRect(x, y, 24, 6, EGA_PALETTE.brown);
                renderer.drawRect(x, y, 24, 2, EGA_PALETTE.yellow);
                // Show treasure inside
                renderer.drawCircle(x + 8, y + 12, 3, EGA_PALETTE.yellow, true);
                renderer.drawCircle(x + 16, y + 12, 3, EGA_PALETTE.yellow, true);
            } else {
                renderer.drawRect(x, y + 4, 24, 6, EGA_PALETTE.brown);
                renderer.drawRect(x, y + 4, 24, 2, EGA_PALETTE.yellow);
                // Lock
                renderer.drawRect(x + 10, y + 6, 4, 4, EGA_PALETTE.yellow);
            }
        }
    },
    
    // Door
    door: {
        width: 20,
        height: 36,
        draw: function(renderer, x, y, open = false, color = EGA_PALETTE.brown) {
            if (open) {
                // Door frame
                renderer.drawRect(x, y, 20, 36, EGA_PALETTE.darkGray);
                // Show darkness inside
                renderer.drawRect(x + 2, y + 2, 16, 32, EGA_PALETTE.black);
            } else {
                // Closed door
                renderer.drawRect(x, y, 20, 36, color);
                // Door frame
                renderer.drawRect(x, y, 20, 2, EGA_PALETTE.darkGray);
                renderer.drawRect(x, y, 2, 36, EGA_PALETTE.darkGray);
                renderer.drawRect(x + 18, y, 2, 36, EGA_PALETTE.darkGray);
                // Door handle
                renderer.drawCircle(x + 15, y + 18, 2, EGA_PALETTE.yellow, true);
                // Panel details
                renderer.drawRect(x + 4, y + 4, 12, 12, EGA_PALETTE.darkGray, false);
                renderer.drawRect(x + 4, y + 20, 12, 12, EGA_PALETTE.darkGray, false);
            }
        }
    },
    
    // NPC - Old wizard
    oldWizard: {
        width: 20,
        height: 32,
        draw: function(renderer, x, y, frame = 0) {
            // Long robe
            renderer.drawRect(x + 4, y + 12, 12, 18, EGA_PALETTE.magenta);
            renderer.drawTriangle(x, y + 30, x + 10, y + 12, x + 20, y + 30, EGA_PALETTE.magenta, true);
            
            // Belt
            renderer.drawRect(x + 4, y + 18, 12, 2, EGA_PALETTE.yellow);
            
            // Face (with beard)
            renderer.drawCircle(x + 10, y + 8, 6, EGA_PALETTE.brown, true);
            
            // Long beard
            renderer.drawTriangle(x + 6, y + 10, x + 10, y + 24, x + 14, y + 10, EGA_PALETTE.lightGray, true);
            
            // Eyes
            renderer.setPixel(x + 8, y + 6, EGA_PALETTE.black);
            renderer.setPixel(x + 12, y + 6, EGA_PALETTE.black);
            
            // Tall wizard hat
            renderer.drawTriangle(x + 2, y + 3, x + 10, y - 12, x + 18, y + 3, EGA_PALETTE.blue, true);
            renderer.drawRect(x, y + 2, 20, 3, EGA_PALETTE.blue);
            // Stars on hat
            renderer.setPixel(x + 8, y - 4, EGA_PALETTE.yellow);
            renderer.setPixel(x + 12, y - 2, EGA_PALETTE.yellow);
            
            // Staff
            renderer.drawRect(x + 18, y + 2, 2, 28, EGA_PALETTE.brown);
            // Crystal on staff
            const sparkle = frame % 6 < 3;
            renderer.drawCircle(x + 19, y, 3, sparkle ? EGA_PALETTE.lightCyan : EGA_PALETTE.cyan, true);
        }
    },
    
    // Book
    book: {
        width: 14,
        height: 12,
        draw: function(renderer, x, y, color = EGA_PALETTE.red) {
            // Cover
            renderer.drawRect(x, y, 14, 12, color);
            // Pages
            renderer.drawRect(x + 2, y + 1, 10, 10, EGA_PALETTE.white);
            // Spine
            renderer.drawRect(x, y, 2, 12, EGA_PALETTE.darkGray);
            // Title decoration
            renderer.drawRect(x + 4, y + 3, 6, 1, EGA_PALETTE.yellow);
            renderer.drawRect(x + 5, y + 5, 4, 1, EGA_PALETTE.yellow);
        }
    },
    
    // Key
    key: {
        width: 12,
        height: 6,
        draw: function(renderer, x, y, color = EGA_PALETTE.yellow) {
            // Handle
            renderer.drawCircle(x + 3, y + 3, 3, color, false);
            // Shaft
            renderer.drawRect(x + 5, y + 2, 6, 2, color);
            // Teeth
            renderer.drawRect(x + 9, y + 3, 1, 2, color);
            renderer.drawRect(x + 11, y + 3, 1, 3, color);
        }
    },
    
    // Potion bottle
    potion: {
        width: 8,
        height: 14,
        draw: function(renderer, x, y, color = EGA_PALETTE.lightGreen) {
            // Bottle body
            renderer.drawRect(x + 1, y + 4, 6, 10, EGA_PALETTE.lightBlue);
            // Liquid
            renderer.drawRect(x + 2, y + 6, 4, 7, color);
            // Neck
            renderer.drawRect(x + 2, y + 1, 4, 4, EGA_PALETTE.lightBlue);
            // Cork
            renderer.drawRect(x + 2, y, 4, 2, EGA_PALETTE.brown);
            // Highlight
            renderer.setPixel(x + 2, y + 5, EGA_PALETTE.white);
        }
    },
    
    // Magical terminal/computer
    terminal: {
        width: 32,
        height: 28,
        draw: function(renderer, x, y, active = true, frame = 0) {
            // Monitor body
            renderer.drawRect(x, y, 32, 24, EGA_PALETTE.darkGray);
            // Screen
            renderer.drawRect(x + 2, y + 2, 28, 18, active ? EGA_PALETTE.black : EGA_PALETTE.darkGray);
            // Screen glow when active
            if (active) {
                renderer.drawRect(x + 3, y + 3, 26, 16, EGA_PALETTE.blue);
                // Text on screen
                const textY = (frame % 3) * 4;
                renderer.drawRect(x + 5, y + 5 + textY, 12, 2, EGA_PALETTE.lightGreen);
                // Cursor blink
                if (frame % 10 < 5) {
                    renderer.drawRect(x + 5, y + 15, 4, 2, EGA_PALETTE.lightGreen);
                }
            }
            // Base
            renderer.drawRect(x + 8, y + 24, 16, 4, EGA_PALETTE.darkGray);
            // Decorative lights
            renderer.setPixel(x + 4, y + 21, active ? EGA_PALETTE.lightGreen : EGA_PALETTE.red);
            renderer.setPixel(x + 27, y + 21, EGA_PALETTE.yellow);
        }
    },
    
    // Scroll
    scroll: {
        width: 16,
        height: 12,
        draw: function(renderer, x, y) {
            // Paper
            renderer.drawRect(x + 2, y + 1, 12, 10, EGA_PALETTE.white);
            // Rolled ends
            renderer.drawCircle(x + 2, y + 6, 2, EGA_PALETTE.white, true);
            renderer.drawCircle(x + 14, y + 6, 2, EGA_PALETTE.white, true);
            // Text lines
            renderer.drawRect(x + 4, y + 3, 8, 1, EGA_PALETTE.darkGray);
            renderer.drawRect(x + 4, y + 5, 6, 1, EGA_PALETTE.darkGray);
            renderer.drawRect(x + 4, y + 7, 7, 1, EGA_PALETTE.darkGray);
        }
    },
    
    // Cauldron
    cauldron: {
        width: 24,
        height: 20,
        draw: function(renderer, x, y, bubbling = false, frame = 0) {
            // Pot body
            renderer.drawEllipse(x + 12, y + 14, 11, 6, EGA_PALETTE.darkGray);
            renderer.drawRect(x + 2, y + 6, 20, 10, EGA_PALETTE.darkGray, true);
            // Rim
            renderer.drawEllipse(x + 12, y + 6, 10, 3, EGA_PALETTE.lightGray);
            // Liquid inside
            renderer.drawEllipse(x + 12, y + 7, 8, 2, EGA_PALETTE.lightGreen);
            // Legs
            renderer.drawRect(x + 4, y + 18, 2, 4, EGA_PALETTE.darkGray);
            renderer.drawRect(x + 18, y + 18, 2, 4, EGA_PALETTE.darkGray);
            // Bubbles
            if (bubbling) {
                const bubbleY = y + 4 - (frame % 4);
                renderer.drawCircle(x + 8 + (frame % 3) * 3, bubbleY, 2, EGA_PALETTE.lightGreen, true);
                renderer.drawCircle(x + 14 - (frame % 2) * 2, bubbleY - 2, 1, EGA_PALETTE.lightGreen, true);
            }
        }
    }
};

// Export for use in other modules
window.EGARenderer = EGARenderer;
window.EGA_PALETTE = EGA_PALETTE;
window.SPRITES = SPRITES;
