'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Code2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Laptop,
  Check,
  Copy,
  FileDown,
  UploadCloud,
  Trash2,
  Lightbulb,
  Cpu,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  Minimize2,
  Gamepad2,
  Trophy,
  Rocket,
} from 'lucide-react';
import {
  LANGUAGE_COURSES,
  LanguageCourseMeta,
  CourseConcept,
  getStoredCustomLessons,
  deleteCustomLesson,
} from '@/lib/kids-courses';
import {
  KidsCourseTemplateModal,
  KidsCourseUploadModal,
} from '@/components/kids/kids-course-import-modals';
import KidsExercisesView from '@/components/kids/kids-exercises-view';
import KidsProjectsStudioView from '@/components/kids/kids-projects-studio-view';
import { QADatabase } from '@/lib/qa-db';

const LANGUAGE_DEFAULTS: Record<'python' | 'javascript' | 'java', { starter: string; filename: string }> = {
  python: {
    starter: `# Python 3.12 Playground\nprint("Hello from Python!")\n\nscores = [95, 88, 92, 100, 78]\naverage = sum(scores) / len(scores)\nprint(f"Average score: {average:.1f}")\n`,
    filename: 'main.py',
  },
  javascript: {
    starter: `// JavaScript ES2024 Playground\nconsole.log("Hello from JavaScript!");\n\nconst scores = [95, 88, 92, 100, 78];\nconst average = scores.reduce((a, b) => a + b, 0) / scores.length;\nconsole.log(\`Average score: \${average.toFixed(1)}\`);\n`,
    filename: 'index.js',
  },
  java: {
    starter: `// Java 21 Playground\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java 21!");\n\n        int[] scores = {95, 88, 92, 100, 78};\n        int sum = 0;\n        for (int s : scores) sum += s;\n        double avg = (double) sum / scores.length;\n        System.out.printf("Average score: %.1f%n", avg);\n    }\n}\n`,
    filename: 'Main.java',
  },
};

// Extract error line number from compiler diagnostic or exception traceback
function extractErrorLineNumber(errorText: string): number | null {
  if (!errorText) return null;
  // Python: File "...", line 8 or line 8, in ...
  const pyMatch = errorText.match(/line\s+(\d+)/i);
  if (pyMatch) return parseInt(pyMatch[1], 10);
  // Java: Main.java:8: error:
  const javaMatch = errorText.match(/:(\d+):\s*error/i);
  if (javaMatch) return parseInt(javaMatch[1], 10);
  // JS/Node: evalmachine.<anonymous>:8 or at line 8
  const jsMatch = errorText.match(/:(\d+):\d+/);
  if (jsMatch) return parseInt(jsMatch[1], 10);
  return null;
}

function KidsCoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Query Parameters: ?lang=python | javascript | java & concept=intro
  const rawLang = searchParams.get('lang');
  const activeLang: 'python' | 'javascript' | 'java' =
    rawLang === 'javascript' || rawLang === 'java' ? rawLang : 'python';
  const conceptParam = searchParams.get('concept');
  const viewParam = searchParams.get('view'); // 'exercises' | 'projects' | null

  // Course metadata and custom imported lessons
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [courseMeta, setCourseMeta] = useState<LanguageCourseMeta>(() => QADatabase.getKidsCourse(activeLang));
  const [customLessons, setCustomLessons] = useState<CourseConcept[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Staged / Selected Concept
  const allConcepts: CourseConcept[] = [...courseMeta.concepts, ...customLessons];
  const activeConcept: CourseConcept | undefined = conceptParam
    ? allConcepts.find((c) => c.id === conceptParam)
    : undefined;

  // Compiler IDE State: hidden by default until user clicks "Try it yourself"
  const [showCompiler, setShowCompiler] = useState<boolean>(false);
  const [editorCode, setEditorCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [terminalError, setTerminalError] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const compilerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef1 = useRef<HTMLDivElement>(null);
  const lineNumbersRef2 = useRef<HTMLDivElement>(null);

  // Resizing state for split view (Concept vs Compiler & IDE vs Output)
  const [descriptionWidthPct, setDescriptionWidthPct] = useState<number>(45);
  const [compilerHeightPct, setCompilerHeightPct] = useState<number>(58);
  const [isHResizing, setIsHResizing] = useState<boolean>(false);
  const [isVResizing, setIsVResizing] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  const mainSplitRef = useRef<HTMLDivElement>(null);
  const rightSplitColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Horizontal resizer (Concept Description vs Compiler+Output)
  const startHResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsHResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!mainSplitRef.current) return;
      const rect = mainSplitRef.current.getBoundingClientRect();
      const currentX = moveEvent.clientX - rect.left;
      const pct = (currentX / rect.width) * 100;
      const clamped = Math.min(Math.max(pct, 20), 75);
      setDescriptionWidthPct(clamped);
    };

    const handleMouseUp = () => {
      setIsHResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Vertical resizer (Compiler IDE vs Output in right column)
  const startVResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVResizing(true);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!rightSplitColumnRef.current) return;
      const rect = rightSplitColumnRef.current.getBoundingClientRect();
      const currentY = moveEvent.clientY - rect.top;
      const pct = (currentY / rect.height) * 100;
      const clamped = Math.min(Math.max(pct, 25), 80);
      setCompilerHeightPct(clamped);
    };

    const handleMouseUp = () => {
      setIsVResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Synchronized scroll handlers for line numbers gutter
  const handleEditorScroll1 = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef1.current) {
      lineNumbersRef1.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleEditorScroll2 = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef2.current) {
      lineNumbersRef2.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Keyboard shortcut & Tab indentation support
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const indent = '    ';
      setEditorCode(val.substring(0, start) + indent + val.substring(end));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + indent.length;
      }, 0);
    }
  };

  const editorLineCount = editorCode.split('\n').length;
  const editorLineNumbers = Array.from({ length: Math.max(editorLineCount, 1) }, (_, i) => i + 1);
  const detectedErrorLine = extractErrorLineNumber(terminalError);

  // Ensure portal mode is set to kids & check Admin role
  useEffect(() => {
    if (typeof window !== 'undefined') {
      QADatabase.setPortalMode('kids');
      const u = QADatabase.getCurrentUser();
      setCurrentUser(u);
      setIsAdmin(QADatabase.isAdmin(u));

      const handleUserOrRoleChange = () => {
        const updated = QADatabase.getCurrentUser();
        setCurrentUser(updated);
        setIsAdmin(QADatabase.isAdmin(updated));
      };

      window.addEventListener('intelligentqa_auth_changed', handleUserOrRoleChange);
      window.addEventListener('intelligentqa_role_changed', handleUserOrRoleChange);
      return () => {
        window.removeEventListener('intelligentqa_auth_changed', handleUserOrRoleChange);
        window.removeEventListener('intelligentqa_role_changed', handleUserOrRoleChange);
      };
    }
  }, []);

  // Sync course metadata from database when activeLang changes or when updated by admin
  useEffect(() => {
    setCourseMeta(QADatabase.getKidsCourse(activeLang));
    const handleCoursesUpdated = () => {
      setCourseMeta(QADatabase.getKidsCourse(activeLang));
    };
    window.addEventListener('intelligentqa_kids_courses_updated', handleCoursesUpdated);
    return () => window.removeEventListener('intelligentqa_kids_courses_updated', handleCoursesUpdated);
  }, [activeLang]);

  // Reload custom lessons when active language changes
  const reloadCustomLessons = () => {
    const custom = getStoredCustomLessons(activeLang);
    setCustomLessons(custom);
  };

  useEffect(() => {
    reloadCustomLessons();
  }, [activeLang]);

  // Sync editor code whenever active concept or language changes
  useEffect(() => {
    if (activeConcept) {
      setEditorCode(activeConcept.starterCode);
      setTerminalOutput(`Ready to execute "${activeConcept.title}". Click "Run Code" or "Try it yourself"!`);
      setTerminalError('');
    } else {
      setEditorCode(LANGUAGE_DEFAULTS[activeLang].starter);
      setTerminalOutput(`Ready to execute ${courseMeta.name}. Click "Run Code" to test!`);
      setTerminalError('');
    }
  }, [activeLang, conceptParam, activeConcept?.id]);

  // Keep IDE hidden by default when navigating concepts, unless explicitly requested via ?try=true
  useEffect(() => {
    if (searchParams.get('try') === 'true') {
      setShowCompiler(true);
    } else {
      setShowCompiler(false);
    }
  }, [conceptParam, activeLang]);

  // Handle "Try it yourself" toggle: opens IDE if hidden, closes IDE if open
  const handleTryItYourself = () => {
    if (showCompiler) {
      setShowCompiler(false);
    } else {
      setShowCompiler(true);
      if (activeConcept) {
        setEditorCode(activeConcept.starterCode);
        setTerminalOutput(`Loaded starter code for "${activeConcept.title}". Click "Run Code" to test output!`);
      } else {
        setEditorCode(LANGUAGE_DEFAULTS[activeLang].starter);
        setTerminalOutput(`Loaded ${courseMeta.name} playground. Click "Run Code" to execute!`);
      }
      setTerminalError('');
      setTimeout(() => {
        compilerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        textareaRef.current?.focus();
      }, 60);
    }
  };

  // Run Code via backend execution engine
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalOutput('Compiling and running code in live execution sandbox...');
    setTerminalError('');

    try {
      const geminiKey = QADatabase.getUserGeminiKey() || '';
      const res = await fetch('/api/sandbox/compiler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiKey ? { 'x-gemini-api-key': geminiKey } : {}),
        },
        body: JSON.stringify({
          language: activeLang,
          code: editorCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setTerminalError(data.error || 'Execution failed.');
        setTerminalOutput('');
      } else {
        const out = data.stdout || 'Program completed with no standard output.';
        setTerminalOutput(out);
        if (data.stderr) {
          setTerminalError(data.stderr);
        }
      }
    } catch (err: any) {
      setTerminalError(err.message || 'Network error running code.');
      setTerminalOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  // Handle code copy
  const handleCopyCode = (snippet: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(snippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Concept Navigation Helpers
  const activeIndex = activeConcept ? allConcepts.findIndex((c) => c.id === activeConcept.id) : -1;
  const prevConcept = activeIndex > 0 ? allConcepts[activeIndex - 1] : null;
  const nextConcept = activeIndex >= 0 && activeIndex < allConcepts.length - 1 ? allConcepts[activeIndex + 1] : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#111111] text-[#FFFFFF] font-sans">
      {/* 1. TOP HEADER & LANGUAGE NAVIGATION (Rendered ONLY on main language overview page) */}
      {!activeConcept && (
        <header className="border-b border-[#262626] bg-[#111111]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Language Selector Tabs & Mode Switcher */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Language Selector Tabs - Emergent Pill Styling */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/?lang=python${viewParam ? `&view=${viewParam}` : ''}`}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    activeLang === 'python'
                      ? 'bg-white text-black shadow-md font-bold'
                      : 'bg-[#1A1A1A] hover:bg-[#222222] text-zinc-300 border border-[#2A2A2A]'
                  }`}
                >
                  <Terminal className="w-4 h-4 text-inherit" />
                  <span>Python</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-inherit">3.12</span>
                </Link>

                <Link
                  href={`/?lang=javascript${viewParam ? `&view=${viewParam}` : ''}`}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    activeLang === 'javascript'
                      ? 'bg-white text-black shadow-md font-bold'
                      : 'bg-[#1A1A1A] hover:bg-[#222222] text-zinc-300 border border-[#2A2A2A]'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-inherit" />
                  <span>JavaScript</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-inherit">ES2024</span>
                </Link>

                <Link
                  href={`/?lang=java${viewParam ? `&view=${viewParam}` : ''}`}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    activeLang === 'java'
                      ? 'bg-white text-black shadow-md font-bold'
                      : 'bg-[#1A1A1A] hover:bg-[#222222] text-zinc-300 border border-[#2A2A2A]'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-inherit" />
                  <span>Java</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-inherit">21 LTS</span>
                </Link>
              </div>

              {/* View Switcher: Lessons | Exercises | Game Studio */}
              <div className="flex items-center gap-1 bg-[#161616] p-1.5 rounded-full border border-[#262626] shadow-inner">
                <Link
                  href={`/?lang=${activeLang}`}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    !viewParam
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Curriculum Lessons & Walkthroughs"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Lessons</span>
                </Link>

                <Link
                  href={`/?lang=${activeLang}&view=exercises`}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewParam === 'exercises'
                      ? 'bg-[#81FF89] text-black font-bold shadow-[0_0_15px_rgba(129,255,137,0.35)]'
                      : 'text-zinc-400 hover:text-[#81FF89]'
                  }`}
                  title="Interactive Knowledge Testing Quizzes (4-5 Qs per section)"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Exercises</span>
                </Link>

                <Link
                  href={`/?lang=${activeLang}&view=projects`}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewParam === 'projects'
                      ? 'bg-[#80FFF9] text-black font-bold shadow-[0_0_15px_rgba(128,255,249,0.35)]'
                      : 'text-zinc-400 hover:text-[#80FFF9]'
                  }`}
                  title="Build Games & Interactive Projects"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Game Studio</span>
                </Link>
              </div>
            </div>

            {/* Import Template & Import Course Content Buttons (Admin CMS Only) */}
            {isAdmin && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(true)}
                  className="py-2 px-4 rounded-full bg-[#1A1A1A] hover:bg-[#222222] text-zinc-200 border border-[#2A2A2A] text-sm font-medium transition flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Download standardized Import Template (JSON/CSV) with mandatory schema fields"
                >
                  <FileDown className="w-4 h-4 text-[#80FFF9]" />
                  <span>Import Template</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="py-2 px-5 rounded-full bg-white hover:bg-zinc-100 text-[#111111] text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
                  title="Import and Upload new course concepts or guides"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>Import Course Content</span>
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      {/* 2. MAIN BODY: LANGUAGE HOME, EXERCISES, GAME STUDIO, OR ACTIVE CONCEPT VIEW */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {viewParam === 'exercises' ? (
          <KidsExercisesView language={activeLang} />
        ) : viewParam === 'projects' ? (
          <KidsProjectsStudioView language={activeLang} />
        ) : !activeConcept ? (
          /* ========================================================= */
          /* LANGUAGE HOME PAGE (Overview, Architecture, Curriculum)   */
          /* ========================================================= */
          <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-200">
            {/* Language Overview Hero - Emergent High-Impact Scale */}
            <div className="p-8 sm:p-12 lg:p-14 rounded-[28px] bg-gradient-to-b from-[#181818] via-[#141414] to-[#101010] border border-[#262626] shadow-2xl relative overflow-hidden space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-sm font-mono font-semibold border border-[#81FF89]/30 bg-[#81FF89]/10 text-[#81FF89]">
                    {courseMeta.version}
                  </span>
                  <span className="text-sm text-zinc-400 font-medium">Official Curriculum</span>
                </div>

                <button
                  type="button"
                  onClick={handleTryItYourself}
                  className="py-3 px-6 sm:px-7 rounded-full bg-white hover:bg-zinc-100 text-[#111111] font-bold text-sm sm:text-base shadow-[0_4px_25px_rgba(255,255,255,0.22)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-emerald-600" />
                  <span>Try it yourself</span>
                </button>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] emergent-headline">
                  {courseMeta.name}
                </h1>
                <p className="text-xl sm:text-2xl text-[#81FF89] font-medium tracking-tight">
                  {courseMeta.tagline}
                </p>
              </div>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-4xl">
                {courseMeta.description}
              </p>

              {/* 3 Overview Information Columns - Emergent Clean Surface */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
                {/* Why Learn */}
                <div className="p-6 rounded-[22px] bg-[#1A1A1A] border border-[#282828] space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#81FF89] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#81FF89]" />
                    <span>Why Learn {activeLang.toUpperCase()}</span>
                  </div>
                  <ul className="space-y-2 text-sm sm:text-base text-zinc-300">
                    {courseMeta.whyLearn.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#81FF89] shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Industry Use Cases */}
                <div className="p-6 rounded-[22px] bg-[#1A1A1A] border border-[#282828] space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#80FFF9] uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-[#80FFF9]" />
                    <span>Industry Applications</span>
                  </div>
                  <ul className="space-y-2 text-sm sm:text-base text-zinc-300">
                    {courseMeta.useCases.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <ChevronRight className="w-4 h-4 text-[#80FFF9] shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Execution Model */}
                <div className="p-6 rounded-[22px] bg-[#1A1A1A] border border-[#282828] space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-zinc-300" />
                    <span>Execution Architecture</span>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {courseMeta.executionModel}
                  </p>
                </div>
              </div>
            </div>

            {/* Curriculum Roadmap Header & Concepts Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <BookOpen className="w-6 h-6 text-[#81FF89]" />
                    <span>Curriculum Roadmap ({allConcepts.length} Learning Concepts)</span>
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-400">
                    Select any concept below or use the playground to start learning and running code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTryItYourself}
                  className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#81FF89] hover:text-[#97FFA0] transition"
                >
                  <span>Open Playground IDE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Core Concepts Cards - Emergent Spacious Card Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allConcepts.map((concept, idx) => (
                  <div
                    key={concept.id}
                    className="emergent-card p-6 sm:p-7 flex flex-col justify-between space-y-5 group shadow-lg"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                          Concept #{concept.order || idx + 1}
                        </span>
                        {concept.id.startsWith('custom-') && (
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#81FF89]/15 text-[#81FF89] font-bold border border-[#81FF89]/30">
                            Imported
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#81FF89] transition-colors leading-snug">
                        {concept.title}
                      </h3>

                      <p className="text-sm sm:text-base text-zinc-400 line-clamp-3 leading-relaxed">
                        {concept.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-3">
                      <Link
                        href={`/?lang=${activeLang}&concept=${concept.id}`}
                        className="flex-1 py-2.5 px-4 rounded-full bg-[#202020] hover:bg-[#282828] text-white text-sm font-semibold transition border border-[#2E2E2E] flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-zinc-400" />
                        <span>Learn Concept</span>
                      </Link>

                      <Link
                        href={`/?lang=${activeLang}&concept=${concept.id}&try=true`}
                        className="py-2.5 px-5 rounded-full bg-white hover:bg-zinc-100 text-[#111111] text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                        title="Open concept code directly in the online compiler"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                        <span>Try it</span>
                      </Link>

                      {isAdmin && concept.id.startsWith('custom-') && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteCustomLesson(concept.id, activeLang);
                            reloadCustomLessons();
                          }}
                          className="p-2.5 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-[#202020] transition cursor-pointer"
                          title="Delete custom imported lesson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Online Compiler Section on Language Home - Emergent IDE */}
            <div ref={compilerRef} className="pt-8 border-t border-[#262626] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
                    <Laptop className="w-6 h-6 text-[#80FFF9]" />
                    <span>{courseMeta.name} Quick Playground</span>
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-400">
                    Write and execute live {activeLang} code in your browser with zero local setup.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditorCode(LANGUAGE_DEFAULTS[activeLang].starter)}
                  className="self-start sm:self-auto py-2 px-4 rounded-full bg-[#1A1A1A] hover:bg-[#222222] text-zinc-300 text-sm font-medium border border-[#2A2A2A] flex items-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Starter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editor Container */}
                <div className="bg-[#141414] border border-[#262626] rounded-[24px] overflow-hidden flex flex-col shadow-xl">
                  <div className="p-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between text-sm font-mono text-zinc-300">
                    <span className="font-bold text-white text-base">{LANGUAGE_DEFAULTS[activeLang].filename}</span>
                    <button
                      type="button"
                      disabled={isRunning}
                      onClick={handleRunCode}
                      className="py-2 px-6 bg-[#81FF89] hover:bg-[#97FFA0] disabled:opacity-60 text-black font-bold rounded-full text-sm flex items-center gap-2 shadow-[0_2px_15px_rgba(129,255,137,0.35)] transition cursor-pointer active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                    </button>
                  </div>
                  {/* Code Editor with Line Numbers */}
                  <div className="flex-1 flex overflow-hidden bg-[#101010] font-mono text-sm sm:text-base relative min-h-[320px]">
                    {/* Line Numbers Gutter */}
                    <div
                      ref={lineNumbersRef1}
                      className="w-12 py-5 px-2 bg-[#141414] text-zinc-500 text-right select-none border-r border-[#262626] shrink-0 overflow-hidden font-mono text-sm leading-6"
                    >
                      {editorLineNumbers.map((num) => {
                        const isError = detectedErrorLine === num;
                        return (
                          <div
                            key={num}
                            className={`leading-6 pr-1 font-mono transition-colors ${
                              isError
                                ? 'text-rose-400 font-extrabold bg-rose-500/25 rounded-xs'
                                : 'text-zinc-600 hover:text-zinc-400'
                            }`}
                            title={isError ? `Error detected on line ${num}` : `Line ${num}`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>

                    {/* Code Input */}
                    <textarea
                      ref={textareaRef}
                      value={editorCode}
                      onChange={(e) => setEditorCode(e.target.value)}
                      onKeyDown={handleEditorKeyDown}
                      onScroll={handleEditorScroll1}
                      className="flex-1 w-full p-5 bg-transparent text-zinc-100 font-mono text-sm sm:text-base leading-6 resize-none focus:outline-none focus:ring-0 whitespace-pre overflow-auto"
                      spellCheck={false}
                      placeholder="Write your code here..."
                    />
                  </div>

                  <div className="p-3.5 bg-[#141414] border-t border-[#262626] flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-2">
                      <span>{editorLineCount} lines</span>
                      {detectedErrorLine && (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          ● Error on Line {detectedErrorLine}
                        </span>
                      )}
                    </span>
                    <span>Shortcut: <kbd className="px-2 py-0.5 rounded bg-[#222222] border border-[#333333] text-zinc-200">Ctrl</kbd> + <kbd className="px-2 py-0.5 rounded bg-[#222222] border border-[#333333] text-zinc-200">Enter</kbd> to Run</span>
                  </div>
                </div>

                {/* Terminal Output */}
                <div className="bg-[#141414] border border-[#262626] rounded-[24px] overflow-hidden flex flex-col shadow-xl">
                  <div className="p-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between text-sm font-mono text-zinc-300">
                    <span className="font-bold text-white text-base">Execution Console / Output</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTerminalOutput('');
                        setTerminalError('');
                      }}
                      className="hover:text-white transition text-xs py-1 px-3 rounded-full bg-[#202020] border border-[#2C2C2C]"
                    >
                      Clear Console
                    </button>
                  </div>
                  <div className="p-5 bg-[#101010] font-mono text-sm sm:text-base text-zinc-200 flex-1 min-h-[260px] overflow-y-auto space-y-2 whitespace-pre-wrap">
                    {terminalOutput && <div className="text-[#81FF89] leading-relaxed">{terminalOutput}</div>}
                    {terminalError && (
                      <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 leading-relaxed">
                        {terminalError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* ACTIVE CONCEPT DETAIL + SPLIT COMPILER IDE VIEW            */
          /* ========================================================= */
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Concept Top Action Bar - Emergent Card Scale */}
            <div className="p-6 sm:p-8 rounded-[26px] bg-[#161616] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
                  <Link href={`/?lang=${activeLang}`} className="hover:text-white transition">
                    {courseMeta.name}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                  <span className="text-[#81FF89] font-semibold">{activeConcept.title}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {activeConcept.title}
                </h1>
              </div>

              {/* "Try it yourself" toggle button: opens IDE if hidden, closes IDE if open */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleTryItYourself}
                  className={`py-3 px-7 rounded-full font-bold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 ${
                    showCompiler
                      ? 'bg-[#202020] hover:bg-[#282828] text-white border border-[#333333]'
                      : 'bg-[#81FF89] hover:bg-[#97FFA0] text-black shadow-[0_4px_25px_rgba(129,255,137,0.35)] hover:scale-[1.02]'
                  }`}
                  title={showCompiler ? 'Click to hide compiler IDE' : 'Click to open compiler IDE with live execution'}
                >
                  {showCompiler ? (
                    <Minimize2 className="w-4 h-4 text-zinc-300" />
                  ) : (
                    <Play className="w-4 h-4 fill-current text-black" />
                  )}
                  <span>{showCompiler ? 'Hide IDE' : 'Try it yourself'}</span>
                </button>
              </div>
            </div>

            {/* Split Screen: Left = Concept Explanation, Right = Compiler IDE & Output Below */}
            <div
              ref={mainSplitRef}
              className={`flex flex-col ${
                showCompiler
                  ? 'lg:flex-row lg:h-[calc(100vh-160px)] lg:min-h-[680px] gap-0'
                  : 'gap-6'
              } items-stretch`}
            >
              {/* LEFT COLUMN: Concept Guide & Walkthrough - Emergent Spacious Surface */}
              <div
                style={showCompiler && isDesktop ? { width: `${descriptionWidthPct}%` } : undefined}
                className={`space-y-6 bg-[#161616] border border-[#262626] rounded-[26px] p-6 sm:p-8 shadow-xl min-w-0 ${
                  showCompiler ? 'lg:h-full lg:overflow-y-auto' : ''
                }`}
              >
                {/* Summary Callout */}
                <div className="p-5 rounded-[20px] bg-[#81FF89]/10 border border-[#81FF89]/25 text-sm sm:text-base text-zinc-200 leading-relaxed flex items-start gap-3.5">
                  <Lightbulb className="w-5 h-5 text-[#81FF89] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#81FF89] font-bold block mb-1 text-base">Concept Summary</strong>
                    <span>{activeConcept.summary}</span>
                  </div>
                </div>

                {/* In-depth Overview */}
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-[#81FF89]" />
                    <span>How It Works</span>
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {activeConcept.overview}
                  </p>
                </div>

                {/* Key Points & Mechanisms */}
                {activeConcept.keyPoints && activeConcept.keyPoints.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#80FFF9]" />
                      <span>Key Rules &amp; Principles</span>
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-base text-zinc-300">
                      {activeConcept.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#80FFF9] shrink-0 mt-1" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Blueprint Snippet */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-white uppercase tracking-wider">Example Blueprint</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(activeConcept.starterCode)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1.5 transition py-1 px-3 rounded-full bg-[#202020] border border-[#2E2E2E]"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-[#81FF89]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-5 rounded-[20px] bg-[#0D0D0D] border border-[#262626] text-sm sm:text-base font-mono text-[#80FFF9] overflow-x-auto leading-relaxed whitespace-pre-wrap">
                    {activeConcept.starterCode}
                  </pre>
                </div>

                {/* Best Practices */}
                {activeConcept.bestPractices && activeConcept.bestPractices.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-[#262626]">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#81FF89]" />
                      <span>Best Practices</span>
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-base text-zinc-300">
                      {activeConcept.bestPractices.map((bp, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <ChevronRight className="w-4 h-4 text-[#81FF89] shrink-0 mt-1" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Previous & Next Concept Footer Navigation */}
                <div className="pt-5 border-t border-[#262626] flex items-center justify-between gap-3 text-sm">
                  {prevConcept ? (
                    <Link
                      href={`/?lang=${activeLang}&concept=${prevConcept.id}`}
                      className="py-2.5 px-5 rounded-full bg-[#202020] hover:bg-[#282828] text-zinc-200 font-semibold flex items-center gap-2 transition border border-[#2E2E2E]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">{prevConcept.title}</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/?lang=${activeLang}`}
                      className="py-2.5 px-5 rounded-full bg-[#202020] hover:bg-[#282828] text-zinc-200 font-semibold transition border border-[#2E2E2E]"
                    >
                      ← {courseMeta.name} Home
                    </Link>
                  )}

                  {nextConcept ? (
                    <Link
                      href={`/?lang=${activeLang}&concept=${nextConcept.id}`}
                      className="py-2.5 px-5 rounded-full bg-white hover:bg-zinc-100 text-black font-bold flex items-center gap-2 transition ml-auto shadow-sm"
                    >
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">{nextConcept.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/?lang=${activeLang}&view=exercises`}
                      className="py-2.5 px-5 rounded-full bg-[#81FF89] hover:bg-[#97FFA0] text-black font-bold transition ml-auto flex items-center gap-2 shadow-[0_2px_15px_rgba(129,255,137,0.3)]"
                    >
                      <span>Take Exercises</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Horizontal Resizer Handle between Concept and Compiler Workspace */}
              {showCompiler && (
                <div
                  onMouseDown={startHResizing}
                  className="hidden lg:flex w-3 items-center justify-center cursor-col-resize group shrink-0 select-none py-4 mx-1.5"
                  title="Drag left/right to resize Concept and Compiler"
                >
                  <div
                    className={`w-1 h-24 rounded-full transition-colors ${
                      isHResizing ? 'bg-[#81FF89]' : 'bg-[#2E2E2E] group-hover:bg-[#81FF89]'
                    }`}
                  />
                </div>
              )}

              {/* RIGHT COLUMN: Compiler IDE on top, Output Console directly below */}
              {showCompiler && (
                <div
                  ref={(node) => {
                    compilerRef.current = node;
                    rightSplitColumnRef.current = node;
                  }}
                  style={isDesktop ? { width: `calc(${100 - descriptionWidthPct}% - 0.875rem)` } : undefined}
                  className="flex-1 flex flex-col min-w-0 h-full overflow-hidden"
                >
                  {/* COMPILER IDE (TOP) */}
                  <div
                    style={isDesktop ? { height: `${compilerHeightPct}%` } : undefined}
                    className="bg-[#141414] border border-[#262626] rounded-[26px] overflow-hidden flex flex-col shadow-2xl min-h-[220px] shrink-0"
                  >
                    <div className="p-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between text-sm shrink-0">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-[#81FF89]" />
                        <span className="font-bold text-white font-mono">
                          {activeLang.toUpperCase()} Compiler IDE
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditorCode(activeConcept.starterCode);
                            setTerminalOutput('Reset to original concept code.');
                            setTerminalError('');
                          }}
                          className="py-1.5 px-3.5 rounded-full text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 bg-[#202020] border border-[#2C2C2C] transition"
                          title="Reset to concept starter code"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRunning}
                          onClick={handleRunCode}
                          className="py-2 px-6 bg-[#81FF89] hover:bg-[#97FFA0] disabled:opacity-60 text-black font-bold rounded-full text-sm flex items-center gap-2 shadow-[0_2px_15px_rgba(129,255,137,0.35)] transition active:scale-95 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Code Editor with Line Numbers */}
                    <div className="flex-1 flex overflow-hidden bg-[#101010] font-mono text-sm sm:text-base relative min-h-[140px]">
                      {/* Line Numbers Gutter */}
                      <div
                        ref={lineNumbersRef2}
                        className="w-12 py-5 px-2 bg-[#141414] text-zinc-500 text-right select-none border-r border-[#262626] shrink-0 overflow-hidden font-mono text-sm leading-6"
                      >
                        {editorLineNumbers.map((num) => {
                          const isError = detectedErrorLine === num;
                          return (
                            <div
                              key={num}
                              className={`leading-6 pr-1 font-mono transition-colors ${
                                isError
                                  ? 'text-rose-400 font-extrabold bg-rose-500/25 rounded-xs'
                                  : 'text-zinc-600 hover:text-zinc-400'
                              }`}
                              title={isError ? `Error detected on line ${num}` : `Line ${num}`}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </div>

                      {/* Code Input */}
                      <textarea
                        ref={textareaRef}
                        value={editorCode}
                        onChange={(e) => setEditorCode(e.target.value)}
                        onKeyDown={handleEditorKeyDown}
                        onScroll={handleEditorScroll2}
                        className="flex-1 w-full p-5 bg-transparent text-zinc-100 font-mono text-sm sm:text-base leading-6 resize-none focus:outline-none focus:ring-0 whitespace-pre overflow-auto"
                        spellCheck={false}
                        placeholder="Write your code here..."
                      />
                    </div>

                    <div className="p-3 bg-[#141414] border-t border-[#262626] flex items-center justify-between text-xs text-zinc-400 shrink-0">
                      <span className="flex items-center gap-2">
                        <span>{editorLineCount} lines · {activeLang}</span>
                        {detectedErrorLine && (
                          <span className="text-rose-400 font-semibold flex items-center gap-1">
                            ● Error on Line {detectedErrorLine}
                          </span>
                        )}
                      </span>
                      <span>Shortcut: <kbd className="px-2 py-0.5 rounded bg-[#222222] border border-[#333333] text-zinc-200">Ctrl</kbd> + <kbd className="px-2 py-0.5 rounded bg-[#222222] border border-[#333333] text-zinc-200">Enter</kbd> to Run</span>
                    </div>
                  </div>

                  {/* Vertical Resizer Handle between Compiler IDE and Output Console */}
                  <div
                    onMouseDown={startVResizing}
                    className="h-3 flex items-center justify-center cursor-row-resize group shrink-0 select-none px-4 my-1.5"
                    title="Drag up/down to resize Compiler and Output"
                  >
                    <div
                      className={`h-1 w-20 rounded-full transition-colors ${
                        isVResizing ? 'bg-[#81FF89]' : 'bg-[#2E2E2E] group-hover:bg-[#81FF89]'
                      }`}
                    />
                  </div>

                  {/* COMPILER OUTPUT DIRECTLY BELOW IDE (BOTTOM) */}
                  <div
                    style={isDesktop ? { height: `calc(${100 - compilerHeightPct}% - 0.875rem)` } : undefined}
                    className="bg-[#141414] border border-[#262626] rounded-[26px] overflow-hidden flex flex-col shadow-2xl min-h-[160px] shrink-0"
                  >
                    <div className="p-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between text-sm font-mono text-zinc-300 shrink-0">
                      <div className="flex items-center gap-2.5">
                        <Laptop className="w-4 h-4 text-[#80FFF9]" />
                        <span className="font-bold text-white text-base">Execution Console / Output</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTerminalOutput('');
                          setTerminalError('');
                        }}
                        className="hover:text-white transition text-xs py-1 px-3 rounded-full bg-[#202020] border border-[#2E2E2E]"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="flex-1 p-5 bg-[#101010] font-mono text-sm sm:text-base text-zinc-200 overflow-y-auto space-y-2 whitespace-pre-wrap min-h-[100px]">
                      {terminalOutput && (
                        <div className="text-[#81FF89] font-medium leading-relaxed">{terminalOutput}</div>
                      )}
                      {terminalError && (
                        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 leading-relaxed">
                          {terminalError}
                        </div>
                      )}
                      {!terminalOutput && !terminalError && (
                        <div className="text-zinc-500 italic">
                          Click &quot;Run Code&quot; or &quot;Try it yourself&quot; to execute and see output here.
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-[#141414] border-t border-[#262626] flex items-center justify-between text-xs text-zinc-400 shrink-0">
                      <span>Status: {isRunning ? 'Executing...' : 'Ready'}</span>
                      <span className="text-xs">In-Browser Execution Sandbox</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals for Standardized Template & Content Upload */}
      {showTemplateModal && (
        <KidsCourseTemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          language={activeLang}
        />
      )}

      {showUploadModal && (
        <KidsCourseUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          language={activeLang}
          onCourseAdded={reloadCustomLessons}
        />
      )}
    </div>
  );
}

export default function KidsCodingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111111] p-8 text-white">Loading Courses...</div>}>
      <KidsCoursesContent />
    </Suspense>
  );
}
