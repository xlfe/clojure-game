// Scene Definitions - The LISP Unicorn Quest
// 10 interconnected scenes teaching LISP basics
// Resolution: 384x240 (16:10 aspect ratio)

const GAME_SCENES = {
    // Scene 1: Starting area - Wizard's cottage
    'cottage': {
        id: 'cottage',
        name: "Wizard's Cottage",
        description: "You stand inside a cozy cottage filled with magical books and bubbling potions. Sunlight streams through a small window. An old wizard sits at a cluttered desk, his long beard nearly touching an open spellbook. The door leads OUTSIDE to the east.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Stone floor
            renderer.drawRect(0, 160, W, 80, EGA_PALETTE.darkGray);
            // Floor stones pattern
            for (let y = 160; y < H; y += 18) {
                for (let x = 0; x < W; x += 25) {
                    const offset = ((y - 160) / 18) % 2 === 0 ? 0 : 12;
                    renderer.drawRect(x + offset, y, 23, 16, EGA_PALETTE.lightGray, false);
                }
            }
            
            // Wooden walls with planks
            renderer.drawRect(0, 0, W, 160, EGA_PALETTE.brown);
            for (let y = 0; y < 160; y += 20) {
                renderer.drawLine(0, y, W, y, EGA_PALETTE.darkGray);
            }
            // Wall texture
            for (let i = 0; i < 30; i++) {
                const x = (i * 47) % W;
                const y = (i * 23) % 160;
                renderer.setPixel(x, y, EGA_PALETTE.darkGray);
            }
            
            // Window with curtains
            renderer.drawRect(240, 30, 70, 55, EGA_PALETTE.lightBlue);
            // Window frame
            renderer.drawRect(240, 30, 70, 55, EGA_PALETTE.brown, false);
            renderer.drawLine(275, 30, 275, 85, EGA_PALETTE.brown);
            renderer.drawLine(240, 57, 310, 57, EGA_PALETTE.brown);
            // Curtains
            renderer.drawRect(235, 25, 12, 65, EGA_PALETTE.red);
            renderer.drawRect(308, 25, 12, 65, EGA_PALETTE.red);
            // Curtain rod
            renderer.drawRect(230, 22, 95, 4, EGA_PALETTE.darkGray);
            // Sunbeam
            renderer.bufferCtx.globalAlpha = 0.25;
            renderer.drawPolygon([
                {x: 250, y: 85}, {x: 300, y: 85}, 
                {x: 340, y: 160}, {x: 210, y: 160}
            ], EGA_PALETTE.yellow, true);
            renderer.bufferCtx.globalAlpha = 1;
            
            // Large bookshelf
            renderer.drawRect(10, 20, 80, 130, EGA_PALETTE.brown);
            renderer.drawRect(10, 20, 80, 5, EGA_PALETTE.darkGray);
            // Shelf dividers
            for (let y = 50; y < 150; y += 30) {
                renderer.drawRect(12, y, 76, 3, EGA_PALETTE.darkGray);
            }
            // Books
            const bookColors = [EGA_PALETTE.red, EGA_PALETTE.blue, EGA_PALETTE.green, EGA_PALETTE.magenta, EGA_PALETTE.cyan, EGA_PALETTE.yellow];
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 5; col++) {
                    const color = bookColors[(row + col) % bookColors.length];
                    const bookH = 20 + (col % 3) * 3;
                    renderer.drawRect(16 + col * 14, 27 + row * 30 + (25 - bookH), 11, bookH, color);
                    // Book spine detail
                    renderer.drawLine(16 + col * 14 + 2, 27 + row * 30 + (25 - bookH) + 2, 16 + col * 14 + 2, 27 + row * 30 + 23, EGA_PALETTE.white);
                }
            }
            
            // Large desk
            renderer.drawRect(110, 115, 100, 45, EGA_PALETTE.brown);
            renderer.drawRect(110, 115, 100, 6, EGA_PALETTE.lightGray);
            // Desk legs
            renderer.drawRect(115, 155, 8, 15, EGA_PALETTE.brown);
            renderer.drawRect(197, 155, 8, 15, EGA_PALETTE.brown);
            // Desk drawer
            renderer.drawRect(140, 130, 40, 20, EGA_PALETTE.darkGray, false);
            renderer.drawCircle(160, 140, 2, EGA_PALETTE.yellow, true);
            
            // Cauldron with better detail
            const cx = 330, cy = 150;
            // Cauldron body
            renderer.drawCircle(cx, cy + 8, 18, EGA_PALETTE.darkGray, true);
            renderer.drawRect(cx - 18, cy, 36, 15, EGA_PALETTE.darkGray, true);
            // Rim
            renderer.drawCircle(cx, cy, 16, EGA_PALETTE.lightGray, false);
            // Liquid
            renderer.drawCircle(cx, cy + 2, 13, EGA_PALETTE.lightGreen, true);
            // Bubbles
            const bubbleY = cy - 5 - (frame % 20);
            renderer.drawCircle(cx - 5 + (frame % 10), bubbleY, 3, EGA_PALETTE.lightGreen, true);
            renderer.drawCircle(cx + 3, bubbleY - 5, 2, EGA_PALETTE.lightGreen, true);
            // Legs
            renderer.drawRect(cx - 12, cy + 22, 4, 8, EGA_PALETTE.darkGray);
            renderer.drawRect(cx + 8, cy + 22, 4, 8, EGA_PALETTE.darkGray);
            // Fire underneath
            const fireColors = [EGA_PALETTE.red, EGA_PALETTE.yellow, EGA_PALETTE.lightRed];
            for (let i = 0; i < 5; i++) {
                const fx = cx - 10 + i * 5;
                const fh = 8 + Math.sin(frame * 0.3 + i) * 4;
                renderer.drawTriangle(fx, cy + 30, fx + 3, cy + 30 - fh, fx + 6, cy + 30, fireColors[i % 3], true);
            }
            
            // Glowing spellbook on desk
            const glowIntensity = Math.sin(frame * 0.08) * 0.3 + 0.5;
            renderer.bufferCtx.globalAlpha = glowIntensity * 0.5;
            renderer.drawCircle(150, 105, 20, EGA_PALETTE.lightCyan, true);
            renderer.bufferCtx.globalAlpha = 1;
            SPRITES.book.draw(renderer, 140, 100, EGA_PALETTE.magenta);
            // Runes floating above book
            const runeY = 90 + Math.sin(frame * 0.1) * 3;
            renderer.drawText('( )', 145, runeY, EGA_PALETTE.lightCyan);
            
            // Old wizard NPC - larger and more detailed
            const wx = 165, wy = 100;
            // Robe
            renderer.drawRect(wx, wy + 15, 20, 30, EGA_PALETTE.blue);
            renderer.drawTriangle(wx - 5, wy + 45, wx + 10, wy + 15, wx + 25, wy + 45, EGA_PALETTE.blue, true);
            // Belt
            renderer.drawRect(wx, wy + 25, 20, 3, EGA_PALETTE.yellow);
            // Face
            renderer.drawCircle(wx + 10, wy + 8, 8, EGA_PALETTE.brown, true);
            // Beard
            renderer.drawTriangle(wx + 4, wy + 12, wx + 10, wy + 35, wx + 16, wy + 12, EGA_PALETTE.lightGray, true);
            // Eyes
            renderer.setPixel(wx + 7, wy + 6, EGA_PALETTE.black);
            renderer.setPixel(wx + 13, wy + 6, EGA_PALETTE.black);
            // Wizard hat
            renderer.drawTriangle(wx, wy + 2, wx + 10, wy - 18, wx + 20, wy + 2, EGA_PALETTE.blue, true);
            renderer.drawRect(wx - 3, wy, 26, 4, EGA_PALETTE.blue);
            // Stars on hat
            renderer.setPixel(wx + 8, wy - 8, EGA_PALETTE.yellow);
            renderer.setPixel(wx + 13, wy - 5, EGA_PALETTE.yellow);
            // Staff
            renderer.drawRect(wx + 22, wy, 3, 45, EGA_PALETTE.brown);
            // Crystal on staff
            const crystalGlow = Math.sin(frame * 0.15) > 0;
            renderer.drawCircle(wx + 23, wy - 3, 5, crystalGlow ? EGA_PALETTE.lightCyan : EGA_PALETTE.cyan, true);
            
            // Door (east) - larger
            const dx = 350, dy = 110;
            renderer.drawRect(dx, dy, 28, 50, EGA_PALETTE.brown);
            renderer.drawRect(dx, dy, 28, 3, EGA_PALETTE.darkGray);
            renderer.drawRect(dx, dy, 3, 50, EGA_PALETTE.darkGray);
            renderer.drawRect(dx + 25, dy, 3, 50, EGA_PALETTE.darkGray);
            // Door panels
            renderer.drawRect(dx + 5, dy + 6, 18, 18, EGA_PALETTE.darkGray, false);
            renderer.drawRect(dx + 5, dy + 28, 18, 18, EGA_PALETTE.darkGray, false);
            // Door handle
            renderer.drawCircle(dx + 22, dy + 28, 3, EGA_PALETTE.yellow, true);
            
            // Candles on desk
            for (let i = 0; i < 2; i++) {
                const candleX = 120 + i * 70;
                renderer.drawRect(candleX, 98, 5, 12, EGA_PALETTE.white);
                const flicker = Math.sin(frame * 0.4 + i * 2) > 0;
                renderer.drawCircle(candleX + 2, 94, 4, flicker ? EGA_PALETTE.yellow : EGA_PALETTE.lightRed, true);
                // Candle glow
                renderer.bufferCtx.globalAlpha = 0.2;
                renderer.drawCircle(candleX + 2, 94, 10, EGA_PALETTE.yellow, true);
                renderer.bufferCtx.globalAlpha = 1;
            }
            
            // Hanging herbs
            for (let i = 0; i < 3; i++) {
                const hx = 100 + i * 30;
                renderer.drawLine(hx, 0, hx, 15, EGA_PALETTE.brown);
                renderer.drawCircle(hx, 18, 5, EGA_PALETTE.green, true);
            }
        },
        
        objects: [
            {
                id: 'spellbook',
                name: 'glowing spellbook',
                aliases: ['book', 'spellbook', 'glowing book'],
                description: 'A thick book with golden runes on the cover. It glows faintly with magical energy. The title reads "LISP: Language of Infinite Sorcery Power".',
                canTake: false,
                cantTakeMessage: 'The wizard is still reading it. Maybe you should TALK TO the WIZARD first.',
                readable: true,
                readText: 'The book is open to a page that says: "LISP uses parentheses for all magic. To add numbers, write (+ 3 4) - the spell goes FIRST, then the ingredients!"'
            },
            {
                id: 'cauldron',
                name: 'bubbling cauldron',
                aliases: ['cauldron', 'pot'],
                description: 'A black iron cauldron bubbles with a mysterious green liquid. Occasionally, numbers float up from the surface: 1, 1, 2, 3, 5, 8...',
                canTake: false
            }
        ],
        
        npcs: [
            {
                id: 'wizard',
                name: 'Old Wizard Parenthesis',
                dialogue: {
                    default: "Ah, young apprentice! I am Wizard Parenthesis. The Doughnut Kingdom is in trouble! The evil Bug has cursed the Rainbow Bridge, and only LISP magic can restore it. But first, you must learn the basics. Are you ready to learn the most powerful magic in all the realm?",
                    conditions: [
                        {
                            flag: 'talkedToWizard',
                            value: true,
                            text: "Remember, LISP puts the spell FIRST! Instead of writing 3 + 4, we write (+ 3 4). Go EAST outside and practice at the Magic Terminal. The unicorn Sparkle awaits you!"
                        },
                        {
                            flag: 'learnedBasicLisp',
                            value: true,
                            text: "Excellent progress! You've learned basic arithmetic. Now go help Sparkle the Unicorn! She's to the NORTH in the meadow."
                        },
                        {
                            flag: 'bridgeBuilt',
                            value: true,
                            text: "You've rebuilt the Rainbow Bridge! Now cross it to face the final challenge in the Doughnut Kingdom!"
                        }
                    ]
                },
                setsFlag: 'talkedToWizard',
                points: 5,
                startsPuzzle: null
            }
        ],
        
        exits: {
            east: {
                scene: 'garden',
                message: 'You step outside into the bright garden.',
                requiresFlag: 'talkedToWizard',
                blockedMessage: 'You should talk to the wizard first. Type: TALK TO WIZARD'
            },
            outside: {
                scene: 'garden',
                requiresFlag: 'talkedToWizard',
                blockedMessage: 'You should talk to the wizard first.'
            }
        }
    },
    
    // Scene 2: Garden with magic terminal
    'garden': {
        id: 'garden',
        name: 'Cottage Garden',
        description: "You're in a lovely garden outside the cottage. Colorful flowers bloom everywhere, and butterflies dance in the air. A strange glowing stone tablet - a MAGIC TERMINAL - stands in the center. Paths lead WEST back to the cottage, NORTH to a meadow, and EAST toward a forest.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Sky gradient with clouds
            for (let y = 0; y < 100; y++) {
                const ratio = y / 100;
                const r = Math.floor(0 + ratio * 85);
                const g = Math.floor(0 + ratio * 85);
                const b = Math.floor(170 + ratio * 85);
                renderer.bufferCtx.fillStyle = `rgb(${r},${g},${b})`;
                renderer.bufferCtx.fillRect(0, y, W, 1);
            }
            
            // Sun
            renderer.drawCircle(50, 35, 20, EGA_PALETTE.yellow, true);
            // Sun rays
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + frame * 0.005;
                const x1 = 50 + Math.cos(angle) * 25;
                const y1 = 35 + Math.sin(angle) * 25;
                const x2 = 50 + Math.cos(angle) * 35;
                const y2 = 35 + Math.sin(angle) * 35;
                renderer.drawLine(x1, y1, x2, y2, EGA_PALETTE.yellow);
            }
            
            // Fluffy clouds
            const drawCloud = (x, y, scale) => {
                renderer.drawCircle(x, y, 12 * scale, EGA_PALETTE.white, true);
                renderer.drawCircle(x - 12 * scale, y + 4 * scale, 9 * scale, EGA_PALETTE.white, true);
                renderer.drawCircle(x + 12 * scale, y + 4 * scale, 9 * scale, EGA_PALETTE.white, true);
                renderer.drawCircle(x + 6 * scale, y - 5 * scale, 8 * scale, EGA_PALETTE.white, true);
                renderer.drawCircle(x - 6 * scale, y - 3 * scale, 7 * scale, EGA_PALETTE.white, true);
            };
            drawCloud(120 + (frame * 0.1) % 50, 30, 1);
            drawCloud(280 - (frame * 0.05) % 40, 45, 0.8);
            drawCloud(200, 25, 0.6);
            
            // Distant mountains with snow caps
            renderer.drawTriangle(280, 120, 340, 50, 400, 120, EGA_PALETTE.darkGray, true);
            renderer.drawTriangle(310, 70, 340, 50, 370, 70, EGA_PALETTE.white, true);
            renderer.drawTriangle(220, 120, 280, 70, 340, 120, EGA_PALETTE.lightGray, true);
            renderer.drawTriangle(250, 85, 280, 70, 310, 85, EGA_PALETTE.white, true);
            
            // Rolling hills
            renderer.drawCircle(100, 160, 80, EGA_PALETTE.green, true);
            renderer.drawRect(0, 140, 180, 100, EGA_PALETTE.green);
            renderer.drawCircle(300, 155, 70, EGA_PALETTE.lightGreen, true);
            renderer.drawRect(230, 140, 154, 100, EGA_PALETTE.lightGreen);
            
            // Main ground
            renderer.drawRect(0, 140, W, 100, EGA_PALETTE.green);
            
            // Grass blades
            for (let i = 0; i < 80; i++) {
                const x = (i * 5 + frame * 0.5) % W;
                const y = 145 + (i * 7) % 90;
                const h = 4 + (i % 4);
                const sway = Math.sin(frame * 0.05 + i * 0.3) * 2;
                renderer.drawLine(x, y, x + sway, y - h, EGA_PALETTE.lightGreen);
            }
            
            // Flower patches with variety
            const flowerTypes = [
                { color: EGA_PALETTE.red, center: EGA_PALETTE.yellow },
                { color: EGA_PALETTE.yellow, center: EGA_PALETTE.brown },
                { color: EGA_PALETTE.lightMagenta, center: EGA_PALETTE.yellow },
                { color: EGA_PALETTE.lightBlue, center: EGA_PALETTE.white },
                { color: EGA_PALETTE.white, center: EGA_PALETTE.yellow }
            ];
            for (let i = 0; i < 35; i++) {
                const x = 15 + (i * 11) % (W - 30);
                const y = 155 + (i * 13) % 75;
                const ft = flowerTypes[i % flowerTypes.length];
                // Stem
                renderer.drawLine(x, y + 4, x, y + 12, EGA_PALETTE.green);
                // Petals
                renderer.drawCircle(x, y, 4, ft.color, true);
                // Center
                renderer.setPixel(x, y, ft.center);
                // Leaves
                if (i % 3 === 0) {
                    renderer.drawCircle(x - 3, y + 8, 2, EGA_PALETTE.green, true);
                    renderer.drawCircle(x + 3, y + 8, 2, EGA_PALETTE.green, true);
                }
            }
            
            // Stone path
            for (let i = 0; i < 8; i++) {
                const px = 10 + i * 12;
                const py = 180 + Math.sin(i * 0.5) * 3;
                renderer.drawCircle(px, py, 6, EGA_PALETTE.lightGray, true);
                renderer.drawCircle(px, py, 6, EGA_PALETTE.darkGray, false);
            }
            
            // Cottage in background (west)
            renderer.drawRect(5, 100, 70, 55, EGA_PALETTE.brown);
            renderer.drawTriangle(0, 100, 40, 60, 80, 100, EGA_PALETTE.red, true);
            renderer.drawRect(25, 120, 20, 35, EGA_PALETTE.darkGray);
            renderer.drawRect(55, 110, 15, 15, EGA_PALETTE.lightBlue);
            // Chimney
            renderer.drawRect(60, 55, 12, 25, EGA_PALETTE.darkGray);
            // Smoke
            for (let i = 0; i < 3; i++) {
                const sy = 45 - i * 12 - (frame * 0.3) % 20;
                const sx = 66 + Math.sin(frame * 0.05 + i) * 5;
                renderer.drawCircle(sx, sy, 4 + i, EGA_PALETTE.lightGray, true);
            }
            
            // Magic terminal - more detailed
            const tx = 180, ty = 145;
            // Stone pedestal
            renderer.drawRect(tx - 5, ty + 25, 50, 15, EGA_PALETTE.lightGray);
            renderer.drawRect(tx, ty + 10, 40, 20, EGA_PALETTE.darkGray);
            // Terminal screen
            renderer.drawRect(tx + 2, ty - 15, 36, 28, EGA_PALETTE.black);
            renderer.drawRect(tx + 4, ty - 13, 32, 24, EGA_PALETTE.blue);
            // Screen content
            renderer.drawRect(tx + 8, ty - 8, 15, 2, EGA_PALETTE.lightGreen);
            renderer.drawRect(tx + 8, ty - 3, 20, 2, EGA_PALETTE.lightGreen);
            // Blinking cursor
            if (frame % 30 < 15) {
                renderer.drawRect(tx + 8, ty + 3, 6, 2, EGA_PALETTE.lightGreen);
            }
            // Magical glow
            const glowPulse = Math.sin(frame * 0.08) * 0.2 + 0.4;
            renderer.bufferCtx.globalAlpha = glowPulse;
            renderer.drawCircle(tx + 20, ty + 5, 35, EGA_PALETTE.lightCyan, true);
            renderer.bufferCtx.globalAlpha = 1;
            // Floating runes
            for (let i = 0; i < 4; i++) {
                const angle = frame * 0.02 + (i / 4) * Math.PI * 2;
                const rx = tx + 20 + Math.cos(angle) * 30;
                const ry = ty + 5 + Math.sin(angle) * 15;
                renderer.drawText(['(', ')', '+', '*'][i], rx, ry, EGA_PALETTE.lightCyan);
            }
            
            // Butterflies
            for (let i = 0; i < 3; i++) {
                const bx = 100 + i * 80 + Math.sin(frame * 0.04 + i * 2) * 30;
                const by = 120 + Math.cos(frame * 0.06 + i) * 20;
                const wingSpread = Math.abs(Math.sin(frame * 0.2 + i)) * 4;
                renderer.setPixel(bx, by, EGA_PALETTE.lightMagenta);
                renderer.setPixel(bx - wingSpread, by - 1, EGA_PALETTE.lightMagenta);
                renderer.setPixel(bx + wingSpread, by - 1, EGA_PALETTE.lightMagenta);
            }
            
            // Direction sign
            renderer.drawRect(320, 160, 4, 40, EGA_PALETTE.brown);
            renderer.drawRect(280, 155, 50, 18, EGA_PALETTE.brown);
            renderer.drawText('N', 300, 158, EGA_PALETTE.white);
            renderer.drawTriangle(325, 165, 335, 155, 335, 175, EGA_PALETTE.brown, true);
        },
        
        objects: [
            {
                id: 'terminal',
                name: 'Magic Terminal',
                aliases: ['terminal', 'tablet', 'stone', 'computer'],
                description: 'A glowing stone tablet covered in mysterious runes. It hums with magical energy. You can USE it to practice LISP magic!',
                canTake: false
            },
            {
                id: 'flower',
                name: 'rainbow flower',
                aliases: ['flower', 'flowers'],
                description: 'Beautiful flowers of every color. One particularly sparkly flower catches your eye.',
                canTake: true,
                takeMessage: 'You carefully pick the sparkliest flower. It glows softly in your hand.',
                points: 5
            }
        ],
        
        useInteractions: [
            {
                item: 'terminal',
                message: 'The terminal glows brighter as you touch it. Type LISP commands to practice magic!\n\nTry this: (+ 3 4)',
                startsPuzzle: 'add-spell'
            }
        ],
        
        npcs: [],
        
        exits: {
            west: { scene: 'cottage', message: 'You enter the cozy cottage.' },
            north: { scene: 'meadow', message: 'You walk north toward the meadow.' },
            east: { 
                scene: 'forest-edge', 
                message: 'You head east toward the forest.',
                requiresFlag: 'learnedBasicLisp',
                blockedMessage: 'You should learn basic LISP at the terminal first. USE TERMINAL and try: (+ 3 4)'
            },
            enter: { scene: 'cottage', message: 'You enter the cottage.' }
        }
    },
    
    // Scene 3: Meadow with unicorn
    'meadow': {
        id: 'meadow',
        name: 'Unicorn Meadow',
        description: "A beautiful meadow filled with soft grass and wildflowers. In the center stands SPARKLE, a magnificent unicorn with a rainbow mane! Her horn glimmers with magic. A sign nearby mentions something about a Rainbow Bridge to the NORTH, but it looks broken. The garden is to the SOUTH.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Beautiful sky gradient
            for (let y = 0; y < 80; y++) {
                const ratio = y / 80;
                renderer.bufferCtx.fillStyle = `rgb(${85 + ratio * 85}, ${170 + ratio * 50}, ${255})`;
                renderer.bufferCtx.fillRect(0, y, W, 1);
            }
            
            // Large sun with glow
            renderer.bufferCtx.globalAlpha = 0.3;
            renderer.drawCircle(330, 40, 35, EGA_PALETTE.yellow, true);
            renderer.bufferCtx.globalAlpha = 1;
            renderer.drawCircle(330, 40, 22, EGA_PALETTE.yellow, true);
            renderer.drawCircle(330, 40, 18, EGA_PALETTE.white, true);
            
            // Clouds
            const drawFluffyCloud = (cx, cy, s) => {
                renderer.drawCircle(cx, cy, 10 * s, EGA_PALETTE.white, true);
                renderer.drawCircle(cx - 10 * s, cy + 3 * s, 8 * s, EGA_PALETTE.white, true);
                renderer.drawCircle(cx + 10 * s, cy + 3 * s, 8 * s, EGA_PALETTE.white, true);
                renderer.drawCircle(cx + 5 * s, cy - 4 * s, 6 * s, EGA_PALETTE.white, true);
            };
            drawFluffyCloud(80, 35, 1.2);
            drawFluffyCloud(220, 25, 0.9);
            
            // Distant gentle hills
            renderer.drawCircle(80, 130, 70, EGA_PALETTE.green, true);
            renderer.drawRect(0, 115, 150, 125, EGA_PALETTE.green);
            renderer.drawCircle(300, 125, 80, EGA_PALETTE.lightGreen, true);
            renderer.drawRect(220, 115, 164, 125, EGA_PALETTE.lightGreen);
            
            // Rainbow bridge in distance
            const bridgeY = 80;
            if (!window.game?.flags?.bridgeBuilt) {
                // Broken bridge pieces
                renderer.drawRect(140, bridgeY, 50, 12, EGA_PALETTE.red);
                renderer.drawRect(145, bridgeY - 4, 40, 4, EGA_PALETTE.yellow);
                renderer.drawRect(210, bridgeY, 50, 12, EGA_PALETTE.blue);
                renderer.drawRect(215, bridgeY - 4, 40, 4, EGA_PALETTE.green);
                // Gap
                renderer.drawRect(185, bridgeY - 5, 30, 25, EGA_PALETTE.lightBlue);
                renderer.drawText('?', 197, bridgeY + 5, EGA_PALETTE.white);
                // Broken sparkles
                renderer.drawSparkle(175, bridgeY + 5, frame);
                renderer.drawSparkle(220, bridgeY + 5, frame + 10);
            } else {
                // Complete rainbow bridge!
                const rainbowColors = [EGA_PALETTE.red, EGA_PALETTE.lightRed, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.green, EGA_PALETTE.cyan, EGA_PALETTE.lightBlue, EGA_PALETTE.blue, EGA_PALETTE.magenta];
                for (let i = 0; i < rainbowColors.length; i++) {
                    renderer.drawRect(130, bridgeY - 8 + i * 3, 140, 3, rainbowColors[i]);
                }
                // Sparkles along bridge
                for (let i = 0; i < 8; i++) {
                    const sx = 140 + i * 16 + Math.sin(frame * 0.1 + i) * 3;
                    const sy = bridgeY + Math.cos(frame * 0.08 + i) * 5;
                    renderer.drawSparkle(sx, sy, frame + i * 5);
                }
            }
            
            // Main meadow ground
            renderer.drawRect(0, 130, W, 110, EGA_PALETTE.green);
            
            // Grass texture and wildflowers
            for (let i = 0; i < 100; i++) {
                const x = (i * 4) % W;
                const y = 135 + (i * 9) % 100;
                const h = 5 + (i % 5);
                const sway = Math.sin(frame * 0.03 + i * 0.2) * 2;
                renderer.drawLine(x, y, x + sway, y - h, EGA_PALETTE.lightGreen);
            }
            
            // Wildflowers scattered
            const wildflowers = [EGA_PALETTE.yellow, EGA_PALETTE.white, EGA_PALETTE.lightMagenta, EGA_PALETTE.lightRed];
            for (let i = 0; i < 40; i++) {
                const x = 10 + (i * 10) % (W - 20);
                const y = 145 + (i * 11) % 85;
                renderer.drawCircle(x, y, 2, wildflowers[i % wildflowers.length], true);
            }
            
            // Unicorn Sparkle - larger and more detailed
            const ux = 160, uy = 150;
            
            // Body
            renderer.drawCircle(ux + 20, uy + 15, 22, EGA_PALETTE.white, true);
            renderer.drawRect(ux + 5, uy + 5, 35, 22, EGA_PALETTE.white, true);
            
            // Legs with hooves
            for (let i = 0; i < 4; i++) {
                const lx = ux + 8 + i * 10;
                renderer.drawRect(lx, uy + 25, 5, 15, EGA_PALETTE.white);
                renderer.drawRect(lx - 1, uy + 38, 7, 4, EGA_PALETTE.lightGray);
            }
            
            // Neck and head
            renderer.drawRect(ux + 35, uy, 10, 20, EGA_PALETTE.white);
            renderer.drawCircle(ux + 48, uy + 3, 10, EGA_PALETTE.white, true);
            
            // Eye
            renderer.drawCircle(ux + 52, uy + 1, 3, EGA_PALETTE.lightMagenta, true);
            renderer.setPixel(ux + 53, uy, EGA_PALETTE.white);
            
            // Ear
            renderer.drawTriangle(ux + 45, uy - 5, ux + 48, uy - 12, ux + 51, uy - 5, EGA_PALETTE.white, true);
            
            // Horn (rainbow magic!)
            const hornColors = [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightCyan, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen];
            const hornColor = hornColors[Math.floor(frame / 8) % hornColors.length];
            renderer.drawLine(ux + 52, uy - 5, ux + 60, uy - 22, hornColor);
            renderer.drawLine(ux + 53, uy - 5, ux + 61, uy - 22, hornColor);
            // Horn sparkle
            renderer.drawSparkle(ux + 61, uy - 24, frame);
            
            // Rainbow mane
            const maneColors = [EGA_PALETTE.red, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta];
            for (let i = 0; i < maneColors.length; i++) {
                const waveOffset = Math.sin(frame * 0.1 + i * 0.5) * 3;
                renderer.drawLine(ux + 35 - i * 3, uy + i * 3, ux + 25 + waveOffset - i * 4, uy + 5 + i * 4, maneColors[i]);
                renderer.drawLine(ux + 36 - i * 3, uy + i * 3, ux + 26 + waveOffset - i * 4, uy + 5 + i * 4, maneColors[i]);
            }
            
            // Rainbow tail
            for (let i = 0; i < maneColors.length; i++) {
                const waveOffset = Math.sin(frame * 0.08 + i * 0.6) * 4;
                renderer.drawLine(ux, uy + 15, ux - 15 + waveOffset, uy + 12 + i * 4, maneColors[i]);
            }
            
            // Sparkles around unicorn
            for (let i = 0; i < 5; i++) {
                const sx = ux + 25 + Math.sin(frame * 0.06 + i * 1.5) * 50;
                const sy = uy + 10 + Math.cos(frame * 0.08 + i * 1.5) * 25;
                renderer.drawSparkle(sx, sy, frame + i * 7);
            }
            
            // Sign post
            renderer.drawRect(60, 155, 6, 50, EGA_PALETTE.brown);
            renderer.drawRect(30, 148, 70, 25, EGA_PALETTE.brown);
            renderer.drawRect(32, 150, 66, 21, EGA_PALETTE.white);
            renderer.drawText('BRIDGE', 40, 153, EGA_PALETTE.brown);
            renderer.drawText('NORTH', 45, 163, EGA_PALETTE.blue);
        },
        
        objects: [
            {
                id: 'sign',
                name: 'wooden sign',
                aliases: ['sign', 'signpost'],
                description: 'The sign reads: "Rainbow Bridge - NORTH. Warning: Bridge damaged! Requires LISP magic to repair."',
                canTake: false
            }
        ],
        
        npcs: [
            {
                id: 'unicorn',
                name: 'Sparkle the Unicorn',
                dialogue: {
                    default: "Hello, young wizard! I am Sparkle. *The unicorn bows gracefully* The Rainbow Bridge to the Doughnut Kingdom is broken! To repair it, we need to calculate the rainbow sum. But I'm so hungry... I haven't had a doughnut in ages!",
                    conditions: [
                        {
                            flag: 'fedUnicorn',
                            value: true,
                            text: "Thank you for the doughnut! *munches happily* Now, use the LISP terminal in the garden to calculate the rainbow sum: (+ 1 2 3 4 5 6 7). That's all 7 colors! Return here when you've done it."
                        },
                        {
                            flag: 'bridgeBuilt',
                            value: true,
                            text: "The bridge is repaired! Go NORTH to the Doughnut Kingdom. I'll wait here and guard the meadow. Good luck, young wizard!"
                        }
                    ]
                },
                wantsItem: 'doughnut',
                giveResponse: "*Sparkle's eyes light up* A DOUGHNUT! Oh thank you, thank you! *She gobbles it up, and her horn glows brighter* Now I have the strength to help you! Go use the terminal and add up all 7 rainbow colors: (+ 1 2 3 4 5 6 7). The sum will repair the bridge!",
                giveFlag: 'fedUnicorn',
                givePoints: 15,
                setsFlag: 'metUnicorn',
                points: 5
            }
        ],
        
        exits: {
            south: { scene: 'garden', message: 'You walk back to the garden.' },
            north: { 
                scene: 'rainbow-bridge', 
                message: 'You approach the Rainbow Bridge...',
                requiresFlag: 'bridgeBuilt',
                blockedMessage: 'The Rainbow Bridge is broken! Sparkle says you need to calculate the rainbow sum at the terminal: (+ 1 2 3 4 5 6 7)'
            }
        }
    },
    
    // Scene 4: Forest Edge - Find doughnuts
    'forest-edge': {
        id: 'forest-edge',
        name: 'Forest Edge',
        description: "You stand at the edge of a dark forest. Tall trees cast long shadows. A small BAKERY STAND sits by the path, selling delicious doughnuts! A friendly baker waves at you. The path continues EAST into the forest depths. The garden is back to the WEST.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Darker sky through trees
            renderer.drawRect(0, 0, W, 120, EGA_PALETTE.blue);
            renderer.drawRect(0, 0, W, 40, EGA_PALETTE.black);
            
            // Visible stars
            for (let i = 0; i < 15; i++) {
                const x = (i * 27) % W;
                const y = 5 + (i * 7) % 35;
                renderer.setPixel(x, y, EGA_PALETTE.white);
            }
            
            // Background trees silhouettes
            for (let i = 0; i < 12; i++) {
                const x = i * 35;
                const h = 70 + (i % 4) * 20;
                renderer.drawTriangle(x, 120, x + 17, 120 - h, x + 34, 120, EGA_PALETTE.darkGray, true);
            }
            
            // Ground
            renderer.drawRect(0, 120, W, 120, EGA_PALETTE.green);
            // Darker forest floor patches
            for (let i = 0; i < 20; i++) {
                const x = (i * 21) % W;
                const y = 130 + (i * 13) % 100;
                renderer.drawCircle(x, y, 8, EGA_PALETTE.brown, true);
            }
            
            // Fallen leaves
            const leafColors = [EGA_PALETTE.brown, EGA_PALETTE.yellow, EGA_PALETTE.red];
            for (let i = 0; i < 30; i++) {
                const x = (i * 13) % W;
                const y = 125 + (i * 9) % 110;
                renderer.setPixel(x, y, leafColors[i % 3]);
                renderer.setPixel(x + 1, y, leafColors[i % 3]);
            }
            
            // Bakery stand - larger and more detailed
            const bx = 90, by = 125;
            // Stand structure
            renderer.drawRect(bx, by, 100, 65, EGA_PALETTE.brown);
            // Awning with stripes
            for (let i = 0; i < 5; i++) {
                const color = i % 2 === 0 ? EGA_PALETTE.red : EGA_PALETTE.white;
                renderer.drawRect(bx + i * 20, by - 15, 20, 18, color);
            }
            // Counter
            renderer.drawRect(bx + 5, by + 10, 90, 8, EGA_PALETTE.white);
            
            // Sign
            renderer.drawRect(bx + 15, by - 35, 70, 22, EGA_PALETTE.white);
            renderer.drawRect(bx + 17, by - 33, 66, 18, EGA_PALETTE.lightMagenta);
            renderer.drawText('DONUTS', bx + 22, by - 30, EGA_PALETTE.white);
            
            // Doughnuts on display
            const doughnutTypes = ['pink', 'chocolate', 'rainbow', 'magic'];
            for (let i = 0; i < 4; i++) {
                const dx = bx + 15 + i * 22;
                const dy = by + 2;
                SPRITES.doughnut.draw(renderer, dx, dy, doughnutTypes[i]);
                // Sparkle on magic doughnut
                if (i === 3) {
                    renderer.drawSparkle(dx + 8, dy - 3, frame);
                }
            }
            
            // Baker character
            const bakX = bx + 50, bakY = by + 35;
            // Body with apron
            renderer.drawRect(bakX - 8, bakY, 16, 25, EGA_PALETTE.white);
            renderer.drawRect(bakX - 6, bakY + 5, 12, 18, EGA_PALETTE.lightGray);
            // Head
            renderer.drawCircle(bakX, bakY - 8, 10, EGA_PALETTE.brown, true);
            // Chef hat
            renderer.drawRect(bakX - 10, bakY - 25, 20, 12, EGA_PALETTE.white);
            renderer.drawRect(bakX - 12, bakY - 14, 24, 4, EGA_PALETTE.white);
            // Face
            renderer.setPixel(bakX - 3, bakY - 10, EGA_PALETTE.black);
            renderer.setPixel(bakX + 3, bakY - 10, EGA_PALETTE.black);
            renderer.drawLine(bakX - 3, bakY - 5, bakX + 3, bakY - 5, EGA_PALETTE.black);
            // Waving arm
            const waveAngle = Math.sin(frame * 0.1) * 0.3;
            renderer.drawLine(bakX + 8, bakY + 5, bakX + 18 + waveAngle * 10, bakY - 5, EGA_PALETTE.brown);
            
            // Foreground trees
            const drawTree = (x, y, scale) => {
                // Trunk
                renderer.drawRect(x - 5 * scale, y - 15 * scale, 10 * scale, 20 * scale, EGA_PALETTE.brown);
                // Foliage layers
                for (let i = 0; i < 3; i++) {
                    const layerW = (30 - i * 8) * scale;
                    const layerH = 20 * scale;
                    renderer.drawTriangle(
                        x - layerW / 2, y - 15 * scale - i * 15 * scale,
                        x, y - 15 * scale - i * 15 * scale - layerH,
                        x + layerW / 2, y - 15 * scale - i * 15 * scale,
                        EGA_PALETTE.green, true
                    );
                }
            };
            drawTree(30, 200, 2);
            drawTree(340, 195, 2.2);
            drawTree(370, 210, 1.5);
            
            // Path going east
            renderer.drawRect(250, 170, 134, 40, EGA_PALETTE.brown);
            renderer.drawRect(250, 175, 134, 30, EGA_PALETTE.lightGray);
            
            // Mushrooms
            for (let i = 0; i < 3; i++) {
                const mx = 220 + i * 25;
                const my = 210;
                renderer.drawRect(mx + 2, my, 4, 6, EGA_PALETTE.white);
                renderer.drawCircle(mx + 4, my - 2, 6, EGA_PALETTE.red, true);
                renderer.setPixel(mx + 2, my - 4, EGA_PALETTE.white);
                renderer.setPixel(mx + 6, my - 3, EGA_PALETTE.white);
            }
        },
        
        objects: [
            {
                id: 'doughnut',
                name: 'magic doughnut',
                aliases: ['doughnut', 'donut', 'pastry'],
                description: 'A delicious-looking doughnut with pink frosting and rainbow sprinkles. It sparkles with a faint magical glow!',
                canTake: true,
                takeMessage: 'The baker smiles as you take a doughnut. "For a young wizard, no charge! These magic doughnuts are made with LISP-powered ovens!"',
                points: 5
            },
            {
                id: 'bakery',
                name: 'bakery stand',
                aliases: ['bakery', 'stand', 'shop'],
                description: 'A charming wooden stand selling fresh doughnuts. A sign says "Powered by LISP Magic - We multiply flour by love!"',
                canTake: false
            }
        ],
        
        npcs: [
            {
                id: 'baker',
                name: 'Friendly Baker',
                dialogue: {
                    default: "Welcome, young wizard! Try our famous magic doughnuts! Did you know? I use LISP to calculate my recipes! If I have 6 boxes with 12 doughnuts each, that's (* 6 12) = 72 doughnuts!",
                    conditions: [
                        {
                            flag: 'fedUnicorn',
                            value: true,
                            text: "I heard you fed Sparkle the Unicorn! Such kindness! Take another doughnut for your journey. The Deep Forest to the east has a treasure chest, but you'll need to solve a puzzle!"
                        }
                    ]
                }
            }
        ],
        
        exits: {
            west: { scene: 'garden', message: 'You walk back to the garden.' },
            east: { scene: 'deep-forest', message: 'You venture deeper into the forest...' }
        }
    },
    
    // Scene 5: Deep Forest - Chest puzzle
    'deep-forest': {
        id: 'deep-forest',
        name: 'Deep Forest',
        description: "The forest grows darker here. Ancient trees tower above, their branches blocking most sunlight. You spot a mysterious TREASURE CHEST half-hidden among the roots. Strange glowing MUSHROOMS provide the only light. A MAGIC TERMINAL is embedded in an old tree stump. The path leads WEST back toward the bakery and NORTH to a clearing.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Very dark background
            renderer.clear(EGA_PALETTE.black);
            
            // Faint stars through canopy
            for (let i = 0; i < 25; i++) {
                const x = (i * 17 + frame * 0.2) % W;
                const y = 5 + (i * 9) % 60;
                if (Math.sin(frame * 0.05 + i) > 0.3) {
                    renderer.setPixel(x, y, EGA_PALETTE.lightGray);
                }
            }
            
            // Canopy silhouette
            for (let x = 0; x < W; x += 3) {
                const h = 40 + Math.sin(x * 0.05) * 15 + Math.cos(x * 0.08) * 10;
                renderer.drawRect(x, 0, 3, h, EGA_PALETTE.darkGray);
            }
            
            // Forest floor
            renderer.drawRect(0, 150, W, 90, EGA_PALETTE.darkGray);
            
            // Massive tree trunks
            renderer.drawRect(0, 60, 45, 180, EGA_PALETTE.brown);
            renderer.drawRect(80, 50, 35, 190, EGA_PALETTE.brown);
            renderer.drawRect(320, 55, 50, 185, EGA_PALETTE.brown);
            renderer.drawRect(250, 90, 30, 150, EGA_PALETTE.brown);
            
            // Tree bark texture
            for (let i = 0; i < 50; i++) {
                const tx = [20, 95, 340, 265][i % 4];
                const ty = 70 + (i * 7) % 120;
                renderer.drawLine(tx, ty, tx + 5, ty + 8, EGA_PALETTE.darkGray);
            }
            
            // Roots
            renderer.drawLine(45, 200, 80, 190, EGA_PALETTE.brown);
            renderer.drawLine(80, 185, 120, 210, EGA_PALETTE.brown);
            renderer.drawLine(320, 195, 290, 220, EGA_PALETTE.brown);
            renderer.drawLine(250, 200, 220, 215, EGA_PALETTE.brown);
            
            // Glowing mushrooms with better glow effect
            const drawGlowMushroom = (x, y, color, size) => {
                const glow = Math.sin(frame * 0.08 + x * 0.1) * 0.3 + 0.7;
                // Glow
                renderer.bufferCtx.globalAlpha = glow * 0.4;
                renderer.drawCircle(x, y - 5, size * 2.5, color, true);
                renderer.bufferCtx.globalAlpha = 1;
                // Stem
                renderer.drawRect(x - 2, y, 4, size, EGA_PALETTE.white);
                // Cap
                renderer.drawCircle(x, y - 3, size, color, true);
                // Cap shine
                renderer.setPixel(x - 2, y - 5, EGA_PALETTE.white);
            };
            
            drawGlowMushroom(130, 190, EGA_PALETTE.lightCyan, 8);
            drawGlowMushroom(300, 200, EGA_PALETTE.lightMagenta, 6);
            drawGlowMushroom(200, 205, EGA_PALETTE.lightGreen, 5);
            drawGlowMushroom(160, 210, EGA_PALETTE.cyan, 4);
            drawGlowMushroom(280, 215, EGA_PALETTE.magenta, 5);
            
            // Treasure chest - more detailed
            const chestOpen = window.game?.flags?.chestsOpened > 0;
            const cx = 170, cy = 165;
            
            // Chest body
            renderer.drawRect(cx, cy + 12, 40, 20, EGA_PALETTE.brown);
            // Metal bands
            renderer.drawRect(cx, cy + 12, 40, 3, EGA_PALETTE.yellow);
            renderer.drawRect(cx + 17, cy + 12, 6, 20, EGA_PALETTE.yellow);
            
            if (chestOpen) {
                // Open lid
                renderer.drawRect(cx, cy, 40, 10, EGA_PALETTE.brown);
                renderer.drawRect(cx, cy, 40, 3, EGA_PALETTE.yellow);
                // Treasure inside
                renderer.drawCircle(cx + 12, cy + 20, 5, EGA_PALETTE.yellow, true);
                renderer.drawCircle(cx + 28, cy + 20, 5, EGA_PALETTE.yellow, true);
                // Golden glow
                renderer.bufferCtx.globalAlpha = 0.4;
                renderer.drawCircle(cx + 20, cy + 15, 20, EGA_PALETTE.yellow, true);
                renderer.bufferCtx.globalAlpha = 1;
                // Sparkles
                renderer.drawSparkle(cx + 15, cy + 10, frame);
                renderer.drawSparkle(cx + 25, cy + 8, frame + 5);
            } else {
                // Closed lid
                renderer.drawRect(cx, cy + 5, 40, 10, EGA_PALETTE.brown);
                renderer.drawRect(cx, cy + 5, 40, 3, EGA_PALETTE.yellow);
                // Lock
                renderer.drawRect(cx + 16, cy + 10, 8, 10, EGA_PALETTE.yellow);
                renderer.drawCircle(cx + 20, cy + 8, 4, EGA_PALETTE.yellow, false);
            }
            
            // Terminal in tree stump
            const tx = 280, ty = 140;
            // Stump
            renderer.drawCircle(tx + 20, ty + 35, 25, EGA_PALETTE.brown, true);
            renderer.drawRect(tx, ty + 10, 40, 30, EGA_PALETTE.brown);
            // Terminal
            renderer.drawRect(tx + 5, ty - 10, 30, 25, EGA_PALETTE.darkGray);
            renderer.drawRect(tx + 7, ty - 8, 26, 20, EGA_PALETTE.black);
            renderer.drawRect(tx + 9, ty - 6, 22, 16, EGA_PALETTE.blue);
            // Screen text
            renderer.drawRect(tx + 12, ty - 2, 10, 2, EGA_PALETTE.lightGreen);
            renderer.drawRect(tx + 12, ty + 3, 14, 2, EGA_PALETTE.lightGreen);
            // Glow
            const termGlow = Math.sin(frame * 0.1) * 0.2 + 0.3;
            renderer.bufferCtx.globalAlpha = termGlow;
            renderer.drawCircle(tx + 20, ty + 5, 25, EGA_PALETTE.lightCyan, true);
            renderer.bufferCtx.globalAlpha = 1;
            
            // Mysterious fog at bottom
            renderer.bufferCtx.globalAlpha = 0.25;
            for (let y = 215; y < H; y += 5) {
                renderer.drawRect(0, y, W, 5, EGA_PALETTE.lightGray);
            }
            renderer.bufferCtx.globalAlpha = 1;
            
            // Fireflies
            for (let i = 0; i < 6; i++) {
                const fx = 100 + (i * 50) + Math.sin(frame * 0.03 + i * 2) * 20;
                const fy = 100 + Math.cos(frame * 0.04 + i * 1.5) * 30;
                if (Math.sin(frame * 0.1 + i) > 0) {
                    renderer.setPixel(fx, fy, EGA_PALETTE.yellow);
                    renderer.setPixel(fx + 1, fy, EGA_PALETTE.yellow);
                }
            }
        },
        
        objects: [
            {
                id: 'chest',
                name: 'treasure chest',
                aliases: ['chest', 'treasure'],
                description: 'An ornate treasure chest with LISP runes carved into it. A riddle on the lock reads: "To open me, create a LIST of magic ingredients: sugar, flour, magic. Use: (list \\"sugar\\" \\"flour\\" \\"magic\\")"',
                canTake: false,
                canOpen: true,
                requiresItem: null,
                lockedMessage: 'The chest is locked with a LISP spell! You need to solve the riddle at the terminal.',
                openMessage: 'The chest opens with a magical click! Inside you find a GOLDEN KEY!',
                setsFlag: 'chestsOpened',
                points: 15,
                contains: [
                    {
                        id: 'golden-key',
                        name: 'golden key',
                        description: 'A beautiful golden key with LISP parentheses engraved on it. It must open something important!',
                        canTake: true,
                        takeMessage: 'You take the golden key. It feels warm with magic.',
                        points: 10,
                        setsFlag: 'hasKey'
                    }
                ]
            },
            {
                id: 'mushrooms',
                name: 'glowing mushrooms',
                aliases: ['mushroom', 'mushrooms', 'fungi'],
                description: 'Bioluminescent mushrooms that glow with soft colors. They seem to pulse in a pattern: blue, pink, green... almost like code!',
                canTake: false
            },
            {
                id: 'forest-terminal',
                name: 'tree stump terminal',
                aliases: ['terminal', 'stump'],
                description: 'A magic terminal growing from an ancient tree stump. Green runes flicker across its surface.',
                canTake: false
            }
        ],
        
        useInteractions: [
            {
                item: 'terminal',
                message: 'The forest terminal awakens! Solve the chest riddle: Create a list with (list "sugar" "flour" "magic")',
                startsPuzzle: 'gather-ingredients'
            },
            {
                item: 'forest-terminal',
                message: 'The forest terminal awakens!',
                startsPuzzle: 'gather-ingredients'
            }
        ],
        
        npcs: [],
        
        exits: {
            west: { scene: 'forest-edge', message: 'You head back toward the bakery.' },
            north: { scene: 'forest-clearing', message: 'You push through the undergrowth to a clearing.' }
        }
    },
    
    // Scene 6: Forest Clearing - Locked gate
    'forest-clearing': {
        id: 'forest-clearing',
        name: 'Forest Clearing',
        description: "You emerge into a moonlit clearing. An ancient stone GATE blocks the path north, covered in glowing runes. Beyond it, you can see a tower in the distance. There's a mysterious pedestal with a TERMINAL near the gate. The dense forest is to the SOUTH.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Night sky
            renderer.clear(EGA_PALETTE.black);
            renderer.drawRect(0, 0, W, 100, EGA_PALETTE.blue);
            
            // Stars with twinkling
            for (let i = 0; i < 50; i++) {
                const x = (i * 8) % W;
                const y = 5 + (i * 5) % 90;
                const twinkle = Math.sin(frame * 0.08 + i) > 0.2;
                if (twinkle) {
                    renderer.setPixel(x, y, EGA_PALETTE.white);
                    if (i % 5 === 0) {
                        renderer.setPixel(x + 1, y, EGA_PALETTE.lightGray);
                        renderer.setPixel(x - 1, y, EGA_PALETTE.lightGray);
                    }
                }
            }
            
            // Large moon
            renderer.drawCircle(320, 45, 30, EGA_PALETTE.white, true);
            renderer.drawCircle(330, 42, 28, EGA_PALETTE.black, true);
            // Moon glow
            renderer.bufferCtx.globalAlpha = 0.2;
            renderer.drawCircle(320, 45, 45, EGA_PALETTE.white, true);
            renderer.bufferCtx.globalAlpha = 1;
            
            // Distant tower
            renderer.drawRect(175, 25, 40, 80, EGA_PALETTE.darkGray);
            renderer.drawTriangle(170, 25, 195, 0, 220, 25, EGA_PALETTE.darkGray, true);
            // Tower windows
            renderer.drawRect(185, 40, 15, 20, EGA_PALETTE.yellow);
            renderer.drawRect(185, 70, 15, 15, EGA_PALETTE.yellow);
            
            // Ground
            renderer.drawRect(0, 140, W, 100, EGA_PALETTE.darkGray);
            renderer.drawRect(0, 135, W, 10, EGA_PALETTE.green);
            
            // Stone gate - large and detailed
            const gateOpen = window.game?.flags?.doorUnlocked;
            const gx = 130, gy = 70;
            
            // Left pillar
            renderer.drawRect(gx, gy, 35, 100, EGA_PALETTE.lightGray);
            renderer.drawRect(gx - 3, gy - 10, 41, 15, EGA_PALETTE.lightGray);
            // Right pillar
            renderer.drawRect(gx + 85, gy, 35, 100, EGA_PALETTE.lightGray);
            renderer.drawRect(gx + 82, gy - 10, 41, 15, EGA_PALETTE.lightGray);
            // Arch
            renderer.drawRect(gx, gy - 15, 120, 12, EGA_PALETTE.lightGray);
            
            // Pillar details
            renderer.drawRect(gx + 5, gy + 10, 25, 80, EGA_PALETTE.darkGray, false);
            renderer.drawRect(gx + 90, gy + 10, 25, 80, EGA_PALETTE.darkGray, false);
            
            if (gateOpen) {
                // Open gate - darkness beyond
                renderer.drawRect(gx + 35, gy, 50, 100, EGA_PALETTE.black);
                // Path visible through gate
                renderer.drawRect(gx + 45, gy + 10, 30, 90, EGA_PALETTE.brown);
            } else {
                // Closed gate
                renderer.drawRect(gx + 35, gy, 50, 100, EGA_PALETTE.brown);
                // Iron bars
                for (let i = 0; i < 5; i++) {
                    renderer.drawLine(gx + 40 + i * 10, gy, gx + 40 + i * 10, gy + 100, EGA_PALETTE.darkGray);
                }
                // Horizontal bars
                renderer.drawLine(gx + 35, gy + 30, gx + 85, gy + 30, EGA_PALETTE.darkGray);
                renderer.drawLine(gx + 35, gy + 60, gx + 85, gy + 60, EGA_PALETTE.darkGray);
                // Lock
                renderer.drawRect(gx + 55, gy + 45, 14, 18, EGA_PALETTE.yellow);
                renderer.drawCircle(gx + 62, gy + 40, 7, EGA_PALETTE.yellow, false);
            }
            
            // Glowing runes on pillars
            const runeGlow = Math.sin(frame * 0.1) > 0 ? EGA_PALETTE.lightCyan : EGA_PALETTE.cyan;
            renderer.drawText('(', gx + 12, gy + 30, runeGlow);
            renderer.drawText('IF', gx + 8, gy + 50, runeGlow);
            renderer.drawText(')', gx + 95, gy + 30, runeGlow);
            renderer.drawText('>', gx + 100, gy + 50, runeGlow);
            
            // Pedestal with terminal
            const px = 50, py = 160;
            renderer.drawRect(px, py, 60, 40, EGA_PALETTE.lightGray);
            renderer.drawRect(px - 5, py - 8, 70, 12, EGA_PALETTE.lightGray);
            // Terminal on pedestal
            renderer.drawRect(px + 10, py - 35, 40, 30, EGA_PALETTE.darkGray);
            renderer.drawRect(px + 13, py - 32, 34, 24, EGA_PALETTE.black);
            renderer.drawRect(px + 15, py - 30, 30, 20, EGA_PALETTE.blue);
            renderer.drawRect(px + 18, py - 25, 15, 2, EGA_PALETTE.lightGreen);
            renderer.drawRect(px + 18, py - 20, 20, 2, EGA_PALETTE.lightGreen);
            // Glow
            const tGlow = Math.sin(frame * 0.08) * 0.25 + 0.35;
            renderer.bufferCtx.globalAlpha = tGlow;
            renderer.drawCircle(px + 30, py - 18, 30, EGA_PALETTE.lightCyan, true);
            renderer.bufferCtx.globalAlpha = 1;
            
            // Magic circle on ground
            renderer.drawCircle(px + 30, py + 20, 45, EGA_PALETTE.lightCyan, false);
            renderer.drawCircle(px + 30, py + 20, 40, EGA_PALETTE.lightMagenta, false);
            // Rotating runes in circle
            for (let i = 0; i < 6; i++) {
                const angle = frame * 0.015 + (i / 6) * Math.PI * 2;
                const rx = px + 30 + Math.cos(angle) * 35;
                const ry = py + 20 + Math.sin(angle) * 20;
                renderer.drawText(['(', ')', 'if', '>', '+', '='][i], rx - 4, ry - 4, EGA_PALETTE.cyan);
            }
            
            // Trees around clearing
            const drawDarkTree = (x, y, s) => {
                renderer.drawRect(x - 6 * s, y - 20 * s, 12 * s, 25 * s, EGA_PALETTE.brown);
                renderer.drawTriangle(x - 20 * s, y - 15 * s, x, y - 50 * s, x + 20 * s, y - 15 * s, EGA_PALETTE.darkGray, true);
                renderer.drawTriangle(x - 15 * s, y - 30 * s, x, y - 60 * s, x + 15 * s, y - 30 * s, EGA_PALETTE.darkGray, true);
            };
            drawDarkTree(15, 190, 1.5);
            drawDarkTree(360, 185, 1.8);
            
            // Moonbeam effect
            renderer.bufferCtx.globalAlpha = 0.12;
            renderer.drawPolygon([
                {x: 290, y: 75}, {x: 350, y: 75},
                {x: 380, y: H}, {x: 260, y: H}
            ], EGA_PALETTE.white, true);
            renderer.bufferCtx.globalAlpha = 1;
        },
        
        objects: [
            {
                id: 'gate',
                name: 'stone gate',
                aliases: ['gate', 'door', 'arch'],
                description: 'A massive stone gate with iron bars. Runes on the pillars read: "Only those who understand IF may pass. Prove yourself: (if (> 10 5) \\"open\\" \\"closed\\")"',
                canTake: false,
                canOpen: true,
                requiresItem: 'golden-key',
                lockedMessage: 'The gate is sealed with a LISP spell! You need to solve the riddle AND have the golden key.',
                openMessage: 'You insert the golden key. The runes glow bright, and the gate swings open with a rumble!',
                setsFlag: 'doorUnlocked',
                points: 20
            },
            {
                id: 'clearing-terminal',
                name: 'pedestal terminal',
                aliases: ['terminal', 'pedestal'],
                description: 'A terminal mounted on a stone pedestal. The screen shows the gate riddle.',
                canTake: false
            }
        ],
        
        useInteractions: [
            {
                item: 'terminal',
                message: 'The terminal shows the gate puzzle: (if (> 10 5) "open" "closed")',
                startsPuzzle: 'unlock-door'
            },
            {
                item: 'clearing-terminal',
                message: 'The terminal shows the gate puzzle!',
                startsPuzzle: 'unlock-door'
            },
            {
                item: 'golden-key',
                target: 'gate',
                requiresFlag: 'unlock-door-solved',
                failMessage: 'The lock glows red. You must solve the LISP puzzle first!',
                message: 'You insert the golden key. Combined with your LISP knowledge, the gate recognizes your worth and swings open!',
                setsFlag: 'doorUnlocked',
                consumesItem: true,
                points: 20
            }
        ],
        
        npcs: [],
        
        exits: {
            south: { scene: 'deep-forest', message: 'You return to the deep forest.' },
            north: { 
                scene: 'tower-base', 
                message: 'You pass through the ancient gate...',
                requiresFlag: 'doorUnlocked',
                blockedMessage: 'The gate is locked! Solve the riddle at the terminal: (if (> 10 5) "open" "closed") Then USE KEY ON GATE.'
            }
        }
    },
    
    // Scene 7: Rainbow Bridge
    'rainbow-bridge': {
        id: 'rainbow-bridge',
        name: 'Rainbow Bridge',
        description: "You stand on the magnificent Rainbow Bridge, its colors shimmering beneath your feet! It arcs gracefully over a sea of clouds. The Doughnut Kingdom awaits to the NORTH. Sparkle's meadow is to the SOUTH.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Magical sky gradient
            for (let y = 0; y < 140; y++) {
                const ratio = y / 140;
                const r = Math.floor(85 + ratio * 85);
                const g = Math.floor(0 + ratio * 50);
                const b = Math.floor(170 - ratio * 50);
                renderer.bufferCtx.fillStyle = `rgb(${r},${g},${b})`;
                renderer.bufferCtx.fillRect(0, y, W, 1);
            }
            
            // Many stars and sparkles
            for (let i = 0; i < 60; i++) {
                const x = (i * 7 + frame * 0.3) % W;
                const y = 10 + (i * 4) % 80;
                renderer.drawSparkle(x, y, frame + i * 3);
            }
            
            // Cloud sea below
            renderer.drawRect(0, 180, W, 60, EGA_PALETTE.white);
            for (let i = 0; i < 20; i++) {
                const cx = (i * 20) % W;
                const cy = 175 + (i % 3) * 5;
                renderer.drawCircle(cx, cy, 12, EGA_PALETTE.white, true);
                renderer.drawCircle(cx + 8, cy + 3, 10, EGA_PALETTE.white, true);
            }
            
            // Rainbow bridge - full arc
            const rainbowColors = [
                EGA_PALETTE.red, EGA_PALETTE.lightRed,
                EGA_PALETTE.yellow, 
                EGA_PALETTE.lightGreen, EGA_PALETTE.green,
                EGA_PALETTE.cyan, EGA_PALETTE.lightCyan,
                EGA_PALETTE.lightBlue, EGA_PALETTE.blue,
                EGA_PALETTE.magenta, EGA_PALETTE.lightMagenta
            ];
            
            // Draw rainbow arc
            for (let i = 0; i < rainbowColors.length; i++) {
                for (let x = 30; x < W - 30; x += 2) {
                    const progress = (x - 30) / (W - 60);
                    const arcY = 160 - Math.sin(progress * Math.PI) * 80 + i * 4;
                    renderer.drawRect(x, arcY, 4, 4, rainbowColors[i]);
                }
            }
            
            // Sparkles along bridge
            for (let i = 0; i < 12; i++) {
                const progress = (i + 1) / 13;
                const sx = 30 + progress * (W - 60) + Math.sin(frame * 0.08 + i) * 5;
                const sy = 160 - Math.sin(progress * Math.PI) * 80 + Math.cos(frame * 0.1 + i) * 8;
                renderer.drawSparkle(sx, sy, frame + i * 5);
            }
            
            // Distant Doughnut Kingdom
            const dkx = W / 2, dky = 50;
            // Main dome
            renderer.drawCircle(dkx, dky + 15, 40, EGA_PALETTE.lightMagenta, true);
            // Castle towers
            renderer.drawRect(dkx - 40, dky + 10, 15, 35, EGA_PALETTE.white);
            renderer.drawRect(dkx + 25, dky + 10, 15, 35, EGA_PALETTE.white);
            renderer.drawTriangle(dkx - 45, dky + 10, dkx - 32, dky - 10, dkx - 20, dky + 10, EGA_PALETTE.lightMagenta, true);
            renderer.drawTriangle(dkx + 20, dky + 10, dkx + 33, dky - 10, dkx + 45, dky + 10, EGA_PALETTE.lightMagenta, true);
            // Giant doughnut on castle
            SPRITES.doughnut.draw(renderer, dkx - 8, dky - 5, 'magic');
            // Windows
            renderer.drawRect(dkx - 37, dky + 20, 8, 10, EGA_PALETTE.yellow);
            renderer.drawRect(dkx + 29, dky + 20, 8, 10, EGA_PALETTE.yellow);
            // Castle glow
            renderer.bufferCtx.globalAlpha = 0.3;
            renderer.drawCircle(dkx, dky + 15, 55, EGA_PALETTE.lightMagenta, true);
            renderer.bufferCtx.globalAlpha = 1;
            
            // "You are here" indicator
            const playerX = W / 2;
            const playerY = 160 - Math.sin(0.5 * Math.PI) * 80 + 5 * 4;
            renderer.drawRect(playerX - 5, playerY - 15, 10, 3, EGA_PALETTE.white);
            renderer.drawTriangle(playerX - 3, playerY - 12, playerX, playerY - 5, playerX + 3, playerY - 12, EGA_PALETTE.white, true);
        },
        
        objects: [
            {
                id: 'bridge',
                name: 'rainbow bridge',
                aliases: ['bridge', 'rainbow'],
                description: 'The Rainbow Bridge stretches before you, each color glowing with LISP magic. You can feel the power of (+ 1 2 3 4 5 6 7) = 28 beneath your feet!',
                canTake: false
            }
        ],
        
        npcs: [],
        
        exits: {
            south: { scene: 'meadow', message: 'You walk back to the meadow.' },
            north: { scene: 'doughnut-kingdom', message: 'You cross the bridge to the Doughnut Kingdom!' }
        }
    },
    
    // Scene 8: Tower Base
    'tower-base': {
        id: 'tower-base',
        name: 'Wizard Tower Base',
        description: "You stand at the base of an ancient wizard tower. A wise OWL perches above the door, seeming to guard the entrance. A TERMINAL with advanced runes sits nearby. The inscription above the door reads: 'Only those who can CREATE magic may enter.' The gate is to the SOUTH, and stairs lead UP into the tower.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Twilight sky
            for (let y = 0; y < 120; y++) {
                const ratio = y / 120;
                const r = Math.floor(85 - ratio * 85);
                const g = Math.floor(0);
                const b = Math.floor(170 - ratio * 100);
                renderer.bufferCtx.fillStyle = `rgb(${r},${g},${b})`;
                renderer.bufferCtx.fillRect(0, y, W, 1);
            }
            
            // Stars
            for (let i = 0; i < 40; i++) {
                const x = (i * 10) % W;
                const y = 5 + (i * 6) % 80;
                renderer.setPixel(x, y, EGA_PALETTE.white);
            }
            
            // Tower - large and imposing
            const tx = 120, ty = 10;
            renderer.drawRect(tx, ty, 150, 190, EGA_PALETTE.darkGray);
            // Tower top
            renderer.drawTriangle(tx - 10, ty, tx + 75, ty - 40, tx + 160, ty, EGA_PALETTE.darkGray, true);
            // Tower details
            renderer.drawRect(tx, ty + 10, 150, 8, EGA_PALETTE.lightGray);
            renderer.drawRect(tx, ty + 90, 150, 5, EGA_PALETTE.lightGray);
            
            // Tower windows
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 2; col++) {
                    const wx = tx + 25 + col * 75;
                    const wy = ty + 30 + row * 60;
                    renderer.drawRect(wx, wy, 25, 35, EGA_PALETTE.yellow);
                    renderer.drawLine(wx + 12, wy, wx + 12, wy + 35, EGA_PALETTE.brown);
                    renderer.drawLine(wx, wy + 17, wx + 25, wy + 17, EGA_PALETTE.brown);
                }
            }
            
            // Tower door
            const dx = tx + 55, dy = ty + 130;
            renderer.drawRect(dx, dy, 40, 60, EGA_PALETTE.brown);
            renderer.drawRect(dx, dy - 8, 40, 12, EGA_PALETTE.darkGray);
            renderer.drawCircle(dx + 32, dy + 30, 4, EGA_PALETTE.yellow, true);
            // Door panels
            renderer.drawRect(dx + 5, dy + 8, 13, 20, EGA_PALETTE.darkGray, false);
            renderer.drawRect(dx + 22, dy + 8, 13, 20, EGA_PALETTE.darkGray, false);
            renderer.drawRect(dx + 5, dy + 33, 13, 20, EGA_PALETTE.darkGray, false);
            renderer.drawRect(dx + 22, dy + 33, 13, 20, EGA_PALETTE.darkGray, false);
            
            // Inscription
            renderer.drawText('CREATE', dx + 3, dy - 15, EGA_PALETTE.lightCyan);
            
            // Owl guardian
            const ox = dx + 55, oy = dy - 25;
            // Body
            renderer.drawCircle(ox, oy + 15, 12, EGA_PALETTE.brown, true);
            // Head
            renderer.drawCircle(ox, oy, 10, EGA_PALETTE.brown, true);
            // Eyes
            renderer.drawCircle(ox - 5, oy - 2, 5, EGA_PALETTE.yellow, true);
            renderer.drawCircle(ox + 5, oy - 2, 5, EGA_PALETTE.yellow, true);
            renderer.setPixel(ox - 5, oy - 2, EGA_PALETTE.black);
            renderer.setPixel(ox + 5, oy - 2, EGA_PALETTE.black);
            // Beak
            renderer.drawTriangle(ox - 3, oy + 3, ox, oy + 8, ox + 3, oy + 3, EGA_PALETTE.yellow, true);
            // Ear tufts
            renderer.drawTriangle(ox - 10, oy - 6, ox - 7, oy - 15, ox - 4, oy - 6, EGA_PALETTE.brown, true);
            renderer.drawTriangle(ox + 4, oy - 6, ox + 7, oy - 15, ox + 10, oy - 6, EGA_PALETTE.brown, true);
            // Wing movement
            const wingAngle = Math.sin(frame * 0.05) * 0.2;
            renderer.drawCircle(ox - 10 - wingAngle * 5, oy + 18, 8, EGA_PALETTE.brown, true);
            renderer.drawCircle(ox + 10 + wingAngle * 5, oy + 18, 8, EGA_PALETTE.brown, true);
            
            // Ground
            renderer.drawRect(0, 190, W, 50, EGA_PALETTE.darkGray);
            // Cobblestones
            for (let y = 190; y < H; y += 15) {
                for (let x = 0; x < W; x += 20) {
                    const offset = ((y - 190) / 15) % 2 === 0 ? 0 : 10;
                    renderer.drawRect(x + offset, y, 18, 13, EGA_PALETTE.lightGray, false);
                }
            }
            
            // Terminal on pedestal
            const px = 40, py = 170;
            renderer.drawRect(px, py + 15, 55, 30, EGA_PALETTE.lightGray);
            renderer.drawRect(px - 3, py + 10, 61, 8, EGA_PALETTE.lightGray);
            // Terminal
            renderer.drawRect(px + 8, py - 20, 40, 32, EGA_PALETTE.darkGray);
            renderer.drawRect(px + 11, py - 17, 34, 26, EGA_PALETTE.black);
            renderer.drawRect(px + 13, py - 15, 30, 22, EGA_PALETTE.blue);
            renderer.drawRect(px + 16, py - 10, 18, 2, EGA_PALETTE.lightGreen);
            renderer.drawRect(px + 16, py - 5, 22, 2, EGA_PALETTE.lightGreen);
            
            // Magic circle
            renderer.drawCircle(px + 28, py + 25, 40, EGA_PALETTE.lightCyan, false);
            for (let i = 0; i < 5; i++) {
                const angle = frame * 0.02 + (i / 5) * Math.PI * 2;
                const rx = px + 28 + Math.cos(angle) * 32;
                const ry = py + 25 + Math.sin(angle) * 18;
                renderer.drawText('()', rx - 6, ry - 4, EGA_PALETTE.lightMagenta);
            }
        },
        
        objects: [
            {
                id: 'tower-door',
                name: 'tower door',
                aliases: ['door', 'entrance'],
                description: 'A heavy wooden door with the inscription "CREATE" above it. The owl hoots: "To enter, you must CREATE your own magic! Define a function with: (define double-magic (lambda (x) (* x 2)))"',
                canTake: false
            },
            {
                id: 'tower-terminal',
                name: 'rune terminal',
                aliases: ['terminal', 'runes'],
                description: 'An advanced terminal covered in swirling runes. It awaits your function definition.',
                canTake: false
            }
        ],
        
        useInteractions: [
            {
                item: 'terminal',
                message: 'The owl hoots: "Create a doubling function! Type: (define double-magic (lambda (x) (* x 2)))"',
                startsPuzzle: 'create-spell'
            },
            {
                item: 'tower-terminal',
                message: 'The terminal activates with advanced magic!',
                startsPuzzle: 'create-spell'
            }
        ],
        
        npcs: [
            {
                id: 'owl',
                name: 'Wise Owl',
                dialogue: {
                    default: "Hoot! I am the guardian of this tower. To prove your worth, you must CREATE new magic! In LISP, (lambda (x) (* x 2)) creates a function that doubles numbers. Use DEFINE to name it: (define double-magic (lambda (x) (* x 2)))",
                    conditions: [
                        {
                            flag: 'create-spell-solved',
                            value: true,
                            text: "Hoot! Excellent! You created a function! Now test it with (double-magic 21). The answer should be 42 - the answer to everything!"
                        },
                        {
                            flag: 'cast-spell-solved',
                            value: true,
                            text: "Hoot hoot! You may enter the tower. Go UP to face the final challenge!"
                        }
                    ]
                },
                points: 5,
                setsFlag: 'talkedToOwl'
            }
        ],
        
        exits: {
            south: { scene: 'forest-clearing', message: 'You return through the gate.' },
            up: { 
                scene: 'tower-top', 
                message: 'You climb the winding stairs...',
                requiresFlag: 'cast-spell-solved',
                blockedMessage: 'The owl blocks the door. "Hoot! First create AND test your function!"'
            },
            enter: {
                scene: 'tower-top',
                requiresFlag: 'cast-spell-solved',
                blockedMessage: 'The owl blocks the entrance. Complete the function puzzles first!'
            }
        }
    },
    
    // Scene 9: Doughnut Kingdom
    'doughnut-kingdom': {
        id: 'doughnut-kingdom',
        name: 'Doughnut Kingdom',
        description: "Welcome to the magical Doughnut Kingdom! Towers made of giant doughnuts rise around you, and the streets are paved with sprinkles. In the center stands the GRAND TERMINAL, the source of all LISP magic. A friendly DOUGHNUT WIZARD greets you. The Rainbow Bridge is to the SOUTH.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Pink magical sky
            for (let y = 0; y < 100; y++) {
                const ratio = y / 100;
                renderer.bufferCtx.fillStyle = `rgb(${255 - ratio * 50}, ${85 + ratio * 50}, ${170 + ratio * 50})`;
                renderer.bufferCtx.fillRect(0, y, W, 1);
            }
            
            // Sparkles everywhere
            for (let i = 0; i < 60; i++) {
                const x = (i * 7 + frame * 0.4) % W;
                const y = 10 + (i * 4) % 120;
                renderer.drawSparkle(x, y, frame + i * 2);
            }
            
            // Doughnut towers
            const drawDoughnutTower = (x, y, height) => {
                renderer.drawRect(x + 5, y, 30, height, EGA_PALETTE.brown);
                for (let i = 0; i < Math.floor(height / 25); i++) {
                    const dy = y + i * 25;
                    const type = ['pink', 'chocolate', 'rainbow', 'magic'][i % 4];
                    SPRITES.doughnut.draw(renderer, x, dy - 5, type);
                }
            };
            drawDoughnutTower(20, 80, 130);
            drawDoughnutTower(320, 90, 110);
            
            // Castle in background
            renderer.drawRect(140, 50, 100, 100, EGA_PALETTE.lightMagenta);
            renderer.drawRect(120, 40, 40, 70, EGA_PALETTE.lightMagenta);
            renderer.drawRect(220, 40, 40, 70, EGA_PALETTE.lightMagenta);
            // Castle tops
            renderer.drawTriangle(115, 40, 140, 15, 165, 40, EGA_PALETTE.magenta, true);
            renderer.drawTriangle(215, 40, 240, 15, 265, 40, EGA_PALETTE.magenta, true);
            // Main dome
            renderer.drawCircle(190, 50, 35, EGA_PALETTE.magenta, true);
            // Castle doughnut crown
            SPRITES.doughnut.draw(renderer, 182, 20, 'magic');
            // Castle windows
            renderer.drawRect(130, 55, 15, 20, EGA_PALETTE.yellow);
            renderer.drawRect(235, 55, 15, 20, EGA_PALETTE.yellow);
            renderer.drawRect(160, 70, 20, 30, EGA_PALETTE.yellow);
            renderer.drawRect(200, 70, 20, 30, EGA_PALETTE.yellow);
            
            // Ground - sprinkle pavement
            renderer.drawRect(0, 170, W, 70, EGA_PALETTE.lightMagenta);
            // Sprinkles
            const sprinkleColors = [EGA_PALETTE.red, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.lightBlue, EGA_PALETTE.white, EGA_PALETTE.lightCyan];
            for (let i = 0; i < 150; i++) {
                const x = (i * 3) % W;
                const y = 172 + (i * 5) % 65;
                renderer.setPixel(x, y, sprinkleColors[i % sprinkleColors.length]);
                renderer.setPixel(x + 1, y, sprinkleColors[i % sprinkleColors.length]);
            }
            
            // Grand Terminal - large and ornate
            const tx = 160, ty = 130;
            // Golden pedestal
            renderer.drawRect(tx, ty + 30, 70, 40, EGA_PALETTE.yellow);
            renderer.drawRect(tx - 5, ty + 25, 80, 8, EGA_PALETTE.yellow);
            // Terminal
            renderer.drawRect(tx + 10, ty - 15, 50, 45, EGA_PALETTE.yellow);
            renderer.drawRect(tx + 14, ty - 11, 42, 37, EGA_PALETTE.black);
            renderer.drawRect(tx + 17, ty - 8, 36, 31, EGA_PALETTE.blue);
            // Screen content
            renderer.drawRect(tx + 22, ty, 20, 3, EGA_PALETTE.lightGreen);
            renderer.drawRect(tx + 22, ty + 8, 26, 3, EGA_PALETTE.lightGreen);
            if (frame % 25 < 12) {
                renderer.drawRect(tx + 22, ty + 16, 8, 3, EGA_PALETTE.lightGreen);
            }
            // Magical rainbow glow
            const glowPhase = frame * 0.05;
            const glowColor = [EGA_PALETTE.lightMagenta, EGA_PALETTE.lightCyan, EGA_PALETTE.yellow][Math.floor(glowPhase) % 3];
            renderer.bufferCtx.globalAlpha = 0.4;
            renderer.drawCircle(tx + 35, ty + 10, 50, glowColor, true);
            renderer.bufferCtx.globalAlpha = 1;
            // Orbiting sparkles
            for (let i = 0; i < 6; i++) {
                const angle = frame * 0.03 + (i / 6) * Math.PI * 2;
                const ox = tx + 35 + Math.cos(angle) * 45;
                const oy = ty + 15 + Math.sin(angle) * 25;
                renderer.drawSparkle(ox, oy, frame + i * 8);
            }
            
            // Doughnut Wizard NPC
            const wx = 280, wy = 155;
            // Doughnut body!
            renderer.drawCircle(wx, wy + 10, 20, EGA_PALETTE.brown, true);
            renderer.drawCircle(wx, wy + 10, 8, EGA_PALETTE.black, true);
            renderer.drawCircle(wx, wy + 7, 18, EGA_PALETTE.lightMagenta, true);
            renderer.drawCircle(wx, wy + 7, 7, EGA_PALETTE.black, true);
            // Sprinkles
            renderer.setPixel(wx - 8, wy + 3, EGA_PALETTE.yellow);
            renderer.setPixel(wx + 6, wy + 2, EGA_PALETTE.lightGreen);
            renderer.setPixel(wx - 3, wy + 12, EGA_PALETTE.lightCyan);
            renderer.setPixel(wx + 10, wy + 8, EGA_PALETTE.red);
            // Wizard hat
            renderer.drawTriangle(wx - 12, wy - 8, wx, wy - 30, wx + 12, wy - 8, EGA_PALETTE.blue, true);
            renderer.drawRect(wx - 15, wy - 10, 30, 5, EGA_PALETTE.blue);
            // Stars on hat
            renderer.setPixel(wx - 3, wy - 18, EGA_PALETTE.yellow);
            renderer.setPixel(wx + 5, wy - 22, EGA_PALETTE.yellow);
            // Face
            renderer.setPixel(wx - 5, wy + 4, EGA_PALETTE.black);
            renderer.setPixel(wx + 5, wy + 4, EGA_PALETTE.black);
            renderer.drawLine(wx - 3, wy + 10, wx + 3, wy + 10, EGA_PALETTE.black);
            // Staff
            renderer.drawRect(wx + 22, wy - 15, 4, 45, EGA_PALETTE.brown);
            SPRITES.doughnut.draw(renderer, wx + 16, wy - 30, 'magic');
        },
        
        objects: [
            {
                id: 'grand-terminal',
                name: 'Grand Terminal',
                aliases: ['terminal', 'grand'],
                description: 'The Grand Terminal pulses with rainbow energy. This is the source of all LISP magic in the kingdom! A message scrolls: "Combine everything you\'ve learned for the FINAL SPELL!"',
                canTake: false
            }
        ],
        
        useInteractions: [
            {
                item: 'terminal',
                message: 'The Grand Terminal awakens with all colors of the rainbow! Complete the final challenge!',
                startsPuzzle: 'final-spell'
            },
            {
                item: 'grand-terminal',
                message: 'The source of all LISP magic responds to your touch!',
                startsPuzzle: 'final-spell'
            }
        ],
        
        npcs: [
            {
                id: 'doughnut-wizard',
                name: 'Doughnut Wizard Glaze',
                dialogue: {
                    default: "Welcome, hero! I am Wizard Glaze! The evil Bug cursed our kingdom, but you've learned LISP and can save us! Go to the Grand Terminal and cast the FINAL SPELL: Combine your double-magic function, multiplication, and a list! (+ (double-magic 10) (* 7 3) (length (list 1 2 3 4 5)))",
                    conditions: [
                        {
                            flag: 'finalSpellCast',
                            value: true,
                            text: "You did it! You cast the Final Spell! The kingdom is saved! You are now a true LISP Wizard!"
                        }
                    ]
                },
                points: 5,
                setsFlag: 'metDoughnutWizard'
            }
        ],
        
        exits: {
            south: { scene: 'rainbow-bridge', message: 'You return to the Rainbow Bridge.' }
        }
    },
    
    // Scene 10: Tower Top
    'tower-top': {
        id: 'tower-top',
        name: 'Tower Summit',
        description: "You've reached the top of the ancient wizard tower! A magnificent view stretches in all directions. You can see the Rainbow Bridge, the Doughnut Kingdom, and even your starting cottage. A MASTER TERMINAL sits here, surrounded by floating crystals. The stairs lead DOWN.",
        
        draw: function(renderer, frame) {
            const W = renderer.width;
            const H = renderer.height;
            
            // Starry night sky
            renderer.clear(EGA_PALETTE.black);
            for (let i = 0; i < 80; i++) {
                const x = (i * 5 + frame * 0.08) % W;
                const y = (i * 3) % (H - 50);
                const bright = Math.sin(frame * 0.05 + i) > 0;
                renderer.setPixel(x, y, bright ? EGA_PALETTE.white : EGA_PALETTE.lightGray);
            }
            
            // Aurora borealis effect
            renderer.bufferCtx.globalAlpha = 0.25;
            for (let i = 0; i < 6; i++) {
                const waveY = 25 + Math.sin(frame * 0.015 + i * 0.4) * 12;
                const colors = [EGA_PALETTE.lightGreen, EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta];
                renderer.drawRect(0, waveY + i * 8, W, 6, colors[i % 3]);
            }
            renderer.bufferCtx.globalAlpha = 1;
            
            // Tower floor/platform
            renderer.drawRect(30, 165, W - 60, 75, EGA_PALETTE.darkGray);
            renderer.drawRect(30, 160, W - 60, 8, EGA_PALETTE.lightGray);
            
            // Stone railing
            for (let x = 45; x < W - 45; x += 25) {
                renderer.drawRect(x, 145, 10, 20, EGA_PALETTE.lightGray);
            }
            renderer.drawRect(30, 140, W - 60, 8, EGA_PALETTE.lightGray);
            
            // View of distant landmarks
            // Rainbow bridge (left)
            const rbColors = [EGA_PALETTE.red, EGA_PALETTE.yellow, EGA_PALETTE.green, EGA_PALETTE.cyan, EGA_PALETTE.blue, EGA_PALETTE.magenta];
            for (let i = 0; i < 6; i++) {
                renderer.drawRect(20, 100 + i * 3, 60, 3, rbColors[i]);
            }
            
            // Doughnut Kingdom (right)
            renderer.drawCircle(320, 105, 20, EGA_PALETTE.lightMagenta, true);
            SPRITES.doughnut.draw(renderer, 312, 97, 'magic');
            renderer.drawRect(305, 115, 8, 15, EGA_PALETTE.white);
            renderer.drawRect(327, 115, 8, 15, EGA_PALETTE.white);
            
            // Cottage (center-left)
            renderer.drawRect(160, 115, 25, 18, EGA_PALETTE.brown);
            renderer.drawTriangle(157, 115, 172, 100, 188, 115, EGA_PALETTE.red, true);
            renderer.drawRect(168, 120, 8, 13, EGA_PALETTE.darkGray);
            
            // Floating crystals
            const crystalColors = [EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta, EGA_PALETTE.lightGreen, EGA_PALETTE.yellow, EGA_PALETTE.white];
            for (let i = 0; i < 5; i++) {
                const cx = 80 + i * 55;
                const cy = 135 + Math.sin(frame * 0.04 + i * 1.2) * 12;
                SPRITES.crystal.draw(renderer, cx, cy, crystalColors[i], frame);
            }
            
            // Master Terminal - ornate
            const tx = W / 2 - 35, ty = 175;
            renderer.drawRect(tx, ty + 15, 70, 30, EGA_PALETTE.yellow);
            renderer.drawRect(tx - 5, ty + 10, 80, 8, EGA_PALETTE.yellow);
            renderer.drawRect(tx + 10, ty - 25, 50, 38, EGA_PALETTE.yellow);
            renderer.drawRect(tx + 14, ty - 21, 42, 30, EGA_PALETTE.black);
            renderer.drawRect(tx + 17, ty - 18, 36, 24, EGA_PALETTE.blue);
            // Screen
            renderer.drawRect(tx + 22, ty - 12, 20, 3, EGA_PALETTE.lightGreen);
            renderer.drawRect(tx + 22, ty - 5, 26, 3, EGA_PALETTE.lightGreen);
            
            // Magical circle around terminal
            renderer.drawCircle(tx + 35, ty + 25, 55, EGA_PALETTE.lightCyan, false);
            renderer.drawCircle(tx + 35, ty + 25, 50, EGA_PALETTE.lightMagenta, false);
            renderer.drawCircle(tx + 35, ty + 25, 45, EGA_PALETTE.yellow, false);
            
            // Orbiting magical symbols
            for (let i = 0; i < 8; i++) {
                const angle = frame * 0.02 + (i / 8) * Math.PI * 2;
                const ox = tx + 35 + Math.cos(angle) * 50;
                const oy = ty + 25 + Math.sin(angle) * 25;
                renderer.drawSparkle(ox, oy, frame + i * 7);
            }
        },
        
        objects: [
            {
                id: 'master-terminal',
                name: 'Master Terminal',
                aliases: ['terminal', 'master'],
                description: 'The most powerful LISP terminal in existence! It can access the same final spell as the Grand Terminal in the Doughnut Kingdom.',
                canTake: false
            },
            {
                id: 'crystals',
                name: 'floating crystals',
                aliases: ['crystals', 'crystal'],
                description: 'Five crystals float in a circle, each representing a LISP concept you\'ve learned: +, list, define, lambda, and if.',
                canTake: false
            }
        ],
        
        useInteractions: [
            {
                item: 'terminal',
                message: 'The Master Terminal recognizes a true LISP wizard! Cast the final spell!',
                startsPuzzle: 'final-spell'
            },
            {
                item: 'master-terminal',
                message: 'The crystals glow brighter as you approach!',
                startsPuzzle: 'final-spell'
            }
        ],
        
        npcs: [],
        
        exits: {
            down: { scene: 'tower-base', message: 'You descend the tower stairs.' }
        }
    }
};

// Export
window.GAME_SCENES = GAME_SCENES;
