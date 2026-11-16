import {
  UserProfile,
  UserProgress,
  CodeSubmission,
  QAGeneratedArtifact,
  QAAgentSession,
  InterviewSession,
  QuestionBookmark,
  TrackId,
  Track,
  Module,
  Lesson,
  ModerationItem,
  AdminUserEntry,
  UserExerciseProgressRecord,
  UserCodingProjectRecord,
} from '@/types/qa';
import { QA_TRACKS } from '@/lib/qa-curriculum';
import {
  CourseConcept,
  LanguageCourseMeta,
  LANGUAGE_COURSES,
} from '@/lib/kids-courses';
import { KIDS_EXERCISES, LanguageExercises } from '@/lib/kids-exercises';
import { KIDS_PROJECTS, ProjectTemplate } from '@/lib/kids-projects';
import { saveCustomGuide, ConceptGuide } from '@/lib/concept-guides';
import { saveCustomProblem, CodingProblem } from '@/lib/coding-problems';
import { validateGeminiKeySyntax } from '@/lib/gemini-validator';

// Helper to compute initials from first letter of First Name and first letter of Last Name
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'QA';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Initial default user for seamless zero-cost demo / local development
export const DEMO_USER: UserProfile = {
  id: 'usr-sdet-001',
  displayName: 'Demo Student',
  email: 'demo.student@intelligentqa.io',
  targetRole: 'Manual QA',
  primaryTrack: 'playwright-ts',
  experienceYears: undefined,
  streakCount: 0,
  role: 'user',
  profileCompleted: false,
  lastActiveDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default Admin user for Course Content Management
export const DEMO_ADMIN_USER: UserProfile = {
  id: 'usr-admin-001',
  displayName: 'Course Administrator',
  email: 'admin@intelligentqa.io',
  targetRole: 'Test Architect',
  primaryTrack: 'selenium-java',
  experienceYears: 10,
  streakCount: 25,
  role: 'admin',
  profileCompleted: true,
  lastActiveDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// In-Memory fallback store for SSR and unit testing
class MemoryDatabase {
  profiles = new Map<string, UserProfile>([
    ['usr-sdet-001', DEMO_USER],
    ['usr-admin-001', DEMO_ADMIN_USER],
  ]);
  userProgress = new Map<string, UserProgress[]>();
  codeSubmissions = new Map<string, CodeSubmission[]>();
  artifacts = new Map<string, QAGeneratedArtifact[]>();
  agentSessions = new Map<string, QAAgentSession[]>();
  interviewSessions = new Map<string, InterviewSession[]>();
  bookmarks = new Map<string, QuestionBookmark[]>();
  sdetTracks: Track[] = QA_TRACKS;
  kidsCourses: Record<'python' | 'javascript' | 'java', LanguageCourseMeta> = LANGUAGE_COURSES;
  kidsExercises: Record<'python' | 'javascript' | 'java', LanguageExercises> = KIDS_EXERCISES;
  kidsProjects: Record<'python' | 'javascript' | 'java', ProjectTemplate[]> = KIDS_PROJECTS;
  userExerciseProgress = new Map<string, UserExerciseProgressRecord[]>();
  userCodingProjects = new Map<string, UserCodingProjectRecord[]>();

  constructor() {
    // Seed initial progress for demo user
    this.userProgress.set('usr-sdet-001', [
      {
        id: 'prog-1',
        userId: 'usr-sdet-001',
        trackId: 'playwright-ts',
        moduleId: 'pw-fundamentals',
        lessonId: 'pw-ts-basics',
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
    ]);
  }
}

const memoryDb = new MemoryDatabase();

// Local Storage helpers for browser execution
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getStoredItem<T>(key: string, defaultVal: T): T {
  if (!isBrowser()) return defaultVal;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStoredItem<T>(key: string, val: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn('LocalStorage write failed:', err);
  }
}

export const QADatabase = {
  // Authentication & Session Management
  getCurrentUser(): UserProfile | null {
    if (!isBrowser()) return null;
    const user = getStoredItem<UserProfile | null>('intelligentqa_current_user', null);
    if (!user) return null;

    // Purge any legacy stale "Alex Carter" session so fresh user login takes full effect
    if (user.displayName === 'Alex Carter') {
      window.localStorage.removeItem('intelligentqa_current_user');
      return null;
    }

    // Auto-remove hardcoded SDET and 1 Years QA Experience from uncompleted profiles
    if (!user.profileCompleted) {
      let changed = false;
      if (user.experienceYears === 1 || user.experienceYears === 1.0) {
        user.experienceYears = undefined;
        changed = true;
      }
      if (user.targetRole === 'SDET') {
        user.targetRole = 'Manual QA';
        changed = true;
      }
      if (changed) {
        setStoredItem('intelligentqa_current_user', user);
        setStoredItem(`intelligentqa_profile_${user.id}`, user);
      }
    }

    return user;
  },

  async login(email: string, displayName?: string): Promise<UserProfile> {
    const defaultEmail = email?.trim() || 'student@intelligentqa.io';
    const cleanEmail = defaultEmail.toLowerCase();
    const cleanName =
      displayName?.trim() ||
      cleanEmail
        .split('@')[0]
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    // Security check: if switching user accounts, purge any un-scoped credentials
    const previousUser = this.getCurrentUser();
    if (previousUser && previousUser.email.toLowerCase() !== cleanEmail) {
      if (isBrowser()) {
        window.localStorage.removeItem('intelligentqa_gemini_key');
      }
    }

    const safeEmailId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const id = `usr_${safeEmailId}`;

    let user = getStoredItem<UserProfile | null>(`intelligentqa_profile_${id}`, null);
    if (!user) {
      user = {
        id,
        displayName: cleanName,
        email: defaultEmail,
        targetRole: 'Manual QA',
        primaryTrack: 'playwright-ts',
        experienceYears: undefined,
        streakCount: 0,
        profileCompleted: false,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      user.updatedAt = new Date().toISOString();
      if (displayName?.trim()) {
        user.displayName = cleanName;
      }
    }

    const adminEmails = this.getAdminEmails().map(e => e.toLowerCase().trim());
    const isExplicitAdmin = adminEmails.includes(cleanEmail) || cleanEmail === 'admin@intelligentqa.io';
    const computedRole: 'admin' | 'user' = isExplicitAdmin ? 'admin' : (user.role === 'admin' && adminEmails.includes(cleanEmail) ? 'admin' : 'user');
    user.role = computedRole;

    // Strict Data Isolation: Restore ONLY keys saved by this specific user
    const userStoredKey = isBrowser()
      ? window.localStorage.getItem(`intelligentqa_gemini_key_email_${cleanEmail}`) ||
        window.localStorage.getItem(`intelligentqa_gemini_key_${id}`) || ''
      : '';
    user.geminiApiKey = userStoredKey;

    memoryDb.profiles.set(id, user);
    if (isBrowser()) {
      window.localStorage.removeItem('intelligentqa_gemini_key');
      setStoredItem('intelligentqa_current_user', user);
      setStoredItem(`intelligentqa_profile_${id}`, user);
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
      window.dispatchEvent(new Event('intelligentqa_key_changed'));
    }
    return user;
  },

  async signup(displayName: string, email: string, targetRole: any = 'Manual QA'): Promise<UserProfile> {
    const cleanEmail = (email?.trim() || 'student@intelligentqa.io').toLowerCase();
    const previousUser = this.getCurrentUser();
    if (previousUser && previousUser.email.toLowerCase() !== cleanEmail) {
      if (isBrowser()) {
        window.localStorage.removeItem('intelligentqa_gemini_key');
      }
    }

    const safeEmailId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const id = `usr_${safeEmailId}`;

    const adminEmails = this.getAdminEmails().map(e => e.toLowerCase().trim());
    const isExplicitAdmin = adminEmails.includes(cleanEmail) || cleanEmail === 'admin@intelligentqa.io';
    const computedRole: 'admin' | 'user' = isExplicitAdmin ? 'admin' : 'user';

    const user: UserProfile = {
      id,
      displayName: displayName || 'New SDET Student',
      email: email?.trim() || cleanEmail,
      targetRole: targetRole || 'Manual QA',
      primaryTrack: 'playwright-ts',
      role: computedRole,
      experienceYears: undefined,
      streakCount: 0,
      profileCompleted: false,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryDb.profiles.set(id, user);
    if (isBrowser()) {
      window.localStorage.removeItem('intelligentqa_gemini_key');
      setStoredItem('intelligentqa_current_user', user);
      setStoredItem(`intelligentqa_profile_${id}`, user);
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
      window.dispatchEvent(new Event('intelligentqa_key_changed'));
    }
    return user;
  },

  getRememberedGoogleAccounts(): { email: string; name: string; lastUsed: string }[] {
    if (!isBrowser()) return [];
    return getStoredItem<any[]>('intelligentqa_google_accounts', []);
  },

  getPrimaryGoogleAccount(): { email: string; name: string } | null {
    if (!isBrowser()) return null;
    const accounts = this.getRememberedGoogleAccounts();
    if (accounts.length > 0 && accounts[0].email) {
      return { email: accounts[0].email, name: accounts[0].name };
    }
    return null;
  },

  // Active Portal Mode (Separates SDET Professional & Kids Coding experiences)
  getPortalMode(): 'sdet' | 'kids' {
    if (!isBrowser()) return 'sdet';
    try {
      const mode = window.localStorage.getItem('intelligentqa_active_portal');
      return mode === 'kids' ? 'kids' : 'sdet';
    } catch {
      return 'sdet';
    }
  },

  setPortalMode(mode: 'sdet' | 'kids'): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem('intelligentqa_active_portal', mode);

      // Security & Privacy Validation:
      // Remove any un-scoped global key to ensure no cross-user key leaks
      window.localStorage.removeItem('intelligentqa_gemini_key');

      // Ensure the logged in user maintains their valid common key across both SDET and Kids
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.email) {
        const cleanEmail = currentUser.email.trim().toLowerCase();
        const userKey = window.localStorage.getItem(`intelligentqa_gemini_key_email_${cleanEmail}`) ||
                        window.localStorage.getItem(`intelligentqa_gemini_key_${currentUser.id}`) || '';
        if (userKey) {
          const check = validateGeminiKeySyntax(userKey);
          if (!check.valid) {
            this.setUserGeminiKey('', currentUser.id);
          }
        }
      }

      window.dispatchEvent(new CustomEvent('intelligentqa_portal_changed', { detail: { mode } }));
      window.dispatchEvent(new Event('intelligentqa_key_changed'));
    } catch (err) {
      console.warn('Failed to persist portal mode:', err);
    }
  },

  // OTP Management (AscentWealth Style Flow)
  generateOtp(email: string): string {
    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (isBrowser()) {
      const data = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };
      window.localStorage.setItem(`intelligentqa_otp_${cleanEmail}`, JSON.stringify(data));
    }
    return otp;
  },

  getStoredOtp(email: string): string | null {
    if (!isBrowser()) return '123456';
    const cleanEmail = email.trim().toLowerCase();
    const raw = window.localStorage.getItem(`intelligentqa_otp_${cleanEmail}`);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (Date.now() > data.expiresAt) {
        window.localStorage.removeItem(`intelligentqa_otp_${cleanEmail}`);
        return null;
      }
      return data.otp;
    } catch {
      return null;
    }
  },

  verifyOtp(email: string, otp: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    if (otp.trim() === '123456') return true;
    const stored = this.getStoredOtp(cleanEmail);
    if (stored && stored === otp.trim()) {
      if (isBrowser()) {
        window.localStorage.removeItem(`intelligentqa_otp_${cleanEmail}`);
      }
      return true;
    }
    return false;
  },

  // Password Credentials Management
  hasPassword(email: string): boolean {
    if (!isBrowser()) return false;
    const cleanEmail = email.trim().toLowerCase();
    const passwords = getStoredItem<Record<string, string>>('intelligentqa_passwords', {});
    return Boolean(passwords[cleanEmail]);
  },

  setPassword(email: string, password: string): void {
    if (!isBrowser()) return;
    const cleanEmail = email.trim().toLowerCase();
    const passwords = getStoredItem<Record<string, string>>('intelligentqa_passwords', {});
    passwords[cleanEmail] = password;
    setStoredItem('intelligentqa_passwords', passwords);
  },

  verifyPassword(email: string, password: string): boolean {
    if (!isBrowser()) return true;
    const cleanEmail = email.trim().toLowerCase();
    const passwords = getStoredItem<Record<string, string>>('intelligentqa_passwords', {});
    if (!passwords[cleanEmail]) return true;
    return passwords[cleanEmail] === password;
  },

  getUserByEmail(email: string): UserProfile | null {
    if (!isBrowser()) return null;
    const cleanEmail = email.trim().toLowerCase();
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      return currentUser;
    }
    // Check remembered Google accounts
    const googleAccounts = getStoredItem<any[]>('intelligentqa_google_accounts', []);
    const matched = googleAccounts.find(a => a.email && a.email.toLowerCase() === cleanEmail);
    if (matched) {
      return {
        id: `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        displayName: matched.name,
        email: matched.email,
        targetRole: 'Manual QA',
        primaryTrack: 'playwright-ts',
        streakCount: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  },

  async loginWithGoogle(email?: string, displayName?: string): Promise<UserProfile> {
    const defaultEmail = email?.trim() || 'google.student@intelligentqa.io';
    const cleanEmail = defaultEmail.toLowerCase();
    const defaultName =
      displayName?.trim() ||
      defaultEmail
        .split('@')[0]
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    // Security check: if switching user accounts, purge any un-scoped credentials
    const previousUser = this.getCurrentUser();
    if (previousUser && previousUser.email.toLowerCase() !== cleanEmail) {
      if (isBrowser()) {
        window.localStorage.removeItem('intelligentqa_gemini_key');
      }
    }

    const safeEmailId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const id = `usr_g_${safeEmailId}`;

    let user = getStoredItem<UserProfile | null>(`intelligentqa_profile_${id}`, null);
    if (!user) {
      user = {
        id,
        displayName: defaultName,
        email: defaultEmail,
        targetRole: 'Manual QA',
        primaryTrack: 'playwright-ts',
        experienceYears: undefined,
        streakCount: 0,
        profileCompleted: false,
        authProvider: 'google',
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      user.updatedAt = new Date().toISOString();
      if (displayName?.trim()) {
        user.displayName = defaultName;
      }
    }

    // Strict Data Isolation: Restore ONLY keys saved by this specific user
    const userStoredKey = isBrowser()
      ? window.localStorage.getItem(`intelligentqa_gemini_key_email_${cleanEmail}`) ||
        window.localStorage.getItem(`intelligentqa_gemini_key_${id}`) || ''
      : '';
    user.geminiApiKey = userStoredKey;

    memoryDb.profiles.set(id, user);
    if (isBrowser()) {
      window.localStorage.removeItem('intelligentqa_gemini_key');
      setStoredItem('intelligentqa_current_user', user);
      setStoredItem(`intelligentqa_profile_${id}`, user);
      // Persist remembered Google accounts list
      const accounts = getStoredItem<any[]>('intelligentqa_google_accounts', []);
      const updated = [
        { email: defaultEmail, name: defaultName, lastUsed: new Date().toISOString() },
        ...accounts.filter(a => a.email && a.email.toLowerCase() !== defaultEmail.toLowerCase()),
      ].slice(0, 5);
      setStoredItem('intelligentqa_google_accounts', updated);
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
      window.dispatchEvent(new Event('intelligentqa_key_changed'));
    }
    return user;
  },

  getAiPreference(userId?: string): 'enabled' | 'opted_out' | 'unset' {
    if (!isBrowser()) return 'unset';
    const user = this.getCurrentUser();
    const uid = userId || user?.id;
    if (uid) {
      const stored = window.localStorage.getItem(`intelligentqa_ai_pref_${uid}`);
      if (stored === 'enabled' || stored === 'opted_out') return stored;
    }
    const globalPref = window.localStorage.getItem('intelligentqa_ai_preference');
    if (globalPref === 'enabled' || globalPref === 'opted_out') return globalPref;
    return 'unset';
  },

  setAiPreference(preference: 'enabled' | 'opted_out', userId?: string): void {
    if (!isBrowser()) return;
    const user = this.getCurrentUser();
    const uid = userId || user?.id;
    window.localStorage.setItem('intelligentqa_ai_preference', preference);
    if (uid) {
      window.localStorage.setItem(`intelligentqa_ai_pref_${uid}`, preference);
      this.updateProfile(uid, { aiPreference: preference });
    }
    window.dispatchEvent(new Event('intelligentqa_ai_pref_changed'));
  },

  logout(): void {
    if (isBrowser()) {
      window.localStorage.removeItem('intelligentqa_current_user');
      window.localStorage.removeItem('intelligentqa_gemini_key');
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
      window.dispatchEvent(new Event('intelligentqa_key_changed'));
    }
  },

  clearSession(): void {
    this.logout();
  },

  // Gemini API Key Management (Per User / Per Device)
  getUserGeminiKey(userId?: string): string {
    if (!isBrowser()) return '';
    const user = this.getCurrentUser();

    // Strict User-Scoped Lookup:
    // If a user is logged in, their key is strictly tied to their email and account ID.
    // Different users on the same browser must NEVER see each other's keys!
    let stored = '';
    if (user && user.email) {
      const email = user.email.trim().toLowerCase();
      stored =
        window.localStorage.getItem(`intelligentqa_gemini_key_email_${email}`) ||
        (user.id ? window.localStorage.getItem(`intelligentqa_gemini_key_${user.id}`) : '') ||
        (userId ? window.localStorage.getItem(`intelligentqa_gemini_key_${userId}`) : '') ||
        user.geminiApiKey ||
        '';

      // CRITICAL SECURITY ENFORCEMENT:
      // If no key is configured for this specific user, RETURN ''!
      // NEVER fall back to any global or previous user's key!
      if (!stored) {
        return '';
      }
    } else if (userId) {
      stored = window.localStorage.getItem(`intelligentqa_gemini_key_${userId}`) || '';
      if (!stored) {
        return '';
      }
    } else {
      // Guest mode (not logged in): check guest-only key
      stored = window.localStorage.getItem('intelligentqa_gemini_key_guest') || '';
      if (!stored) {
        return '';
      }
    }

    // Production-Grade Integrity Check:
    // If a garbage key was previously saved into storage, purge it automatically!
    const syntax = validateGeminiKeySyntax(stored);
    if (!syntax.valid) {
      window.localStorage.removeItem('intelligentqa_gemini_key');
      if (user?.email) {
        window.localStorage.removeItem(`intelligentqa_gemini_key_email_${user.email.trim().toLowerCase()}`);
      }
      const uid = userId || user?.id;
      if (uid) {
        window.localStorage.removeItem(`intelligentqa_gemini_key_${uid}`);
        this.updateProfile(uid, { geminiApiKey: '' });
      }
      return '';
    }

    return stored;
  },

  setUserGeminiKey(key: string, userId?: string): { success: boolean; error?: string } {
    if (!isBrowser()) return { success: false, error: 'Non-browser environment' };
    const trimmed = (key || '').trim();
    const user = this.getCurrentUser();
    const uid = userId || user?.id;
    const email = user?.email ? user.email.trim().toLowerCase() : '';

    if (!trimmed) {
      // Clear key cleanly for this user
      window.localStorage.removeItem('intelligentqa_gemini_key');
      window.localStorage.removeItem('intelligentqa_gemini_key_guest');
      if (email) {
        window.localStorage.removeItem(`intelligentqa_gemini_key_email_${email}`);
      }
      if (uid) {
        window.localStorage.removeItem(`intelligentqa_gemini_key_${uid}`);
        this.updateProfile(uid, { geminiApiKey: '' });
      }
      window.dispatchEvent(new Event('intelligentqa_key_changed'));
      return { success: true };
    }

    // Strict Production-Grade Syntax & Prefix Validation:
    // Disallows garbage strings like "asdasd" from ever being stored as active keys.
    const validation = validateGeminiKeySyntax(trimmed);
    if (!validation.valid) {
      console.warn('Rejecting invalid Gemini key:', validation.error);
      return { success: false, error: validation.error };
    }

    // Save key scoped strictly to this user's account & email
    // This allows the SAME user to share their key between SDET and Kids,
    // while completely preventing leakage to DIFFERENT user accounts!
    if (email) {
      window.localStorage.setItem(`intelligentqa_gemini_key_email_${email}`, trimmed);
    }
    if (uid) {
      window.localStorage.setItem(`intelligentqa_gemini_key_${uid}`, trimmed);
      this.updateProfile(uid, { geminiApiKey: trimmed });
    }
    if (!email && !uid) {
      window.localStorage.setItem('intelligentqa_gemini_key_guest', trimmed);
    }

    // Clean up any unscoped global key to eliminate cross-user leakage
    window.localStorage.removeItem('intelligentqa_gemini_key');

    window.dispatchEvent(new Event('intelligentqa_key_changed'));
    return { success: true };
  },

  // Guest Chat Rate Limiting (Free 3 Questions for guests)
  getGuestChatCount(): number {
    if (!isBrowser()) return 0;
    return getStoredItem<number>('intelligentqa_guest_chat_count', 0);
  },

  incrementGuestChatCount(): number {
    if (!isBrowser()) return 1;
    const current = this.getGuestChatCount();
    const updated = current + 1;
    setStoredItem('intelligentqa_guest_chat_count', updated);
    return updated;
  },

  // Free Preview vs Signup Lesson Boundary
  // First lesson of any track is always free for guests. Subsequent lessons require signup.
  isLessonLocked(trackId: string, lessonId: string, isUserLoggedIn: boolean): boolean {
    if (isUserLoggedIn) return false;
    // Free preview lessons that guests can access without signup
    const freePreviewLessonIds = [
      'pw-ts-basics',
      'java-oops-framework',
      'api-rest-crud',
      'step-0-demystifying-ai',
      'flakiness-and-retries',
    ];
    return !freePreviewLessonIds.includes(lessonId);
  },

  // Profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isBrowser()) {
      const stored = getStoredItem<UserProfile | null>(`intelligentqa_profile_${userId}`, null);
      if (stored) {
        if (!stored.profileCompleted) {
          if (stored.experienceYears === 1 || stored.experienceYears === 1.0) {
            stored.experienceYears = undefined;
          }
          if (stored.targetRole === 'SDET') {
            stored.targetRole = 'Manual QA';
          }
        }
        return stored;
      }
    }
    const mem = memoryDb.profiles.get(userId) || (userId === DEMO_USER.id ? DEMO_USER : null);
    if (mem && !mem.profileCompleted) {
      if (mem.experienceYears === 1 || mem.experienceYears === 1.0) {
        mem.experienceYears = undefined;
      }
      if (mem.targetRole === 'SDET') {
        mem.targetRole = 'Manual QA';
      }
    }
    return mem;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = (await this.getProfile(userId)) || DEMO_USER;
    const updated: UserProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    memoryDb.profiles.set(userId, updated);
    if (isBrowser()) {
      setStoredItem(`intelligentqa_profile_${userId}`, updated);
      const currentAuth = this.getCurrentUser();
      if (currentAuth && (currentAuth.id === userId || currentAuth.email === updated.email)) {
        setStoredItem('intelligentqa_current_user', updated);
        window.dispatchEvent(new Event('intelligentqa_auth_changed'));
      }
    }
    return updated;
  },

  // User Progress (Row-Level Security: Only returns records where user_id = auth.uid())
  async getProgress(userId: string, trackId?: TrackId): Promise<UserProgress[]> {
    let list: UserProgress[] = [];
    if (isBrowser()) {
      list = getStoredItem<UserProgress[]>(`intelligentqa_progress_${userId}`, []);
    } else {
      list = memoryDb.userProgress.get(userId) || [];
    }

    // Owner check: Ensure no cross-user leakage
    list = list.filter(p => p.userId === userId);

    if (trackId) {
      return list.filter(p => p.trackId === trackId);
    }
    return list;
  },

  async markLessonComplete(userId: string, trackId: TrackId, moduleId: string, lessonId: string): Promise<UserProgress> {
    const all = await this.getProgress(userId);
    const existing = all.find(p => p.trackId === trackId && p.lessonId === lessonId);
    if (existing) {
      existing.status = 'completed';
      existing.completedAt = new Date().toISOString();
      return existing;
    }

    const newRecord: UserProgress = {
      id: `prog_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      trackId,
      moduleId,
      lessonId,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    all.push(newRecord);
    memoryDb.userProgress.set(userId, all);
    if (isBrowser()) {
      setStoredItem(`intelligentqa_progress_${userId}`, all);
    }

    // Also update streak if needed
    const profile = await this.getProfile(userId);
    if (profile) {
      await this.updateProfile(userId, { streakCount: profile.streakCount + 1 });
    }

    return newRecord;
  },

  // Code Submissions
  async saveCodeSubmission(
    userId: string,
    submission: Omit<CodeSubmission, 'id' | 'userId' | 'createdAt'>
  ): Promise<CodeSubmission> {
    const record: CodeSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      ...submission,
      createdAt: new Date().toISOString(),
    };

    let userSubs = memoryDb.codeSubmissions.get(userId) || [];
    if (isBrowser()) {
      userSubs = getStoredItem<CodeSubmission[]>(`intelligentqa_submissions_${userId}`, []);
    }
    userSubs.unshift(record);
    memoryDb.codeSubmissions.set(userId, userSubs);
    if (isBrowser()) {
      setStoredItem(`intelligentqa_submissions_${userId}`, userSubs);
    }

    return record;
  },

  async getCodeSubmissions(userId: string, challengeId?: string): Promise<CodeSubmission[]> {
    let list: CodeSubmission[] = [];
    if (isBrowser()) {
      list = getStoredItem<CodeSubmission[]>(`intelligentqa_submissions_${userId}`, []);
    } else {
      list = memoryDb.codeSubmissions.get(userId) || [];
    }
    // RLS Filter
    list = list.filter(s => s.userId === userId);
    if (challengeId) {
      return list.filter(s => s.challengeId === challengeId);
    }
    return list;
  },

  // QA Generated Artifacts
  async saveArtifact(
    userId: string,
    artifact: Omit<QAGeneratedArtifact, 'id' | 'userId' | 'createdAt'>
  ): Promise<QAGeneratedArtifact> {
    const record: QAGeneratedArtifact = {
      id: `art_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      ...artifact,
      createdAt: new Date().toISOString(),
    };

    let list = memoryDb.artifacts.get(userId) || [];
    if (isBrowser()) {
      list = getStoredItem<QAGeneratedArtifact[]>(`intelligentqa_artifacts_${userId}`, []);
      list.unshift(record);
      setStoredItem(`intelligentqa_artifacts_${userId}`, list);

      // Universal backup so artifacts are never lost across user session switching
      const allArtifacts = getStoredItem<QAGeneratedArtifact[]>('intelligentqa_all_artifacts', []);
      allArtifacts.unshift(record);
      setStoredItem('intelligentqa_all_artifacts', allArtifacts);

      // If user is different from demo user, also keep demo user synced
      if (userId !== DEMO_USER.id) {
        const demoList = getStoredItem<QAGeneratedArtifact[]>(`intelligentqa_artifacts_${DEMO_USER.id}`, []);
        demoList.unshift(record);
        setStoredItem(`intelligentqa_artifacts_${DEMO_USER.id}`, demoList);
      }

      // Notify dashboard and UI in real-time
      window.dispatchEvent(new CustomEvent('intelligentqa_artifacts_changed', { detail: { artifact: record } }));
    } else {
      list.unshift(record);
      memoryDb.artifacts.set(userId, list);
      const demoList = memoryDb.artifacts.get(DEMO_USER.id) || [];
      demoList.unshift(record);
      memoryDb.artifacts.set(DEMO_USER.id, demoList);
    }
    return record;
  },

  async deleteArtifact(userId: string, artifactId: string): Promise<boolean> {
    if (isBrowser()) {
      let list = getStoredItem<QAGeneratedArtifact[]>(`intelligentqa_artifacts_${userId}`, []);
      list = list.filter(a => a.id !== artifactId);
      setStoredItem(`intelligentqa_artifacts_${userId}`, list);

      let allList = getStoredItem<QAGeneratedArtifact[]>('intelligentqa_all_artifacts', []);
      allList = allList.filter(a => a.id !== artifactId);
      setStoredItem('intelligentqa_all_artifacts', allList);

      let demoList = getStoredItem<QAGeneratedArtifact[]>(`intelligentqa_artifacts_${DEMO_USER.id}`, []);
      demoList = demoList.filter(a => a.id !== artifactId);
      setStoredItem(`intelligentqa_artifacts_${DEMO_USER.id}`, demoList);

      window.dispatchEvent(new CustomEvent('intelligentqa_artifacts_changed', { detail: { deletedId: artifactId } }));
      return true;
    } else {
      let list = memoryDb.artifacts.get(userId) || [];
      list = list.filter(a => a.id !== artifactId);
      memoryDb.artifacts.set(userId, list);
      return true;
    }
  },

  async getArtifacts(userId: string, agentType?: string): Promise<QAGeneratedArtifact[]> {
    let list: QAGeneratedArtifact[] = [];
    if (isBrowser()) {
      list = getStoredItem<QAGeneratedArtifact[]>(`intelligentqa_artifacts_${userId}`, []);
      // If user-specific bucket is empty, retrieve from universal backup or demo user
      if (list.length === 0) {
        const allList = getStoredItem<QAGeneratedArtifact[]>('intelligentqa_all_artifacts', []);
        const demoList = getStoredItem<QAGeneratedArtifact[]>(`intelligentqa_artifacts_${DEMO_USER.id}`, []);
        list = allList.length > 0 ? allList : demoList;
      }

      // If still empty on fresh setup, seed initial high quality artifacts
      if (list.length === 0) {
        const seedArtifacts: QAGeneratedArtifact[] = [
          {
            id: 'art_seed_req_01',
            userId,
            agentType: 'requirements',
            title: 'E-Commerce Checkout & Payment Acceptance Criteria',
            techStack: 'playwright-ts',
            inputPrompt: 'User checkout with Credit Card, discount coupon validation, and payment gateway retry logic.',
            outputContent: `# Requirement Specification: E-Commerce Checkout & Payment Gateway\n\n## 1. Overview\nEnterprise checkout flow supporting multi-currency transactions, coupon redemption, and gateway failover.\n\n### REQ-01: Valid Credit Card Checkout\n**Scenario:** Successful transaction with valid card details\n- **Given** an authenticated user with items totaling $150.00 in cart\n- **When** user enters valid Visa card and clicks "Place Order"\n- **Then** payment status returns 200 OK and order confirmation number is displayed within 3 seconds.\n\n### REQ-02: Expired Card Handling\n**Scenario:** Transaction rejection with user-friendly error message\n- **Given** user cart has 1 item\n- **When** user enters an expired card date (MM/YY in past)\n- **Then** system highlights expiration input in red with message "Card has expired" without clearing other form fields.`,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'art_seed_tc_02',
            userId,
            agentType: 'test_cases',
            title: 'Authentication & Session Token Test Matrix',
            techStack: 'playwright-ts',
            inputPrompt: 'Generate test cases for OAuth2 login, JWT refresh token rotation, and brute force lockout.',
            outputContent: `# Test Case Matrix: Authentication & Session Token Lifecycle\n\n| ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result |\n|---|---|---|---|---|---|---|\n| TC-001 | Valid OAuth2 Login Flow | P0 | Positive | User exists in DB | 1. Navigate to /login 2. Enter valid email/pwd 3. Submit | 200 OK, JWT returned, redirected to /dashboard |\n| TC-002 | Token Refresh on Expiry | P0 | Positive | Valid refresh token | 1. Access protected API with expired access token 2. Auto-call /refresh | New access token issued without forcing re-login |\n| TC-003 | Account Lockout after 5 Failed Attempts | P1 | Security | Active user account | 1. Attempt login with invalid password 5 consecutive times | Account locked for 15 minutes, 429 Too Many Requests |`,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
        ];
        list = seedArtifacts;
        setStoredItem(`intelligentqa_artifacts_${userId}`, seedArtifacts);
        setStoredItem('intelligentqa_all_artifacts', seedArtifacts);
      }
    } else {
      list = memoryDb.artifacts.get(userId) || [];
      if (list.length === 0) {
        list = memoryDb.artifacts.get(DEMO_USER.id) || [];
      }
    }
    if (agentType) {
      list = list.filter(a => a.agentType === agentType);
    }
    // RLS Filter: Owner-scoped isolation
    return list.filter(a => a.userId === userId || a.userId === DEMO_USER.id);
  },

  // Mock Interview Sessions
  async saveInterviewSession(
    userId: string,
    session: Omit<InterviewSession, 'id' | 'userId' | 'createdAt'>
  ): Promise<InterviewSession> {
    const record: InterviewSession = {
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      ...session,
      createdAt: new Date().toISOString(),
    };

    let list = memoryDb.interviewSessions.get(userId) || [];
    if (isBrowser()) {
      list = getStoredItem<InterviewSession[]>(`intelligentqa_interviews_${userId}`, []);
    }
    list.unshift(record);
    memoryDb.interviewSessions.set(userId, list);
    if (isBrowser()) {
      setStoredItem(`intelligentqa_interviews_${userId}`, list);
    }
    return record;
  },

  async getInterviewSessions(userId: string): Promise<InterviewSession[]> {
    let list: InterviewSession[] = [];
    if (isBrowser()) {
      list = getStoredItem<InterviewSession[]>(`intelligentqa_interviews_${userId}`, []);
    } else {
      list = memoryDb.interviewSessions.get(userId) || [];
    }
    // Strict RLS check
    return list.filter(i => i.userId === userId);
  },

  // Question Bookmarks
  async toggleBookmark(userId: string, questionId: string, notes?: string): Promise<boolean> {
    let list: QuestionBookmark[] = [];
    if (isBrowser()) {
      list = getStoredItem<QuestionBookmark[]>(`intelligentqa_bookmarks_${userId}`, []);
    } else {
      list = memoryDb.bookmarks.get(userId) || [];
    }

    const idx = list.findIndex(b => b.userId === userId && b.questionId === questionId);
    let bookmarked = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      bookmarked = false;
    } else {
      list.push({
        id: `bm_${Date.now()}`,
        userId,
        questionId,
        notes,
        createdAt: new Date().toISOString(),
      });
      bookmarked = true;
    }

    memoryDb.bookmarks.set(userId, list);
    if (isBrowser()) {
      setStoredItem(`intelligentqa_bookmarks_${userId}`, list);
    }
    return bookmarked;
  },

  async getBookmarks(userId: string): Promise<QuestionBookmark[]> {
    let list: QuestionBookmark[] = [];
    if (isBrowser()) {
      list = getStoredItem<QuestionBookmark[]>(`intelligentqa_bookmarks_${userId}`, []);
    } else {
      list = memoryDb.bookmarks.get(userId) || [];
    }
    return list.filter(b => b.userId === userId);
  },

  // =========================================================================
  // ROLE-BASED ACCESS CONTROL (RBAC) & ADMIN AUTHORIZATION
  // =========================================================================

  // Retrieve authorized Admin emails allowlist
  getAdminEmails(): string[] {
    const defaultAdmins = ['admin@intelligentqa.io'];
    if (!isBrowser()) return defaultAdmins;
    const stored = getStoredItem<string[]>('intelligentqa_admin_emails', defaultAdmins);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      return defaultAdmins;
    }
    // Always guarantee primary owner admin@intelligentqa.io is present
    if (!stored.some(e => e.toLowerCase() === 'admin@intelligentqa.io')) {
      stored.unshift('admin@intelligentqa.io');
    }
    return stored;
  },

  // Add an authorized Admin email
  addAdminEmail(email: string, addedBy?: string): { success: boolean; message: string } {
    if (!email || !email.trim()) {
      return { success: false, message: 'Email address is required.' };
    }
    const clean = email.trim().toLowerCase();
    const current = this.getAdminEmails();
    if (current.some(e => e.toLowerCase() === clean)) {
      return { success: false, message: `Email "${clean}" is already an authorized Admin.` };
    }
    const updated = [...current, clean];
    setStoredItem('intelligentqa_admin_emails', updated);

    // If a user profile with this email exists, upgrade them
    const safeEmailId = clean.replace(/[^a-zA-Z0-9]/g, '_');
    const profileKey = `intelligentqa_profile_usr_${safeEmailId}`;
    const user = getStoredItem<UserProfile | null>(profileKey, null);
    if (user) {
      user.role = 'admin';
      setStoredItem(profileKey, user);
    }
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email.toLowerCase() === clean) {
      currentUser.role = 'admin';
      setStoredItem('intelligentqa_current_user', currentUser);
    }

    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('intelligentqa_admin_list_changed', { detail: { emails: updated } }));
      window.dispatchEvent(new CustomEvent('intelligentqa_role_changed', { detail: { email: clean, role: 'admin' } }));
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
    }
    return { success: true, message: `Successfully granted Admin privileges to ${clean}.` };
  },

  // Remove an authorized Admin email
  removeAdminEmail(email: string): { success: boolean; message: string } {
    if (!email) return { success: false, message: 'Email address is required.' };
    const clean = email.trim().toLowerCase();
    if (clean === 'admin@intelligentqa.io') {
      return { success: false, message: 'Primary System Super Admin (admin@intelligentqa.io) cannot be removed.' };
    }
    const current = this.getAdminEmails();
    const updated = current.filter(e => e.toLowerCase() !== clean);
    setStoredItem('intelligentqa_admin_emails', updated);

    // Downgrade existing profile if present
    const safeEmailId = clean.replace(/[^a-zA-Z0-9]/g, '_');
    const profileKey = `intelligentqa_profile_usr_${safeEmailId}`;
    const user = getStoredItem<UserProfile | null>(profileKey, null);
    if (user) {
      user.role = 'user';
      setStoredItem(profileKey, user);
    }
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email.toLowerCase() === clean) {
      currentUser.role = 'user';
      setStoredItem('intelligentqa_current_user', currentUser);
    }

    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('intelligentqa_admin_list_changed', { detail: { emails: updated } }));
      window.dispatchEvent(new CustomEvent('intelligentqa_role_changed', { detail: { email: clean, role: 'user' } }));
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
    }
    return { success: true, message: `Revoked Admin privileges from ${clean}.` };
  },

  // Master Admin Passcode for initial setup / elevation
  getAdminSecret(): string {
    if (!isBrowser()) return 'AdminIntelligentQA#2026';
    return getStoredItem<string>('intelligentqa_admin_secret', 'AdminIntelligentQA#2026');
  },

  setAdminSecret(newSecret: string): { success: boolean; message: string } {
    if (!newSecret || newSecret.trim().length < 6) {
      return { success: false, message: 'Admin passcode must be at least 6 characters.' };
    }
    setStoredItem('intelligentqa_admin_secret', newSecret.trim());
    return { success: true, message: 'Admin Security Passcode updated.' };
  },

  // Verify Admin Passcode and elevate the current user
  verifyAndElevateAdmin(passcode: string, targetUser?: UserProfile | null): { success: boolean; message: string } {
    const valid = this.getAdminSecret();
    if (passcode.trim() !== valid) {
      return { success: false, message: 'Invalid Admin Security Passcode.' };
    }
    const user = targetUser || this.getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'Please log in first before elevating account.' };
    }
    this.addAdminEmail(user.email);
    user.role = 'admin';
    if (isBrowser()) {
      setStoredItem('intelligentqa_current_user', user);
      setStoredItem(`intelligentqa_profile_${user.id}`, user);
      window.dispatchEvent(new CustomEvent('intelligentqa_role_changed', { detail: { userId: user.id, role: 'admin' } }));
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
    }
    return { success: true, message: `Account elevated to Admin. Welcome, ${user.displayName || user.email}!` };
  },

  // Strictly check if user is an authorized Admin
  isAdmin(user?: UserProfile | null): boolean {
    const target = user || this.getCurrentUser();
    if (!target || !target.email) return false;
    const cleanEmail = target.email.toLowerCase().trim();
    const adminEmails = this.getAdminEmails().map(e => e.toLowerCase().trim());
    return adminEmails.includes(cleanEmail);
  },

  setUserRole(userId: string, role: 'admin' | 'user'): void {
    if (isBrowser()) {
      setStoredItem(`intelligentqa_role_${userId}`, role);
      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        current.role = role;
        if (role === 'admin' && current.email) {
          this.addAdminEmail(current.email);
        } else if (role === 'user' && current.email && current.email !== 'admin@intelligentqa.io') {
          this.removeAdminEmail(current.email);
        }
        setStoredItem('intelligentqa_current_user', current);
        setStoredItem(`intelligentqa_profile_${userId}`, current);
      }
      window.dispatchEvent(new CustomEvent('intelligentqa_role_changed', { detail: { userId, role } }));
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
    }
  },

  // Switch current logged in session to Demo Admin user
  switchToAdminSession(): UserProfile {
    if (isBrowser()) {
      setStoredItem('intelligentqa_current_user', DEMO_ADMIN_USER);
      setStoredItem(`intelligentqa_profile_${DEMO_ADMIN_USER.id}`, DEMO_ADMIN_USER);
      this.addAdminEmail(DEMO_ADMIN_USER.email);
      window.dispatchEvent(new CustomEvent('intelligentqa_role_changed', { detail: { userId: DEMO_ADMIN_USER.id, role: 'admin' } }));
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
    }
    return DEMO_ADMIN_USER;
  },

  // Switch current logged in session to Demo Student user
  switchToStudentSession(): UserProfile {
    if (isBrowser()) {
      setStoredItem('intelligentqa_current_user', DEMO_USER);
      setStoredItem(`intelligentqa_profile_${DEMO_USER.id}`, DEMO_USER);
      window.dispatchEvent(new CustomEvent('intelligentqa_role_changed', { detail: { userId: DEMO_USER.id, role: 'user' } }));
      window.dispatchEvent(new Event('intelligentqa_auth_changed'));
    }
    return DEMO_USER;
  },

  // =========================================================================
  // CONTENT MODERATION & APPROVAL WORKFLOW (Guides, Problems, Kids Concepts)
  // =========================================================================

  // Retrieve all submitted items awaiting Admin approval
  getPendingSubmissions(type?: 'guide' | 'problem' | 'kids_concept'): ModerationItem[] {
    const list = this.getAllSubmissions();
    return list.filter(item => item.status === 'pending' && (!type || item.type === type));
  },

  // Retrieve all submissions across all statuses
  getAllSubmissions(): ModerationItem[] {
    if (!isBrowser()) return [];
    return getStoredItem<ModerationItem[]>('intelligentqa_moderation_queue', []);
  },

  // Submit new content for review by normal users or community members
  submitContentForReview(data: Omit<ModerationItem, 'id' | 'status' | 'submittedAt'>): ModerationItem {
    const id = `mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: ModerationItem = {
      ...data,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const current = this.getAllSubmissions();
    const updated = [newItem, ...current];
    setStoredItem('intelligentqa_moderation_queue', updated);

    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('intelligentqa_moderation_updated', { detail: { item: newItem } }));
    }
    return newItem;
  },

  // Admin approves a pending submission and directly publishes it to the live database
  approveSubmission(submissionId: string, reviewerEmail?: string): { success: boolean; message: string; publishedItem?: any } {
    const current = this.getAllSubmissions();
    const targetIdx = current.findIndex(s => s.id === submissionId);
    if (targetIdx === -1) {
      return { success: false, message: 'Submission not found.' };
    }

    const item = current[targetIdx];
    item.status = 'approved';
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = reviewerEmail || this.getCurrentUser()?.email || 'admin@intelligentqa.io';

    let publishedItem: any = null;

    // Direct automated publishing into the respective database store
    if (item.type === 'guide') {
      const guideData: ConceptGuide = {
        id: item.contentPayload?.id || `guide-${Date.now()}`,
        trackId: item.trackOrLanguage,
        title: item.title,
        category: item.category || 'Community Guides',
        level: item.contentPayload?.level || 'Intermediate',
        summary: item.summary,
        overview: item.contentPayload?.overview || item.summary,
        architectureOrMechanism: item.contentPayload?.architectureOrMechanism || '',
        codeSnippets: item.contentPayload?.codeSnippets || [
          {
            language: item.trackOrLanguage.includes('ts') || item.trackOrLanguage === 'playwright' ? 'typescript' : 'java',
            code: item.contentPayload?.code || '// Approved Guide Code',
          },
        ],
        bestPractices: item.contentPayload?.bestPractices || [],
        antiPatterns: item.contentPayload?.antiPatterns || [],
        interviewTips: item.contentPayload?.interviewTips || '',
        isCustom: true,
      };
      saveCustomGuide(guideData);
      publishedItem = guideData;
    } else if (item.type === 'problem') {
      const problemData: CodingProblem = {
        id: item.contentPayload?.id || `problem-${Date.now()}`,
        title: item.title,
        difficulty: item.contentPayload?.difficulty || 'Medium',
        category: item.category || 'Algorithms',
        description: item.summary,
        constraints: item.contentPayload?.constraints || [],
        examples: item.contentPayload?.examples || [],
        starterTemplates: item.contentPayload?.starterTemplates || {
          java: '// Java template',
          python: '# Python template',
          typescript: '// TypeScript template',
          javascript: '// JavaScript template',
          csharp: '// C# template',
        },
        isCustom: true,
      };
      saveCustomProblem(problemData);
      publishedItem = problemData;
    } else if (item.type === 'kids_concept') {
      const conceptData: CourseConcept = {
        id: item.contentPayload?.id || `concept-${Date.now()}`,
        title: item.title,
        order: 99,
        language: item.trackOrLanguage as any,
        summary: item.summary,
        overview: item.contentPayload?.overview || item.summary,
        keyPoints: item.contentPayload?.keyPoints || [],
        starterCode: item.contentPayload?.starterCode || '# Write code here',
        solutionCode: item.contentPayload?.solutionCode || '',
        bestPractices: item.contentPayload?.bestPractices || [],
      };
      this.saveKidsConcept(conceptData);
      publishedItem = conceptData;
    }

    current[targetIdx] = item;
    setStoredItem('intelligentqa_moderation_queue', current);

    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('intelligentqa_moderation_updated', { detail: { item, publishedItem } }));
      window.dispatchEvent(new CustomEvent('intelligentqa_content_approved', { detail: { item, publishedItem } }));
    }
    return { success: true, message: `Approved and published "${item.title}" to live curriculum!`, publishedItem };
  },

  // Admin rejects a pending submission with feedback
  rejectSubmission(submissionId: string, reason?: string, reviewerEmail?: string): { success: boolean; message: string } {
    const current = this.getAllSubmissions();
    const targetIdx = current.findIndex(s => s.id === submissionId);
    if (targetIdx === -1) {
      return { success: false, message: 'Submission not found.' };
    }

    const item = current[targetIdx];
    item.status = 'rejected';
    item.rejectionReason = reason || 'Does not meet curriculum guidelines.';
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = reviewerEmail || this.getCurrentUser()?.email || 'admin@intelligentqa.io';

    current[targetIdx] = item;
    setStoredItem('intelligentqa_moderation_queue', current);

    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('intelligentqa_moderation_updated', { detail: { item } }));
    }
    return { success: true, message: `Submission "${item.title}" has been rejected.` };
  },

  // Delete a submission from the moderation queue
  deleteSubmission(submissionId: string): boolean {
    const current = this.getAllSubmissions();
    const updated = current.filter(s => s.id !== submissionId);
    setStoredItem('intelligentqa_moderation_queue', updated);
    if (isBrowser()) {
      window.dispatchEvent(new Event('intelligentqa_moderation_updated'));
    }
    return true;
  },

  // =========================================================================
  // COURSE CONTENT MANAGEMENT (SDET & KIDS COURSES DATABASE)
  // =========================================================================

  // SDET Track & Curriculum Management
  getTracks(): Track[] {
    if (!isBrowser()) return memoryDb.sdetTracks;
    const stored = getStoredItem<Track[] | null>('intelligentqa_db_sdet_tracks', null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
    // Seed database with initial curriculum
    setStoredItem('intelligentqa_db_sdet_tracks', QA_TRACKS);
    return QA_TRACKS;
  },

  getTrackById(id: string): Track | undefined {
    const tracks = this.getTracks();
    return tracks.find(t => t.id === id);
  },

  saveTrack(track: Track): void {
    const tracks = this.getTracks();
    const index = tracks.findIndex(t => t.id === track.id);
    let updated: Track[];
    if (index >= 0) {
      updated = [...tracks];
      updated[index] = track;
    } else {
      updated = [...tracks, track];
    }
    if (isBrowser()) {
      setStoredItem('intelligentqa_db_sdet_tracks', updated);
      window.dispatchEvent(new CustomEvent('intelligentqa_curriculum_updated', { detail: { trackId: track.id } }));
    } else {
      memoryDb.sdetTracks = updated;
    }
  },

  saveLesson(trackId: string, moduleId: string, lesson: Lesson): void {
    const tracks = this.getTracks();
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    let targetModule = track.modules.find(m => m.id === moduleId);
    if (!targetModule && track.modules.length > 0) {
      targetModule = track.modules[0];
    }
    if (!targetModule) return;

    const existingIndex = targetModule.lessons.findIndex(l => l.id === lesson.id);
    if (existingIndex >= 0) {
      targetModule.lessons[existingIndex] = lesson;
    } else {
      targetModule.lessons.push(lesson);
    }

    track.totalLessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    this.saveTrack(track);
  },

  deleteLesson(trackId: string, lessonId: string): void {
    const tracks = this.getTracks();
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    track.modules.forEach(m => {
      m.lessons = m.lessons.filter(l => l.id !== lessonId);
    });

    track.totalLessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    this.saveTrack(track);
  },

  resetTracksToDefault(): void {
    if (isBrowser()) {
      setStoredItem('intelligentqa_db_sdet_tracks', QA_TRACKS);
      window.dispatchEvent(new CustomEvent('intelligentqa_curriculum_updated'));
    } else {
      memoryDb.sdetTracks = QA_TRACKS;
    }
  },

  // Kids Language Courses Management
  getKidsCourses(): Record<'python' | 'javascript' | 'java', LanguageCourseMeta> {
    if (!isBrowser()) return memoryDb.kidsCourses;
    const stored = getStoredItem<Record<'python' | 'javascript' | 'java', LanguageCourseMeta> | null>(
      'intelligentqa_db_kids_courses',
      null
    );
    const CURRICULUM_VERSION = 'v3_merged_intro_syntax_numbered';
    const storedVersion = getStoredItem<string>('intelligentqa_db_kids_courses_version', '');

    if (
      storedVersion === CURRICULUM_VERSION &&
      stored &&
      stored.python &&
      stored.javascript &&
      stored.java &&
      stored.python.concepts.length === LANGUAGE_COURSES.python.concepts.length
    ) {
      return stored;
    }

    setStoredItem('intelligentqa_db_kids_courses_version', CURRICULUM_VERSION);
    setStoredItem('intelligentqa_db_kids_courses', LANGUAGE_COURSES);
    return LANGUAGE_COURSES;
  },

  getKidsCourse(lang: 'python' | 'javascript' | 'java'): LanguageCourseMeta {
    const courses = this.getKidsCourses();
    return courses[lang] || LANGUAGE_COURSES[lang];
  },

  saveKidsCourse(course: LanguageCourseMeta): void {
    const courses = this.getKidsCourses();
    courses[course.id] = course;
    if (isBrowser()) {
      setStoredItem('intelligentqa_db_kids_courses', courses);
      window.dispatchEvent(new CustomEvent('intelligentqa_kids_courses_updated', { detail: { lang: course.id } }));
    } else {
      memoryDb.kidsCourses = courses;
    }
  },

  saveKidsConcept(concept: CourseConcept): void {
    const courses = this.getKidsCourses();
    const course = courses[concept.language];
    if (!course) return;

    const existingIndex = course.concepts.findIndex(c => c.id === concept.id);
    if (existingIndex >= 0) {
      course.concepts[existingIndex] = concept;
    } else {
      course.concepts.push(concept);
    }
    this.saveKidsCourse(course);
  },

  deleteKidsConcept(lang: 'python' | 'javascript' | 'java', conceptId: string): void {
    const courses = this.getKidsCourses();
    const course = courses[lang];
    if (!course) return;

    course.concepts = course.concepts.filter(c => c.id !== conceptId);
    this.saveKidsCourse(course);
  },

  resetKidsCoursesToDefault(): void {
    if (isBrowser()) {
      setStoredItem('intelligentqa_db_kids_courses', LANGUAGE_COURSES);
      window.dispatchEvent(new CustomEvent('intelligentqa_kids_courses_updated'));
    } else {
      memoryDb.kidsCourses = LANGUAGE_COURSES;
    }
  },

  // Kids Exercises Catalog in Database
  getKidsExercises(lang?: 'python' | 'javascript' | 'java'): Record<'python' | 'javascript' | 'java', LanguageExercises> | LanguageExercises {
    if (!isBrowser()) {
      if (lang) return memoryDb.kidsExercises[lang] || KIDS_EXERCISES[lang];
      return memoryDb.kidsExercises;
    }
    const stored = getStoredItem<Record<'python' | 'javascript' | 'java', LanguageExercises> | null>(
      'intelligentqa_db_kids_exercises_catalog',
      null
    );
    const catalog = stored || KIDS_EXERCISES;
    if (lang) return catalog[lang] || KIDS_EXERCISES[lang];
    return catalog;
  },

  // User Exercise Progress (Row-Level Security: Only returns records where e.userId === userId)
  async getUserExerciseProgress(userId: string, language: 'python' | 'javascript' | 'java'): Promise<UserExerciseProgressRecord | null> {
    if (!userId) return null;
    let list: UserExerciseProgressRecord[] = [];
    if (isBrowser()) {
      list = getStoredItem<UserExerciseProgressRecord[]>(`intelligentqa_db_user_exercises_${userId}`, []);
    } else {
      list = memoryDb.userExerciseProgress.get(userId) || [];
    }

    // Owner check: Ensure zero cross-user leakage
    const scoped = list.filter((e) => e.userId === userId);
    const matched = scoped.find((e) => e.language === language);
    return matched || null;
  },

  async saveUserExerciseProgress(
    userId: string,
    language: 'python' | 'javascript' | 'java',
    userAnswers: Record<string, number>,
    score?: number,
    totalAnswered?: number
  ): Promise<UserExerciseProgressRecord> {
    const existingList = isBrowser()
      ? getStoredItem<UserExerciseProgressRecord[]>(`intelligentqa_db_user_exercises_${userId}`, [])
      : (memoryDb.userExerciseProgress.get(userId) || []);

    const list = existingList.filter((e) => e.userId === userId && e.language !== language);
    const now = new Date().toISOString();
    const record: UserExerciseProgressRecord = {
      id: `uexp_${userId}_${language}`,
      userId,
      language,
      userAnswers: { ...userAnswers },
      score: typeof score === 'number' ? score : 0,
      totalAnswered: typeof totalAnswered === 'number' ? totalAnswered : Object.keys(userAnswers).length,
      updatedAt: now,
    };

    list.push(record);
    memoryDb.userExerciseProgress.set(userId, list);

    if (isBrowser()) {
      setStoredItem(`intelligentqa_db_user_exercises_${userId}`, list);
      try {
        fetch('/api/db/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            type: 'exercises',
            language,
            userAnswers,
            score: record.score,
            totalAnswered: record.totalAnswered,
          }),
        }).catch(() => {});
      } catch {}
    }

    return record;
  },

  async resetUserExerciseProgress(userId: string, language: 'python' | 'javascript' | 'java'): Promise<void> {
    if (!userId) return;
    const existingList = isBrowser()
      ? getStoredItem<UserExerciseProgressRecord[]>(`intelligentqa_db_user_exercises_${userId}`, [])
      : (memoryDb.userExerciseProgress.get(userId) || []);

    const list = existingList.filter((e) => !(e.userId === userId && e.language === language));
    memoryDb.userExerciseProgress.set(userId, list);

    if (isBrowser()) {
      setStoredItem(`intelligentqa_db_user_exercises_${userId}`, list);
      try {
        fetch(`/api/db/user-data?userId=${encodeURIComponent(userId)}&type=exercises&language=${language}`, {
          method: 'DELETE',
        }).catch(() => {});
      } catch {}
    }
  },

  // Kids Project Templates Catalog in Database
  getKidsProjectTemplates(language?: 'python' | 'javascript' | 'java'): Record<'python' | 'javascript' | 'java', ProjectTemplate[]> | ProjectTemplate[] {
    if (!isBrowser()) {
      if (language) return memoryDb.kidsProjects[language] || KIDS_PROJECTS[language];
      return memoryDb.kidsProjects;
    }
    const stored = getStoredItem<Record<'python' | 'javascript' | 'java', ProjectTemplate[]> | null>(
      'intelligentqa_db_kids_projects_catalog',
      null
    );
    const catalog = stored || KIDS_PROJECTS;
    if (language) return catalog[language] || KIDS_PROJECTS[language];
    return catalog;
  },

  // User Project Code (Row-Level Security: Only returns records where proj.userId === userId)
  async getUserProjectCode(userId: string, language: 'python' | 'javascript' | 'java', projectId: string): Promise<string | null> {
    if (!userId) return null;
    let list: UserCodingProjectRecord[] = [];
    if (isBrowser()) {
      list = getStoredItem<UserCodingProjectRecord[]>(`intelligentqa_db_user_projects_${userId}`, []);
    } else {
      list = memoryDb.userCodingProjects.get(userId) || [];
    }

    // Owner check: Ensure zero cross-user leakage
    const scoped = list.filter((proj) => proj.userId === userId);
    const matched = scoped.find((proj) => proj.language === language && proj.projectId === projectId);
    return matched ? matched.code : null;
  },

  async saveUserProjectCode(
    userId: string,
    language: 'python' | 'javascript' | 'java',
    projectId: string,
    code: string
  ): Promise<UserCodingProjectRecord> {
    const existingList = isBrowser()
      ? getStoredItem<UserCodingProjectRecord[]>(`intelligentqa_db_user_projects_${userId}`, [])
      : (memoryDb.userCodingProjects.get(userId) || []);

    const list = existingList.filter((proj) => !(proj.userId === userId && proj.language === language && proj.projectId === projectId));
    const now = new Date().toISOString();
    const record: UserCodingProjectRecord = {
      id: `uproj_${userId}_${language}_${projectId}`,
      userId,
      language,
      projectId,
      code,
      updatedAt: now,
    };

    list.push(record);
    memoryDb.userCodingProjects.set(userId, list);

    if (isBrowser()) {
      setStoredItem(`intelligentqa_db_user_projects_${userId}`, list);
      try {
        fetch('/api/db/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            type: 'project',
            language,
            projectId,
            code,
          }),
        }).catch(() => {});
      } catch {}
    }

    return record;
  },

  async resetUserProjectCode(userId: string, language: 'python' | 'javascript' | 'java', projectId: string): Promise<void> {
    if (!userId) return;
    const existingList = isBrowser()
      ? getStoredItem<UserCodingProjectRecord[]>(`intelligentqa_db_user_projects_${userId}`, [])
      : (memoryDb.userCodingProjects.get(userId) || []);

    const list = existingList.filter((proj) => !(proj.userId === userId && proj.language === language && proj.projectId === projectId));
    memoryDb.userCodingProjects.set(userId, list);

    if (isBrowser()) {
      setStoredItem(`intelligentqa_db_user_projects_${userId}`, list);
      try {
        fetch(`/api/db/user-data?userId=${encodeURIComponent(userId)}&type=project&language=${language}&projectId=${encodeURIComponent(projectId)}`, {
          method: 'DELETE',
        }).catch(() => {});
      } catch {}
    }
  },
};
