// Game Engine - Text Parser, Inventory, and State Management

class GameEngine {
    constructor() {
        this.currentScene = null;
        this.inventory = [];
        this.score = 0;
        this.maxScore = 200;
        this.flags = {};
        this.scenes = {};
        this.messageQueue = [];
        this.lisp = new LispInterpreter();
        this.animationFrame = 0;
        this.currentPuzzle = null;
        
        // Command synonyms for parser
        this.synonyms = {
            'look': ['look', 'l', 'examine', 'ex', 'x', 'inspect', 'view', 'see', 'check'],
            'get': ['get', 'take', 'grab', 'pick', 'pickup', 'acquire', 'collect'],
            'use': ['use', 'apply', 'put', 'insert', 'place'],
            'talk': ['talk', 'speak', 'ask', 'chat', 'converse', 'say'],
            'go': ['go', 'walk', 'move', 'travel', 'head', 'enter', 'exit'],
            'open': ['open', 'unlock'],
            'read': ['read', 'study'],
            'give': ['give', 'offer', 'hand'],
            'help': ['help', 'hint', 'h', '?'],
            'inventory': ['inventory', 'inv', 'i', 'items', 'bag'],
            'save': ['save'],
            'load': ['load', 'restore'],
            'lisp': ['lisp', 'terminal', 'code', 'program', 'magic'],
            'close': ['close', 'shut'],
            'eat': ['eat', 'consume', 'taste', 'bite'],
            'cast': ['cast', 'spell']
        };
        
        // Direction synonyms
        this.directions = {
            'north': ['north', 'n', 'forward', 'up'],
            'south': ['south', 's', 'back', 'down'],
            'east': ['east', 'e', 'right'],
            'west': ['west', 'w', 'left'],
            'enter': ['enter', 'in', 'inside'],
            'exit': ['exit', 'out', 'outside', 'leave']
        };
    }
    
    // Initialize the game
    init(scenes) {
        this.scenes = scenes;
        this.reset();
    }
    
    reset() {
        this.inventory = [];
        this.score = 0;
        this.flags = {
            talkedToWizard: false,
            learnedBasicLisp: false,
            hasKey: false,
            doorUnlocked: false,
            metUnicorn: false,
            fedUnicorn: false,
            gotCrystal: false,
            bridgeBuilt: false,
            chestsOpened: 0,
            spellsLearned: 0,
            finalSpellCast: false,
            completedPuzzles: []
        };
        this.lisp.reset();
        this.currentPuzzle = null;
    }
    
    // Parse and execute a command
    parseCommand(input) {
        input = input.toLowerCase().trim();
        
        if (!input) {
            return { action: 'none', message: '' };
        }
        
        // Check for direction-only commands
        for (const [dir, aliases] of Object.entries(this.directions)) {
            if (aliases.includes(input)) {
                return this.executeCommand('go', dir);
            }
        }
        
        // Parse command and target
        const words = input.split(/\s+/);
        let verb = words[0];
        let rest = words.slice(1).join(' ');
        
        // Remove articles
        rest = rest.replace(/^(the|a|an|to|at|with)\s+/gi, '');
        
        // Find the actual command
        let command = null;
        for (const [cmd, aliases] of Object.entries(this.synonyms)) {
            if (aliases.includes(verb)) {
                command = cmd;
                break;
            }
        }
        
        if (!command) {
            // Check if it's a direction
            for (const [dir, aliases] of Object.entries(this.directions)) {
                if (aliases.includes(verb)) {
                    return this.executeCommand('go', dir);
                }
            }
            return { 
                action: 'unknown', 
                message: `I don't understand "${verb}". Try: LOOK, GET, USE, TALK TO, GO, or HELP.` 
            };
        }
        
        return this.executeCommand(command, rest);
    }
    
    executeCommand(command, target) {
        const scene = this.scenes[this.currentScene];
        if (!scene) {
            return { action: 'error', message: 'Error: No scene loaded!' };
        }
        
        switch (command) {
            case 'look':
                return this.handleLook(scene, target);
            case 'get':
                return this.handleGet(scene, target);
            case 'use':
                return this.handleUse(scene, target);
            case 'talk':
                return this.handleTalk(scene, target);
            case 'go':
                return this.handleGo(scene, target);
            case 'open':
                return this.handleOpen(scene, target);
            case 'read':
                return this.handleRead(scene, target);
            case 'give':
                return this.handleGive(scene, target);
            case 'help':
                return this.handleHelp();
            case 'inventory':
                return this.handleInventory();
            case 'lisp':
                return this.handleLisp(target);
            case 'eat':
                return this.handleEat(target);
            case 'cast':
                return this.handleCast(target);
            default:
                return { action: 'unknown', message: `I don't know how to ${command}.` };
        }
    }
    
