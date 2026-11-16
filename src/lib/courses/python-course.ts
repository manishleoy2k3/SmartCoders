import { CourseConcept, LanguageCourseMeta } from '../kids-courses-types';

export const PYTHON_CONCEPTS: CourseConcept[] = [
  {
    id: 'intro',
    title: 'Python Intro, Get Started & Syntax',
    order: 1,
    language: 'python',
    summary: 'What is Python, execution lifecycle (.py & REPL), and core syntax & 4-space indentation rules.',
    overview: 'Python is a high-level, general-purpose interpreted language created by Guido van Rossum in 1991. The Python interpreter reads your .py source file, compiles it into bytecode, and executes it immediately. Unlike languages requiring curly braces, Python delimits code blocks strictly using clean whitespace indentation.',
    keyPoints: [
      'Interpreted language: executes code line-by-line without manual compile steps',
      'Execution lifecycle: run files via "python3 script.py" or interactively via the terminal REPL',
      'Indentation rules: standard 4 spaces per nesting level define code blocks (PEP 8 standard)',
      'Clean syntax: statements end with newline (no semicolons required)',
    ],
    starterCode: `# 1. Python Intro, Get Started & Syntax
import sys

# Welcome & Runtime Information
print("🐍 Welcome to Python 3!")
print(f"Active Interpreter Version: {sys.version.split()[0]}")

# 4-Space Indentation Rules & Clean Syntax
test_status = "PASS"
execution_speed_ms = 42

if test_status == "PASS":
    print("  ✓ Indented Block: Test suite executed cleanly!")
    print(f"  ✓ Duration: {execution_speed_ms}ms")
else:
    print("  ✗ Test suite failed.")

print("Root level: Script completed successfully.")
`,
    bestPractices: [
      'Write Pythonic code following the Zen of Python (PEP 20): Simple is better than complex.',
      'Never mix tabs and spaces in Python files; configure your editor to indent with 4 spaces.',
      'Keep your entry point clean using if __name__ == "__main__": blocks in executable scripts.',
    ],
  },
  {
    id: 'output',
    title: 'Python Output',
    order: 2,
    language: 'python',
    summary: 'Printing to the console, sep and end parameters, and modern f-string interpolation.',
    overview: 'The print() function outputs strings, numbers, collections, and custom objects to standard output (sys.stdout). You can customize the separator between items with sep=, control trailing characters with end=, and format numbers cleanly with f-strings.',
    keyPoints: [
      'print(*objects, sep=" ", end="\\n") outputs values with flexible separators',
      'f-strings (f"Value: {val}") are the fastest, cleanest string formatting mechanism in Python',
      'Format specifications: {val:.2f} for floats, {num:05d} for padded integers',
    ],
    starterCode: `# 2. Python Output & Formatting
item = "Automation Test Suite"
passed = 48
total = 50
pass_rate = (passed / total) * 100

# Custom separator and custom end character
print("Status", "Report", "2026", sep=" -> ")
print(f"Suite: {item} | Passed: {passed}/{total} | Rate: {pass_rate:.1f}%")
print("Progress: [", end="")
print("=" * 10, end="")
print("] 100%")
`,
    bestPractices: [
      'Use f-strings for all modern string formatting rather than % or .format().',
      'Use sys.stdout.write when building real-time command-line spinners or progress bars.',
    ],
  },
  {
    id: 'comments',
    title: 'Python Comments',
    order: 3,
    language: 'python',
    summary: 'Single-line comments, inline comments, multi-line docstrings, and documentation standards.',
    overview: 'Comments clarify complex business rules, explain non-obvious algorithms, and document functions for other engineers. The Python interpreter completely ignores comments during execution.',
    keyPoints: [
      'Single-line comments begin with a hash character (#)',
      'Inline comments follow code separated by at least two spaces (e.g., x = 5  # Initial count)',
      'Docstrings use triple quotes ("""Docstring""") to document modules, classes, and functions',
      'Docstrings are accessible at runtime via obj.__doc__ or help(obj)',
    ],
    starterCode: `# 3. Python Comments & Docstrings

# Single-line comment explaining the variable
base_url = "https://api.intelligentqa.com"

def calculate_latency(start_ms: float, end_ms: float) -> float:
    """Calculate the elapsed round-trip time in milliseconds.

    Args:
        start_ms: Unix timestamp start.
        end_ms: Unix timestamp end.

    Returns:
        The delta in milliseconds.
    """
    return end_ms - start_ms  # inline comment

print("Function docstring:")
print(calculate_latency.__doc__)
print(f"Latency test: {calculate_latency(100.5, 145.2):.1f} ms")
`,
    bestPractices: [
      'Write comments that explain "why" a solution exists, not "what" the obvious code already does.',
      'Always add docstrings to public automation utility functions and test helpers.',
    ],
  },
  {
    id: 'variables',
    title: 'Python Variables',
    order: 4,
    language: 'python',
    summary: 'Creating variables, dynamic reassignment, multiple assignment, and naming conventions.',
    overview: 'In Python, a variable is created the moment you first assign a value to it using the = operator. You do not need to declare a variable type. Variables in Python are references pointing to objects stored in memory.',
    keyPoints: [
      'Variables are dynamically typed and can reference different types over time',
      'Variable names are case-sensitive: count and Count are distinct variables',
      'Multiple assignments in one line: a, b, c = 1, 2, 3',
      'Naming convention: snake_case for variables/functions, PascalCase for classes',
    ],
    starterCode: `# 4. Python Variables & Multiple Assignment
user_name = "Alex"
user_age = 14
is_enrolled = True

# Multiple assignment (tuple unpacking)
x, y, z = 10, 20, 30

# Variable swapping without a temporary variable!
x, y = y, x

print(f"User: {user_name}, Age: {user_age}, Enrolled: {is_enrolled}")
print(f"Swapped values: x={x}, y={y}, z={z}")
`,
    bestPractices: [
      'Use descriptive, searchable names (e.g. max_retry_attempts rather than mra).',
      'Avoid using Python reserved keywords like list, dict, type, or id as variable names.',
    ],
  },
  {
    id: 'data-types',
    title: 'Python Data Types',
    order: 5,
    language: 'python',
    summary: 'Built-in data types, type inspection with type(), and isinstance() validation.',
    overview: 'Python has built-in data types categorized into Text (str), Numeric (int, float, complex), Sequence (list, tuple, range), Mapping (dict), Set (set, frozenset), Boolean (bool), and Binary (bytes, bytearray).',
    keyPoints: [
      'type(x) returns the runtime class type of x',
      'isinstance(x, int) checks if an object is an instance of a specified type',
      'NoneType (None) represents the intentional absence of a value',
      'Everything in Python is an object, including integers and functions',
    ],
    starterCode: `# 5. Python Data Types & Type Inspection
sample_int = 42
sample_float = 3.14159
sample_str = "SDET Automated Testing"
sample_bool = True
sample_list = ["Selenium", "Playwright", "Cypress"]
sample_dict = {"framework": "Playwright", "language": "Python"}
sample_none = None

types = [sample_int, sample_float, sample_str, sample_bool, sample_list, sample_dict, sample_none]

for item in types:
    print(f"Value: {repr(item):<25} | Type: {type(item).__name__}")
`,
    bestPractices: [
      'Prefer isinstance(val, (int, float)) over type(val) == int to support subclassing and inheritance.',
      'Use Python type hints (def add(a: int, b: int) -> int:) for better IDE autocompletion and static analysis.',
    ],
  },
  {
    id: 'numbers',
    title: 'Python Numbers',
    order: 6,
    language: 'python',
    summary: 'Integers, floats, complex numbers, scientific notation, and the math module.',
    overview: 'Python supports arbitrary-precision integers (int can grow as large as memory permits), floating-point numbers (IEEE 754 double precision float), and complex numbers (complex with real and imaginary parts).',
    keyPoints: [
      'int has unlimited precision in Python 3; no overflow errors occur',
      'float represents real numbers with decimals (e.g., 3.14 or 1e-4 in scientific notation)',
      'complex numbers use j for the imaginary unit (e.g. 3 + 4j)',
      'The math module provides advanced operations like sqrt, floor, ceil, and pi',
    ],
    starterCode: `# 6. Python Numbers & Mathematical Utilities
import math

# Unlimited precision integer
big_number = 2 ** 64
print("2^64 =", big_number)

# Floating point arithmetic
price = 19.99
tax_rate = 0.0825
total = price * (1 + tax_rate)

print(f"Subtotal: \${price:.2f}")
print(f"Total with Tax: \${total:.2f}")
print(f"math.ceil total: \${math.ceil(total)}")
print(f"math.sqrt(144): {math.sqrt(144):.0f}")
`,
    bestPractices: [
      'For monetary calculations, use the decimal.Decimal module to prevent float precision rounding inaccuracies.',
      'Use underscores in large numbers for readability (e.g., 1_000_000).',
    ],
  },
  {
    id: 'casting',
    title: 'Python Casting',
    order: 7,
    language: 'python',
    summary: 'Type conversion functions: int(), float(), str(), bool(), list(), and tuple().',
    overview: 'Casting converts a value from one data type to another. Python provides explicit constructor functions to cast between numbers, strings, and collections.',
    keyPoints: [
      'int("123") converts a numeric string or float to an integer',
      'float("45.67") parses decimal text into a floating-point number',
      'str(100) converts any Python object into its string representation',
      'bool(x) evaluates truthiness: 0, "", [], {}, None become False; others become True',
    ],
    starterCode: `# 7. Python Casting & Type Conversions
raw_input_age = "15"
parsed_age = int(raw_input_age)
next_year_age = parsed_age + 1

price_str = "49.95"
price_float = float(price_str)

print(f"String '{raw_input_age}' cast to int: {parsed_age} (Next year: {next_year_age})")
print(f"Price float: {price_float:.2f}")

# Truthiness casting
print("bool('Hello'):", bool("Hello"))
print("bool(''):", bool(""))
print("bool(0):", bool(0))
print("bool(42):", bool(42))
`,
    bestPractices: [
      'Always wrap int() or float() user input parsing in try...except ValueError to handle malformed input gracefully.',
    ],
  },
  {
    id: 'strings',
    title: 'Python Strings & Manipulation',
    order: 8,
    language: 'python',
    summary: 'Indexing, slicing, immutability, string methods (split, join, replace, upper, strip), and f-strings.',
    overview: 'Strings in Python are immutable sequences of Unicode characters enclosed in single or double quotes. Python provides rich slicing syntax [start:end:step] and dozens of built-in transformation methods.',
    keyPoints: [
      'Strings are immutable; modifying a string creates a new string object in memory',
      'Slicing syntax: text[0:5] grabs first 5 characters, text[::-1] reverses a string',
      'Common methods: .lower(), .upper(), .strip(), .split(), .join(), .replace()',
      'f-strings support inline expressions, function calls, and formatting flags',
    ],
    starterCode: `# 8. Python Strings & Slicing
message = "  Automation Engineer with Python  "

# Trimming and Case formatting
clean = message.strip()
print("Cleaned:", clean)
print("Upper:", clean.upper())
print("Lower:", clean.lower())

# Slicing
print("First 10 chars:", clean[:10])
print("Reversed string:", clean[::-1])

# Split and Join
words = clean.split()
rejoined = "-".join(words)
print("Words list:", words)
print("Kebab-case joined:", rejoined)
`,
    bestPractices: [
      'Use str.join(list) to concatenate multiple strings rather than the + operator in loops for O(N) performance.',
      'Use str.startswith() and str.endswith() instead of slicing when checking string prefixes and suffixes.',
    ],
  },
  {
    id: 'booleans',
    title: 'Python Booleans & Logic',
    order: 9,
    language: 'python',
    summary: 'Boolean values True and False, comparison evaluation, truthiness, and short-circuit evaluation.',
    overview: 'Booleans represent one of two truth values: True or False. In Python, booleans are a subclass of integers (True == 1 and False == 0). Every Python object evaluates to True or False in conditional contexts.',
    keyPoints: [
      'Keywords True and False are capitalized in Python',
      'Falsy values: False, None, 0, 0.0, empty collections ("", [], (), {})',
      'Truthy values: Any non-zero number, non-empty string, or populated collection',
      'Logical operators: and, or, not',
    ],
    starterCode: `# 9. Python Booleans & Logical Evaluation
has_token = True
is_expired = False
role = "admin"

is_authorized = has_token and not is_expired and (role == "admin" or role == "tester")
print(f"Is User Authorized: {is_authorized}")

# Checking truthiness of collections
cart = ["Notebook", "Pencil"]
empty_cart = []

print("Cart has items:", bool(cart))
print("Empty cart has items:", bool(empty_cart))
`,
    bestPractices: [
      'Prefer if items: over if len(items) > 0: to leverage Python truthiness idiomatic style.',
      'Never compare booleans with == True; use if is_valid: or if not is_valid:.',
    ],
  },
  {
    id: 'operators',
    title: 'Python Operators & Expressions',
    order: 10,
    language: 'python',
    summary: 'Arithmetic, assignment, comparison, logical, identity (is), and membership (in) operators.',
    overview: 'Python provides standard arithmetic operators (+, -, *, /, //, %, **), comparison operators (==, !=, <, >), logical operators (and, or, not), identity operators (is, is not), and membership operators (in, not in).',
    keyPoints: [
      '// performs floor (integer) division; / always produces a float',
      '** is the exponentiation operator (e.g. 2 ** 3 == 8)',
      'is checks memory identity (same object in RAM); == checks value equality',
      'in checks for membership inside a string, list, tuple, set, or dictionary',
    ],
    starterCode: `# 10. Python Operators in Action
a = 17
b = 5

print(f"True Division (17 / 5): {a / b}")
print(f"Floor Division (17 // 5): {a // b}")
print(f"Remainder Modulus (17 % 5): {a % b}")
print(f"Exponent (2 ** 8): {2 ** 8}")

# Membership & Identity
tools = ["Selenium", "Playwright", "Cypress"]
print("'Playwright' in tools:", "Playwright" in tools)
print("'Postman' in tools:", "Postman" in tools)

# Difference between == and is
list1 = [1, 2, 3]
list2 = [1, 2, 3]
print("list1 == list2 (Same value):", list1 == list2)
print("list1 is list2 (Same memory address):", list1 is list2)
`,
    bestPractices: [
      'Use is None and is not None to check for None (never use == None).',
      'Use chained comparisons like 0 <= score <= 100 for clean range checking.',
    ],
  },
  {
    id: 'lists',
    title: 'Python Lists & Comprehensions',
    order: 11,
    language: 'python',
    summary: 'Ordered mutable collections, indexing, slicing, methods (append, pop, sort), and list comprehensions.',
    overview: 'Lists are ordered, mutable sequences that can store duplicate elements of mixed data types. List comprehensions provide a concise syntax to create new lists from existing iterables based on transformations and filters.',
    keyPoints: [
      'Created using square brackets: my_list = [1, 2, 3]',
      'Mutable: elements can be modified, appended, inserted, and removed in-place',
      'Common methods: .append(), .extend(), .insert(), .remove(), .pop(), .sort(), .reverse()',
      'List comprehension syntax: [expression for item in iterable if condition]',
    ],
    starterCode: `# 11. Python Lists & List Comprehensions
frameworks = ["Selenium", "Appium", "Playwright", "Cypress"]

# Modifying lists
frameworks.append("Robot Framework")
frameworks.sort()
print("Sorted Frameworks:", frameworks)

# List Comprehension: Filter items with > 6 characters and convert to uppercase
long_names = [f.upper() for f in frameworks if len(f) > 6]
print("Frameworks (>6 chars):", long_names)

# Number comprehension: Squares of even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [n ** 2 for n in numbers if n % 2 == 0]
print("Even Squares:", even_squares)
`,
    bestPractices: [
      'Use list comprehensions for simple mappings and filters, but avoid deeply nested comprehensions for readability.',
      'Use deque from collections module if you need O(1) appends and pops from both ends of a list.',
    ],
  },
  {
    id: 'tuples',
    title: 'Python Tuples & Immutability',
    order: 12,
    language: 'python',
    summary: 'Ordered immutable collections, packing and unpacking, singleton tuples, and tuple hashing.',
    overview: 'A tuple is an ordered, immutable collection. Once created, its items cannot be added, removed, or changed. Because they are immutable, tuples can be used as dictionary keys and set elements if all members are hashable.',
    keyPoints: [
      'Created with parentheses: coordinates = (10, 20)',
      'A single-item tuple requires a trailing comma: single = (42,)',
      'Tuple unpacking allows assigning members to multiple variables: x, y = point',
      'Tuples use less memory and execute faster than lists',
    ],
    starterCode: `# 12. Python Tuples & Unpacking
endpoint = ("GET", "/api/v1/users", 200)

# Unpacking
method, path, expected_status = endpoint
print(f"HTTP Method: {method}")
print(f"API Route: {path}")
print(f"Status: {expected_status}")

# Functions returning multiple values actually return a tuple!
def get_screen_resolution():
    return 1920, 1080  # Returns (1920, 1080)

width, height = get_screen_resolution()
print(f"Screen: {width}x{height}")
`,
    bestPractices: [
      'Use tuples when representing fixed, heterogeneous records (e.g. database rows or coordinates).',
      'Consider collections.namedtuple or dataclasses for structured records with named fields.',
    ],
  },
  {
    id: 'sets',
    title: 'Python Sets & Operations',
    order: 13,
    language: 'python',
    summary: 'Unordered collections of unique elements, set operations (union, intersection, difference), and deduplication.',
    overview: 'A set is an unordered, unindexed collection of unique elements. Sets are implemented as hash tables, making membership testing (x in my_set) an extremely fast O(1) constant-time operation.',
    keyPoints: [
      'Created using curly braces {1, 2, 3} or set() function; empty set must use set()',
      'Automatically eliminates duplicates upon initialization',
      'Union (a | b), Intersection (a & b), Difference (a - b), Symmetric Difference (a ^ b)',
      'O(1) average lookup performance compared to O(N) for lists',
    ],
    starterCode: `# 13. Python Sets & Fast Deduplication
browsers = ["Chrome", "Firefox", "Chrome", "Edge", "Safari", "Firefox"]

# Remove duplicates in one step
unique_browsers = set(browsers)
print("Unique Browsers:", unique_browsers)

# Mathematical Set Operations
frontend_skills = {"HTML", "CSS", "JavaScript", "TypeScript", "React"}
sdet_skills = {"Python", "JavaScript", "Selenium", "Playwright", "React"}

print("Common Skills (Intersection):", frontend_skills & sdet_skills)
print("All Unique Skills (Union):", frontend_skills | sdet_skills)
print("SDET Exclusive Skills (Difference):", sdet_skills - frontend_skills)
`,
    bestPractices: [
      'Convert lists to sets when you need frequent membership tests (if item in lookup_set:).',
      'Remember that set elements must be immutable and hashable (e.g. lists cannot be set elements).',
    ],
  },
  {
    id: 'dictionaries',
    title: 'Python Dictionaries & Key-Value Pairs',
    order: 14,
    language: 'python',
    summary: 'Mapping type with key-value pairs, dictionary methods (.get, .keys, .values, .items), and dict comprehensions.',
    overview: 'Dictionaries are mutable mappings of unique keys to values. As of Python 3.7+, dictionaries maintain insertion order. They provide constant-time O(1) average lookups by key.',
    keyPoints: [
      'Created with curly braces: user = {"name": "Sara", "role": "SDET"}',
      'Keys must be immutable and hashable (strings, numbers, tuples)',
      'Use user.get("age", 0) to avoid KeyError when accessing optional keys',
      'Dictionary comprehensions allow transforming mappings concisely',
    ],
    starterCode: `# 14. Python Dictionaries in Action
test_run = {
    "suite": "Smoke Tests",
    "total": 45,
    "passed": 43,
    "failed": 2,
    "env": "staging",
}

# Accessing with fallback
browser = test_run.get("browser", "Headless Chrome")
print(f"Browser: {browser}")

# Iterating keys and values
print("Test Run Summary:")
for key, value in test_run.items():
    print(f"  {key.capitalize()}: {value}")

# Dictionary Comprehension: Calculate percentages
scores = {"Alice": 95, "Bob": 78, "Charlie": 88}
passing_students = {k: v for k, v in scores.items() if v >= 80}
print("High Scorers:", passing_students)
`,
    bestPractices: [
      'Always use .get(key, default) when reading keys that might not exist in dynamic JSON responses.',
      'Use dict.setdefault() or collections.defaultdict to simplify grouping logic.',
    ],
  },
  {
    id: 'if-else',
    title: 'Python If...Else Conditions & Decisions',
    order: 15,
    language: 'python',
    summary: 'Branching logic with if, elif, else, nested conditions, and conditional ternary expressions.',
    overview: 'Conditional statements allow programs to make decisions and execute different blocks of code based on whether a boolean expression evaluates to True or False.',
    keyPoints: [
      'Syntax: if condition: followed by indented statements, optional elif:, and final else:',
      'Multiple conditions combined with and, or, not',
      'Ternary conditional expression: result = "Pass" if score >= 70 else "Fail"',
      'pass keyword acts as a syntactical placeholder for empty blocks',
    ],
    starterCode: `# 15. Python If...Else & Ternary Operator
http_status = 404

if 200 <= http_status < 300:
    category = "Success"
elif 300 <= http_status < 400:
    category = "Redirection"
elif 400 <= http_status < 500:
    category = "Client Error"
elif 500 <= http_status < 600:
    category = "Server Error"
else:
    category = "Unknown Status"

print(f"HTTP {http_status}: {category}")

# One-line ternary expression
grade = 88
verdict = "Distinction" if grade >= 85 else "Pass"
print(f"Grade {grade} -> Verdict: {verdict}")
`,
    bestPractices: [
      'Avoid deep nesting (> 3 levels) of if statements; use guard clauses with early returns.',
      'Take advantage of chained comparisons (e.g., 200 <= status < 300) for cleaner code.',
    ],
  },
  {
    id: 'match',
    title: 'Python Match & Case Statements',
    order: 16,
    language: 'python',
    summary: 'Structural pattern matching introduced in Python 3.10 with match and case expressions.',
    overview: 'Introduced in Python 3.10 (PEP 634), the match statement brings structural pattern matching to Python, replacing complex if-elif chains with elegant pattern matching on values, shapes, types, and sequence structures.',
    keyPoints: [
      'Syntax: match subject: with case pattern: branches',
      'Wildcard case _: acts as the default fallback branch',
      'Combines values using the pipe | symbol (e.g. case 200 | 201:)',
      'Supports guard conditions with if (e.g. case x if x > 100:)',
    ],
    starterCode: `# 16. Python Match & Case Statement (Python 3.10+)
command = "DELETE /api/users"

action, *resource = command.split()

match action:
    case "GET":
        print(f"Retrieving data from {resource}")
    case "POST":
        print(f"Creating new resource at {resource}")
    case "PUT" | "PATCH":
        print(f"Updating resource at {resource}")
    case "DELETE":
        print(f"Removing resource at {resource}")
    case _:
        print(f"Unsupported action: {action}")
`,
    bestPractices: [
      'Use match-case when handling commands, HTTP method dispatching, or validating complex AST / JSON shapes.',
      'Always include the wildcard case _: to catch unexpected or unhandled inputs.',
    ],
  },
  {
    id: 'while-loops',
    title: 'Python While Loops & Iteration',
    order: 17,
    language: 'python',
    summary: 'Iterating while a condition holds true, break, continue, and the loop else clause.',
    overview: 'A while loop repeatedly executes a target block of statements as long as the test condition remains True. Python also features a unique while...else clause that executes when the condition becomes False without hitting break.',
    keyPoints: [
      'Condition is evaluated before each iteration',
      'break immediately terminates and exits the loop',
      'continue skips the rest of the current iteration and re-evaluates the condition',
      'else block runs when the loop condition terminates normally without a break',
    ],
    starterCode: `# 17. Python While Loops & Polling Simulation
retry_count = 0
max_retries = 5
service_ready = False

while retry_count < max_retries:
    retry_count += 1
    print(f"Polling server (Attempt {retry_count}/{max_retries})...")
    if retry_count == 3:
        service_ready = True
        print("Server answered! Breaking loop.")
        break
else:
    print("Failed to reach server within retry threshold.")

print(f"Final Service State: Ready={service_ready}")
`,
    bestPractices: [
      'Always ensure the loop variable is updated within the while block to prevent infinite loops.',
      'Prefer for loops with range() over while loops when the total iteration count is predetermined.',
    ],
  },
  {
    id: 'for-loops',
    title: 'Python For Loops',
    order: 18,
    language: 'python',
    summary: 'Iterating over sequences, iterating dictionaries, enumerate(), zip(), and nested loops.',
    overview: 'Python for loops iterate over elements of any sequence or iterable (strings, lists, tuples, sets, dictionaries, generators). Unlike traditional C-style for loops, Python for loops act like for-each iterators.',
    keyPoints: [
      'Syntax: for item in iterable:',
      'enumerate(iterable, start=0) gives you both the index and the value',
      'zip(list1, list2) iterates over multiple collections in parallel',
      'Nested loops iterate through multidimensional matrices or combinations',
    ],
    starterCode: `# 18. Python For Loops with enumerate and zip
test_cases = ["Login Test", "Cart Checkout", "Profile Update", "Logout Test"]
durations_ms = [320, 1150, 480, 210]

# enumerate gives index and item cleanly
print("--- Test Execution Index ---")
for idx, test in enumerate(test_cases, start=1):
    print(f"Test #{idx}: {test}")

# zip pairs multiple lists together
print("\\n--- Combined Test Run Metrics ---")
for name, ms in zip(test_cases, durations_ms):
    status = "SLOW" if ms > 1000 else "FAST"
    print(f"[{status}] {name:<20} took {ms}ms")
`,
    bestPractices: [
      'Never iterate over range(len(items)) when you need indices; always use enumerate(items).',
      'Use zip() with strict=True (Python 3.10+) when you want an error if iterables have unequal lengths.',
    ],
  },
  {
    id: 'range',
    title: 'Python Range Function',
    order: 19,
    language: 'python',
    summary: 'The range(start, stop, step) sequence generator, memory efficiency, and step increments.',
    overview: 'The range() function returns an immutable sequence of numbers. Instead of allocating memory for all numbers at once, range generates numbers on the fly in O(1) memory, regardless of the size of the range.',
    keyPoints: [
      'range(stop): generates 0 up to (stop - 1)',
      'range(start, stop): generates start up to (stop - 1)',
      'range(start, stop, step): increments by step; negative step counts backward',
      'O(1) memory complexity: range(1_000_000) takes the same tiny memory footprint as range(10)',
    ],
    starterCode: `# 19. Python Range Generator
# Basic range 0 to 4
print("range(5):", list(range(5)))

# Range with start and stop (10 to 15)
print("range(10, 16):", list(range(10, 16)))

# Range with step 2 (Even numbers)
print("Even numbers (2 to 10):", list(range(2, 11, 2)))

# Reverse counting countdown
print("Countdown: ", end="")
for sec in range(5, 0, -1):
    print(sec, end=".. ")
print("BLASTOFF!")
`,
    bestPractices: [
      'Do not cast range to list unless you explicitly need a list object; iterate directly over range.',
    ],
  },
  {
    id: 'functions',
    title: 'Python Functions & Methods',
    order: 20,
    language: 'python',
    summary: 'Defining functions with def, parameters, default arguments, *args, **kwargs, and return values.',
    overview: 'Functions are reusable, named blocks of code designed to perform specific operations. Python functions are first-class citizens, meaning they can be passed as arguments, assigned to variables, and returned from other functions.',
    keyPoints: [
      'Created with def function_name(params):',
      'Default parameter values: def connect(timeout=30)',
      '*args gathers arbitrary positional arguments into a tuple',
      '**kwargs gathers arbitrary keyword arguments into a dictionary',
    ],
    starterCode: `# 20. Python Functions with *args and **kwargs
def calculate_grade(score: float, max_score: float = 100.0) -> str:
    pct = (score / max_score) * 100
    if pct >= 90: return "A"
    if pct >= 80: return "B"
    if pct >= 70: return "C"
    return "F"

# Variable arguments (*args, **kwargs)
def build_report(report_title, *metrics, **metadata):
    print(f"=== {report_title} ===")
    print("Metrics:", metrics)
    print("Metadata:", metadata)

print("Grade:", calculate_grade(85))
print("Custom Base Grade:", calculate_grade(42, max_score=50))
build_report("Nightly CI Run", 98.5, 120.4, 45.2, environment="Staging", runner="Linux")
`,
    bestPractices: [
      'Never use mutable objects (like [] or {}) as default parameter values; use None and assign inside.',
      'Include type annotations and return type annotations for clean documentation and static analysis.',
    ],
  },
  {
    id: 'lambda',
    title: 'Python Lambda & Anonymous Functions',
    order: 21,
    language: 'python',
    summary: 'Single-expression anonymous functions, map(), filter(), sorted(key=...), and callbacks.',
    overview: 'A lambda function is a small, anonymous function defined with the lambda keyword. It can take any number of arguments, but can only contain a single expression whose evaluated result is returned.',
    keyPoints: [
      'Syntax: lambda arguments: expression',
      'Useful as quick callback keys for sorted(), min(), max()',
      'map(func, iterable) transforms each element',
      'filter(func, iterable) keeps elements where func evaluates to True',
    ],
    starterCode: `# 21. Python Lambda & Higher-Order Functions
# Sorting objects by custom dictionary keys
users = [
    {"name": "Alice", "score": 92},
    {"name": "Bob", "score": 75},
    {"name": "Charlie", "score": 88},
]

# Sort by score ascending using lambda key
users_by_score = sorted(users, key=lambda u: u["score"], reverse=True)
print("Ranked Users:")
for rank, u in enumerate(users_by_score, start=1):
    print(f"  {rank}. {u['name']} ({u['score']} pts)")

# map and filter with lambda
numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
tripled = list(map(lambda x: x * 3, evens))
print("Filtered Evens:", evens)
print("Tripled Evens:", tripled)
`,
    bestPractices: [
      'Do not assign lambdas to variable names (f = lambda x: ...); use def f(x): instead as per PEP 8.',
      'Prefer list comprehensions over map and filter with lambda for readability in pure Python.',
    ],
  },
  {
    id: 'arrays',
    title: 'Python Arrays & Collections',
    order: 22,
    language: 'python',
    summary: 'The array module for homogeneous primitive arrays, comparison with lists, and memory efficiency.',
    overview: 'While Python lists can store heterogeneous objects, the array module provides compact, homogeneous arrays of primitive numeric data types (integers, floats) stored directly as contiguous C buffers in memory.',
    keyPoints: [
      'import array creates compact numeric arrays with type codes (e.g. "i" for int, "d" for double)',
      'Substantially lower memory consumption than general Python lists of numbers',
      'Directly compatible with binary C file reading and writing',
      'Lists are preferred for general programming; array and NumPy are preferred for numeric workloads',
    ],
    starterCode: `# 22. Python Homogeneous Arrays vs Lists
import array

# Create an array of signed integers (type code 'i')
sensor_readings = array.array('i', [102, 105, 98, 110, 104])

# Appending and accessing elements
sensor_readings.append(108)
print(f"Array Type Code: '{sensor_readings.typecode}'")
print(f"Item Size (bytes): {sensor_readings.itemsize}")
print(f"Readings Count: {len(sensor_readings)}")
print(f"Values: {sensor_readings.tolist()}")
print(f"Average: {sum(sensor_readings) / len(sensor_readings):.1f}")
`,
    bestPractices: [
      'Use built-in lists for everyday programming and array/NumPy when processing millions of numeric values.',
    ],
  },
  {
    id: 'classes-objects',
    title: 'Python Objects & Classes',
    order: 23,
    language: 'python',
    summary: 'Object-Oriented Programming (OOP), __init__ constructor, instance methods, self parameter, and __str__.',
    overview: 'Classes provide a blueprint for creating objects, bundling data (attributes) and behavior (methods) together. The __init__() method initializes instance state, and self refers to the active object instance.',
    keyPoints: [
      'Class definition starts with class ClassName:',
      '__init__(self, ...) initializes instance variables',
      'self must be the first parameter of any instance method in Python',
      '__str__ and __repr__ define how the object renders as human-readable text',
    ],
    starterCode: `# 23. Python Classes & Object-Oriented Blueprint
class TestCase:
    def __init__(self, test_id: str, title: str, priority: str = "P2"):
        self.test_id = test_id
        self.title = title
        self.priority = priority
        self.status = "PENDING"

    def execute(self, is_passing: bool = True):
        self.status = "PASSED" if is_passing else "FAILED"
        return self.status

    def __str__(self):
        return f"[{self.test_id}] {self.title} - Priority: {self.priority} (Status: {self.status})"

# Creating instances
login_test = TestCase("TC-101", "User Login with Valid Credentials", priority="P0")
checkout_test = TestCase("TC-102", "Stripe Checkout Flow", priority="P1")

login_test.execute(is_passing=True)
checkout_test.execute(is_passing=False)

print(login_test)
print(checkout_test)
`,
    bestPractices: [
      'Keep class attributes distinct from instance attributes initialized inside __init__.',
      'Always implement __str__ for human logging and __repr__ for unambiguous debugging.',
    ],
  },
  {
    id: 'inheritance',
    title: 'Python Inheritance & Polymorphism',
    order: 24,
    language: 'python',
    summary: 'Subclasses, super() function, method overriding, multiple inheritance, and polymorphic interfaces.',
    overview: 'Inheritance allows a new class (child/subclass) to inherit attributes and methods from an existing class (parent/superclass). Polymorphism enables different classes to be treated uniformly through shared method interfaces.',
    keyPoints: [
      'class Child(Parent): derives Child from Parent',
      'super().__init__() invokes the parent constructor cleanly',
      'Subclasses can override parent methods to provide specialized behavior',
      'isinstance(obj, Parent) returns True for child class instances',
    ],
    starterCode: `# 24. Python Inheritance & Polymorphic Automation Drivers
class BaseDriver:
    def __init__(self, browser_name: str):
        self.browser_name = browser_name

    def navigate(self, url: str):
        print(f"[{self.browser_name}] Navigating to {url}")

    def take_screenshot(self):
        print(f"[{self.browser_name}] Generic screenshot captured.")

class ChromeDriver(BaseDriver):
    def __init__(self, headless: bool = True):
        super().__init__("Google Chrome")
        self.headless = headless

    # Method Overriding
    def take_screenshot(self):
        mode = "Headless" if self.headless else "GUI"
        print(f"[{self.browser_name} ({mode})] High-res Chromium screenshot captured.")

# Polymorphism in action
drivers: list[BaseDriver] = [BaseDriver("Safari"), ChromeDriver(headless=True)]
for d in drivers:
    d.navigate("https://intelligentqa.com")
    d.take_screenshot()
`,
    bestPractices: [
      'Favor composition over deep inheritance hierarchies for maintainable test frameworks.',
      'Always call super().__init__() to ensure parent initialization state is preserved.',
    ],
  },
  {
    id: 'iterators',
    title: 'Python Iterators & Generators',
    order: 25,
    language: 'python',
    summary: 'The iterator protocol (__iter__, __next__), generator functions with yield, and memory efficiency.',
    overview: 'An iterator is an object representing a stream of data that produces values one at a time via next(). A generator function uses yield to pause execution and stream values with near-zero memory footprint.',
    keyPoints: [
      'Iterator protocol uses __iter__() and __next__() methods',
      'Calling next() raises StopIteration when the stream is exhausted',
      'yield turns any standard Python function into a lazy generator',
      'Generators enable streaming multi-gigabyte log files without memory crashes',
    ],
    starterCode: `# 25. Python Generators with yield for Memory Efficiency
def page_id_generator(batch_size: int, total_items: int):
    """Lazily generate pagination offsets without preallocating a list."""
    current = 0
    while current < total_items:
        yield f"offset_{current}_limit_{batch_size}"
        current += batch_size

# Consuming the generator stream
stream = page_id_generator(batch_size=20, total_items=80)
print("Type of stream:", type(stream).__name__)

for page_token in stream:
    print("Fetching batch:", page_token)
`,
    bestPractices: [
      'Use generator functions (yield) whenever reading large log files, database tables, or CSV feeds.',
      'Use generator expressions (x ** 2 for x in data) instead of list comprehensions when only iterating once.',
    ],
  },
  {
    id: 'scope',
    title: 'Python Scope & Global Variables',
    order: 26,
    language: 'python',
    summary: 'LEGB rule (Local, Enclosing, Global, Built-in), the global keyword, and nonlocal closures.',
    overview: 'Scope determines where a variable is recognized and accessible. Python resolves variable references using the LEGB rule: Local $\\rightarrow$ Enclosing $\\rightarrow$ Global $\\rightarrow$ Built-in.',
    keyPoints: [
      'Local scope: variables created inside a function',
      'Enclosing scope: variables in outer functions (closures)',
      'Global scope: variables defined at the top level of a module',
      'Built-in scope: pre-defined keywords and built-in functions (len, print, range)',
      'The global and nonlocal keywords permit modifying outer variables',
    ],
    starterCode: `# 26. Python Scope & LEGB Demonstration
global_counter = 100

def outer_function():
    enclosing_val = "Enclosing Scope"

    def inner_function():
        local_val = "Local Scope"
        print(f"Inside: {local_val} | {enclosing_val} | Global: {global_counter}")

    inner_function()

outer_function()

def increment_global():
    global global_counter
    global_counter += 1

increment_global()
print(f"Modified global counter: {global_counter}")
`,
    bestPractices: [
      'Minimize the use of mutable global variables to avoid state bugs in multithreaded test suites.',
      'Pass values explicitly via arguments and return values rather than mutating global state.',
    ],
  },
  {
    id: 'modules',
    title: 'Python Modules & Packages',
    order: 27,
    language: 'python',
    summary: 'import statements, from ... import ..., aliasing with as, __name__ == "__main__", and packages.',
    overview: 'A module is simply a Python file (.py) containing functions, classes, and definitions. A package is a directory containing multiple modules with an __init__.py file. Modules allow organizing code into modular architectures.',
    keyPoints: [
      'import module_name loads an entire module into its own namespace',
      'from module_name import func, Class imports specific members directly',
      'as keyword creates aliases (e.g. import datetime as dt)',
      'if __name__ == "__main__": runs code only when executed directly, not when imported',
    ],
    starterCode: `# 27. Python Built-in Modules & Time Calculations
import time
import datetime
import random

# Current date and time
now = datetime.datetime.now()
print(f"Current Date: {now.strftime('%Y-%m-%d %H:%M:%S')}")

# Random selection
test_browsers = ["Chrome", "Firefox", "Edge", "WebKit"]
selected = random.choice(test_browsers)
print(f"Randomly chosen browser for test: {selected}")

# Benchmarking execution with time
start = time.perf_counter()
sum([i for i in range(100_000)])
elapsed = (time.perf_counter() - start) * 1000
print(f"Sum computation took: {elapsed:.2f} ms")
`,
    bestPractices: [
      'Always place all import statements at the very top of your Python files (PEP 8).',
      'Avoid wildcard imports (from math import *) to prevent namespace contamination and subtle bugs.',
    ],
  },
  {
    id: 'file-handling',
    title: 'Python File Handling & I/O',
    order: 28,
    language: 'python',
    summary: 'Reading, writing, appending files with open(), and safe context managers (with open).',
    overview: 'Python provides native file operations for reading and writing text and binary files. Using context managers (with open(...) as f:) guarantees that file handles are automatically closed even if exceptions occur.',
    keyPoints: [
      'Modes: "r" (read), "w" (overwrite), "a" (append), "b" (binary mode)',
      'Always use with open(...) as f: context managers to prevent leaked file descriptors',
      'f.read() reads full contents, f.readline() reads one line, f.readlines() reads all lines into a list',
      'The io and json modules provide in-memory and serialized structured data management',
    ],
    starterCode: `# 28. Python File Simulation & Context Manager
import io
import json

# Simulating file reading and writing using StringIO in memory
virtual_file = io.StringIO()

# Writing structured test output
report_data = {
    "run_id": "RUN-2026-11",
    "passed": 48,
    "failed": 0,
    "framework": "Python Playwright"
}

virtual_file.write(json.dumps(report_data, indent=2))
virtual_file.seek(0)  # Rewind to read

# Reading back the file content
loaded = json.loads(virtual_file.read())
print("Decoded JSON Report:")
print(f"Run ID: {loaded['run_id']}")
print(f"All Tests Passed: {loaded['passed'] > 0 and loaded['failed'] == 0}")
`,
    bestPractices: [
      'Always use the with open(...) statement to ensure automatic resource cleanup.',
      'Specify encoding="utf-8" explicitly whenever reading or writing text files.',
    ],
  },
  {
    id: 'try-except',
    title: 'Python Try...Except & Error Handling',
    order: 29,
    language: 'python',
    summary: 'Exception handling with try, except, else, finally, and custom exceptions with raise.',
    overview: 'Errors in Python are represented by exceptions. When an error occurs, Python raises an exception. You can catch and recover from exceptions using try...except blocks without crashing your application.',
    keyPoints: [
      'try: wraps code that may raise an error',
      'except SpecificError as e: catches and handles that specific error',
      'else: runs only if no exception was raised in the try block',
      'finally: always runs regardless of success or failure, ideal for cleanup',
      'raise CustomError("message") triggers an exception explicitly',
    ],
    starterCode: `# 29. Python Exception Handling & Cleanup
def safe_divide(numerator: float, denominator: float):
    try:
        result = numerator / denominator
    except ZeroDivisionError as err:
        print(f"[Error Handled] Cannot divide by zero: {err}")
        return None
    except TypeError as err:
        print(f"[Error Handled] Invalid operand types: {err}")
        return None
    else:
        print(f"Division succeeded: {numerator} / {denominator} = {result}")
        return result
    finally:
        print("-> Execution completed for safe_divide.")

safe_divide(10, 2)
safe_divide(10, 0)
`,
    bestPractices: [
      'Never catch bare except:; always catch specific exceptions (except ValueError:, except KeyError:).',
      'Use finally blocks to close network connections, browser drivers, and database transactions.',
    ],
  },
  {
    id: 'advanced',
    title: 'Python Advanced Concepts & Decorators',
    order: 30,
    language: 'python',
    summary: 'Decorators (@functools.wraps), context managers, dataclasses, and *args/**kwargs forwarding.',
    overview: 'Python decorators allow you to modify or extend the behavior of functions or methods without permanently altering their source code. They are widely used in frameworks like PyTest (@pytest.mark), Flask/FastAPI (@app.get), and custom logging.',
    keyPoints: [
      'A decorator is a function that takes another function as input and returns an enhanced function',
      'Applied with the @decorator_name syntax above a function definition',
      'functools.wraps preserves original function metadata (name, docstring)',
      'Dataclasses (@dataclass) automatically generate __init__, __repr__, and __eq__ methods',
    ],
    starterCode: `# 30. Python Decorators & Timing Wrapper
import time
from functools import wraps

def time_it(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[@time_it] '{func.__name__}' executed in {elapsed:.3f} ms")
        return result
    return wrapper

@time_it
def compute_factorial(n: int) -> int:
    """Compute n factorial."""
    fact = 1
    for i in range(1, n + 1):
        fact *= i
    return fact

res = compute_factorial(15)
print(f"Factorial(15) = {res}")
print(f"Function Name preserved: {compute_factorial.__name__}")
`,
    bestPractices: [
      'Always use @functools.wraps inside decorators to preserve docstrings and introspection.',
      'Use @dataclass from the dataclasses module for clean, boilerplate-free data models.',
    ],
  },
];
