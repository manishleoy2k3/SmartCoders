/**
 * Concept Guides — Custom community-submitted or admin-created concept guides
 *
 * Provides the ConceptGuide interface and storage helpers for saving/loading
 * custom guides that are approved via the content moderation workflow.
 */

export interface ConceptGuide {
  id: string;
  trackId: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior' | 'Architect' | string;
  summary: string;
  overview: string;
  architectureOrMechanism: string;
  codeSnippets: {
    language: string;
    code: string;
  }[];
  bestPractices: string[];
  antiPatterns: string[];
  interviewTips: string;
  isCustom?: boolean;
}

const STORAGE_KEY = 'intelligentqa_custom_guides';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Retrieves all saved custom concept guides from localStorage.
 */
export function getCustomGuides(): ConceptGuide[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves (upserts) a custom concept guide into localStorage.
 * If a guide with the same id already exists, it is replaced.
 */
export function saveCustomGuide(guide: ConceptGuide): void {
  if (!isBrowser()) return;
  try {
    const guides = getCustomGuides();
    const index = guides.findIndex((g) => g.id === guide.id);
    if (index >= 0) {
      guides[index] = guide;
    } else {
      guides.push(guide);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
    window.dispatchEvent(new CustomEvent('intelligentqa_guides_updated', { detail: { guide } }));
  } catch (err) {
    console.warn('Failed to save custom guide:', err);
  }
}

/**
 * Deletes a custom concept guide by id.
 */
export function deleteCustomGuide(guideId: string): void {
  if (!isBrowser()) return;
  try {
    const guides = getCustomGuides().filter((g) => g.id !== guideId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
    window.dispatchEvent(new Event('intelligentqa_guides_updated'));
  } catch (err) {
    console.warn('Failed to delete custom guide:', err);
  }
}
