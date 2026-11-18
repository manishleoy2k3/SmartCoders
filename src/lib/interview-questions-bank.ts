/**
 * Interview Questions Bank
 *
 * Generates a comprehensive bank of curated SDET interview questions
 * spanning Playwright, Selenium, Java, TypeScript, API Testing, AI/LLM,
 * and Framework Design topics at various difficulty levels.
 */

import { InterviewQuestionItem } from '@/types/qa';

export function generateComprehensiveQuestionBank(): InterviewQuestionItem[] {
  return [
    {
      id: 'iq-pw-auto-waiting',
      technology: 'Playwright',
      difficulty: 'Junior',
      topic: 'Auto-Waiting',
      question: 'Explain how Playwright auto-waiting works and why it reduces flakiness.',
      answerSummary:
        'Playwright automatically checks actionability (Attached, Visible, Stable, Receives Events, Enabled) before every action. This eliminates the need for manual WebDriverWait calls and dramatically reduces flaky tests caused by timing issues.',
      codeSnippet: `// No explicit wait needed — Playwright auto-waits
await page.getByRole('button', { name: 'Submit' }).click();`,
      bestPractice: 'Rely on built-in actionability checks and web-first assertions instead of arbitrary delays.',
      pitfallToAvoid: 'Using page.waitForTimeout() or hardcoded sleep calls.',
    },
    {
      id: 'iq-pw-locator-strategy',
      technology: 'Playwright',
      difficulty: 'Mid',
      topic: 'Locator Strategies',
      question: 'What is the recommended locator priority in Playwright and why?',
      answerSummary:
        'Playwright recommends user-facing locators: getByRole > getByText > getByLabel > getByPlaceholder > getByTestId > CSS/XPath. User-facing locators are resilient to implementation changes and reflect how users actually interact with the page.',
      bestPractice: 'Prefer getByRole() as the primary locator strategy for maximum resilience.',
      pitfallToAvoid: 'Using brittle CSS selectors dependent on class names that change frequently.',
    },
    {
      id: 'iq-sel-stale-element',
      technology: 'Selenium',
      difficulty: 'Mid',
      topic: 'StaleElementReferenceException',
      question: 'What causes StaleElementReferenceException and how do you handle it?',
      answerSummary:
        'It occurs when a cached WebElement reference points to a DOM node that has been detached or re-rendered. Handle it by storing By locators instead of WebElements, using FluentWait with ignoring(StaleElementReferenceException.class), or re-querying the element before interaction.',
      codeSnippet: `Wait<WebDriver> wait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(10))
    .ignoring(StaleElementReferenceException.class);
WebElement btn = wait.until(d -> d.findElement(By.id("submit")));
btn.click();`,
      bestPractice: 'Store By locators in Page Objects and find elements at the moment of interaction.',
      pitfallToAvoid: 'Caching WebElement instances as class-level fields in dynamic SPAs.',
    },
    {
      id: 'iq-java-oops',
      technology: 'Java',
      difficulty: 'Junior',
      topic: 'OOP Principles in Test Frameworks',
      question: 'How do OOP principles (Encapsulation, Inheritance, Polymorphism, Abstraction) apply to test framework design?',
      answerSummary:
        'Encapsulation: Page Objects hide locators and expose only action methods. Inheritance: BasePage class shares common methods (wait, navigate). Polymorphism: Different page implementations share a common interface. Abstraction: Abstract base test class handles setup/teardown.',
      bestPractice: 'Use composition over deep inheritance hierarchies for maintainable Page Objects.',
      pitfallToAvoid: 'Creating God-class Page Objects with 500+ lines mixing locators, actions, and assertions.',
    },
    {
      id: 'iq-ts-async-await',
      technology: 'TypeScript',
      difficulty: 'Junior',
      topic: 'Async/Await',
      question: 'Why is async/await essential in Playwright TypeScript tests?',
      answerSummary:
        'All Playwright interactions are asynchronous (they communicate with the browser over WebSocket/CDP). async/await ensures each action completes before the next one starts, maintaining correct execution order and preventing race conditions.',
      codeSnippet: `test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@test.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/dashboard');
});`,
      bestPractice: 'Always await Playwright API calls and use web-first assertions.',
      pitfallToAvoid: 'Forgetting await on locator actions, causing tests to execute out of order.',
    },
    {
      id: 'iq-api-status-codes',
      technology: 'API Testing',
      difficulty: 'Junior',
      topic: 'HTTP Status Codes',
      question: 'Explain the difference between 200, 201, 400, 401, 403, and 404 status codes.',
      answerSummary:
        '200: OK (success). 201: Created (resource created). 400: Bad Request (invalid input). 401: Unauthorized (missing/invalid auth). 403: Forbidden (authenticated but no permission). 404: Not Found (resource does not exist).',
      bestPractice: 'Assert both the status code AND the response body structure in every API test.',
      pitfallToAvoid: 'Only checking the status code without validating the response payload.',
    },
    {
      id: 'iq-api-schema-validation',
      technology: 'API Testing',
      difficulty: 'Mid',
      topic: 'JSON Schema Validation',
      question: 'Why is JSON Schema validation important in API test automation?',
      answerSummary:
        'JSON Schema validation catches breaking contract changes (removed fields, type changes, missing required properties) automatically. It acts as a contract test that fails immediately when backend changes break the API shape, before UI regression suites even run.',
      bestPractice: 'Maintain JSON schema files in version control and validate responses against them in CI.',
      pitfallToAvoid: 'Only asserting individual field values without validating the overall response structure.',
    },
    {
      id: 'iq-ai-llm-testing',
      technology: 'AI & LLM',
      difficulty: 'Senior',
      topic: 'Testing LLM Applications',
      question: 'How do you test AI/LLM-powered features where outputs are non-deterministic?',
      answerSummary:
        'Use semantic assertions (cosine similarity > 0.85), LLM-as-a-Judge with scoring rubrics, JSON schema guardrails for structured output, and adversarial red-teaming for prompt injection and hallucination detection. Maintain a golden evaluation dataset.',
      bestPractice: 'Set temperature to 0.0–0.2 in test environments and maintain a golden dataset of 100+ prompt-response pairs.',
      pitfallToAvoid: 'Using exact string equality (expect(text).toBe(...)) on non-deterministic LLM outputs.',
    },
    {
      id: 'iq-framework-pom',
      technology: 'Framework Design',
      difficulty: 'Mid',
      topic: 'Page Object Model',
      question: 'Describe the Page Object Model pattern and its benefits in test automation.',
      answerSummary:
        'POM separates page-specific locators and interaction logic from test assertions. Each page/component gets its own class with methods representing user actions. Benefits: reduced duplication, easier maintenance when UI changes, clean separation of concerns.',
      codeSnippet: `export class LoginPage {
  constructor(private page: Page) {}

  readonly email = this.page.getByLabel('Email');
  readonly password = this.page.getByLabel('Password');
  readonly submitBtn = this.page.getByRole('button', { name: 'Sign in' });

  async login(email: string, pass: string) {
    await this.email.fill(email);
    await this.password.fill(pass);
    await this.submitBtn.click();
  }
}`,
      bestPractice: 'Keep assertions in test files and actions in Page Objects (Single Responsibility Principle).',
      pitfallToAvoid: 'Putting expect() or Assert calls directly inside Page Object methods.',
    },
    {
      id: 'iq-framework-ci-cd',
      technology: 'Framework Design',
      difficulty: 'Senior',
      topic: 'CI/CD Integration',
      question: 'How do you integrate test automation into a CI/CD pipeline?',
      answerSummary:
        'Configure tests to run in GitHub Actions / Jenkins / GitLab CI on every PR. Use parallel sharding for speed, capture traces/screenshots on failure, generate HTML reports, and gate deployments on test pass rate. Use Playwright projects for auth setup.',
      bestPractice: 'Run tests in parallel with sharding and fail the pipeline on any test failure.',
      pitfallToAvoid: 'Running tests sequentially in CI, making the feedback loop too slow for developers.',
    },
  ];
}