    handleLook(scene, target) {
        if (!target || target === 'around' || target === 'room') {
            // General room description
            return { 
                action: 'look', 
                message: scene.description + this.getVisibleItems(scene)
            };
        }
        
        // Look at specific object
        const obj = this.findObject(scene, target);
        if (obj) {
            return { action: 'look', message: obj.description || `You see ${obj.name}.` };
        }
        
        // Check inventory
        const invItem = this.findInventoryItem(target);
        if (invItem) {
            return { action: 'look', message: invItem.description || `You have ${invItem.name}.` };
        }
        
        return { action: 'look', message: `You don't see any "${target}" here.` };
    }
    
    handleGet(scene, target) {
        if (!target) {
            return { action: 'get', message: 'Get what?' };
        }
        
        const obj = this.findObject(scene, target);
        if (!obj) {
            return { action: 'get', message: `You don't see any "${target}" here.` };
        }
        
        if (!obj.canTake) {
            return { action: 'get', message: obj.cantTakeMessage || `You can't take the ${obj.name}.` };
        }
        
        if (obj.requiresFlag && !this.flags[obj.requiresFlag]) {
            return { action: 'get', message: obj.requiresMessage || `You can't get that yet.` };
        }
        
        // Add to inventory
        this.inventory.push({
            id: obj.id,
            name: obj.name,
            description: obj.description
        });
        
        // Remove from scene
        scene.objects = scene.objects.filter(o => o.id !== obj.id);
        
        // Set flags
        if (obj.setsFlag) {
            this.flags[obj.setsFlag] = true;
        }
        
        // Add score
        if (obj.points) {
            this.addScore(obj.points);
        }
        
        return { 
            action: 'get', 
            message: obj.takeMessage || `You pick up the ${obj.name}.`,
            gotItem: obj.id
        };
    }
    
    handleUse(scene, target) {
        if (!target) {
            return { action: 'use', message: 'Use what?' };
        }
        
        // Parse "use X on Y" or "use X with Y"
        const match = target.match(/(.+?)\s+(?:on|with)\s+(.+)/);
        let item, targetObj;
        
        if (match) {
            item = match[1];
            targetObj = match[2];
        } else {
            item = target;
            targetObj = null;
        }
        
        // Check if item is in inventory
        const invItem = this.findInventoryItem(item);
        if (!invItem && !this.findObject(scene, item)) {
            return { action: 'use', message: `You don't have "${item}".` };
        }
        
        // Check scene for use interactions
        if (scene.useInteractions) {
            for (const interaction of scene.useInteractions) {
                if (this.matchesTarget(item, interaction.item)) {
                    if (interaction.target && targetObj && !this.matchesTarget(targetObj, interaction.target)) {
                        continue;
                    }
                    
                    if (interaction.requiresFlag && !this.flags[interaction.requiresFlag]) {
                        return { action: 'use', message: interaction.failMessage || `That doesn't work yet.` };
                    }
                    
                    // Execute the interaction
                    if (interaction.setsFlag) {
                        this.flags[interaction.setsFlag] = true;
                    }
                    if (interaction.points) {
                        this.addScore(interaction.points);
                    }
                    if (interaction.consumesItem) {
                        this.inventory = this.inventory.filter(i => i.id !== invItem.id);
                    }
                    if (interaction.startsPuzzle) {
                        this.currentPuzzle = interaction.startsPuzzle;
                        return { 
                            action: 'puzzle', 
                            message: interaction.message,
                            puzzle: interaction.startsPuzzle
                        };
                    }
                    
                    return { action: 'use', message: interaction.message };
                }
            }
        }
        
        return { action: 'use', message: `You can't use ${item}${targetObj ? ' on ' + targetObj : ''} here.` };
    }
    
