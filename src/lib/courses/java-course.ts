import { CourseConcept } from '../kids-courses-types';

export const JAVA_CONCEPTS: CourseConcept[] = [
  {
    id: 'intro',
    title: 'Java Intro, Get Started & Syntax',
    order: 1,
    language: 'java',
    summary: 'What is Java, JVM architecture (WORA), entry point main method, and class syntax structure.',
    overview: 'Java is a statically-typed, object-oriented, class-based language created by James Gosling at Sun Microsystems in 1995. Its core philosophy is "Write Once, Run Anywhere" (WORA): Java source (.java) compiles to bytecode (.class), which executes across any operating system on the Java Virtual Machine (JVM). Every executable application begins inside public static void main(String[] args).',
    keyPoints: [
      'JVM Ecosystem: JDK (Development Kit), JRE (Runtime), JVM (Bytecode Execution Virtual Machine)',
      'Main Method Entry Point: public static void main(String[] args) is required by the JVM to launch',
      'Class Structure: Every function and variable in Java must reside inside a class declaration',
      'Syntax Rules: Java is case-sensitive, statements must end in semicolons (;), and blocks use curly braces {}',
    ],
    starterCode: `// 1. Java Intro, Get Started & Syntax
public class Main {
    public static void main(String[] args) {
        String platform = "Java Platform (SE 21 LTS)";
        String architecture = "JVM Bytecode (Write Once, Run Anywhere)";
        
        System.out.println("☕ Welcome to " + platform + "!");
        System.out.println("Execution Model: " + architecture);

        // Core Syntax & Block Scope
        int testCases = 25;
        boolean suitePassed = true;

        if (suitePassed) {
            System.out.println("  ✓ Code Block Executed: All " + testCases + " tests passed!");
            System.out.println("  ✓ Class structure and main entry point validated.");
        }
    }
}
`,
    bestPractices: [
      'Follow Java naming conventions: UpperCamelCase for Classes and lowerCamelCase for methods and variables.',
      'Always ensure the public class name matches the filename exactly (e.g., Main.java for public class Main).',
      'Use modern Java LTS versions (Java 17, Java 21) for production test automation frameworks.',
    ],
  },
  {
    id: 'output',
    title: 'Java Output (println & printf)',
    order: 2,
    language: 'java',
    summary: 'Standard output via System.out.println(), System.out.print(), and System.out.printf() format specifiers.',
    overview: 'Java provides standard streams in the System class: System.out (standard output) and System.err (error output). println() appends a newline, print() does not, and printf() supports C-style format strings (%s, %d, %.2f).',
    keyPoints: [
      'System.out.println() prints and advances the cursor to the next line',
      'System.out.print() prints text inline without a newline',
      'System.out.printf() formats text with specifiers: %s (string), %d (integer), %.2f (float)',
      'System.err.println() prints diagnostics to standard error stream',
    ],
    starterCode: `// 2. Java Output Formatting with println and printf
public class Main {
    public static void main(String[] args) {
        String testSuite = "Regression Suite";
        int totalTests = 120;
        int passedTests = 118;
        double passPercentage = ((double) passedTests / totalTests) * 100.0;

        // Using println
        System.out.println("=== Test Run Summary ===");
        System.out.println("Suite: " + testSuite);

        // Using printf with format specifiers
        System.out.printf("Passed: %d / %d tests (%.2f%% success rate)%n", 
                          passedTests, totalTests, passPercentage);

        // System.err for error warnings
        System.err.println("[DIAGNOSTIC] 2 tests skipped in regression pipeline.");
    }
}
`,
    bestPractices: [
      'Use System.out.printf() with %n (platform-independent newline) for formatted reports.',
      'In production frameworks, use SLF4J / Log4j2 loggers instead of raw System.out.println.',
    ],
  },
  {
    id: 'comments',
    title: 'Java Comments & Javadoc',
    order: 3,
    language: 'java',
    summary: 'Single-line comments (//), multi-line comments (/* ... */), and formal Javadoc (/** ... */) tags.',
    overview: 'Javadoc comments generate standard HTML documentation from source code annotations (@param, @return, @throws). They are used across all major enterprise frameworks.',
    keyPoints: [
      'Single-line comments begin with //',
      'Multi-line comments are enclosed between /* and */',
      'Javadoc blocks begin with /** and include tags: @param, @return, @throws, @author',
    ],
    starterCode: `// 3. Java Comments & Javadoc Documentation
public class Main {
    /**
     * Calculates the exponential backoff delay in milliseconds.
     * 
     * @param attempt The current retry attempt number (1-based).
     * @param baseDelayMs The initial delay in milliseconds.
     * @return The computed backoff delay in milliseconds.
     */
    public static long calculateBackoff(int attempt, long baseDelayMs) {
        // Exponential formula: base * 2^(attempt - 1)
        return baseDelayMs * (1L << (attempt - 1));
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 4; i++) {
            System.out.printf("Retry Attempt #%d -> Delay: %d ms%n", i, calculateBackoff(i, 500));
        }
    }
}
`,
    bestPractices: [
      'Write comprehensive Javadoc for all public framework utilities and custom page object methods.',
    ],
  },
  {
    id: 'variables',
    title: 'Java Variables & Strong Typing',
    order: 4,
    language: 'java',
    summary: 'Strong static typing, variable declaration, initialization, constants with final, and local type inference (var).',
    overview: 'Java is statically typed: every variable must have a declared type before use. Since Java 10, the var keyword allows local variable type inference where the compiler infers the type from the initialization expression.',
    keyPoints: [
      'Explicit typing: String name = "Alex"; int count = 5;',
      'final keyword marks a variable as a constant that cannot be reassigned',
      'var keyword (Java 10+) infers local variable type without sacrificing type safety',
      'Variable scope is strictly block-scoped to the enclosing curly braces {}',
    ],
    starterCode: `// 4. Java Variables, Constants, and Local Type Inference
public class Main {
    // Constant at class level
    public static final String DEFAULT_ENVIRONMENT = "STAGING";

    public static void main(String[] args) {
        // Explicitly typed local variables
        int timeoutSeconds = 30;
        double threshold = 99.5;
        boolean isHeadless = true;

        // final local constant
        final int MAX_RETRIES = 3;

        // var local type inference (Java 10+)
        var reportTitle = "Nightly Smoke Test Report";

        System.out.println("Title: " + reportTitle);
        System.out.println("Environment: " + DEFAULT_ENVIRONMENT);
        System.out.println("Timeout: " + timeoutSeconds + "s | Retries: " + MAX_RETRIES);
        System.out.println("Headless Mode: " + isHeadless);
    }
}
`,
    bestPractices: [
      'Use final for variables that should not change after initialization.',
      'Use var when the type is obvious from the right-hand side (e.g. var map = new HashMap<String, String>();).',
    ],
  },
  {
    id: 'data-types',
    title: 'Java Data Types (Primitive vs Object)',
    order: 5,
    language: 'java',
    summary: 'The 8 primitive types (byte, short, int, long, float, double, boolean, char) and Object wrapper classes.',
    overview: 'Java differentiates between 8 primitive types stored directly on the stack and Reference/Object types stored on the heap. Autoboxing automatically converts between primitives and their wrapper classes (e.g. int $\\leftrightarrow$ Integer).',
    keyPoints: [
      '8 Primitives: byte (8-bit), short (16-bit), int (32-bit), long (64-bit), float, double, boolean, char',
      'Wrapper classes: Byte, Short, Integer, Long, Float, Double, Boolean, Character',
      'Generics and Collections (List<Integer>) require wrapper objects, not raw primitives',
      'Autoboxing/unboxing converts between int and Integer automatically',
    ],
    starterCode: `// 5. Java Primitive Types & Autoboxing
public class Main {
    public static void main(String[] args) {
        // 8 Primitive Types
        byte b = 127;
        short s = 32000;
        int i = 2147483647;
        long l = 9223372036854775807L;
        float f = 3.14f;
        double d = 2.718281828459045;
        boolean bool = true;
        char c = 'A';

        // Autoboxing: primitive int to Integer object
        Integer boxedInt = i;
        // Unboxing: Integer object to primitive int
        int unboxedInt = boxedInt;

        System.out.println("Max 32-bit Int: " + i);
        System.out.println("Max 64-bit Long: " + l);
        System.out.println("Char: " + c + " (Unicode value: " + (int) c + ")");
        System.out.println("Autoboxing Verified: " + (unboxedInt == i));
    }
}
`,
    bestPractices: [
      'Prefer primitives (int, double) for high-performance loops to avoid heap allocation overhead.',
      'Be mindful of NullPointerException when unboxing wrapper classes (Integer n = null; int x = n; crashes!).',
    ],
  },
  {
    id: 'casting',
    title: 'Java Type Casting (Widening & Narrowing)',
    order: 6,
    language: 'java',
    summary: 'Widening casting (automatic, safe) vs Narrowing casting (explicit, potential data loss).',
    overview: 'Type casting assigns a value of one primitive data type to another. Widening casting occurs automatically from smaller to larger types. Narrowing casting requires an explicit cast operator (type) and may cause truncation.',
    keyPoints: [
      'Widening (Automatic): byte $\\rightarrow$ short $\\rightarrow$ char $\\rightarrow$ int $\\rightarrow$ long $\\rightarrow$ float $\\rightarrow$ double',
      'Narrowing (Manual): double $\\rightarrow$ float $\\rightarrow$ long $\\rightarrow$ int $\\rightarrow$ char $\\rightarrow$ short $\\rightarrow$ byte',
      'Explicit syntax: int myInt = (int) myDouble;',
      'Parsing strings: Integer.parseInt("123"), Double.parseDouble("45.67")',
    ],
    starterCode: `// 6. Java Type Casting & String Parsing
public class Main {
    public static void main(String[] args) {
        // Widening casting: int to double (safe & automatic)
        int score = 85;
        double preciseScore = score;
        System.out.println("Widened score: " + preciseScore);

        // Narrowing casting: double to int (requires explicit cast)
        double latencyMs = 145.89;
        int truncatedLatency = (int) latencyMs;
        System.out.println("Narrowed latency (decimals discarded): " + truncatedLatency);

        // Parsing string to numeric
        String portStr = "8080";
        int portNumber = Integer.parseInt(portStr);
        System.out.println("Parsed Port: " + (portNumber + 1) + " (Ready)");
    }
}
`,
    bestPractices: [
      'Always validate or catch NumberFormatException when parsing numbers from test configuration strings.',
    ],
  },
  {
    id: 'operators',
    title: 'Java Operators & Expressions',
    order: 7,
    language: 'java',
    summary: 'Arithmetic, relational, logical (&&, ||, !), bitwise, assignment, and ternary operators.',
    overview: 'Java operators perform calculations, comparisons, and logic. Short-circuit operators (&&, ||) avoid evaluating the right operand if the left operand determines the outcome.',
    keyPoints: [
      'Arithmetic: +, -, *, /, % (modulus)',
      'Relational: ==, !=, <, >, <=, >=',
      'Logical: && (short-circuit AND), || (short-circuit OR), ! (NOT)',
      'Ternary conditional: condition ? valueIfTrue : valueIfFalse',
    ],
    starterCode: `// 7. Java Operators & Short-Circuit Evaluation
public class Main {
    public static void main(String[] args) {
        int a = 23;
        int b = 4;

        System.out.println("Integer Division (23 / 4): " + (a / b));
        System.out.println("Remainder Modulus (23 % 4): " + (a % b));

        // Short-circuit logic: Right side won't throw NullPointerException
        String token = null;
        boolean isValid = (token != null) && (token.length() > 0);
        System.out.println("Token is valid: " + isValid);

        // Ternary operator
        int responseCode = 200;
        String result = (responseCode >= 200 && responseCode < 300) ? "PASS" : "FAIL";
        System.out.println("Test Result: " + result);
    }
}
`,
    bestPractices: [
      'Use && instead of single & for logical evaluation to benefit from short-circuit protection.',
    ],
  },
  {
    id: 'strings',
    title: 'Java Strings & Manipulation',
    order: 8,
    language: 'java',
    summary: 'String immutability, String Pool, methods (substring, split, equals), and StringBuilder for efficiency.',
    overview: 'Strings in Java are immutable objects backed by the String Constant Pool. Comparing strings must always use .equals() rather than ==. For heavy concatenation inside loops, StringBuilder must be used.',
    keyPoints: [
      'Strings are immutable; concatenations create new objects in memory',
      'Never compare strings with == (compares memory references); always use .equals() or .equalsIgnoreCase()',
      'String Pool caches string literals to conserve memory',
      'StringBuilder provides mutable character sequences for O(N) concatenation',
    ],
    starterCode: `// 8. Java Strings & StringBuilder Performance
public class Main {
    public static void main(String[] args) {
        String str1 = "IntelligentQA";
        String str2 = new String("IntelligentQA");

        // Pitfall comparison with == vs .equals()
        System.out.println("str1 == str2 (Reference check): " + (str1 == str2)); // false!
        System.out.println("str1.equals(str2) (Value check): " + str1.equals(str2)); // true!

        // String Methods
        String title = "   Selenium WebDriver Automation Framework   ";
        String clean = title.trim();
        System.out.println("Trimmed: " + clean);
        System.out.println("Substring(0, 8): " + clean.substring(0, 8));
        System.out.println("Contains 'WebDriver': " + clean.contains("WebDriver"));

        // StringBuilder for high-performance concatenation
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            sb.append("Step ").append(i).append(" -> ");
        }
        sb.append("Done!");
        System.out.println("StringBuilder output: " + sb.toString());
    }
}
`,
    bestPractices: [
      'Always use .equals() or Objects.equals(a, b) to compare string contents.',
      'Use StringBuilder inside loops when constructing dynamic SQL queries, logs, or reports.',
    ],
  },
  {
    id: 'booleans',
    title: 'Java Booleans & Conditions',
    order: 9,
    language: 'java',
    summary: 'boolean primitive, Boolean wrapper, comparison evaluation, and logical expressions.',
    overview: 'The boolean data type has only two possible values: true and false. Unlike C or Python, Java integers (0 or 1) cannot be coerced into booleans.',
    keyPoints: [
      'Keywords true and false are all lowercase in Java',
      'Conditions in if statements must evaluate to a strict boolean expression',
      'Boolean wrapper class provides Boolean.parseBoolean("true")',
    ],
    starterCode: `// 9. Java Booleans & Strict Evaluation
public class Main {
    public static void main(String[] args) {
        boolean isBrowserOpen = true;
        boolean hasElementLoaded = true;
        boolean isTimeoutExceeded = false;

        boolean canInteract = isBrowserOpen && hasElementLoaded && !isTimeoutExceeded;
        System.out.println("Can Interact With UI: " + canInteract);

        // Parsing boolean string
        String configFlag = "true";
        boolean headless = Boolean.parseBoolean(configFlag);
        System.out.println("Headless Mode: " + headless);
    }
}
`,
    bestPractices: [
      'Write descriptive boolean variable names with prefixes like is, has, can (e.g. isElementVisible).',
    ],
  },
  {
    id: 'numbers',
    title: 'Java Numbers & Math API',
    order: 10,
    language: 'java',
    summary: 'The java.lang.Math class: min, max, sqrt, pow, abs, random, and BigDecimal for financial precision.',
    overview: 'The Math class contains static methods for basic numeric operations. For financial or arbitrary-precision decimal operations, java.math.BigDecimal is used to prevent double rounding errors.',
    keyPoints: [
      'Math.max(), Math.min(), Math.abs(), Math.sqrt(), Math.pow()',
      'Math.random() generates a pseudorandom double between 0.0 and 1.0',
      'Math.round(), Math.floor(), Math.ceil() for rounding floats and doubles',
      'Use BigDecimal for monetary calculations where floating point inaccuracies are unacceptable',
    ],
    starterCode: `// 10. Java Math Utility Methods
public class Main {
    public static void main(String[] args) {
        int a = 45;
        int b = 80;

        System.out.println("Math.max(45, 80): " + Math.max(a, b));
        System.out.println("Math.sqrt(144): " + Math.sqrt(144));
        System.out.println("Math.pow(2, 8): " + Math.pow(2, 8));

        // Random port generation between 8000 and 9000
        int minPort = 8000;
        int maxPort = 9000;
        int randomPort = (int) (Math.random() * (maxPort - minPort + 1)) + minPort;
        System.out.println("Random Test Port: " + randomPort);
    }
}
`,
    bestPractices: [
      'Use java.util.concurrent.ThreadLocalRandom for generating random numbers in multi-threaded test suites.',
    ],
  },
  {
    id: 'arrays',
    title: 'Java Arrays (1D & 2D)',
    order: 11,
    language: 'java',
    summary: 'Fixed-size contiguous memory blocks, 1D arrays, multidimensional 2D matrices, and java.util.Arrays.',
    overview: 'Arrays are fixed-length data structures that hold elements of the same type. Array length is established upon creation and cannot change. The java.util.Arrays utility class provides sorting, searching, and string representations.',
    keyPoints: [
      'Declared with square brackets: int[] numbers = new int[5];',
      'Arrays have a fixed .length property (not a method)',
      '2D arrays (matrices): int[][] matrix = new int[3][3];',
      'Arrays.toString() and Arrays.deepToString() render arrays cleanly',
    ],
    starterCode: `// 11. Java Arrays & Arrays Utility Class
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        // 1D Array initialization
        String[] browsers = {"Chrome", "Firefox", "Edge", "Safari"};
        System.out.println("Array Length: " + browsers.length);
        System.out.println("First Browser: " + browsers[0]);

        // Sorting the array in place
        Arrays.sort(browsers);
        System.out.println("Sorted Browsers: " + Arrays.toString(browsers));

        // 2D Array: Test Data Matrix (DataProvider simulation)
        Object[][] testData = {
            {"admin@app.com", "SecretPass123", true},
            {"guest@app.com", "WrongPassword", false}
        };

        System.out.println("Test Data Rows: " + testData.length);
        System.out.println("Row 1 User: " + testData[0][0]);
    }
}
`,
    bestPractices: [
      'Always prefer int[] array syntax over int array[] (C-style syntax).',
      'Use Arrays.equals(arr1, arr2) to check if two arrays contain identical elements in the same order.',
    ],
  },
  {
    id: 'if-else',
    title: 'Java If...Else Conditions & Decisions',
    order: 12,
    language: 'java',
    summary: 'Branching logic with if, else if, else, nested conditions, and guard clauses.',
    overview: 'Conditional statements direct execution based on truth values. Java requires boolean expressions inside condition parentheses.',
    keyPoints: [
      'Syntax: if (condition) { ... } else if (other) { ... } else { ... }',
      'Compound conditions use && (AND), || (OR), and ! (NOT)',
      'Always use block braces {} even for single-line statements to avoid dangling else bugs',
    ],
    starterCode: `// 12. Java If...Else Branching Logic
public class Main {
    public static void main(String[] args) {
        int httpCode = 404;

        if (httpCode >= 200 && httpCode < 300) {
            System.out.println("HTTP Success (" + httpCode + ")");
        } else if (httpCode >= 400 && httpCode < 500) {
            System.out.println("HTTP Client Error (" + httpCode + ")");
        } else if (httpCode >= 500) {
            System.out.println("HTTP Server Error (" + httpCode + ")");
        } else {
            System.out.println("Unhandled HTTP Status: " + httpCode);
        }
    }
}
`,
    bestPractices: [
      'Use early returns (guard clauses) to reduce nested indentation in methods.',
    ],
  },
  {
    id: 'switch',
    title: 'Java Switch & Pattern Matching',
    order: 13,
    language: 'java',
    summary: 'Traditional switch statements, break keyword, and modern Java 14+ switch expressions (->).',
    overview: 'A switch statement allows a variable to be tested for equality against a list of values. Modern Java (Java 14+) introduces switch expressions using the arrow syntax -> that return values directly and eliminate accidental break fall-through.',
    keyPoints: [
      'Traditional switch uses case value: followed by break;',
      'Modern switch expression (Java 14+) uses case value -> expr without needing break',
      'Supports byte, short, char, int, String, and enum types',
      'default case acts as the catch-all branch',
    ],
    starterCode: `// 13. Java Modern Switch Expressions (Java 14+)
public class Main {
    public static void main(String[] args) {
        String environment = "STAGING";

        // Modern Switch Expression returning a value
        int timeoutSeconds = switch (environment.toUpperCase()) {
            case "LOCAL", "DEV" -> 10;
            case "STAGING" -> 30;
            case "PROD", "PRODUCTION" -> 60;
            default -> 15;
        };

        System.out.printf("Environment: %s -> Timeout: %d seconds%n", environment, timeoutSeconds);
    }
}
`,
    bestPractices: [
      'Adopt modern switch expressions (->) for new code to completely avoid fall-through bugs.',
    ],
  },
  {
    id: 'while-loops',
    title: 'Java While Loops & Iteration',
    order: 14,
    language: 'java',
    summary: 'while loops, do...while loops, polling conditions, and loop control with break and continue.',
    overview: 'A while loop executes while its boolean expression evaluates to true. A do-while loop evaluates its condition at the end of the block, guaranteeing at least one execution.',
    keyPoints: [
      'while (condition) { ... } tests condition at the top',
      'do { ... } while (condition); tests condition at the bottom',
      'break terminates the loop immediately',
      'continue skips to the next iteration',
    ],
    starterCode: `// 14. Java While Loop: Polling WebDriver Element Wait Simulation
public class Main {
    public static void main(String[] args) {
        int elapsedMs = 0;
        int timeoutMs = 2000;
        int pollIntervalMs = 500;
        boolean elementFound = false;

        System.out.println("Polling for DOM element presence...");
        while (elapsedMs < timeoutMs && !elementFound) {
            elapsedMs += pollIntervalMs;
            System.out.println("  Checking DOM at " + elapsedMs + " ms...");

            if (elapsedMs == 1000) {
                elementFound = true;
                System.out.println("  Element located successfully!");
                break;
            }
        }

        System.out.println("Finished. Element Found: " + elementFound);
    }
}
`,
    bestPractices: [
      'Always ensure the terminating condition increments properly inside the while block to prevent infinite loops.',
    ],
  },
  {
    id: 'for-loops',
    title: 'Java For Loops & Enhanced For-Each',
    order: 15,
    language: 'java',
    summary: 'Traditional indexed for(;;), enhanced for-each (:), nested loops, and loop labels.',
    overview: 'Java provides standard indexed for loops and enhanced for-each loops for iterating over arrays and any class implementing java.lang.Iterable.',
    keyPoints: [
      'Traditional: for (int i = 0; i < max; i++) { ... }',
      'Enhanced for-each: for (String item : items) { ... }',
      'Use enhanced for-each when you do not need the numeric index',
      'Labeled break and continue statements allow breaking out of outer nested loops',
    ],
    starterCode: `// 15. Java For Loops: Indexed vs Enhanced For-Each
public class Main {
    public static void main(String[] args) {
        String[] testEndpoints = {"/api/login", "/api/users", "/api/checkout"};

        // 1. Traditional Indexed Loop
        System.out.println("--- Indexed Loop ---");
        for (int i = 0; i < testEndpoints.length; i++) {
            System.out.printf("Endpoint #%d: %s%n", (i + 1), testEndpoints[i]);
        }

        // 2. Enhanced For-Each Loop
        System.out.println("\\n--- Enhanced For-Each Loop ---");
        for (String endpoint : testEndpoints) {
            System.out.println("Verifying health: " + endpoint);
        }
    }
}
`,
    bestPractices: [
      'Prefer the enhanced for-each loop unless you explicitly need the index or need to modify the collection.',
    ],
  },
  {
    id: 'methods',
    title: 'Java Functions & Methods',
    order: 16,
    language: 'java',
    summary: 'Method signature, parameters, return types, static vs instance methods, and method overloading.',
    overview: 'A method is a block of code declared within a class that performs an action. Method overloading allows multiple methods to share the same name with different parameter signatures.',
    keyPoints: [
      'Signature consists of method name and parameter types',
      'static methods belong to the class, not instance objects',
      'void indicates the method does not return a value',
      'Method overloading: same method name with different parameter count or types',
    ],
    starterCode: `// 16. Java Method Overloading & Signatures
public class Main {
    // Method 1: Default timeout
    public static void clickElement(String locator) {
        clickElement(locator, 10); // Delegates to overloaded method
    }

    // Method 2: Overloaded with custom timeout
    public static void clickElement(String locator, int timeoutSeconds) {
        System.out.printf("Clicking '%s' with timeout of %d seconds.%n", locator, timeoutSeconds);
    }

    public static void main(String[] args) {
        clickElement("#submit-btn");
        clickElement("#slow-modal", 30);
    }
}
`,
    bestPractices: [
      'Keep methods small and focused on a single responsibility (Single Responsibility Principle).',
      'Use method overloading to provide sensible default parameters.',
    ],
  },
  {
    id: 'scope',
    title: 'Java Scope & Variable Lifecycles',
    order: 17,
    language: 'java',
    summary: 'Class scope (fields), method scope (parameters), block scope ({}), and variable shadowing (this).',
    overview: 'Variable scope defines the accessibility of variables across different parts of a program. In Java, scope is determined by curly braces {}. Instance fields are shadowed by local variables of the same name.',
    keyPoints: [
      'Class fields: accessible across all non-static methods of the class',
      'Method parameters: accessible throughout the entire method',
      'Block variables: accessible only within the specific { ... } block where declared',
      'this keyword resolves shadowing between instance fields and parameter names',
    ],
    starterCode: `// 17. Java Scope & Shadowing Resolution
public class Main {
    // Class variable
    private static int globalExecutionCount = 0;

    public static void main(String[] args) {
        int localVal = 50;

        if (localVal > 0) {
            int blockScopedVal = 100;
            System.out.println("Inside Block: " + blockScopedVal);
            globalExecutionCount++;
        }

        // blockScopedVal is not accessible here!
        System.out.println("Global Execution Count: " + globalExecutionCount);
    }
}
`,
    bestPractices: [
      'Declare variables in the innermost scope possible to limit their lifecycle and avoid accidental reuse.',
    ],
  },
  {
    id: 'classes-objects',
    title: 'Java Objects & Classes',
    order: 18,
    language: 'java',
    summary: 'Object-Oriented Programming (OOP) foundation, creating classes, new keyword, state and behavior.',
    overview: 'A class is a blueprint from which individual objects are instantiated. Objects possess state (stored in fields) and behavior (exposed through methods).',
    keyPoints: [
      'Instantiated with the new keyword: User u = new User();',
      'Heap memory stores the object instance; stack stores the reference pointer',
      'Fields hold object state; methods define object actions',
      'toString() method returns a textual representation of the object',
    ],
    starterCode: `// 18. Java OOP Blueprint & Objects
class TestCase {
    String testId;
    String description;
    String status;

    public TestCase(String testId, String description) {
        this.testId = testId;
        this.description = description;
        this.status = "NOT_RUN";
    }

    public void pass() {
        this.status = "PASSED";
    }

    @Override
    public String toString() {
        return "[" + testId + "] " + description + " - Status: " + status;
    }
}

public class Main {
    public static void main(String[] args) {
        TestCase loginTest = new TestCase("TC-01", "Verify Google OAuth Login");
        TestCase cartTest = new TestCase("TC-02", "Add Item to Shopping Cart");

        loginTest.pass();

        System.out.println(loginTest);
        System.out.println(cartTest);
    }
}
`,
    bestPractices: [
      'Always override toString() in your data classes to assist debugging and logging.',
    ],
  },
  {
    id: 'constructors',
    title: 'Java Constructors & Initialization',
    order: 19,
    language: 'java',
    summary: 'Default constructor, parameterized constructors, constructor overloading, and constructor chaining with this().',
    overview: 'A constructor is a special method called when an object is instantiated with new. Constructors initialize object state. Constructor chaining using this() allows constructors to delegate to each other.',
    keyPoints: [
      'Constructor name must exactly match the class name',
      'Constructors have no return type (not even void)',
      'The compiler provides a default no-arg constructor only if no custom constructors are defined',
      'this(...) calls another constructor in the same class and must be the first line',
    ],
    starterCode: `// 19. Java Constructor Chaining with this()
class BrowserConfig {
    String browserName;
    int timeoutSeconds;
    boolean headless;

    // Default constructor chaining to 3-arg constructor
    public BrowserConfig() {
        this("Chrome", 30, true);
    }

    // 2-argument constructor
    public BrowserConfig(String browserName, int timeoutSeconds) {
        this(browserName, timeoutSeconds, true);
    }

    // Master parameterized constructor
    public BrowserConfig(String browserName, int timeoutSeconds, boolean headless) {
        this.browserName = browserName;
        this.timeoutSeconds = timeoutSeconds;
        this.headless = headless;
    }

    public void printConfig() {
        System.out.printf("Browser: %s | Timeout: %ds | Headless: %b%n", 
                          browserName, timeoutSeconds, headless);
    }
}

public class Main {
    public static void main(String[] args) {
        BrowserConfig defaultConf = new BrowserConfig();
        BrowserConfig customConf = new BrowserConfig("Firefox", 45, false);

        defaultConf.printConfig();
        customConf.printConfig();
    }
}
`,
    bestPractices: [
      'Use constructor chaining (this()) to prevent duplicate field initialization logic.',
    ],
  },
  {
    id: 'modifiers',
    title: 'Java Access Modifiers & Encapsulation',
    order: 20,
    language: 'java',
    summary: 'public, protected, default (package-private), private modifiers, and getters/setters encapsulation.',
    overview: 'Encapsulation bundles data and methods together, protecting object state from unauthorized direct manipulation. Data fields should be private and exposed via validated getters and setters.',
    keyPoints: [
      'private: accessible only within the declaring class',
      'default (no keyword): accessible within classes in the same package',
      'protected: accessible within the same package and by subclasses',
      'public: accessible from any class in any package',
    ],
    starterCode: `// 20. Java Encapsulation & Access Modifiers
class UserProfile {
    private String username;
    private int age;

    public UserProfile(String username, int age) {
        this.username = username;
        setAge(age); // Use setter for validation
    }

    public String getUsername() {
        return username;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 0 || age > 130) {
            throw new IllegalArgumentException("Invalid age: " + age);
        }
        this.age = age;
    }
}

public class Main {
    public static void main(String[] args) {
        UserProfile user = new UserProfile("alex_sdet", 28);
        System.out.printf("User: %s | Age: %d%n", user.getUsername(), user.getAge());

        user.setAge(29);
        System.out.println("Updated Age: " + user.getAge());
    }
}
`,
    bestPractices: [
      'Make all class fields private by default and expose getters/setters only when necessary.',
    ],
  },
  {
    id: 'inheritance',
    title: 'Java Inheritance & Super Keyword',
    order: 21,
    language: 'java',
    summary: 'Subclasses using extends, super() constructor calls, method overriding with @Override, and single inheritance.',
    overview: 'Inheritance allows a child class to inherit fields and methods from a parent class using extends. Java supports single inheritance of classes (a class can only extend one superclass).',
    keyPoints: [
      'class SubClass extends SuperClass',
      'super() invokes the superclass constructor and must be the first statement',
      '@Override annotation ensures the compiler checks that a method actually overrides a parent method',
      'final classes cannot be inherited; final methods cannot be overridden',
    ],
    starterCode: `// 21. Java Inheritance & super Keyword
class BaseTest {
    protected String environment;

    public BaseTest(String environment) {
        this.environment = environment;
        System.out.println("[BaseTest] Initializing test in: " + environment);
    }

    public void teardown() {
        System.out.println("[BaseTest] Cleaning up session and closing drivers.");
    }
}

class LoginTest extends BaseTest {
    public LoginTest() {
        super("STAGING"); // Calls BaseTest constructor
    }

    public void run() {
        System.out.println("[LoginTest] Executing valid login assertions...");
    }

    @Override
    public void teardown() {
        System.out.println("[LoginTest] Archiving login session screenshots.");
        super.teardown(); // Call parent teardown
    }
}

public class Main {
    public static void main(String[] args) {
        LoginTest test = new LoginTest();
        test.run();
        test.teardown();
    }
}
`,
    bestPractices: [
      'Always add the @Override annotation above overridden methods to prevent subtle typo bugs.',
    ],
  },
  {
    id: 'polymorphism',
    title: 'Java Polymorphism & Method Overriding',
    order: 22,
    language: 'java',
    summary: 'Compile-time polymorphism (overloading) vs Runtime dynamic polymorphism (overriding and upcasting).',
    overview: 'Polymorphism allows objects of different classes to be treated through a uniform superclass or interface reference. Dynamic method dispatch determines which overridden method to execute at runtime.',
    keyPoints: [
      'Upcasting: SuperClass obj = new SubClass();',
      'Dynamic dispatch invokes the child overridden implementation at runtime',
      'Enables extensible framework architectures without hardcoding specific implementations',
    ],
    starterCode: `// 22. Java Dynamic Polymorphism
interface WebDriver {
    void get(String url);
    void quit();
}

class ChromeDriver implements WebDriver {
    public void get(String url) {
        System.out.println("ChromeDriver: Navigating to " + url);
    }
    public void quit() {
        System.out.println("ChromeDriver: Closing Chrome process.");
    }
}

class FirefoxDriver implements WebDriver {
    public void get(String url) {
        System.out.println("FirefoxDriver: Navigating to " + url);
    }
    public void quit() {
        System.out.println("FirefoxDriver: Closing Gecko process.");
    }
}

public class Main {
    public static void main(String[] args) {
        // Polymorphic reference: Program to interface, not implementation!
        WebDriver[] drivers = { new ChromeDriver(), new FirefoxDriver() };

        for (WebDriver driver : drivers) {
            driver.get("https://intelligentqa.com");
            driver.quit();
        }
    }
}
`,
    bestPractices: [
      'Always code to interfaces (e.g. WebDriver driver = new ChromeDriver(); or List<String> l = new ArrayList<>();).',
    ],
  },
  {
    id: 'abstraction',
    title: 'Java Abstraction & Interfaces',
    order: 23,
    language: 'java',
    summary: 'abstract classes vs interfaces, default methods in interfaces, and multiple interface implementation.',
    overview: 'Abstraction hides internal implementation details while exposing a clear contract. An interface defines what a class must do, while an abstract class can provide partial implementation and state.',
    keyPoints: [
      'An abstract class cannot be instantiated directly and can contain abstract and concrete methods',
      'A class implements multiple interfaces: class Foo implements Bar, Baz',
      'Interfaces can define default and static methods (Java 8+)',
      'All variables in an interface are implicitly public static final constants',
    ],
    starterCode: `// 23. Java Abstraction & Interfaces
interface Reportable {
    void generateReport();

    // Default method (Java 8+)
    default void printFooter() {
        System.out.println("--- End of Automated Test Report ---");
    }
}

abstract class BaseRunner {
    protected String suiteName;

    public BaseRunner(String suiteName) {
        this.suiteName = suiteName;
    }

    // Abstract method must be implemented by subclasses
    public abstract void execute();
}

class ApiSuiteRunner extends BaseRunner implements Reportable {
    public ApiSuiteRunner() {
        super("RestAssured API Suite");
    }

    public void execute() {
        System.out.println("Executing 45 REST API endpoint tests for " + suiteName);
    }

    public void generateReport() {
        System.out.println("Report: All 45 API tests passed successfully.");
    }
}

public class Main {
    public static void main(String[] args) {
        ApiSuiteRunner runner = new ApiSuiteRunner();
        runner.execute();
        runner.generateReport();
        runner.printFooter();
    }
}
`,
    bestPractices: [
      'Prefer interfaces over abstract classes when defining contracts across unrelated classes.',
    ],
  },
  {
    id: 'arraylist',
    title: 'Java ArrayList & List Collections',
    order: 24,
    language: 'java',
    summary: 'The java.util.List interface, ArrayList dynamic resizing, generics, and common List methods.',
    overview: 'ArrayList is a resizable array implementation of the List interface. As elements are added, its capacity grows dynamically. It provides fast O(1) random access by index.',
    keyPoints: [
      'List<String> list = new ArrayList<>(); (Program to interface)',
      'Methods: .add(), .get(index), .remove(index), .size(), .contains(), .clear()',
      'Generics (<Type>) enforce compile-time type safety',
      'Fast O(1) read access by index; slower O(N) arbitrary insertions/deletions',
    ],
    starterCode: `// 24. Java ArrayList Collections
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> testFrameworks = new ArrayList<>();

        testFrameworks.add("Selenium");
        testFrameworks.add("Playwright");
        testFrameworks.add("Appium");
        testFrameworks.add("RestAssured");

        System.out.println("Frameworks count: " + testFrameworks.size());
        System.out.println("First framework: " + testFrameworks.get(0));

        // Iteration
        System.out.println("--- Test Frameworks List ---");
        for (String framework : testFrameworks) {
            System.out.println("• " + framework);
        }

        testFrameworks.remove("Appium");
        System.out.println("Contains Appium after removal: " + testFrameworks.contains("Appium"));
    }
}
`,
    bestPractices: [
      'Declare the reference type as List<T> rather than ArrayList<T> (List<T> list = new ArrayList<>();).',
    ],
  },
  {
    id: 'hashmap',
    title: 'Java HashMap & Key-Value Dictionaries',
    order: 25,
    language: 'java',
    summary: 'The java.util.Map interface, HashMap implementation, key-value mappings, and iteration.',
    overview: 'HashMap is a hash table based implementation of the Map interface. It stores unique keys mapped to values with O(1) average lookup, insertion, and deletion performance.',
    keyPoints: [
      'Map<String, Object> map = new HashMap<>();',
      'Methods: .put(key, val), .get(key), .getOrDefault(key, default), .containsKey(key)',
      'Iterate entries using map.entrySet()',
      'Keys must properly implement hashCode() and equals()',
    ],
    starterCode: `// 25. Java HashMap & EntrySet Iteration
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> testResults = new HashMap<>();

        testResults.put("Passed", 48);
        testResults.put("Failed", 2);
        testResults.put("Skipped", 1);

        System.out.println("Passed count: " + testResults.get("Passed"));
        System.out.println("Flaky count (fallback): " + testResults.getOrDefault("Flaky", 0));

        // Iterating Map Entries
        System.out.println("--- Test Results Summary ---");
        for (Map.Entry<String, Integer> entry : testResults.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
`,
    bestPractices: [
      'Use map.getOrDefault(key, defaultValue) to handle optional keys without throwing NullPointerExceptions.',
    ],
  },
  {
    id: 'hashset',
    title: 'Java HashSet & Sets',
    order: 26,
    language: 'java',
    summary: 'The java.util.Set interface, HashSet unique elements, deduplication, and mathematical set operations.',
    overview: 'A Set is a collection that cannot contain duplicate elements. HashSet is backed by a HashMap, offering constant-time O(1) performance for add, remove, and contains operations.',
    keyPoints: [
      'Set<String> set = new HashSet<>();',
      'Duplicate elements are automatically discarded on add()',
      'No index-based access (unordered collection)',
      'Set operations: addAll (union), retainAll (intersection), removeAll (difference)',
    ],
    starterCode: `// 26. Java HashSet & Fast Deduplication
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        String[] logs = {"ERROR_404", "WARN_TIMEOUT", "ERROR_404", "INFO_INIT", "WARN_TIMEOUT"};

        // Deduplication using HashSet
        Set<String> uniqueErrors = new HashSet<>(Arrays.asList(logs));

        System.out.println("Original Log Count: " + logs.length);
        System.out.println("Unique Error Types: " + uniqueErrors);
        System.out.println("Contains ERROR_404: " + uniqueErrors.contains("ERROR_404"));
    }
}
`,
    bestPractices: [
      'Use HashSet when you need to track unique identifiers (like visited test URLs) with high performance.',
    ],
  },
  {
    id: 'iterators',
    title: 'Java Iterators & Stream API',
    order: 27,
    language: 'java',
    summary: 'Iterator interface, safe removal during iteration, and functional Stream API (filter, map, collect).',
    overview: 'Java Iterators allow safely removing elements from a collection during iteration. Java 8+ Stream API enables declarative functional operations (filter, map, reduce) over collections.',
    keyPoints: [
      'iterator.hasNext() and iterator.next() traverse elements',
      'iterator.remove() safely deletes elements without ConcurrentModificationException',
      'Stream API: list.stream().filter(...).map(...).toList()',
    ],
    starterCode: `// 27. Java Stream API & Functional Pipelines
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<String> endpoints = List.of(
            "/api/v1/auth/login",
            "/api/v1/users",
            "/public/health",
            "/api/v1/checkout",
            "/public/metrics"
        );

        // Filter endpoints containing "api" and convert to uppercase
        List<String> apiEndpoints = endpoints.stream()
            .filter(ep -> ep.startsWith("/api"))
            .map(String::toUpperCase)
            .collect(Collectors.toList());

        System.out.println("Filtered Protected API Endpoints:");
        apiEndpoints.forEach(ep -> System.out.println("-> " + ep));
    }
}
`,
    bestPractices: [
      'Use Stream API for data filtering and transformations for cleaner, declarative code.',
    ],
  },
  {
    id: 'exceptions',
    title: 'Java Exceptions & Try...Catch',
    order: 28,
    language: 'java',
    summary: 'Checked vs Unchecked exceptions, try-catch-finally, try-with-resources, and custom exceptions.',
    overview: 'Java distinguishes between Checked exceptions (subclasses of Exception checked at compile-time) and Unchecked exceptions (subclasses of RuntimeException like NullPointerException). Try-with-resources automatically closes AutoCloseable resources.',
    keyPoints: [
      'try { ... } catch (SpecificException e) { ... } finally { ... }',
      'Checked exceptions must be declared with throws or caught in a try-catch block',
      'Unchecked exceptions (RuntimeException) do not require explicit throws declarations',
      'try-with-resources: try (AutoCloseable res = new Resource()) { ... } ensures automatic cleanup',
    ],
    starterCode: `// 28. Java Exception Handling & Custom Exceptions
class ElementNotFoundException extends RuntimeException {
    public ElementNotFoundException(String locator) {
        super("Element with locator '" + locator + "' was not found within timeout.");
    }
}

public class Main {
    public static void findElement(String locator) {
        if ("#missing-popup".equals(locator)) {
            throw new ElementNotFoundException(locator);
        }
        System.out.println("Located element: " + locator);
    }

    public static void main(String[] args) {
        try {
            System.out.println("Attempting element location...");
            findElement("#missing-popup");
        } catch (ElementNotFoundException ex) {
            System.err.println("[HANDLED ERROR] " + ex.getMessage());
        } finally {
            System.out.println("Teardown: Diagnostic screenshot captured.");
        }
    }
}
`,
    bestPractices: [
      'Never catch bare Exception or Throwable; catch specific exceptions (like IOException, NoSuchElementException).',
      'Use try-with-resources for streams, database connections, and file readers.',
    ],
  },
  {
    id: 'advanced',
    title: 'Java Advanced Concepts & Generics',
    order: 29,
    language: 'java',
    summary: 'Generics (<T>), bounded wildcards (? extends / ? super), Enums, and Reflection basics.',
    overview: 'Generics provide compile-time type safety and eliminate runtime ClassCastExceptions. Enums provide type-safe constants with custom fields and methods.',
    keyPoints: [
      'Generic class: public class ApiResponse<T> { T data; }',
      'Enums define fixed sets of named constants with fields and behavior',
      'Reflection allows inspecting classes, methods, and annotations at runtime',
    ],
    starterCode: `// 29. Java Generics & Type-Safe Enums
enum Environment {
    DEV("https://dev.api.com", 15),
    STAGING("https://staging.api.com", 30),
    PROD("https://api.com", 60);

    private final String url;
    private final int timeoutSeconds;

    Environment(String url, int timeoutSeconds) {
        this.url = url;
        this.timeoutSeconds = timeoutSeconds;
    }

    public String getUrl() { return url; }
    public int getTimeout() { return timeoutSeconds; }
}

// Generic Response Wrapper
class ApiResponse<T> {
    private int statusCode;
    private T payload;

    public ApiResponse(int statusCode, T payload) {
        this.statusCode = statusCode;
        this.payload = payload;
    }

    public T getPayload() { return payload; }
    public int getStatusCode() { return statusCode; }
}

public class Main {
    public static void main(String[] args) {
        Environment env = Environment.STAGING;
        System.out.println("Active Env: " + env + " | URL: " + env.getUrl() + " | Timeout: " + env.getTimeout() + "s");

        ApiResponse<String> response = new ApiResponse<>(200, "{ \\"status\\": \\"success\\" }");
        System.out.println("Response Payload: " + response.getPayload());
    }
}
`,
    bestPractices: [
      'Use enums instead of string constants for fixed sets of options (like Browser, Environment, Severity).',
    ],
  },
];
