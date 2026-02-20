// Simple LISP Interpreter for Educational Adventure Game
// Designed to teach basic LISP concepts to children

class LispInterpreter {
    constructor() {
        this.environment = {};
        this.history = [];
        this.puzzleState = {};
        
        // Initialize built-in functions
        this.builtins = {
            // Arithmetic
            '+': (args) => args.reduce((a, b) => a + b, 0),
            '-': (args) => args.length === 1 ? -args[0] : args.reduce((a, b) => a - b),
            '*': (args) => args.reduce((a, b) => a * b, 1),
            '/': (args) => args.reduce((a, b) => a / b),
            
            // Comparison
            '=': (args) => args.every(a => a === args[0]),
            '<': (args) => args[0] < args[1],
            '>': (args) => args[0] > args[1],
            '<=': (args) => args[0] <= args[1],
            '>=': (args) => args[0] >= args[1],
            
            // List operations
            'list': (args) => args,
            'car': (args) => args[0][0],
            'cdr': (args) => args[0].slice(1),
            'cons': (args) => [args[0], ...args[1]],
            'length': (args) => args[0].length,
            'append': (args) => args[0].concat(args[1]),
            'reverse': (args) => [...args[0]].reverse(),
            'first': (args) => args[0][0],
            'rest': (args) => args[0].slice(1),
            'last': (args) => args[0][args[0].length - 1],
            
            // Predicates
            'null?': (args) => args[0] === null || (Array.isArray(args[0]) && args[0].length === 0),
            'number?': (args) => typeof args[0] === 'number',
            'list?': (args) => Array.isArray(args[0]),
            'atom?': (args) => !Array.isArray(args[0]),
            'equal?': (args) => JSON.stringify(args[0]) === JSON.stringify(args[1]),
            
            // String operations (kid-friendly)
            'concat': (args) => args.join(''),
            'upcase': (args) => String(args[0]).toUpperCase(),
            'downcase': (args) => String(args[0]).toLowerCase(),
            
            // Math helpers
            'abs': (args) => Math.abs(args[0]),
            'max': (args) => Math.max(...args),
            'min': (args) => Math.min(...args),
            'mod': (args) => args[0] % args[1],
            
            // Fun functions for kids
            'double': (args) => args[0] * 2,
            'square': (args) => args[0] * args[0],
            'cube': (args) => args[0] * args[0] * args[0],
            
            // Special game functions
            'magic-number': (args) => {
                // Returns a "magic" number based on unicorn lore
                return args[0] * 7; // Unicorns love 7!
            },
            'rainbow-color': (args) => {
                const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
                const index = Math.abs(args[0]) % 7;
                return colors[index];
            },
            'doughnut-power': (args) => {
                // Each doughnut gives power!
                return args[0] * 10 + 5;
            },
            'spell': (args) => {
                // Create a spell from components
                return `SPELL: ${args.join('-')}`;
            },
            // Pre-defined double-magic for the final puzzle (can be overridden by define)
            'double-magic': (args) => args[0] * 2
        };
    }
    
    // Tokenize input string
    tokenize(input) {
        const tokens = [];
        let current = '';
        let inString = false;
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            
            if (char === '"') {
                if (inString) {
                    tokens.push({ type: 'string', value: current });
                    current = '';
                    inString = false;
                } else {
                    if (current) tokens.push(this.classifyToken(current));
                    current = '';
                    inString = true;
                }
            } else if (inString) {
                current += char;
            } else if (char === '(' || char === ')') {
                if (current) {
                    tokens.push(this.classifyToken(current));
                    current = '';
                }
                tokens.push({ type: 'paren', value: char });
            } else if (char === "'" && !current) {
                tokens.push({ type: 'quote', value: "'" });
            } else if (/\s/.test(char)) {
                if (current) {
                    tokens.push(this.classifyToken(current));
                    current = '';
                }
            } else {
                current += char;
            }
        }
        
        if (current) {
            tokens.push(this.classifyToken(current));
        }
        
