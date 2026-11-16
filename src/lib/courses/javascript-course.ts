import { CourseConcept } from '../kids-courses-types';

export const JAVASCRIPT_CONCEPTS: CourseConcept[] = [
  {
    id: 'intro',
    title: 'JavaScript Intro, Get Started & Syntax',
    order: 1,
    language: 'javascript',
    summary: 'What is JavaScript, Node.js & browser runtimes, script execution, statements, and semicolon rules.',
    overview: 'JavaScript is a high-level, dynamic, single-threaded language created by Brendan Eich in 1995. It powers the modern web, backend APIs via Node.js, and browser-driven end-to-end automation frameworks like Playwright and Cypress. Code is parsed and compiled Just-In-Time (JIT) by engines like Google V8.',
    keyPoints: [
      'Multi-paradigm: supports event-driven, functional, and object-oriented programming styles',
      'Runtimes: runs natively inside every modern web browser and on server backends via Node.js / Bun',
      'Syntax: uses curly braces {} for code blocks and camelCase for identifier naming',
      'Statements & Semicolons: JavaScript features Automatic Semicolon Insertion (ASI), though explicit semicolons are standard',
    ],
    starterCode: `// 1. JavaScript Intro, Get Started & Syntax
const language = "JavaScript";
const runtime = typeof window !== "undefined" ? "Browser (DOM)" : "Node.js (Server/SDET)";
const standard = "ECMAScript 2026 (ESNext)";

console.log("⚡ Welcome to " + language + "!");
console.log("Runtime Environment: " + runtime);
console.log("Language Standard: " + standard);

// Syntax Demo: Code Block & Condition
const isReady = true;
if (isReady) {
  console.log("  ✓ Syntax Block: Curly braces define execution scope");
  console.log("  ✓ Test automation ready!");
}
`,
    bestPractices: [
      'Always write modern ES6+ code using const and let rather than legacy var.',
      'Use strict equality (===) to prevent unexpected type coercion bugs.',
      'Format consistently using Prettier or ESLint standards across your test repositories.',
    ],
  },
  {
    id: 'output',
    title: 'JavaScript Output',
    order: 2,
    language: 'javascript',
    summary: 'console.log(), console.error(), console.table(), and template literals formatting.',
    overview: 'JavaScript provides rich logging utilities via the console object. Beyond simple logging, you can format structured tables with console.table(), warn with console.warn(), and time execution with console.time().',
    keyPoints: [
      'console.log() outputs standard info messages',
      'console.table() formats arrays and objects as clean ASCII tables',
      'console.time() and console.timeEnd() measure code execution speed',
      'Template literals (\`...\`) allow multiline strings and embedded expressions',
    ],
    starterCode: `// 2. JavaScript Output & Console Tools
const testSuite = {
  suite: "Payment Gateway",
  passed: 24,
  failed: 1,
  durationMs: 450
};

console.log("Standard Log:", testSuite.suite);
console.warn("Warning: 1 test retry detected.");

// Formatted table output
const testCases = [
  { id: "TC-01", name: "Valid Card Checkout", status: "PASS" },
  { id: "TC-02", name: "Expired Card Decline", status: "PASS" },
  { id: "TC-03", name: "Insufficient Funds", status: "FAIL" }
];
console.table(testCases);
`,
    bestPractices: [
      'Strip out redundant console.log statements from production code or use a dedicated logging library.',
    ],
  },
  {
    id: 'comments',
    title: 'JavaScript Comments',
    order: 3,
    language: 'javascript',
    summary: 'Single-line comments (//), multi-line comments (/* ... */), and JSDoc annotations.',
    overview: 'Comments explain code logic and document parameters. JSDoc comments (@param, @returns) enable rich TypeScript-like IDE autocompletion and type validation in plain JavaScript files.',
    keyPoints: [
      'Single-line comments start with //',
      'Multi-line comments are enclosed between /* and */',
      'JSDoc blocks start with /** and document types with tags like @param and @returns',
    ],
    starterCode: `// 3. JavaScript Comments & JSDoc

// Single line comment: Config URL
const BASE_URL = "https://staging.intelligentqa.com";

/**
 * Validates whether an HTTP status code signifies success.
 * @param {number} statusCode - The HTTP response code.
 * @returns {boolean} True if status is 2xx.
 */
function isSuccess(statusCode) {
  /* Check if status is between
     200 and 299 inclusive */
  return statusCode >= 200 && statusCode < 300;
}

console.log("HTTP 200 is success:", isSuccess(200));
console.log("HTTP 404 is success:", isSuccess(404));
`,
    bestPractices: [
      'Use JSDoc comments above automation utility functions to give your team autocomplete hints in VS Code.',
    ],
  },
  {
    id: 'variables',
    title: 'JavaScript Variables & Scope',
    order: 4,
    language: 'javascript',
    summary: 'Declaring variables with let, const, and var, block scope, temporal dead zone, and reassignment.',
    overview: 'Modern JavaScript uses const for immutable references and let for mutable variables. Both are block-scoped. The legacy var keyword is function-scoped and subject to hoisting bugs.',
    keyPoints: [
      'const prevents variable identifier reassignment; use by default',
      'let allows reassigning values and is strictly block-scoped to {}',
      'var is hoisted and function-scoped; avoid in modern development',
      'Naming convention: camelCase for variables/functions, UPPER_SNAKE_CASE for constants',
    ],
    starterCode: `// 4. JavaScript Variables: const vs let
const MAX_RETRIES = 3; // Cannot be reassigned
let currentAttempt = 0; // Can be reassigned

while (currentAttempt < MAX_RETRIES) {
  currentAttempt++;
  const attemptTimestamp = Date.now(); // Block-scoped to while loop
  console.log(\`Attempt #\${currentAttempt} at \${attemptTimestamp}\`);
}

console.log("Final Attempts:", currentAttempt);
`,
    bestPractices: [
      'Default to const everywhere; only change to let if you explicitly need reassignment.',
      'Remember that const objects/arrays can still have their internal properties mutated.',
    ],
  },
  {
    id: 'data-types',
    title: 'JavaScript Data Types & Primitives',
    order: 5,
    language: 'javascript',
    summary: 'The 7 primitive types (string, number, boolean, null, undefined, symbol, bigint) and objects.',
    overview: 'JavaScript has 7 primitive types that are immutable and passed by value, and one complex Object type (including arrays, functions, and plain objects) that is mutable and passed by reference.',
    keyPoints: [
      'Primitives: string, number, bigint, boolean, undefined, symbol, null',
      'typeof undefined is "undefined"; typeof null is historically "object"',
      'Primitives are stored directly on the call stack and compared by value',
      'Objects and Arrays are stored in heap memory and compared by reference',
    ],
    starterCode: `// 5. JavaScript Data Types & Type Inspection
const items = [
  "Playwright",
  42,
  9007199254740991n, // BigInt
  true,
  undefined,
  null,
  Symbol("id"),
  { test: "Login" },
  [1, 2, 3]
];

items.forEach(item => {
  console.log(\`Value: \${String(item)} | typeof: \${typeof item}\`);
});
`,
    bestPractices: [
      'Always check for null explicitly (val === null) because typeof null evaluates to "object".',
      'Use undefined for variables that haven\'t been set, and null for intentional empty values.',
    ],
  },
  {
    id: 'numbers',
    title: 'JavaScript Numbers & Math',
    order: 6,
    language: 'javascript',
    summary: 'Double-precision floats, integer safety, NaN, Infinity, and the built-in Math object.',
    overview: 'All numbers in JavaScript are 64-bit IEEE 754 floating-point numbers. The Math object provides static methods for trigonometry, rounding, powers, and pseudorandom numbers.',
    keyPoints: [
      'Number.isInteger(x) checks if a number has no fractional component',
      'NaN (Not-a-Number) results from invalid math (e.g. 0 / 0 or parseInt("abc"))',
      'Number.isNaN(x) is the only reliable way to check for NaN (NaN === NaN is false!)',
      'Math.floor(), Math.ceil(), Math.round(), Math.random(), Math.max()',
    ],
    starterCode: `// 6. JavaScript Numbers and Math Operations
const price = 49.99;
const discount = 0.15;
const discountedPrice = price * (1 - discount);

console.log("Discounted Price:", discountedPrice.toFixed(2));
console.log("Math.round:", Math.round(discountedPrice));
console.log("Math.ceil:", Math.ceil(discountedPrice));
console.log("Math.floor:", Math.floor(discountedPrice));

// Generating a random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log("Random Test Port:", getRandomInt(3000, 9000));
`,
    bestPractices: [
      'Be cautious with float rounding errors (0.1 + 0.2 !== 0.3); use Math.round or scaled cents.',
    ],
  },
  {
    id: 'casting',
    title: 'JavaScript Type Casting & Coercion',
    order: 7,
    language: 'javascript',
    summary: 'Explicit conversion (Number(), String(), Boolean()) vs implicit coercion, and strict equality (===).',
    overview: 'JavaScript can convert types explicitly or implicitly. Implicit coercion happens automatically when operators like + or == are applied to mismatched types, often causing unexpected bugs.',
    keyPoints: [
      'Explicit casting: Number("123"), String(456), Boolean(0)',
      'Unary plus operator +str converts strings to numbers quickly (e.g. +"42" === 42)',
      'Strict equality === checks both value and type without coercion',
      'Loose equality == coerces types (e.g. "0" == 0 is true, but "0" === 0 is false)',
    ],
    starterCode: `// 7. JavaScript Type Casting & Strict Equality
const rawInput = "100";
const explicitNumber = Number(rawInput);
const unaryNumber = +rawInput;

console.log("Explicit cast:", explicitNumber, typeof explicitNumber);
console.log("Unary plus cast:", unaryNumber, typeof unaryNumber);

// Comparison pitfalls: == vs ===
console.log('"5" == 5 (Loose equality):', "5" == 5);
console.log('"5" === 5 (Strict equality):', "5" === 5);
console.log('null == undefined:', null == undefined);
console.log('null === undefined:', null === undefined);
`,
    bestPractices: [
      'Always use strict equality === and strict inequality !==; never use loose == or !=.',
      'Use Number.parseInt(val, 10) specifying radix 10 to parse integers safely.',
    ],
  },
  {
    id: 'strings',
    title: 'JavaScript Strings & Template Literals',
    order: 8,
    language: 'javascript',
    summary: 'Indexing, slicing, substring, trim, split, replace, regular expressions, and template literals.',
    overview: 'Strings are immutable UTF-16 character sequences. Modern JavaScript provides rich string methods along with backtick template literals for interpolation and multiline strings.',
    keyPoints: [
      'Template literals \`\${expr}\` interpolate variables and inline code expressions',
      'Common methods: .trim(), .toLowerCase(), .toUpperCase(), .includes(), .startsWith()',
      '.slice(start, end) extracts parts of a string without modifying the original',
      '.split(delimiter) and .join(delimiter) convert strings to arrays and back',
    ],
    starterCode: `// 8. JavaScript Strings & Methods
const rawHeader = "   Authorization: Bearer eyJhbGciOiJIUzI1Ni...   ";

const cleaned = rawHeader.trim();
console.log("Trimmed:", cleaned);
console.log("Starts with Authorization:", cleaned.startsWith("Authorization"));

const parts = cleaned.split(" ");
const tokenType = parts[0].replace(":", "");
const token = parts[1];

console.log(\`Token Type: \${tokenType}\`);
console.log(\`Token Preview: \${token.slice(0, 15)}...\`);
`,
    bestPractices: [
      'Use .includes(substr) instead of the old indexOf(substr) !== -1.',
      'Use .replaceAll() when replacing all occurrences of a string without complex regex.',
    ],
  },
  {
    id: 'booleans',
    title: 'JavaScript Booleans & Truthy/Falsy',
    order: 9,
    language: 'javascript',
    summary: 'Boolean logic, truthy and falsy values, logical operators (&&, ||, !), and nullish coalescing (??).',
    overview: 'In JavaScript, any value can be evaluated in a boolean context. Values are categorized as either truthy or falsy. Modern JavaScript also includes the nullish coalescing operator ?? for safe defaults.',
    keyPoints: [
      'Only 8 values are Falsy: false, 0, -0, 0n, "", null, undefined, NaN',
      'Everything else is Truthy, including empty arrays [] and empty objects {}',
      '|| returns the first truthy value or fallback',
      '?? (nullish coalescing) only falls back if value is null or undefined (not 0 or "")',
    ],
    starterCode: `// 9. JavaScript Booleans & Nullish Coalescing (??)
const timeoutConfig = 0; // 0 is a valid timeout, but falsy!

// || replaces 0 with 5000 because 0 is falsy! (Bug!)
const buggyTimeout = timeoutConfig || 5000;

// ?? preserves 0 because 0 is neither null nor undefined! (Correct!)
const safeTimeout = timeoutConfig ?? 5000;

console.log("Buggy Timeout (||):", buggyTimeout);
console.log("Safe Timeout (??):", safeTimeout);

// Truthy evaluation of empty arrays
console.log("Boolean([]):", Boolean([])); // true!
console.log("Boolean({}):", Boolean({})); // true!
`,
    bestPractices: [
      'Always use ?? (nullish coalescing) instead of || when assigning default options where 0 or "" are valid.',
      'Remember that empty arrays [] and objects {} are truthy in JavaScript (unlike Python).',
    ],
  },
  {
    id: 'operators',
    title: 'JavaScript Operators & Expressions',
    order: 10,
    language: 'javascript',
    summary: 'Arithmetic, assignment, comparison, logical, ternary, optional chaining (?.), and typeof.',
    overview: 'Operators perform computations, assignments, and structural property checks. Optional chaining ?. prevents "Cannot read properties of undefined" runtime crashes.',
    keyPoints: [
      'Arithmetic: +, -, *, /, % (remainder), ** (exponentiation)',
      'Logical assignment: &&=, ||=, ??=',
      'Optional chaining: user?.profile?.email returns undefined instead of throwing error',
      'Ternary operator: condition ? exprIfTrue : exprIfFalse',
    ],
    starterCode: `// 10. JavaScript Operators & Optional Chaining (?.)
const userResponse = {
  id: 101,
  name: "Alex",
  // profile is missing
};

// Without optional chaining, userResponse.profile.avatar throws TypeError!
// With optional chaining ?., it safely yields undefined:
const avatarUrl = userResponse?.profile?.avatar ?? "https://avatar.default.png";
console.log("Avatar URL:", avatarUrl);

// Exponentiation and Ternary
const memoryMb = 2 ** 10; // 1024
const tier = memoryMb >= 1024 ? "High Memory" : "Standard";
console.log(\`Memory: \${memoryMb} MB (\${tier})\`);
`,
    bestPractices: [
      'Use optional chaining (?.) when accessing deep API response payloads that may contain null fields.',
    ],
  },
  {
    id: 'arrays',
    title: 'JavaScript Arrays & Methods',
    order: 11,
    language: 'javascript',
    summary: 'Array creation, indexing, mutating methods (push, pop, shift, unshift, splice), and slicing.',
    overview: 'JavaScript arrays are ordered lists of values. They are dynamic, resizable, and can hold mixed types. Arrays provide built-in methods for queue and stack behaviors.',
    keyPoints: [
      'push() / pop() add and remove elements from the end (Stack: LIFO)',
      'unshift() / shift() add and remove elements from the beginning (Queue: FIFO)',
      'slice(start, end) returns a shallow copy of a portion of an array without mutating',
      'splice(start, count, ...items) mutates the array by deleting or inserting elements in place',
    ],
    starterCode: `// 11. JavaScript Arrays & Operations
const testQueue = ["Login Test", "Cart Test"];

// Queue operations
testQueue.push("Checkout Test"); // Add to end
testQueue.push("Payment Test");
console.log("Initial Queue:", testQueue);

const runningNow = testQueue.shift(); // Remove from front
console.log("Running Now:", runningNow);
console.log("Remaining Queue:", testQueue);

// Slicing without mutating
const nextTwo = testQueue.slice(0, 2);
console.log("Next Two:", nextTwo);
`,
    bestPractices: [
      'Prefer non-mutating methods (slice, concat, spread [...arr]) over mutating methods (splice) in functional code.',
    ],
  },
  {
    id: 'array-iteration',
    title: 'JavaScript Array Iteration (map, filter, reduce)',
    order: 12,
    language: 'javascript',
    summary: 'Functional array processing using forEach, map, filter, find, some, every, and reduce.',
    overview: 'Modern JavaScript favors functional transformations over traditional index-based for loops. Higher-order methods like map and filter produce clean, declarative data processing pipelines.',
    keyPoints: [
      'map(fn) transforms every element and returns a new array of the same length',
      'filter(fn) returns a new array with elements that pass the test function',
      'reduce(fn, init) accumulates all elements into a single computed value',
      'find(fn) returns the first matching element, or undefined if none match',
    ],
    starterCode: `// 12. JavaScript Array Iteration Pipelines
const testRuns = [
  { id: 1, name: "API Auth", durationMs: 120, passed: true },
  { id: 2, name: "UI Checkout", durationMs: 850, passed: false },
  { id: 3, name: "DB Health", durationMs: 95, passed: true },
  { id: 4, name: "Email Worker", durationMs: 310, passed: true }
];

// Filter passed tests
const passedTests = testRuns.filter(t => t.passed);
console.log("Passed Tests Count:", passedTests.length);

// Map to extract names
const testNames = testRuns.map(t => t.name);
console.log("All Test Names:", testNames);

// Reduce to calculate total suite duration
const totalDuration = testRuns.reduce((sum, t) => sum + t.durationMs, 0);
console.log(\`Total Execution Time: \${totalDuration} ms\`);
`,
    bestPractices: [
      'Chain .filter().map() for concise transformations, but use .reduce() if you need to calculate both in one pass.',
      'Always provide an initial value (e.g. 0 or []) as the second argument to reduce().',
    ],
  },
  {
    id: 'objects',
    title: 'JavaScript Objects & Properties',
    order: 13,
    language: 'javascript',
    summary: 'Object literals, dot and bracket notation, methods, Object.keys(), Object.values(), and Object.entries().',
    overview: 'Objects are collections of key-value properties. Keys are strings (or Symbols), and values can be any type including functions (methods). Objects form the foundation of JavaScript architecture.',
    keyPoints: [
      'Created with object literal syntax: const obj = { key: "value" }',
      'Access properties with dot notation (obj.key) or bracket notation (obj["key"])',
      'Object.keys(), Object.values(), and Object.entries() iterate object keys and values',
      'Object.freeze(obj) prevents adding, deleting, or modifying properties',
    ],
    starterCode: `// 13. JavaScript Objects & Inspection
const environmentConfig = {
  env: "staging",
  baseUrl: "https://staging.app.com",
  timeoutMs: 30000,
  headless: true
};

// Accessing properties
console.log("Base URL:", environmentConfig.baseUrl);
console.log("Dynamic Key Lookup:", environmentConfig["timeoutMs"]);

// Inspecting entries
console.log("--- Config Key-Value Pairs ---");
for (const [key, value] of Object.entries(environmentConfig)) {
  console.log(\`\${key}: \${value}\`);
}
`,
    bestPractices: [
      'Use bracket notation when property keys contain spaces, hyphens, or are computed dynamically.',
      'Use structuredClone(obj) to deep clone objects rather than shallow Object.assign() or {...obj}.',
    ],
  },
  {
    id: 'if-else',
    title: 'JavaScript If...Else & Conditions',
    order: 14,
    language: 'javascript',
    summary: 'if, else if, else branching, nested conditions, and ternary operator expressions.',
    overview: 'Conditional statements control the execution flow of programs based on boolean expressions.',
    keyPoints: [
      'Syntax: if (condition) { ... } else if (other) { ... } else { ... }',
      'Curly braces are recommended even for single-line blocks to avoid bugs',
      'Ternary conditional: const status = score >= 70 ? "Pass" : "Fail"',
    ],
    starterCode: `// 14. JavaScript If...Else & Guard Clauses
function evaluateStatus(statusCode) {
  if (statusCode >= 200 && statusCode < 300) {
    return "SUCCESS: Request completed successfully.";
  } else if (statusCode >= 400 && statusCode < 500) {
    return "CLIENT ERROR: Invalid request payload.";
  } else if (statusCode >= 500) {
    return "SERVER ERROR: Downstream microservice failure.";
  } else {
    return "UNKNOWN STATUS";
  }
}

console.log(evaluateStatus(200));
console.log(evaluateStatus(401));
console.log(evaluateStatus(503));
`,
    bestPractices: [
      'Use guard clauses with early returns inside functions to keep nesting flat and readable.',
    ],
  },
  {
    id: 'switch',
    title: 'JavaScript Switch Statements',
    order: 15,
    language: 'javascript',
    summary: 'The switch statement, case clauses, break keyword, and default fallback.',
    overview: 'A switch statement evaluates an expression matching against multiple case clauses using strict equality (===).',
    keyPoints: [
      'Uses strict equality === to compare the expression with case values',
      'break terminates the switch block and prevents fall-through into next cases',
      'default clause executes when no cases match',
    ],
    starterCode: `// 15. JavaScript Switch Statement
const browser = "firefox";

switch (browser.toLowerCase()) {
  case "chromium":
  case "chrome":
    console.log("Launching Chromium engine with DevTools protocol.");
    break;
  case "firefox":
    console.log("Launching Gecko engine with Marionette.");
    break;
  case "webkit":
  case "safari":
    console.log("Launching WebKit engine.");
    break;
  default:
    console.warn(\`Unsupported browser: \${browser}\`);
}
`,
    bestPractices: [
      'Always remember to add break; to each case unless intentional fall-through is required.',
      'Consider object lookups (const handlers = { chrome: () => ... }) as a cleaner alternative to huge switches.',
    ],
  },
  {
    id: 'while-loops',
    title: 'JavaScript While & Do-While Loops',
    order: 16,
    language: 'javascript',
    summary: 'while loops, do...while loops, break, and continue statements.',
    overview: 'A while loop executes statements as long as its condition evaluates to true. A do...while loop always executes its body at least once before testing the condition.',
    keyPoints: [
      'while (condition) { ... } checks before execution',
      'do { ... } while (condition); executes body once before checking condition',
      'break exits the loop immediately; continue skips to the next iteration',
    ],
    starterCode: `// 16. JavaScript While & Do-While Loops
let attempts = 0;
const maxAttempts = 3;
let connected = false;

while (attempts < maxAttempts && !connected) {
  attempts++;
  console.log(\`Connecting to WebSocket (Attempt \${attempts}/\${maxAttempts})...\`);
  if (attempts === 2) {
    connected = true;
    console.log("WebSocket connection established!");
  }
}

// Do-while: Runs at least once
let counter = 0;
do {
  counter++;
  console.log("do-while iteration:", counter);
} while (counter < 1);
`,
    bestPractices: [
      'Always ensure the terminating condition increments or changes to avoid infinite loop locks.',
    ],
  },
  {
    id: 'for-loops',
    title: 'JavaScript For Loops (for, for...in, for...of)',
    order: 17,
    language: 'javascript',
    summary: 'Standard for loops, for...of for iterables, and for...in for object keys.',
    overview: 'JavaScript provides 3 distinct for loop constructs: traditional for(;;), for...of for iterating array values and strings, and for...in for iterating enumerable object property keys.',
    keyPoints: [
      'for (let i = 0; i < len; i++) is the traditional index loop',
      'for (const item of iterable) iterates values of arrays, sets, maps, strings',
      'for (const key in object) iterates property keys of objects',
      'Never use for...in on arrays because it iterates arbitrary property names and indices as strings',
    ],
    starterCode: `// 17. JavaScript For Loops Comparison
const testSuites = ["Auth", "Billing", "Search"];

// 1. for...of loop (Best for Arrays!)
console.log("--- for...of Array Values ---");
for (const suite of testSuites) {
  console.log("Suite:", suite);
}

// 2. for...in loop (Best for Object Keys!)
const metrics = { passed: 98, failed: 2, skipped: 0 };
console.log("\\n--- for...in Object Keys ---");
for (const key in metrics) {
  console.log(\`\${key}: \${metrics[key]}\`);
}
`,
    bestPractices: [
      'Use for...of for arrays and iterables; use for...in only for iterating plain object keys.',
    ],
  },
  {
    id: 'functions',
    title: 'JavaScript Functions & Arrow Functions',
    order: 18,
    language: 'javascript',
    summary: 'Function declarations, expressions, arrow functions (=>), default parameters, and rest parameters.',
    overview: 'Functions encapsulate reusable behavior. Modern JavaScript uses arrow functions () => {} extensively for concise callbacks and lexical this binding.',
    keyPoints: [
      'Function declarations function foo() {} are hoisted to the top of their scope',
      'Arrow functions const foo = () => {} have concise syntax and lexically bind this',
      'Default parameters: function connect(port = 8080) { ... }',
      'Rest parameters gather arguments into an array: function logAll(...messages) { ... }',
    ],
    starterCode: `// 18. JavaScript Functions & Arrow Syntax
// Standard Function
function add(a, b = 0) {
  return a + b;
}

// Arrow Function with implicit return
const multiply = (a, b) => a * b;

// Rest parameters
const summarizeTests = (suiteName, ...testResults) => {
  const total = testResults.length;
  const passed = testResults.filter(Boolean).length;
  return \`[\${suiteName}] Passed \${passed}/\${total}\`;
};

console.log("Sum:", add(10, 5));
console.log("Product:", multiply(4, 7));
console.log(summarizeTests("Smoke Suite", true, true, false, true));
`,
    bestPractices: [
      'Use arrow functions for callbacks and array methods (map, filter).',
      'Use named function declarations for top-level utility functions for clear stack traces in errors.',
    ],
  },
  {
    id: 'scope',
    title: 'JavaScript Scope & Closures',
    order: 19,
    language: 'javascript',
    summary: 'Lexical scope, block scope, hoisting, closures, and data encapsulation.',
    overview: 'A closure is the combination of a function bundled together with references to its surrounding lexical state. Closures allow inner functions to access outer scope variables even after the outer function has finished executing.',
    keyPoints: [
      'Block scope: let and const are confined to their enclosing {} block',
      'Lexical scope: inner functions have access to variables in outer parent scopes',
      'Closures enable private state and factory functions',
    ],
    starterCode: `// 19. JavaScript Closures for Encapsulation
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable hidden by closure!

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const testIdGenerator = createCounter(100);
console.log("Generated ID:", testIdGenerator.increment());
console.log("Generated ID:", testIdGenerator.increment());
console.log("Current Count:", testIdGenerator.getCount());
`,
    bestPractices: [
      'Use closures to create private variables and encapsulate module state without global variables.',
    ],
  },
  {
    id: 'destructuring',
    title: 'JavaScript Destructuring & Spread/Rest',
    order: 20,
    language: 'javascript',
    summary: 'Array destructuring, object destructuring, spread operator (...), and rest parameters.',
    overview: 'Destructuring unpacks values from arrays or properties from objects into distinct variables. The spread operator (...) expands arrays and objects into individual elements or shallow copies.',
    keyPoints: [
      'Object destructuring: const { name, age } = user',
      'Array destructuring: const [first, second] = list',
      'Spread operator shallow clones objects: const clone = { ...original, updatedKey: "new" }',
      'Rest parameters collect remaining items: const [head, ...tail] = [1, 2, 3]',
    ],
    starterCode: `// 20. JavaScript Destructuring & Spread Operator
const config = {
  env: "staging",
  retries: 2,
  browser: "chrome"
};

// Object Destructuring with default value
const { env, retries, timeout = 5000 } = config;
console.log(\`Env: \${env}, Retries: \${retries}, Timeout: \${timeout}\`);

// Object Spread for immutable updates
const prodConfig = {
  ...config,
  env: "production",
  retries: 5
};
console.log("Production Config:", prodConfig);

// Array Destructuring
const coordinates = [1920, 1080];
const [width, height] = coordinates;
console.log(\`Resolution: \${width}x\${height}\`);
`,
    bestPractices: [
      'Use object destructuring in function parameter lists (function runTest({ url, timeout }) {}) for clean API signatures.',
    ],
  },
  {
    id: 'sets-maps',
    title: 'JavaScript Sets & Maps',
    order: 21,
    language: 'javascript',
    summary: 'The Set collection for unique values and Map collection for arbitrary-key dictionaries.',
    overview: 'Set and Map are modern ES6 collection types. Set stores unique values, eliminating duplicates. Map stores key-value pairs where keys can be any type, including objects and functions.',
    keyPoints: [
      'Set stores unique values: new Set([1, 2, 2, 3]) contains only [1, 2, 3]',
      'Map allows any type as key (objects, functions, numbers, strings)',
      'Map preserves insertion order and provides .size property and .get()/.set() methods',
      'Fast O(1) average lookup performance for both Set and Map',
    ],
    starterCode: `// 21. JavaScript Set and Map
// Deduplicating arrays with Set
const browsers = ["Chrome", "Firefox", "Chrome", "Edge", "Firefox"];
const uniqueBrowsers = [...new Set(browsers)];
console.log("Unique Browsers:", uniqueBrowsers);

// Key-Value Mapping with Map
const testSessionMap = new Map();
const sessionKey = { sessionId: "sess-99" }; // Object used as Map key!

testSessionMap.set(sessionKey, { user: "Sara", role: "SDET" });
console.log("Map Size:", testSessionMap.size);
console.log("Retrieved Data:", testSessionMap.get(sessionKey));
`,
    bestPractices: [
      'Use Map instead of plain objects when keys are unknown until runtime or when keys are objects.',
      'Use Set for fast membership testing (set.has(item)) over array.includes(item).',
    ],
  },
  {
    id: 'classes',
    title: 'JavaScript Classes & OOP',
    order: 22,
    language: 'javascript',
    summary: 'Class declarations, constructor, instance methods, static methods, and private fields (#).',
    overview: 'Classes in JavaScript provide a clean syntax over JavaScript prototype-based inheritance. ES2022 introduces private fields prefixed with # for true private encapsulation.',
    keyPoints: [
      'Defined with class ClassName { constructor(...) { ... } }',
      'static methods are called directly on the class (ClassName.method()), not on instances',
      'Private fields and methods are prefixed with # (#privateField) and inaccessible from outside',
      'this references the current object instance',
    ],
    starterCode: `// 22. JavaScript Classes & Private Fields
class BasePage {
  #authToken; // Private field (ES2022)

  constructor(pageUrl, token) {
    this.pageUrl = pageUrl;
    this.#authToken = token;
  }

  navigate() {
    console.log(\`Navigating to \${this.pageUrl}\`);
  }

  // Method accessing private field
  getAuthHeader() {
    return \`Bearer \${this.#authToken}\`;
  }

  static getSupportedProtocol() {
    return "HTTPS";
  }
}

const loginPage = new BasePage("https://app.com/login", "secret-token-123");
loginPage.navigate();
console.log("Protocol:", BasePage.getSupportedProtocol());
console.log("Auth:", loginPage.getAuthHeader());
`,
    bestPractices: [
      'Use private fields (#field) to encapsulate sensitive authentication tokens and internal state in Page Objects.',
    ],
  },
  {
    id: 'inheritance',
    title: 'JavaScript Inheritance & Prototypes',
    order: 23,
    language: 'javascript',
    summary: 'Subclasses with extends, super() constructor calls, method overriding, and prototype chains.',
    overview: 'Inheritance allows a subclass to inherit attributes and methods from a parent class using the extends keyword. Subclasses can override parent methods and call super() to invoke parent constructors.',
    keyPoints: [
      'class Child extends Parent establishes the inheritance relationship',
      'super() must be called in the child constructor before accessing this',
      'Subclasses can override parent methods to specialize behavior',
      'instanceof operator verifies if an object derives from a specific class',
    ],
    starterCode: `// 23. JavaScript Inheritance with extends & super
class AutomationTest {
  constructor(name) {
    this.name = name;
  }

  run() {
    console.log(\`[AutomationTest] Starting test: \${this.name}\`);
  }
}

class ApiTest extends AutomationTest {
  constructor(name, endpoint) {
    super(name); // Call parent constructor
    this.endpoint = endpoint;
  }

  // Override parent method
  run() {
    super.run(); // Call parent logic
    console.log(\`[ApiTest] Sending GET request to \${this.endpoint}\`);
  }
}

const test = new ApiTest("Verify Users Endpoint", "/api/v1/users");
test.run();
console.log("Is instance of AutomationTest:", test instanceof AutomationTest);
`,
    bestPractices: [
      'Always call super(...) first in child constructors before referencing this.',
    ],
  },
  {
    id: 'try-catch',
    title: 'JavaScript Try...Catch & Error Handling',
    order: 24,
    language: 'javascript',
    summary: 'try, catch, finally blocks, throwing Custom Errors, and Error object properties.',
    overview: 'Exceptions in JavaScript are handled using try...catch blocks. Unhandled errors crash execution, while handled errors allow resilient recovery and diagnostic logging.',
    keyPoints: [
      'try wraps code that may throw exceptions',
      'catch (err) captures the error object with .name, .message, and .stack',
      'finally always executes regardless of whether an error occurred',
      'throw new Error("message") explicitly creates and triggers an exception',
    ],
    starterCode: `// 24. JavaScript Error Handling & Custom Exceptions
class ElementNotFoundError extends Error {
  constructor(selector) {
    super(\`Element matching selector "\${selector}" not found on page.\`);
    this.name = "ElementNotFoundError";
  }
}

function findElement(selector) {
  if (selector === "#missing-button") {
    throw new ElementNotFoundError(selector);
  }
  return { selector, text: "Click Me" };
}

try {
  console.log("Searching for element...");
  findElement("#missing-button");
} catch (err) {
  if (err instanceof ElementNotFoundError) {
    console.error(\`[\${err.name}] \${err.message}\`);
  } else {
    console.error("Unknown error:", err);
  }
} finally {
  console.log("Cleanup: Screenshot captured.");
}
`,
    bestPractices: [
      'Create custom Error subclasses for domain-specific errors (like ElementNotFoundError).',
      'Always use finally blocks to close browser contexts, release locks, and close open sockets.',
    ],
  },
  {
    id: 'async-await',
    title: 'JavaScript Async/Await & Promises',
    order: 25,
    language: 'javascript',
    summary: 'Promises (.then, .catch), async functions, await keyword, Promise.all(), and asynchronous patterns.',
    overview: 'JavaScript is single-threaded and non-blocking. Asynchronous operations (HTTP requests, browser automation commands, timer delays) return Promises. async/await provides synchronous-like syntax for asynchronous workflows.',
    keyPoints: [
      'A Promise represents an asynchronous operation with Pending, Fulfilled, or Rejected state',
      'async functions always return a Promise implicitly',
      'await pauses function execution until the Promise resolves or rejects',
      'Promise.all([p1, p2]) runs multiple independent asynchronous operations concurrently',
    ],
    starterCode: `// 25. JavaScript Async/Await & Concurrent Promises
// Simulated asynchronous API fetch using Promise
const simulateFetchUser = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, username: \`user_\${userId}\` });
      } else {
        reject(new Error("Invalid User ID"));
      }
    }, 100);
  });
};

async function executeTestSuite() {
  console.log("Starting async test suite...");

  // Sequential await
  const user1 = await simulateFetchUser(1);
  console.log("Fetched User 1:", user1);

  // Concurrent parallel execution with Promise.all
  console.log("Fetching users 2 and 3 concurrently...");
  const [user2, user3] = await Promise.all([
    simulateFetchUser(2),
    simulateFetchUser(3)
  ]);

  console.log("Concurrent Results:", user2, user3);
}

executeTestSuite();
`,
    bestPractices: [
      'Always wrap await calls inside try...catch blocks to handle promise rejections cleanly.',
      'Use Promise.all() when multiple requests do not depend on each other to reduce total execution time.',
    ],
  },
  {
    id: 'modules',
    title: 'JavaScript Modules (ESM & CommonJS)',
    order: 26,
    language: 'javascript',
    summary: 'export, import, export default, named exports, and differences with CommonJS (require).',
    overview: 'Modern JavaScript uses ES Modules (ESM) with import and export statements. Node.js traditionally used CommonJS with require() and module.exports.',
    keyPoints: [
      'Named exports: export const helper = () => {} $\\rightarrow$ import { helper } from "./module.js"',
      'Default exports: export default ClassName $\\rightarrow$ import ClassName from "./module.js"',
      'ES modules are statically analyzed and hoisted',
      'CommonJS uses require("module") and module.exports',
    ],
    starterCode: `// 26. JavaScript Modules Simulation
// In an ES Module file (utils.js):
// export const API_VERSION = "v2";
// export default class ApiClient { ... }

// Simulating modular namespace:
const MathModule = (() => {
  const PI = 3.14159;
  const square = (x) => x * x;
  return { PI, square };
})();

console.log("Imported Constant:", MathModule.PI);
console.log("Imported Function:", MathModule.square(9));
`,
    bestPractices: [
      'Use modern ES Modules (import/export) with "type": "module" in package.json for new projects.',
    ],
  },
  {
    id: 'advanced',
    title: 'JavaScript Advanced Concepts & Event Loop',
    order: 27,
    language: 'javascript',
    summary: 'The Event Loop, Call Stack, Microtask queue vs Macrotask queue, and Proxy objects.',
    overview: 'The JavaScript runtime uses a single-threaded Event Loop to orchestrate synchronous execution, Microtasks (Promise callbacks, queueMicrotask), and Macrotasks (setTimeout, setInterval). Proxy objects allow intercepting and customizing fundamental operations.',
    keyPoints: [
      'Call Stack executes synchronous code to completion (Run-to-completion)',
      'Microtask queue (Promises) has higher priority and executes immediately after the stack empties',
      'Macrotask queue (timers, I/O) executes on the next event loop tick',
      'Proxy and Reflect APIs enable reactive state and dynamic method interception',
    ],
    starterCode: `// 27. JavaScript Event Loop Microtask vs Macrotask
console.log("1. Synchronous: Start");

setTimeout(() => {
  console.log("4. Macrotask: setTimeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask: Promise.then callback");
});

console.log("2. Synchronous: End");

// Proxy Interception
const target = { env: "dev" };
const proxy = new Proxy(target, {
  get(obj, prop) {
    console.log(\`[@Proxy] Property '\${prop}' accessed.\`);
    return obj[prop] ?? "DEFAULT_VALUE";
  }
});

console.log("Proxy env:", proxy.env);
console.log("Proxy unknown:", proxy.timeout);
`,
    bestPractices: [
      'Understand the Event Loop to debug timing race conditions in asynchronous test scripts.',
      'Use Proxies to build mock objects and intercept API requests during test execution.',
    ],
  },
];
