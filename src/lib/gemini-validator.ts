/**
 * Gemini API Key Validator & Sanitizer
 *
 * Provides client-side syntax validation and sanitization for Google AI Studio
 * API keys before they are stored or sent to the backend for live verification.
 */

export interface GeminiKeyValidationResult {
  valid: boolean;
  code?: string;
  error?: string;
  details?: string;
}

/**
 * Validates the format/syntax of a Gemini API key without making any network calls.
 *
 * Rules:
 * - Must start with the prefix "AIzaSy"
 * - Must be exactly 39 characters long
 * - Must contain only alphanumeric characters, hyphens, and underscores
 */
export function validateGeminiKeySyntax(key: string): GeminiKeyValidationResult {
  if (!key || typeof key !== 'string') {
    return {
      valid: false,
      code: 'EMPTY_KEY',
      error: 'API key is empty or not a string.',
      details: 'Please paste your 39-character Gemini API key starting with "AIzaSy".',
    };
  }

  const trimmed = key.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      code: 'EMPTY_KEY',
      error: 'API key is empty.',
      details: 'Please paste your Gemini API key from Google AI Studio.',
    };
  }

  // Prefix check
  if (!trimmed.startsWith('AIzaSy')) {
    return {
      valid: false,
      code: 'INVALID_PREFIX',
      error: 'Key must start with "AIzaSy".',
      details:
        'Google AI Studio keys always begin with the prefix "AIzaSy". Please copy the full key from https://aistudio.google.com/app/apikey.',
    };
  }

  // Length check
  if (trimmed.length !== 39) {
    return {
      valid: false,
      code: 'INVALID_LENGTH',
      error: `Key is ${trimmed.length} characters (expected exactly 39).`,
      details:
        'A valid Google AI Studio API key is exactly 39 characters long. Please ensure you copied the complete key.',
    };
  }

  // Character set check: alphanumeric, hyphens, and underscores only
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    return {
      valid: false,
      code: 'INVALID_CHARACTERS',
      error: 'Key contains invalid characters.',
      details:
        'API keys should only contain letters, digits, hyphens, and underscores. Remove any spaces or special characters.',
    };
  }

  return { valid: true };
}

/**
 * Sanitizes a raw API key string by trimming whitespace, removing surrounding
 * quotes, and stripping any accidental line-break or invisible characters.
 */
export function sanitizeGeminiKey(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  let cleaned = raw.trim();

  // Strip surrounding quotes (single or double) that users sometimes copy
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Remove any embedded whitespace / newlines
  cleaned = cleaned.replace(/\s+/g, '');

  return cleaned;
}
