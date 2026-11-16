export type { CourseConcept, LanguageCourseMeta } from './kids-courses-types';
import { CourseConcept, LanguageCourseMeta } from './kids-courses-types';
import { PYTHON_CONCEPTS } from './courses/python-course';
import { JAVASCRIPT_CONCEPTS } from './courses/javascript-course';
import { JAVA_CONCEPTS } from './courses/java-course';

/**
 * Standard Curriculum Modules:
 * - Introduction & Syntax
 * - Operators & Expressions
 * - Conditions & Decisions
 * - Loops & Iteration
 * - Strings & Manipulation
 * - Functions & Methods
 * - Objects & Classes
 * - Data Structures
 * - Advanced Concepts
 */
export const CORE_CURRICULUM_PILLARS = [
  'Introduction & Syntax',
  'Operators & Expressions',
  'Conditions & Decisions',
  'Loops & Iteration',
  'Strings & Manipulation',
  'Functions & Methods',
  'Objects & Classes',
  'Data Structures',
  'Advanced Concepts',
] as const;

export const LANGUAGE_COURSES: Record<'python' | 'javascript' | 'java', LanguageCourseMeta> = {
  python: {
    id: 'python',
    name: 'Python Programming',
    version: 'Python 3.12',
    tagline: 'Clean, elegant, and versatile programming from foundations to AI.',
    badge: 'Python 3',
    accentColor: 'text-amber-500',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    description: `Python is one of the world's most popular, readable, and widely-used programming languages. Created by Guido van Rossum with the guiding philosophy of code readability, Python uses clean indentation rather than brackets, allowing engineers to write clean algorithms with minimal boilerplate. It is the gold standard for Artificial Intelligence, Data Science, Web Backends, and Test Automation.`,
    whyLearn: [
      'Beginner-friendly syntax that reads like plain English',
      'The #1 language for Artificial Intelligence, Machine Learning, and Data Analytics',
      'Massive ecosystem with thousands of production libraries (NumPy, Pandas, FastAPI, PyTest)',
      'Versatile across Web Development, Cloud Automation, Scripting, and SDET Tooling',
    ],
    useCases: [
      'Artificial Intelligence & Deep Learning (PyTorch, TensorFlow)',
      'Data Engineering & Big Data Analytics (Pandas, Polars)',
      'Modern High-Performance Web APIs (FastAPI, Django)',
      'DevOps & Automation Scripting',
      'SDET Automation Frameworks (Selenium Python, Playwright Python, Robot Framework)',
    ],
    executionModel: 'Interpreted byte-code compiled to the CPython Virtual Machine with automatic memory management and garbage collection.',
    concepts: PYTHON_CONCEPTS,
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    version: 'ECMAScript 2024 / Node.js 20',
    tagline: 'The universal language of modern web browsers, full-stack apps, and testing frameworks.',
    badge: 'JS ES2024',
    accentColor: 'text-emerald-500',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    description: `JavaScript powers 98% of all websites in existence and serves as the universal runtime for modern web browsers. With Node.js, Bun, and Deno, JavaScript and TypeScript drive ultra-fast backend microservices, real-time communications, and next-generation test automation tools like Playwright, Cypress, and WebdriverIO.`,
    whyLearn: [
      'Powers the entire World Wide Web: every modern browser runs JavaScript natively',
      'Full-stack flexibility: build frontends with React/Vue and backends with Node.js',
      'Modern, expressive features: async/await, arrow functions, destructuring, and modules',
      'The foundation for modern SDET test automation (Playwright TS/JS, Cypress, Jest)',
    ],
    useCases: [
      'Interactive Web User Interfaces (React, Next.js, Vue)',
      'High-Throughput Asynchronous Backend Microservices (Node.js, Express, Fastify)',
      'Browser Test Automation & E2E Testing (Playwright, Cypress, Puppeteer)',
      'Cross-Platform Mobile Applications (React Native)',
      'Desktop Applications (Electron, Tauri)',
    ],
    executionModel: 'Just-In-Time (JIT) compiled by the Google V8 engine with a single-threaded Event Loop architecture.',
    concepts: JAVASCRIPT_CONCEPTS,
  },
  java: {
    id: 'java',
    name: 'Java',
    version: 'Java 21 LTS (OpenJDK)',
    tagline: 'Robust, statically typed, enterprise-grade object-oriented language with high performance.',
    badge: 'Java 21 LTS',
    accentColor: 'text-cyan-500',
    badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
    description: `Java is the gold standard for mission-critical enterprise systems, cloud banking backends, Android app development, and large-scale test automation architectures. Designed with the core philosophy of 'Write Once, Run Anywhere' (WORA), Java code compiles into platform-independent bytecode that executes on the high-performance Java Virtual Machine (JVM).`,
    whyLearn: [
      'The industry standard for SDET Test Automation (Selenium WebDriver Java, RestAssured, Appium)',
      'Strong static typing catches bugs early at compile-time before code reaches production',
      'Massive global enterprise adoption across Fortune 500 banks, airlines, and tech giants',
      'High-performance JVM with state-of-the-art garbage collection and concurrency',
    ],
    useCases: [
      'Enterprise Backend Microservices (Spring Boot, Quarkus, Micronaut)',
      'Industry-Standard Test Automation (Selenium WebDriver, RestAssured, TestNG, JUnit 5)',
      'Android Mobile Application Development',
      'High-Frequency Financial Trading & Banking Infrastructure',
      'Big Data Processing Frameworks (Apache Spark, Apache Kafka, Apache Flink)',
    ],
    executionModel: 'Ahead-of-time compiled to bytecode (.class) and executed by the HotSpot JVM with tiered JIT compilation.',
    concepts: JAVA_CONCEPTS,
  },
};

