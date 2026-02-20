// Main Game Controller - The LISP Unicorn Quest

class Game {
    constructor() {
        this.engine = new GameEngine();
        this.renderer = null;
        this.animationFrame = 0;
        this.isRunning = false;
        this.lispConsoleOpen = false;
        this.currentPuzzle = null;
        this.messageHistory = [];
        
        // DOM elements
        this.elements = {};
        
        // Sound effects (Web Audio API)
        this.audioContext = null;
        this.sounds = {};
    }
    
    init() {
        // Get DOM elements
        this.elements = {
            titleScreen: document.getElementById('title-screen'),
            gameScreen: document.getElementById('game-screen'),
            winScreen: document.getElementById('win-screen'),
            canvas: document.getElementById('game-canvas'),
            messageText: document.getElementById('message-text'),
            commandInput: document.getElementById('command-input'),
            inventoryItems: document.getElementById('inventory-items'),
            score: document.getElementById('score'),
            location: document.getElementById('location'),
            lispConsole: document.getElementById('lisp-console'),
            lispOutput: document.getElementById('lisp-output'),
            lispInput: document.getElementById('lisp-input'),
            lispHint: document.getElementById('lisp-hint'),
            startBtn: document.getElementById('start-btn'),
            replayBtn: document.getElementById('replay-btn'),
            closeLisp: document.getElementById('close-lisp'),
            winMessage: document.getElementById('win-message'),
            finalScore: document.getElementById('final-score')
        };
        
        // Initialize renderer
        this.renderer = new EGARenderer(this.elements.canvas);
        
        // Initialize title screen renderer
        this.titleCanvas = document.getElementById('title-canvas');
        if (this.titleCanvas) {
            this.titleCanvas.width = 384;
            this.titleCanvas.height = 120;
            this.titleRenderer = new EGARenderer(this.titleCanvas);
            this.titleRenderer.width = 384;
            this.titleRenderer.height = 120;
            this.titleRenderer.buffer.width = 384;
            this.titleRenderer.buffer.height = 120;
        }
        
        // Initialize game engine with scenes
        this.engine.init(GAME_SCENES);
        
        // Make game globally accessible for scene rendering
        window.game = this.engine;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize audio
        this.initAudio();
        
        // Show title screen
        this.showScreen('title');
        
        // Start title animation
        this.animateTitleScreen();
    }
    