    handleTalk(scene, target) {
        // Remove "to" prefix
        target = target.replace(/^to\s+/i, '');
        
        if (!target) {
            return { action: 'talk', message: 'Talk to whom?' };
        }
        
        const npc = scene.npcs?.find(n => 
            this.matchesTarget(target, n.id) || 
            this.matchesTarget(target, n.name)
        );
        
        if (!npc) {
            return { action: 'talk', message: `You don't see anyone called "${target}" here.` };
        }
        
        // Get appropriate dialogue based on game state
        let dialogue = npc.dialogue.default;
        
        if (npc.dialogue.conditions) {
            for (const condition of npc.dialogue.conditions) {
                if (condition.flag && this.flags[condition.flag] === condition.value) {
                    dialogue = condition.text;
                    break;
                }
                if (condition.hasItem && this.hasItem(condition.hasItem)) {
                    dialogue = condition.text;
                    break;
                }
            }
        }
        
        // Set flags from talking
        if (npc.setsFlag && !this.flags[npc.setsFlag]) {
            this.flags[npc.setsFlag] = true;
            if (npc.points) {
                this.addScore(npc.points);
            }
        }
        
        // Check for giving items
        if (npc.wantsItem && this.hasItem(npc.wantsItem)) {
            if (npc.giveDialogue) {
                dialogue = npc.giveDialogue;
            }
        }
        
        // Start puzzle from conversation
        if (npc.startsPuzzle && (!npc.puzzleRequiresFlag || this.flags[npc.puzzleRequiresFlag])) {
            this.currentPuzzle = npc.startsPuzzle;
            return {
                action: 'puzzle',
                message: dialogue,
                puzzle: npc.startsPuzzle
            };
        }
        
        return { action: 'talk', message: `${npc.name} says: "${dialogue}"` };
    }
    
    handleGo(scene, direction) {
        if (!direction) {
            return { action: 'go', message: 'Go where? Try: NORTH, SOUTH, EAST, WEST, or a location name.' };
        }
        
        // Normalize direction
        let normalizedDir = direction;
        for (const [dir, aliases] of Object.entries(this.directions)) {
            if (aliases.includes(direction.toLowerCase())) {
                normalizedDir = dir;
                break;
            }
        }
        
        // Check exits
        const exit = scene.exits?.[normalizedDir];
        if (!exit) {
            return { action: 'go', message: scene.blockedMessage || `You can't go ${direction} from here.` };
        }
        
        // Check if exit is blocked
        if (exit.requiresFlag && !this.flags[exit.requiresFlag]) {
            return { action: 'go', message: exit.blockedMessage || `You can't go that way yet.` };
        }
        
        // Change scene
        this.currentScene = exit.scene;
        const newScene = this.scenes[this.currentScene];
        
        return { 
            action: 'go', 
            message: exit.message || `You go ${normalizedDir}.`,
            newScene: this.currentScene,
            sceneDescription: newScene.description + this.getVisibleItems(newScene)
        };
    }
    
    handleOpen(scene, target) {
        if (!target) {
            return { action: 'open', message: 'Open what?' };
        }
        
        const obj = this.findObject(scene, target);
        if (!obj) {
            return { action: 'open', message: `You don't see any "${target}" here.` };
        }
        
        if (!obj.canOpen) {
            return { action: 'open', message: `You can't open the ${obj.name}.` };
        }
        
        if (obj.requiresItem && !this.hasItem(obj.requiresItem)) {
            return { action: 'open', message: obj.lockedMessage || `The ${obj.name} is locked.` };
        }
        
        // Open it
        obj.isOpen = true;
        
        if (obj.setsFlag) {
            this.flags[obj.setsFlag] = true;
        }
        
        if (obj.points) {
            this.addScore(obj.points);
        }
        
        // Reveal contents
        if (obj.contains) {
            for (const item of obj.contains) {
                scene.objects.push(item);
            }
        }
        
        return { action: 'open', message: obj.openMessage || `You open the ${obj.name}.` };
    }
    
    handleRead(scene, target) {
        if (!target) {
            return { action: 'read', message: 'Read what?' };
        }
        
        const obj = this.findObject(scene, target) || this.findInventoryItem(target);
        if (!obj) {
            return { action: 'read', message: `You don't see any "${target}" to read.` };
        }
        
        if (!obj.readable) {
            return { action: 'read', message: `You can't read the ${obj.name}.` };
        }
        
        if (obj.setsFlag) {
            this.flags[obj.setsFlag] = true;
        }
        
        if (obj.points && !obj.pointsAwarded) {
            this.addScore(obj.points);
            obj.pointsAwarded = true;
        }
        
        return { action: 'read', message: obj.readText || `The ${obj.name} is blank.` };
    }
    
    handleGive(scene, target) {
        const match = target.match(/(.+?)\s+to\s+(.+)/);
        if (!match) {
            return { action: 'give', message: 'Give what to whom? (e.g., GIVE DOUGHNUT TO UNICORN)' };
        }
        
        const itemName = match[1];
        const npcName = match[2];
        
        const item = this.findInventoryItem(itemName);
        if (!item) {
            return { action: 'give', message: `You don't have "${itemName}".` };
        }
        
        const npc = scene.npcs?.find(n => 
            this.matchesTarget(npcName, n.id) || 
            this.matchesTarget(npcName, n.name)
        );
        
        if (!npc) {
            return { action: 'give', message: `You don't see "${npcName}" here.` };
        }
        
        if (npc.wantsItem && this.matchesTarget(itemName, npc.wantsItem)) {
            // Give the item
            this.inventory = this.inventory.filter(i => i.id !== item.id);
            
            if (npc.giveFlag) {
                this.flags[npc.giveFlag] = true;
            }
            
            if (npc.givePoints) {
                this.addScore(npc.givePoints);
            }
            
            // Give reward
            if (npc.giveReward) {
                this.inventory.push(npc.giveReward);
            }
            
            return { 
                action: 'give', 
                message: npc.giveResponse || `${npc.name} accepts the ${item.name}.`,
                rewardItem: npc.giveReward
            };
        }
        
        return { action: 'give', message: `${npc.name} doesn't want the ${item.name}.` };
    }
    
