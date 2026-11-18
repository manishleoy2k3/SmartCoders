/**
 * Coding Problems — Custom community-submitted or admin-created coding challenges
 *
 * Provides the CodingProblem interface and storage helpers for saving/loading
 * custom problems that are approved via the content moderation workflow.
 */

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  category: string;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterTemplates: {
    java?: string;
    python?: string;
    typescript?: string;
    javascript?: string;
    csharp?: string;
  };
  isCustom?: boolean;
}

const STORAGE_KEY = 'intelligentqa_custom_problems';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Retrieves all saved custom coding problems from localStorage.
 */
export function getCustomProblems(): CodingProblem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves (upserts) a custom coding problem into localStorage.
 * If a problem with the same id already exists, it is replaced.
 */
export function saveCustomProblem(problem: CodingProblem): void {
  if (!isBrowser()) return;
  try {
    const problems = getCustomProblems();
    const index = problems.findIndex((p) => p.id === problem.id);
    if (index >= 0) {
      problems[index] = problem;
    } else {
      problems.push(problem);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    window.dispatchEvent(
      new CustomEvent('intelligentqa_problems_updated', { detail: { problem } })
    );
  } catch (err) {
    console.warn('Failed to save custom problem:', err);
  }
}

/**
 * Deletes a custom coding problem by id.
 */
export function deleteCustomProblem(problemId: string): void {
  if (!isBrowser()) return;
  try {
    const problems = getCustomProblems().filter((p) => p.id !== problemId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    window.dispatchEvent(new Event('intelligentqa_problems_updated'));
  } catch (err) {
    console.warn('Failed to delete custom problem:', err);
  }
}
