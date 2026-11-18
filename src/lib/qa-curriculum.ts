/**
 * QA Curriculum — SDET Professional Track Definitions
 *
 * Defines the structured learning tracks for the SDET Professional portal.
 * Each track contains modules and lessons covering Playwright, Selenium,
 * API Testing, AI-QA, and Interview preparation.
 */

import { Track, TrackId } from '@/types/qa';

export const QA_TRACKS: Track[] = [
  {
    id: 'playwright-ts',
    title: 'Playwright + TypeScript',
    tagline: 'Modern End-to-End Test Automation',
    description:
      'Master Playwright with TypeScript from zero to framework architect. Covers auto-waiting, locators, POM, API testing, visual regression, and CI/CD integration.',
    color: 'emerald',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    iconName: 'Sparkles',
    totalLessons: 12,
    estimatedHours: 40,
    modules: [
      {
        id: 'pw-fundamentals',
        trackId: 'playwright-ts',
        title: 'Playwright Fundamentals',
        description: 'Core concepts, installation, first test, and actionability.',
        order: 1,
        lessons: [
          {
            id: 'pw-ts-basics',
            moduleId: 'pw-fundamentals',
            trackId: 'playwright-ts',
            title: 'Getting Started with Playwright',
            description: 'Install Playwright, write your first test, and understand auto-waiting.',
            durationMinutes: 45,
            badge: 'playwright',
            level: 'Beginner',
            manualContext: {
              title: 'Manual Equivalent',
              steps: [
                'Open browser manually',
                'Navigate to URL',
                'Click buttons and verify text visually',
              ],
              painPoints: [
                'Slow and error-prone',
                'No repeatability',
                'Cannot run in CI/CD',
              ],
            },
            automationContext: {
              playwrightTs: `import { test, expect } from '@playwright/test';\n\ntest('homepage has title', async ({ page }) => {\n  await page.goto('https://example.com');\n  await expect(page).toHaveTitle(/Example/);\n});`,
              explanation:
                'Playwright automatically waits for elements to be actionable before interacting.',
              bestPractices: [
                'Use web-first assertions',
                'Prefer role-based locators',
              ],
              antiPatterns: [
                'Using page.waitForTimeout()',
                'Using fragile XPath selectors',
              ],
            },
            aiAugmentation: {
              promptExample: 'Generate a Playwright test for login flow',
              agenticWorkflow: 'AI generates POM + test + assertions',
              selfHealingTip: 'Use getByRole for resilient selectors',
            },
            challenge: {
              instruction: 'Write a test that verifies the page title.',
              starterCode: {
                typescript: `import { test, expect } from '@playwright/test';\n\ntest('verify title', async ({ page }) => {\n  // TODO: navigate and assert title\n});`,
              },
              solutionCode: {
                typescript: `import { test, expect } from '@playwright/test';\n\ntest('verify title', async ({ page }) => {\n  await page.goto('https://example.com');\n  await expect(page).toHaveTitle(/Example/);\n});`,
              },
              validationRules: [
                {
                  requiredPatterns: ['page.goto', 'toHaveTitle'],
                  forbiddenPatterns: ['waitForTimeout'],
                  description: 'Must navigate and assert title without arbitrary waits',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'selenium-java',
    title: 'Selenium + Java',
    tagline: 'Enterprise-Grade Browser Automation',
    description:
      'Learn Selenium WebDriver 4 with Java for enterprise testing. Covers WebDriverWait, POM, TestNG, cross-browser grids, and CI/CD pipelines.',
    color: 'cyan',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    iconName: 'Laptop',
    totalLessons: 10,
    estimatedHours: 35,
    modules: [
      {
        id: 'sel-fundamentals',
        trackId: 'selenium-java',
        title: 'Selenium Fundamentals',
        description: 'Setup WebDriver, write your first Selenium test, and handle waits.',
        order: 1,
        lessons: [
          {
            id: 'java-oops-framework',
            moduleId: 'sel-fundamentals',
            trackId: 'selenium-java',
            title: 'Java OOP for Test Frameworks',
            description: 'Object-Oriented Programming principles applied to Selenium test framework design.',
            durationMinutes: 50,
            badge: 'java',
            level: 'Beginner',
            manualContext: {
              title: 'Manual Equivalent',
              steps: ['Open browser', 'Navigate to login page', 'Enter credentials'],
              painPoints: ['Repetitive manual steps', 'No data-driven approach'],
            },
            automationContext: {
              playwrightTs: '',
              seleniumJava: `WebDriver driver = new ChromeDriver();\ndriver.get("https://example.com");\nWebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));\nwait.until(ExpectedConditions.titleContains("Example"));`,
              explanation: 'Selenium requires explicit synchronization using WebDriverWait.',
              bestPractices: ['Use Page Object Model', 'Store By locators, not WebElements'],
              antiPatterns: ['Thread.sleep()', 'Implicit waits mixed with explicit waits'],
            },
            aiAugmentation: {
              promptExample: 'Generate a Selenium POM class for login',
              agenticWorkflow: 'AI generates Java POM + TestNG test',
              selfHealingTip: 'Use CSS selectors with data-testid for stability',
            },
            challenge: {
              instruction: 'Write a Selenium test verifying the page title.',
              starterCode: {
                java: `// TODO: Create WebDriver, navigate, and assert title`,
              },
              solutionCode: {
                java: `WebDriver driver = new ChromeDriver();\ndriver.get("https://example.com");\nassertTrue(driver.getTitle().contains("Example"));\ndriver.quit();`,
              },
              validationRules: [
                {
                  requiredPatterns: ['ChromeDriver', 'getTitle'],
                  forbiddenPatterns: ['Thread.sleep'],
                  description: 'Must use ChromeDriver and assert title without Thread.sleep',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'api-testing',
    title: 'API Testing',
    tagline: 'REST, GraphQL & Contract Testing',
    description:
      'Master API automation with REST Assured, Playwright API fixtures, and JSON Schema validation for robust backend testing.',
    color: 'amber',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    iconName: 'Cpu',
    totalLessons: 8,
    estimatedHours: 25,
    modules: [
      {
        id: 'api-fundamentals',
        trackId: 'api-testing',
        title: 'API Testing Fundamentals',
        description: 'HTTP methods, status codes, REST principles, and your first API test.',
        order: 1,
        lessons: [
          {
            id: 'api-rest-crud',
            moduleId: 'api-fundamentals',
            trackId: 'api-testing',
            title: 'RESTful CRUD API Testing',
            description: 'Automate GET, POST, PUT, DELETE operations with response validation.',
            durationMinutes: 40,
            badge: 'api-testing',
            level: 'Beginner',
            manualContext: {
              title: 'Manual Equivalent',
              steps: ['Open Postman', 'Send GET request', 'Verify response body manually'],
              painPoints: ['No regression safety', 'Manual JSON comparison'],
            },
            automationContext: {
              playwrightTs: `const response = await request.get('/api/users');\nexpect(response.status()).toBe(200);`,
              restAssuredJava: `given().when().get("/api/users").then().statusCode(200);`,
              explanation: 'Automate API calls and validate status codes, headers, and body.',
              bestPractices: ['Validate JSON schema', 'Use POJO deserialization'],
              antiPatterns: ['Only checking status codes', 'Hardcoded auth tokens'],
            },
            aiAugmentation: {
              promptExample: 'Generate API tests for user CRUD endpoints',
              agenticWorkflow: 'AI generates test matrix from OpenAPI spec',
              selfHealingTip: 'Use schema validation to catch contract drift',
            },
            challenge: {
              instruction: 'Write an API test for GET /api/users.',
              starterCode: {
                typescript: `// TODO: Send GET request and assert status 200`,
              },
              solutionCode: {
                typescript: `const response = await request.get('/api/users');\nexpect(response.status()).toBe(200);`,
              },
              validationRules: [
                {
                  requiredPatterns: ['get', 'status'],
                  forbiddenPatterns: [],
                  description: 'Must send GET request and check status',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ai-qa',
    title: 'AI-Augmented QA',
    tagline: 'AI Agents, LLM Testing & Self-Healing',
    description:
      'Learn to build and test AI-powered quality systems: LLM-as-a-Judge, semantic assertions, prompt injection testing, and autonomous QA agents.',
    color: 'purple',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    iconName: 'Sparkles',
    totalLessons: 6,
    estimatedHours: 20,
    modules: [
      {
        id: 'ai-qa-fundamentals',
        trackId: 'ai-qa',
        title: 'AI for Quality Engineering',
        description: 'Introduction to AI-augmented testing, LLM evaluation, and test generation.',
        order: 1,
        lessons: [
          {
            id: 'step-0-demystifying-ai',
            moduleId: 'ai-qa-fundamentals',
            trackId: 'ai-qa',
            title: 'Demystifying AI for QA Engineers',
            description: 'Understand how LLMs, embeddings, and AI agents transform test automation.',
            durationMinutes: 35,
            badge: 'ai-qa',
            level: 'Beginner',
            manualContext: {
              title: 'Manual Equivalent',
              steps: ['Write test cases by hand', 'Review code manually'],
              painPoints: ['Slow test case creation', 'No intelligent prioritization'],
            },
            automationContext: {
              playwrightTs: `// AI-generated test from natural language\ntest('verify checkout flow', async ({ page }) => {\n  await page.goto('/checkout');\n  await expect(page.getByText('Order Summary')).toBeVisible();\n});`,
              explanation: 'AI tools generate test scaffolding from requirements.',
              bestPractices: ['Review AI-generated code', 'Use AI for boilerplate, not logic'],
              antiPatterns: ['Blindly trusting AI output', 'Skipping code review'],
            },
            aiAugmentation: {
              promptExample: 'Generate boundary test cases for a payment form',
              agenticWorkflow: 'AI agent analyzes requirements and outputs test matrix',
              selfHealingTip: 'AI can suggest locator fixes when elements change',
            },
            challenge: {
              instruction: 'Describe how you would use AI to generate test cases.',
              starterCode: { typescript: '// Describe your approach' },
              solutionCode: { typescript: '// Use AI to generate, then review and refine' },
              validationRules: [
                {
                  requiredPatterns: [],
                  forbiddenPatterns: [],
                  description: 'Open-ended reflection exercise',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'interview-griller',
    title: 'Interview Griller',
    tagline: 'Mock Interviews & Coding Challenges',
    description:
      'Prepare for SDET interviews with mock grilling sessions, coding challenges, and real-world scenario questions.',
    color: 'rose',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    iconName: 'Trophy',
    totalLessons: 5,
    estimatedHours: 15,
    modules: [
      {
        id: 'interview-prep',
        trackId: 'interview-griller',
        title: 'Interview Preparation',
        description: 'Common SDET interview patterns, coding rounds, and framework questions.',
        order: 1,
        lessons: [
          {
            id: 'flakiness-and-retries',
            moduleId: 'interview-prep',
            trackId: 'interview-griller',
            title: 'Handling Flakiness & Retry Strategies',
            description: 'Deep dive into test flakiness root causes, retry mechanisms, and stabilization.',
            durationMinutes: 40,
            badge: 'interview',
            level: 'Intermediate',
            manualContext: {
              title: 'Manual Equivalent',
              steps: ['Re-run failed tests manually', 'Report flaky tests to dev team'],
              painPoints: ['Time wasted on false failures', 'Loss of CI confidence'],
            },
            automationContext: {
              playwrightTs: `// Playwright built-in retry\ntest.describe.configure({ retries: 2 });\n\ntest('flaky-safe test', async ({ page }) => {\n  await page.goto('/dashboard');\n  await expect(page.getByText('Welcome')).toBeVisible();\n});`,
              explanation: 'Configure retries at test, describe, or project level.',
              bestPractices: ['Classify flakiness root causes', 'Use trace on retry'],
              antiPatterns: ['Retrying indefinitely without investigation', 'Ignoring flaky tests'],
            },
            aiAugmentation: {
              promptExample: 'Analyze this test log and classify the flakiness root cause',
              agenticWorkflow: 'AI triages CI logs and categorizes failures',
              selfHealingTip: 'Auto-retry with trace capture to debug intermittent issues',
            },
            challenge: {
              instruction: 'Configure retry logic for a flaky test.',
              starterCode: { typescript: '// TODO: Add retry configuration' },
              solutionCode: {
                typescript: `test.describe.configure({ retries: 2 });\ntest('example', async ({ page }) => {\n  // test body\n});`,
              },
              validationRules: [
                {
                  requiredPatterns: ['retries'],
                  forbiddenPatterns: ['setTimeout'],
                  description: 'Must use built-in retry mechanism',
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