    setupEventListeners() {
        // Start button
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        
        // Replay button
        this.elements.replayBtn.addEventListener('click', () => {
            this.engine.reset();
            this.startGame();
        });
        
        // Command input
        this.elements.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand(this.elements.commandInput.value);
                this.elements.commandInput.value = '';
            }
        });
        
        // LISP input
        this.elements.lispInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleLispInput(this.elements.lispInput.value);
                this.elements.lispInput.value = '';
            }
            if (e.key === 'Escape') {
                this.closeLispConsole();
            }
        });
        
        // Close LISP button
        this.elements.closeLisp.addEventListener('click', () => this.closeLispConsole());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lispConsoleOpen) {
                this.closeLispConsole();
            }
        });
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create simple sound effects
            this.sounds = {
                success: () => this.playTone(523.25, 0.1, 'sine'), // C5
                error: () => this.playTone(220, 0.2, 'sawtooth'),   // A3
                pickup: () => this.playTone(659.25, 0.08, 'sine'),  // E5
                magic: () => this.playMagicSound(),
                walk: () => this.playTone(150, 0.05, 'square'),
                win: () => this.playWinSound()
            };
        } catch (e) {
            console.log('Audio not available');
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playMagicSound() {
        if (!this.audioContext) return;
        
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15, 'sine'), i * 100);
        });
    }
    
    playWinSound() {
        if (!this.audioContext) return;
        
        const melody = [523.25, 659.25, 783.99, 659.25, 783.99, 1046.50];
        melody.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 150);
        });
    }
    
    showScreen(screenName) {
        // Hide all screens
        this.elements.titleScreen.classList.remove('active');
        this.elements.gameScreen.classList.remove('active');
        this.elements.winScreen.classList.remove('active');
        
        // Show requested screen
        switch (screenName) {
            case 'title':
                this.elements.titleScreen.classList.add('active');
                break;
            case 'game':
                this.elements.gameScreen.classList.add('active');
                break;
            case 'win':
                this.elements.winScreen.classList.add('active');
                break;
        }
    }
    
    startGame() {
        this.isRunning = true;
        this.engine.currentScene = 'cottage';
        
        this.showScreen('game');
        
        // Show initial scene description
        const scene = this.engine.scenes[this.engine.currentScene];
        this.showMessage(scene.description + this.engine.getVisibleItems(scene));
        
        // Update UI
        this.updateUI();
        
        // Start render loop
        this.render();
        
        // Focus command input
        this.elements.commandInput.focus();
        
        // Play start sound
        this.sounds.magic?.();
    }
    
    handleCommand(input) {
        if (!input.trim()) return;
        
        const result = this.engine.parseCommand(input);
        
        // Play appropriate sound
        switch (result.action) {
            case 'get':
                if (result.gotItem) this.sounds.pickup?.();
                break;
            case 'go':
                if (result.newScene) this.sounds.walk?.();
                break;
            case 'puzzle':
            case 'lisp':
                this.sounds.magic?.();
                break;
            case 'unknown':
            case 'error':
                this.sounds.error?.();
                break;
        }
        
        // Show message
        let message = result.message;
        if (result.sceneDescription) {
            message += '\n\n' + result.sceneDescription;
        }
        this.showMessage(message);
        
        // Handle special actions
        if (result.openTerminal || result.puzzle) {
            this.openLispConsole(result.puzzle);
        }
        
        // Update UI
        this.updateUI();
        
        // Check win condition
        if (this.engine.checkWin()) {
            this.handleWin();
        }
    }
    
    showMessage(text) {
        // Add to history
        this.messageHistory.push(text);
        if (this.messageHistory.length > 50) {
            this.messageHistory.shift();
        }
        
        // Format text with highlights
        let formatted = text
            .replace(/\b(NORTH|SOUTH|EAST|WEST|UP|DOWN|ENTER|EXIT)\b/g, '<span class="highlight">$1</span>')
            .replace(/\b([A-Z]{2,})\b/g, '<span class="highlight">$1</span>')
            .replace(/\(([^)]+)\)/g, '<span class="lisp-code">($1)</span>')
            .replace(/\n/g, '<br>');
        
        this.elements.messageText.innerHTML = formatted;
        this.elements.messageText.scrollTop = this.elements.messageText.scrollHeight;
    }
    
    updateUI() {
        // Update score
        this.elements.score.textContent = `Score: ${this.engine.score}/${this.engine.maxScore}`;
        
        // Update location
        const scene = this.engine.scenes[this.engine.currentScene];
        this.elements.location.textContent = scene ? scene.name : '';
        
        // Update inventory
        this.elements.inventoryItems.innerHTML = '';
        for (const item of this.engine.inventory) {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.textContent = item.name;
            itemEl.title = item.description || '';
            itemEl.addEventListener('click', () => {
                this.showMessage(item.description || `You have ${item.name}.`);
            });
            this.elements.inventoryItems.appendChild(itemEl);
        }
    }
    
    openLispConsole(puzzleId = null, keepOutput = false) {
        this.lispConsoleOpen = true;
        this.currentPuzzle = puzzleId;
        this.elements.lispConsole.classList.remove('hidden');
        
        // Clear previous output unless we're transitioning between puzzles
        if (!keepOutput) {
            this.elements.lispOutput.innerHTML = '';
        }
        
        // Show puzzle info
        if (puzzleId) {
            const puzzleInfo = this.getPuzzleInfo(puzzleId);
            if (keepOutput) {
                this.addLispOutput('');
                this.addLispOutput('<span class="lisp-info">--- NEXT CHALLENGE ---</span>');
            }
            this.addLispOutput(`<span class="lisp-info">PUZZLE: ${puzzleInfo.title}</span>`);
            this.addLispOutput(`<span class="lisp-info">${puzzleInfo.description}</span>`);
            this.addLispOutput('');
            this.elements.lispHint.textContent = `Hint: ${puzzleInfo.hint}`;
        } else {
            this.addLispOutput('<span class="lisp-info">Welcome to the LISP Magic Terminal!</span>');
            this.addLispOutput('<span class="lisp-info">Try expressions like: (+ 1 2 3) or (list "a" "b" "c")</span>');
            this.elements.lispHint.textContent = 'Type LISP expressions to practice magic!';
        }
        
        this.elements.lispInput.focus();
    }
    
    closeLispConsole() {
        this.lispConsoleOpen = false;
        this.elements.lispConsole.classList.add('hidden');
        this.elements.commandInput.focus();
    }
    
    getPuzzleInfo(puzzleId) {
        const puzzles = {
            'add-spell': {
                title: 'Basic Addition Magic',
                description: 'In LISP, we put the operation FIRST! Add 3 and 4 together.',
                hint: 'Type: (+ 3 4)'
            },
            'rainbow-bridge': {
                title: 'Rainbow Sum',
                description: 'Add all 7 rainbow colors (1+2+3+4+5+6+7) to repair the bridge!',
                hint: 'Type: (+ 1 2 3 4 5 6 7)'
            },
            'name-unicorn': {
                title: 'Define a Variable',
                description: 'Give the unicorn a name by creating a variable.',
                hint: 'Type: (define unicorn-name "Sparkle")'
            },
            'gather-ingredients': {
                title: 'Create a List',
                description: 'Gather ingredients by creating a list of items.',
                hint: 'Type: (list "sugar" "flour" "magic")'
            },
            'doughnut-recipe': {
                title: 'Multiplication Magic',
                description: '6 boxes with 12 doughnuts each - how many total?',
                hint: 'Type: (* 6 12)'
            },
            'first-color': {
                title: 'First Element',
                description: 'Get the first color from a rainbow list.',
                hint: 'Type: (first (list "red" "orange" "yellow"))'
            },
            'unlock-door': {
                title: 'Conditional Magic (IF)',
                description: 'Use IF to check if 10 is greater than 5.',
                hint: 'Type: (if (> 10 5) "open" "closed")'
            },
            'create-spell': {
                title: 'Create a Function',
                description: 'Create a doubling spell using lambda!',
                hint: 'Type: (define double-magic (lambda (x) (* x 2)))'
            },
            'cast-spell': {
                title: 'Use Your Function',
                description: 'Call your double-magic function with 21.',
                hint: 'Type: (double-magic 21)'
            },
            'final-spell': {
                title: 'THE FINAL SPELL',
                description: 'Combine everything: your function, multiplication, and list length!',
                hint: 'Type: (+ (double-magic 10) (* 7 3) (length (list 1 2 3 4 5)))'
            }
        };
        
        return puzzles[puzzleId] || {
            title: 'LISP Practice',
            description: 'Practice your LISP magic!',
            hint: 'Try different expressions'
        };
    }
    
    handleLispInput(input) {
        if (!input.trim()) return;
        
        // Echo input
        this.addLispOutput(`<span style="color: #aaa;">LISP&gt; ${this.escapeHtml(input)}</span>`);
        
        // Check if solving a puzzle
        if (this.currentPuzzle) {
            const result = this.engine.lisp.checkPuzzle(this.currentPuzzle, input);
            
            if (result.valid) {
                this.addLispOutput(`<span class="lisp-result">=&gt; ${result.result}</span>`);
                this.addLispOutput(`<span class="lisp-info">${result.teaching}</span>`);
                this.sounds.success?.();
                
                // Mark puzzle complete
                const completedPuzzle = this.currentPuzzle;
                this.engine.completePuzzle(completedPuzzle);
                this.engine.flags[`${completedPuzzle}-solved`] = true;
                this.engine.addScore(15);
                
                // Clear current puzzle BEFORE handling completion (which may set a new one)
                this.currentPuzzle = null;
                
                // Special handling for specific puzzles (may open new puzzle)
                this.handlePuzzleComplete(completedPuzzle);
                
                // Show success message only if no new puzzle was opened
                if (!this.currentPuzzle) {
                    setTimeout(() => {
                        this.addLispOutput('');
                        this.addLispOutput('<span class="lisp-info">PUZZLE COMPLETE! Press ESC or click X to close.</span>');
                    }, 500);
                }
            } else {
                if (result.error) {
                    this.addLispOutput(`<span class="lisp-error">Error: ${result.error}</span>`);
                } else {
                    this.addLispOutput(`<span class="lisp-result">=&gt; ${result.result}</span>`);
                    this.addLispOutput(`<span class="lisp-error">Not quite! ${result.hint}</span>`);
                }
                this.sounds.error?.();
            }
        } else {
            // Free practice mode
            const result = this.engine.lisp.execute(input);
            
            if (result.success) {
                this.addLispOutput(`<span class="lisp-result">=&gt; ${result.result}</span>`);
                this.sounds.success?.();
            } else {
                this.addLispOutput(`<span class="lisp-error">Error: ${result.error}</span>`);
                this.sounds.error?.();
            }
        }
        
        this.updateUI();
    }
    
    handlePuzzleComplete(puzzleId) {
        switch (puzzleId) {
            case 'add-spell':
                this.engine.flags.learnedBasicLisp = true;
                this.showMessage('You feel magical energy flow through you! You\'ve learned basic LISP addition! Go EAST to explore further, or NORTH to meet the unicorn!');
                break;
                
            case 'rainbow-bridge':
                this.engine.flags.bridgeBuilt = true;
                this.showMessage('The Rainbow Bridge glows with renewed power! All 7 colors shine bright! You can now cross to the Doughnut Kingdom!');
                this.sounds.magic?.();
                break;
                
            case 'gather-ingredients':
                this.engine.flags.chestUnlockable = true;
                // Automatically open chest
                const scene = this.engine.scenes['deep-forest'];
                const chest = scene.objects.find(o => o.id === 'chest');
                if (chest && !chest.isOpen) {
                    chest.isOpen = true;
                    this.engine.flags.chestsOpened = 1;
                    if (chest.contains) {
                        for (const item of chest.contains) {
                            scene.objects.push(item);
                        }
                    }
                }
                this.showMessage('The treasure chest clicks open! Your list magic worked! Look inside - there\'s a GOLDEN KEY!');
                break;
                
            case 'unlock-door':
                this.engine.flags['unlock-door-solved'] = true;
                this.showMessage('The IF spell worked! The runes glow green! Now USE the GOLDEN KEY ON the GATE to open it!');
                break;
                
            case 'create-spell':
                this.showMessage('You created your first function! The owl hoots approvingly. Now test it with: (double-magic 21)');
                // Keep the output and transition to the next puzzle
                this.openLispConsole('cast-spell', true);
                break;
                
            case 'cast-spell':
                this.showMessage('42 - The answer to everything! The owl bows and the tower door opens. Go UP to the tower summit!');
                break;
                
            case 'final-spell':
                this.engine.flags.finalSpellCast = true;
                this.showMessage('THE FINAL SPELL IS CAST! Rainbow light explodes from the terminal! The curse is broken!');
                this.sounds.win?.();
                setTimeout(() => this.handleWin(), 2000);
                break;
        }
    }
    
    addLispOutput(html) {
        this.elements.lispOutput.innerHTML += html + '<br>';
        this.elements.lispOutput.scrollTop = this.elements.lispOutput.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    handleWin() {
        this.isRunning = false;
        
        // Calculate final score
        const finalScore = this.engine.score;
        const maxScore = this.engine.maxScore;
        const puzzlesSolved = this.engine.flags.completedPuzzles.length;
        
        // Set win screen content
        this.elements.winMessage.innerHTML = `
            You have mastered the basics of LISP magic and saved the Doughnut Kingdom!<br><br>
            Puzzles Solved: ${puzzlesSolved}/10<br>
            You learned: addition, multiplication, lists, variables, conditionals, and functions!<br><br>
            The unicorn Sparkle, Wizard Parenthesis, and all the citizens of the<br>
            Doughnut Kingdom thank you, young wizard!
        `;
        
        this.elements.finalScore.textContent = `Final Score: ${finalScore}/${maxScore}`;
        
        this.showScreen('win');
        this.sounds.win?.();
    }
    
    render() {
        if (!this.isRunning) return;
        
        this.animationFrame++;
        
        // Get current scene
        const scene = this.engine.scenes[this.engine.currentScene];
        if (scene && scene.draw) {
            scene.draw(this.renderer, this.animationFrame);
            this.renderer.render();
        }
        
        // Continue render loop
        requestAnimationFrame(() => this.render());
    }
    
    animateTitleScreen() {
        if (!this.titleRenderer) return;
        
        let titleFrame = 0;
        
        const drawTitle = () => {
            titleFrame++;
            const r = this.titleRenderer;
            const W = 384, H = 120;
            
            // Sky gradient background
            for (let y = 0; y < 40; y++) {
                const ratio = y / 40;
                r.bufferCtx.fillStyle = `rgb(${Math.floor(ratio * 50)}, ${Math.floor(ratio * 50)}, ${Math.floor(85 + ratio * 85)})`;
                r.bufferCtx.fillRect(0, y, W, 1);
            }
            r.drawRect(0, 40, W, H - 40, EGA_PALETTE.blue);
            
            // Twinkling stars
            for (let i = 0; i < 35; i++) {
                const x = (i * 12 + titleFrame * 0.15) % W;
                const y = 3 + (i * 4) % 35;
                const twinkle = Math.sin(titleFrame * 0.08 + i * 0.7) > 0;
                if (twinkle) {
                    r.setPixel(x, y, EGA_PALETTE.white);
                    if (i % 4 === 0) {
                        r.setPixel(x + 1, y, EGA_PALETTE.lightGray);
                        r.setPixel(x - 1, y, EGA_PALETTE.lightGray);
                    }
                }
            }
            
            // Rainbow arc - larger and more vibrant
            const rainbowColors = [EGA_PALETTE.red, EGA_PALETTE.lightRed, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.green, EGA_PALETTE.cyan, EGA_PALETTE.lightBlue, EGA_PALETTE.blue, EGA_PALETTE.magenta];
            for (let i = 0; i < rainbowColors.length; i++) {
                for (let x = 50; x < W - 50; x += 2) {
                    const arcY = 70 - Math.sin((x - 50) / (W - 100) * Math.PI) * 55 + i * 2;
                    r.drawRect(x, arcY, 3, 2, rainbowColors[i]);
                }
            }
            
            // Sparkles along rainbow
            for (let i = 0; i < 6; i++) {
                const progress = (i + 1) / 7;
                const sx = 50 + progress * (W - 100) + Math.sin(titleFrame * 0.06 + i) * 5;
                const sy = 70 - Math.sin(progress * Math.PI) * 55 + Math.cos(titleFrame * 0.08 + i) * 5;
                r.drawSparkle(sx, sy, titleFrame + i * 6);
            }
            
            // Grassy ground
            r.drawRect(0, 88, W, 32, EGA_PALETTE.green);
            // Grass blades
            for (let i = 0; i < 50; i++) {
                const gx = (i * 8) % W;
                const sway = Math.sin(titleFrame * 0.04 + i * 0.3) * 2;
                r.drawLine(gx, 92, gx + sway, 88, EGA_PALETTE.lightGreen);
            }
            
            // Unicorn - larger and more detailed
            const unicornBob = Math.sin(titleFrame * 0.06) * 3;
            const ux = 35, uy = 68 + unicornBob;
            
            // Body
            r.drawCircle(ux + 18, uy + 12, 10, EGA_PALETTE.white, true);
            r.drawRect(ux + 8, uy + 6, 22, 12, EGA_PALETTE.white, true);
            // Neck and head
            r.drawRect(ux + 28, uy, 8, 14, EGA_PALETTE.white);
            r.drawCircle(ux + 38, uy + 3, 8, EGA_PALETTE.white, true);
            // Eye
            r.setPixel(ux + 41, uy + 1, EGA_PALETTE.magenta);
            // Horn with rainbow glow
            const hornColor = rainbowColors[Math.floor(titleFrame / 5) % rainbowColors.length];
            r.drawLine(ux + 40, uy - 3, ux + 46, uy - 14, hornColor);
            r.drawLine(ux + 41, uy - 3, ux + 47, uy - 14, hornColor);
            r.drawSparkle(ux + 47, uy - 15, titleFrame);
            // Rainbow mane
            const maneColors = [EGA_PALETTE.red, EGA_PALETTE.yellow, EGA_PALETTE.lightGreen, EGA_PALETTE.lightCyan, EGA_PALETTE.lightMagenta];
            for (let i = 0; i < maneColors.length; i++) {
                const waveOffset = Math.sin(titleFrame * 0.08 + i * 0.5) * 3;
                r.drawLine(ux + 26 - i * 2, uy + 2 + i * 2, ux + 18 + waveOffset - i * 3, uy + 5 + i * 3, maneColors[i]);
            }
            // Legs
            r.drawRect(ux + 10, uy + 17, 3, 8, EGA_PALETTE.white);
            r.drawRect(ux + 17, uy + 17, 3, 8, EGA_PALETTE.white);
            r.drawRect(ux + 24, uy + 17, 3, 8, EGA_PALETTE.white);
            // Hooves
            r.drawRect(ux + 10, uy + 24, 3, 2, EGA_PALETTE.lightGray);
            r.drawRect(ux + 17, uy + 24, 3, 2, EGA_PALETTE.lightGray);
            r.drawRect(ux + 24, uy + 24, 3, 2, EGA_PALETTE.lightGray);
            
            // Floating doughnuts with sparkles
            const doughnutTypes = ['pink', 'rainbow', 'magic', 'chocolate'];
            for (let i = 0; i < 4; i++) {
                const dx = 220 + i * 35;
                const dy = 45 + Math.sin(titleFrame * 0.05 + i * 1.8) * 10;
                SPRITES.doughnut.draw(r, dx, dy, doughnutTypes[i]);
                if (i === 2) { // Magic doughnut sparkle
                    r.drawSparkle(dx + 8, dy - 5, titleFrame + 10);
                }
            }
            
            // Floating LISP symbols
            const pColor = EGA_PALETTE.lightCyan;
            r.drawText('(', 150 + Math.sin(titleFrame * 0.035) * 12, 25, pColor);
            r.drawText(')', 180 + Math.cos(titleFrame * 0.035) * 12, 25, pColor);
            r.drawText('+', 165, 35 + Math.sin(titleFrame * 0.045) * 5, EGA_PALETTE.yellow);
            r.drawText('*', 155 + Math.cos(titleFrame * 0.04) * 8, 45, EGA_PALETTE.lightMagenta);
            
            // Cottage in background
            r.drawRect(320, 72, 45, 30, EGA_PALETTE.brown);
            r.drawTriangle(313, 72, 342, 50, 372, 72, EGA_PALETTE.red, true);
            r.drawRect(332, 82, 15, 20, EGA_PALETTE.darkGray);
            r.drawRect(322, 78, 10, 10, EGA_PALETTE.yellow);
            // Chimney with smoke
            r.drawRect(355, 55, 8, 18, EGA_PALETTE.darkGray);
            for (let i = 0; i < 2; i++) {
                const sy = 48 - i * 8 - (titleFrame * 0.2) % 15;
                const sx = 359 + Math.sin(titleFrame * 0.04 + i) * 3;
                r.drawCircle(sx, sy, 3 + i, EGA_PALETTE.lightGray, true);
            }
            
            r.render();
            
            // Continue animation if on title screen
            if (this.elements.titleScreen.classList.contains('active')) {
                requestAnimationFrame(drawTitle);
            }
        };
        
        drawTitle();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