const STORAGE_KEY_PREFIX = 'intelligentqa_kids_course_custom_';

// Stored Custom Lessons
export function getStoredCustomLessons(lang: 'python' | 'javascript' | 'java'): CourseConcept[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${lang}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomLesson(lesson: CourseConcept): void {
  if (typeof window === 'undefined') return;
  const existing = getStoredCustomLessons(lesson.language);
  const updated = [lesson, ...existing.filter(l => l.id !== lesson.id)];
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${lesson.language}`, JSON.stringify(updated));
}

export function deleteCustomLesson(id: string, lang: 'python' | 'javascript' | 'java'): void {
  if (typeof window === 'undefined') return;
  const existing = getStoredCustomLessons(lang);
  const updated = existing.filter(l => l.id !== id);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${lang}`, JSON.stringify(updated));
}

// Generate Standardized Import Template with Mandatory Fields
export function generateCourseImportTemplate(format: 'json' | 'csv', language: 'python' | 'javascript' | 'java' = 'python'): string {
  if (format === 'csv') {
    return `Title,Language,Summary,Overview,StarterCode,SolutionCode
"Algorithm: Binary Search","${language}","Fast divide-and-conquer search on sorted collections.","Binary search divides the search space in half with every step, achieving O(log n) time complexity.","def binary_search(arr, target):\\n    left, right = 0, len(arr) - 1\\n    while left <= right:\\n        mid = (left + right) // 2\\n        if arr[mid] == target: return mid\\n        elif arr[mid] < target: left = mid + 1\\n        else: right = mid - 1\\n    return -1\\n\\nprint(binary_search([1, 3, 5, 7, 9], 7))","def binary_search(arr, target):\\n    return arr.index(target) if target in arr else -1"
"Algorithm: Bubble Sort","${language}","Classic comparison sorting algorithm for beginner computer science.","Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.","def bubble_sort(arr):\\n    n = len(arr)\\n    for i in range(n):\\n        for j in range(0, n-i-1):\\n            if arr[j] > arr[j+1]: arr[j], arr[j+1] = arr[j+1], arr[j]\\n    return arr\\n\\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))",""`;
  }

  const sampleTemplate: Partial<CourseConcept>[] = [
    {
      title: "Sample Concept Title (Mandatory)",
      language: language,
      summary: "Concise summary explaining what the student will learn in this concept.",
      overview: "Detailed walkthrough of the programming concept with clear examples.",
      starterCode: language === 'python'
        ? "# Starter Python Code\ndef calculate_score(points):\n    return points * 2\n\nprint(calculate_score(10))"
        : language === 'javascript'
        ? "// Starter JavaScript Code\nfunction calculateScore(points) {\n  return points * 2;\n}\nconsole.log(calculateScore(10));"
        : "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Java Concept Starter\");\n    }\n}",
      solutionCode: language === 'python'
        ? "def calculate_score(points):\n    return points * 2\n\nprint(calculate_score(25))"
        : language === 'javascript'
        ? "function calculateScore(points) {\n  return points * 2;\n}\nconsole.log(calculateScore(25));"
        : "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Java Concept Solution\");\n    }\n}",
      keyPoints: [
        "Key point 1 explaining the mechanism",
        "Key point 2 on runtime or syntax details"
      ],
      bestPractices: [
        "Best practice recommendation 1",
        "Best practice recommendation 2"
      ],
    },
  ];

  return JSON.stringify(sampleTemplate, null, 2);
}

// Download Course Import Template
export function downloadCourseImportTemplate(format: 'json' | 'csv', language: 'python' | 'javascript' | 'java' = 'python'): void {
  const content = generateCourseImportTemplate(format, language);
  const mimeType = format === 'json' ? 'application/json' : 'text/csv';
  const extension = format === 'json' ? 'json' : 'csv';
  const filename = `${language}_course_import_template.${extension}`;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