        return tokens;
    }
    
    classifyToken(str) {
        if (/^-?\d+(\.\d+)?$/.test(str)) {
            return { type: 'number', value: parseFloat(str) };
        }
        if (str === 'true' || str === '#t') {
            return { type: 'boolean', value: true };
        }
        if (str === 'false' || str === '#f' || str === 'nil') {
            return { type: 'boolean', value: false };
        }
        return { type: 'symbol', value: str };
    }
    
    // Parse tokens into AST
    parse(tokens) {
        if (tokens.length === 0) {
            throw new Error('Unexpected end of input');
        }
        
        const token = tokens.shift();
        
        if (token.type === 'quote') {
            return { type: 'quote', value: this.parse(tokens) };
        }
        
        if (token.type === 'paren' && token.value === '(') {
            const list = [];
            while (tokens.length > 0 && !(tokens[0].type === 'paren' && tokens[0].value === ')')) {
                list.push(this.parse(tokens));
            }
            if (tokens.length === 0) {
                throw new Error('Missing closing parenthesis )');
            }
            tokens.shift(); // Remove closing paren
            return { type: 'list', value: list };
        }
        
        if (token.type === 'paren' && token.value === ')') {
            throw new Error('Unexpected closing parenthesis');
        }
        
        return token;
    }
    
    // Evaluate AST
    evaluate(ast, env = null) {
        if (env === null) {
            env = { ...this.environment };
        }
        
        if (ast.type === 'number' || ast.type === 'string' || ast.type === 'boolean') {
            return ast.value;
        }
        
        if (ast.type === 'quote') {
            return this.quoteValue(ast.value);
        }
        
        if (ast.type === 'symbol') {
            const name = ast.value;
            if (name in env) {
                return env[name];
            }
            if (name in this.builtins) {
                return { type: 'builtin', name: name };
            }
            throw new Error(`Unknown variable: ${name}`);
        }
        
        if (ast.type === 'list') {
            if (ast.value.length === 0) {
                return [];
            }
            
            const first = ast.value[0];
            
            // Special forms
            if (first.type === 'symbol') {
                switch (first.value) {
                    case 'define':
                    case 'def':
                        const varName = ast.value[1].value;
                        const varValue = this.evaluate(ast.value[2], env);
                        this.environment[varName] = varValue;
                        env[varName] = varValue;
                        return varValue;
                    
                    case 'set!':
                        const setName = ast.value[1].value;
                        const setValue = this.evaluate(ast.value[2], env);
                        if (!(setName in env) && !(setName in this.environment)) {
                            throw new Error(`Cannot set undefined variable: ${setName}`);
                        }
                        this.environment[setName] = setValue;
                        env[setName] = setValue;
                        return setValue;
                    
                    case 'if':
                        const condition = this.evaluate(ast.value[1], env);
                        if (condition && condition !== 'nil' && condition !== false) {
                            return this.evaluate(ast.value[2], env);
                        } else if (ast.value[3]) {
                            return this.evaluate(ast.value[3], env);
                        }
                        return null;
                    
                    case 'cond':
                        for (let i = 1; i < ast.value.length; i++) {
                            const clause = ast.value[i].value;
                            const test = clause[0].value === 'else' ? true : this.evaluate(clause[0], env);
                            if (test && test !== false && test !== 'nil') {
                                return this.evaluate(clause[1], env);
                            }
                        }
                        return null;
                    
                    case 'lambda':
                    case 'fn':
                        const params = ast.value[1].value.map(p => p.value);
                        const body = ast.value[2];
                        return { type: 'lambda', params, body, env: { ...env } };
                    
                    case 'let':
                        const letBindings = ast.value[1].value;
                        const letEnv = { ...env };
                        for (const binding of letBindings) {
                            const bName = binding.value[0].value;
                            const bValue = this.evaluate(binding.value[1], letEnv);
                            letEnv[bName] = bValue;
                        }
                        return this.evaluate(ast.value[2], letEnv);
                    
                    case 'begin':
                    case 'do':
                        let result = null;
                        for (let i = 1; i < ast.value.length; i++) {
                            result = this.evaluate(ast.value[i], env);
                        }
                        return result;
                    
                    case 'quote':
                        return this.quoteValue(ast.value[1]);
                    
                    case 'and':
                        for (let i = 1; i < ast.value.length; i++) {
                            const val = this.evaluate(ast.value[i], env);
                            if (!val || val === false || val === 'nil') {
                                return false;
                            }
                        }
                        return true;
                    
                    case 'or':
                        for (let i = 1; i < ast.value.length; i++) {
                            const val = this.evaluate(ast.value[i], env);
                            if (val && val !== false && val !== 'nil') {
                                return val;
                            }
                        }
                        return false;
                    
                    case 'not':
                        const notVal = this.evaluate(ast.value[1], env);
                        return !notVal || notVal === false || notVal === 'nil';
                }
            }
            
            // Function application
            const func = this.evaluate(first, env);
            const args = ast.value.slice(1).map(arg => this.evaluate(arg, env));
            
            if (func && func.type === 'builtin') {
                return this.builtins[func.name](args);
            }
            
            if (func && func.type === 'lambda') {
                const lambdaEnv = { ...func.env };
                for (let i = 0; i < func.params.length; i++) {
                    lambdaEnv[func.params[i]] = args[i];
                }
                return this.evaluate(func.body, lambdaEnv);
            }
            
            throw new Error(`Cannot apply: ${JSON.stringify(first)}`);
        }
        
        throw new Error(`Unknown AST node type: ${ast.type}`);
    }
    
    quoteValue(ast) {
        if (ast.type === 'number' || ast.type === 'string' || ast.type === 'boolean') {
            return ast.value;
        }
        if (ast.type === 'symbol') {
            return ast.value;
        }
        if (ast.type === 'list') {
            return ast.value.map(item => this.quoteValue(item));
        }
        return ast;
    }
    
    // Main execution function
    execute(input) {
        try {
            const tokens = this.tokenize(input);
            if (tokens.length === 0) {
                return { success: true, result: null };
            }
            
            const ast = this.parse(tokens);
            const result = this.evaluate(ast);
            
            this.history.push({ input, result, success: true });
            
            return { success: true, result: this.formatResult(result) };
        } catch (error) {
            this.history.push({ input, error: error.message, success: false });
            return { success: false, error: error.message };
        }
    }
    
    formatResult(result) {
        if (result === null || result === undefined) {
            return 'nil';
        }
        if (Array.isArray(result)) {
            return '(' + result.map(r => this.formatResult(r)).join(' ') + ')';
        }
        if (typeof result === 'object' && result.type === 'lambda') {
            return '#<lambda>';
        }
        if (typeof result === 'object' && result.type === 'builtin') {
            return `#<builtin:${result.name}>`;
        }
        if (typeof result === 'boolean') {
            return result ? '#t' : '#f';
        }
        return String(result);
    }
    
    // Puzzle checking functions
    checkPuzzle(puzzleId, input) {
        const puzzles = {
            // Puzzle 1: Basic addition
            'add-spell': {
                description: 'Use + to add 3 and 4 together',
                hint: 'Try: (+ 3 4)',
                check: (result) => result === '7',
                teaching: 'Great! In LISP, we write (+ 3 4) instead of 3 + 4. The operator comes first!'
            },
            
            // Puzzle 2: Multiple addition
            'rainbow-bridge': {
                description: 'Add all 7 rainbow colors: (+ 1 2 3 4 5 6 7)',
                hint: 'In LISP, + can add many numbers at once!',
                check: (result) => result === '28',
                teaching: 'Amazing! LISP can add as many numbers as you want in one expression!'
            },
            
            // Puzzle 3: Define a variable
            'name-unicorn': {
                description: 'Give the unicorn a name using: (define unicorn-name "Sparkle")',
                hint: 'Use define to create a variable',
                check: (result, interpreter) => interpreter.environment['unicorn-name'] !== undefined,
                teaching: 'You created a variable! Variables store values we can use later.'
            },
            
            // Puzzle 4: Use a list
            'gather-ingredients': {
                description: 'Create a list of ingredients: (list "sugar" "flour" "magic")',
                hint: 'Use the list function to group items together',
                check: (result) => result.includes('sugar') && result.includes('flour') && result.includes('magic'),
                teaching: 'Lists are one of the most important ideas in LISP! They hold groups of things.'
            },
            
            // Puzzle 5: Multiplication for doughnuts
            'doughnut-recipe': {
                description: 'Calculate doughnuts: If you have 6 boxes with 12 doughnuts each, how many total? (* 6 12)',
                hint: 'Use * for multiplication',
                check: (result) => result === '72',
                teaching: 'Yum! You just used LISP to solve a real math problem!'
            },
            
            // Puzzle 6: First of a list (car)
            'first-color': {
                description: 'Get the first color from the rainbow: (first (list "red" "orange" "yellow"))',
                hint: 'Use first (or car) to get the first item in a list',
                check: (result) => result === 'red',
                teaching: 'In LISP, "first" or "car" gets the first item. "car" is the traditional name!'
            },
            
            // Puzzle 7: Conditional
            'unlock-door': {
                description: 'Write a spell: (if (> 10 5) "open" "closed")',
                hint: 'if checks a condition and returns one of two values',
                check: (result) => result === 'open',
                teaching: 'Conditionals let programs make decisions! If something is true, do one thing; otherwise, do another.'
            },
            
            // Puzzle 8: Define a function
            'create-spell': {
                description: 'Create a doubling spell: (define double-magic (lambda (x) (* x 2)))',
                hint: 'lambda creates a new function',
                check: (result, interpreter) => interpreter.environment['double-magic'] !== undefined,
                teaching: 'You created a function! Functions are reusable pieces of magic (code)!'
            },
            
            // Puzzle 9: Use the function
            'cast-spell': {
                description: 'Use your spell on 21: (double-magic 21)',
                hint: 'Call your function with a number',
                check: (result) => result === '42',
                teaching: '42 - the answer to everything! You called a function you created!'
            },
            
            // Puzzle 10: Final challenge - combine concepts
            'final-spell': {
                description: 'Calculate the magic number: (+ (double-magic 10) (* 7 3) (length (list 1 2 3 4 5)))',
                hint: 'Combine addition, your function, multiplication, and length',
                check: (result) => result === '46',
                teaching: 'You\'ve mastered the basics of LISP! You combined functions, math, and lists!'
            }
        };
        
        const puzzle = puzzles[puzzleId];
        if (!puzzle) {
            return { valid: false, error: 'Unknown puzzle' };
        }
        
        const execution = this.execute(input);
        if (!execution.success) {
            return { 
                valid: false, 
                error: execution.error,
                hint: puzzle.hint
            };
        }
        
        const passed = puzzle.check(execution.result, this);
        
        return {
            valid: passed,
            result: execution.result,
            teaching: passed ? puzzle.teaching : null,
            hint: passed ? null : puzzle.hint,
            description: puzzle.description
        };
    }
    
    // Get hints for current puzzle
    getPuzzleHint(puzzleId) {
        const hints = {
            'add-spell': [
                'LISP puts the operator FIRST, inside parentheses',
                'Instead of 3 + 4, we write (+ 3 4)',
                'The + sign comes before the numbers!'
            ],
            'rainbow-bridge': [
                'You can add more than two numbers!',
                '(+ 1 2 3) adds 1, 2, and 3 together',
                'Try: (+ 1 2 3 4 5 6 7)'
            ],
            'name-unicorn': [
                'define creates a new variable',
                'Put the name first, then the value',
                '(define name value) - like (define age 10)'
            ],
            'gather-ingredients': [
                'list creates a group of items',
                'Put quotes around text strings',
                '(list "item1" "item2" "item3")'
            ],
            'doughnut-recipe': [
                '* is for multiplication',
                '6 boxes times 12 doughnuts',
                '(* 6 12)'
            ],
            'first-color': [
                'first gives you the first item in a list',
                'You need to create a list first',
                '(first (list "a" "b" "c")) gives "a"'
            ],
            'unlock-door': [
                'if takes 3 parts: condition, then, else',
                '> checks if one number is greater',
                '(if condition true-result false-result)'
            ],
            'create-spell': [
                'lambda creates a function',
                '(x) is the input parameter',
                '(* x 2) multiplies the input by 2'
            ],
            'cast-spell': [
                'Call a function by putting it first',
                'Then put the argument after it',
                '(function-name argument)'
            ],
            'final-spell': [
                'Break it into parts!',
                '(double-magic 10) = 20',
                '(* 7 3) = 21, (length (list 1 2 3 4 5)) = 5'
            ]
        };
        
        return hints[puzzleId] || ['Think carefully about the syntax!'];
    }
    
    // Reset interpreter state
    reset() {
        this.environment = {};
        this.history = [];
        this.puzzleState = {};
    }
    
    // Get defined variables (for debugging/display)
    getEnvironment() {
        return { ...this.environment };
    }
}

// Export
window.LispInterpreter = LispInterpreter;