    handleHelp() {
        const helpText = `
COMMANDS:
LOOK [object] - Examine your surroundings or an object
GET [item] - Pick up an item
USE [item] - Use an item, or USE [item] ON [target]
TALK TO [person] - Talk to someone
GO [direction] - Move (NORTH, SOUTH, EAST, WEST, or location)
OPEN [object] - Open something
READ [object] - Read text
GIVE [item] TO [person] - Give someone an item
INVENTORY - See what you're carrying
LISP - Open the magic LISP terminal
HELP - Show this help

DIRECTIONS: N, S, E, W, ENTER, EXIT

TIP: Type LOOK to see what's around you!`;
        
        return { action: 'help', message: helpText };
    }
    
    handleInventory() {
        if (this.inventory.length === 0) {
            return { action: 'inventory', message: 'You are not carrying anything.' };
        }
        
        const items = this.inventory.map(i => i.name).join(', ');
        return { action: 'inventory', message: `You are carrying: ${items}` };
    }
    
    handleLisp(target) {
        return { 
            action: 'lisp', 
            message: 'Opening the magic LISP terminal...',
            openTerminal: true
        };
    }
    
    handleEat(target) {
        const item = this.findInventoryItem(target);
        if (!item) {
            return { action: 'eat', message: `You don't have any "${target}" to eat.` };
        }
        
        if (item.id.includes('doughnut')) {
            this.inventory = this.inventory.filter(i => i.id !== item.id);
            return { 
                action: 'eat', 
                message: 'Mmm! The doughnut is delicious! Sugary magic tingles through you.' 
            };
        }
        
        return { action: 'eat', message: `You can't eat the ${item.name}.` };
    }
    
    handleCast(target) {
        if (!this.flags.learnedBasicLisp) {
            return { action: 'cast', message: 'You don\'t know any spells yet. Maybe someone can teach you?' };
        }
        
        return { 
            action: 'lisp', 
            message: 'You prepare to cast a spell...',
            openTerminal: true
        };
    }
    
    // Helper methods
    findObject(scene, target) {
        return scene.objects?.find(o => 
            this.matchesTarget(target, o.id) || 
            this.matchesTarget(target, o.name) ||
            o.aliases?.some(a => this.matchesTarget(target, a))
        );
    }
    
    findInventoryItem(target) {
        return this.inventory.find(i => 
            this.matchesTarget(target, i.id) || 
            this.matchesTarget(target, i.name)
        );
    }
    
    hasItem(itemId) {
        return this.inventory.some(i => i.id === itemId || i.name.toLowerCase() === itemId.toLowerCase());
    }
    
    matchesTarget(input, target) {
        if (!input || !target) return false;
        input = input.toLowerCase().trim();
        target = target.toLowerCase().trim();
        return input === target || input.includes(target) || target.includes(input);
    }
    
    getVisibleItems(scene) {
        const items = scene.objects?.filter(o => o.visible !== false) || [];
        if (items.length === 0) return '';
        
        const itemNames = items.map(i => i.name).join(', ');
        return `\n\nYou see: ${itemNames}`;
    }
    
    addScore(points) {
        this.score += points;
        return this.score;
    }
    
    // Puzzle completion
    completePuzzle(puzzleId) {
        if (!this.flags.completedPuzzles.includes(puzzleId)) {
            this.flags.completedPuzzles.push(puzzleId);
            this.flags.spellsLearned++;
        }
    }
    
    // Check win condition
    checkWin() {
        return this.flags.finalSpellCast;
    }
    
    // Save/Load game
    saveGame() {
        return JSON.stringify({
            currentScene: this.currentScene,
            inventory: this.inventory,
            score: this.score,
            flags: this.flags,
            lispEnv: this.lisp.getEnvironment()
        });
    }
    
    loadGame(saveData) {
        try {
            const data = JSON.parse(saveData);
            this.currentScene = data.currentScene;
            this.inventory = data.inventory;
            this.score = data.score;
            this.flags = data.flags;
            this.lisp.environment = data.lispEnv;
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Export
window.GameEngine = GameEngine;
