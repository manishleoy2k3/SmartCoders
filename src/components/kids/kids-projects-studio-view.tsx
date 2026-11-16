'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Play,
  RotateCcw,
  Save,
  Download,
  Sparkles,
  Trophy,
  Rocket,
  Terminal,
  Laptop,
  Check,
  Code2,
  ChevronRight,
  Lightbulb,
  Layers,
  Copy,
  Info,
} from 'lucide-react';
import { KIDS_PROJECTS, ProjectTemplate } from '@/lib/kids-projects';
import { QADatabase } from '@/lib/qa-db';
import { UserProfile } from '@/types/qa';

interface KidsProjectsStudioViewProps {
  language: 'python' | 'javascript' | 'java';
  onSwitchLanguage?: (lang: 'python' | 'javascript' | 'java') => void;
}

export default function KidsProjectsStudioView({ language }: KidsProjectsStudioViewProps) {
  const templates = KIDS_PROJECTS[language] || [];
  const [selectedProjectId, setSelectedProjectId] = useState<string>(templates[0]?.id || 'custom');
  const [editorCode, setEditorCode] = useState<string>(templates[0]?.starterCode || '');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [terminalError, setTerminalError] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const activeProject: ProjectTemplate | undefined =
    templates.find((p) => p.id === selectedProjectId) || templates[0];

  // Load saved code from Database for the active user & active project
  useEffect(() => {
    const loadProjectCode = async () => {
      const user = QADatabase.getCurrentUser();
      setCurrentUser(user);
      const uid = user ? user.id : 'usr_guest';

      if (activeProject) {
        try {
          // 1. Check user-scoped record in QADatabase
          const savedCode = await QADatabase.getUserProjectCode(uid, language, activeProject.id);
          if (savedCode) {
            setEditorCode(savedCode);
            setTerminalOutput(`Loaded saved project code from Database for "${activeProject.title}". Click "Run Project" to play!`);
            setTerminalError('');
            return;
          }

          // 2. Try server database endpoint
          const res = await fetch(`/api/db/user-data?userId=${encodeURIComponent(uid)}&type=project&language=${language}&projectId=${encodeURIComponent(activeProject.id)}`).catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            if (data?.record?.code) {
              setEditorCode(data.record.code);
              setTerminalOutput(`Loaded saved project code from Database for "${activeProject.title}". Click "Run Project" to play!`);
              setTerminalError('');
              return;
            }
          }

          // Default fallback to starter template
          setEditorCode(activeProject.starterCode);
          setTerminalOutput(`Ready to play "${activeProject.title}". Click "Run Project" to start!`);
          setTerminalError('');
        } catch {
          setEditorCode(activeProject.starterCode);
          setTerminalOutput(`Ready to play "${activeProject.title}". Click "Run Project" to start!`);
          setTerminalError('');
        }
      }
    };

    loadProjectCode();

    // Listen for auth changes (login / logout) to reload code for the authenticated user and prevent cross-user leakage
    const handleAuthChange = () => {
      loadProjectCode();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('intelligentqa_auth_changed', handleAuthChange);
      return () => {
        window.removeEventListener('intelligentqa_auth_changed', handleAuthChange);
      };
    }
  }, [selectedProjectId, language]);

  // Synchronized scrolling for line numbers
  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to run
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunProject();
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

  // Save project code to Database
  const handleSaveProject = async () => {
    if (activeProject) {
      const uid = currentUser ? currentUser.id : 'usr_guest';
      await QADatabase.saveUserProjectCode(uid, language, activeProject.id, editorCode);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    }
  };

  // Reset to original template starter
  const handleResetToTemplate = async () => {
    if (activeProject && window.confirm(`Reset code for "${activeProject.title}" in database to original template?`)) {
      setEditorCode(activeProject.starterCode);
      setTerminalOutput('Reset to original project blueprint.');
      setTerminalError('');
      const uid = currentUser ? currentUser.id : 'usr_guest';
      await QADatabase.resetUserProjectCode(uid, language, activeProject.id);
    }
  };

  // Download code as a standalone script
  const handleDownloadScript = () => {
    const ext = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'java';
    const filename = `${activeProject?.id || 'game_project'}.${ext}`;
    const blob = new Blob([editorCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Run project via multi-tier backend execution engine
  const handleRunProject = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalOutput(`Compiling and executing "${activeProject?.title || 'Game Project'}"...`);
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
          language,
          code: editorCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setTerminalError(data.error || 'Execution encountered an issue.');
        setTerminalOutput('');
      } else if (!data.success && data.stderr && !data.stdout) {
        setTerminalError(data.stderr);
        setTerminalOutput('');
      } else {
        const out = data.stdout || (data.stderr ? '' : 'Program completed with no standard output.');
        if (data.stderr) {
          setTerminalError(data.stderr);
        }
        setTerminalOutput(out);
      }
    } catch (err: any) {
      setTerminalError(err.message || 'Execution failed.');
      setTerminalOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const lineCount = editorCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <Gamepad2 className="w-4 h-4" />
              <span>Project Studio &amp; Game Coding Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>Build Real Games &amp; Apps with {language.toUpperCase()}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Apply everything you learned in the programming lessons to build playable games, interactive simulators, and creative applications!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentUser ? `DB: ${currentUser.displayName || currentUser.email}` : 'DB: Guest Mode'}</span>
            </div>

            <button
              type="button"
              onClick={handleSaveProject}
              className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                savedFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
              }`}
              title="Save project progress to database"
            >
              {savedFeedback ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedFeedback ? 'Saved to DB!' : 'Save Game'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadScript}
              className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Download source code to your computer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Selector Gallery */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Choose a Project Blueprint</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((project) => {
            const isSelected = selectedProjectId === project.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedProjectId(project.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        project.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{project.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{project.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span>{isSelected ? '● Active Studio' : 'Load Project'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Coding Workspace & Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Full Code Editor (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
          {/* Action Bar */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white font-mono">
                {activeProject?.title || 'Coding Workspace'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToTemplate}
                className="py-1 px-2.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1 transition"
                title="Reset to starter blueprint"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={handleRunProject}
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Project'}</span>
              </button>
            </div>
          </div>

          {/* Editor Area with Line Numbers */}
          <div className="flex bg-slate-950 font-mono text-xs sm:text-sm relative min-h-[420px] max-h-[580px] overflow-hidden">
            {/* Gutter */}
            <div
              ref={lineNumbersRef}
              className="w-12 py-4 px-2 bg-slate-900/60 text-slate-500 text-right select-none border-r border-slate-800 shrink-0 overflow-hidden font-mono text-xs leading-6"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6 pr-1 text-slate-600">
                  {num}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              onKeyDown={handleEditorKeyDown}
              onScroll={handleEditorScroll}
              className="flex-1 w-full p-4 bg-transparent text-slate-200 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none focus:ring-0 whitespace-pre overflow-auto"
              spellCheck={false}
              placeholder="Write your game code here..."
            />
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>{lineCount} lines · {language.toUpperCase()} Game Studio</span>
            <span>Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Enter</kbd> to Run</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Execution Console & Project Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Output Terminal */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white">Game Output / Live Console</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTerminalOutput('');
                  setTerminalError('');
                }}
                className="hover:text-slate-200 transition text-[11px]"
              >
                Clear
              </button>
            </div>

            <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 min-h-[220px] max-h-[320px] overflow-y-auto space-y-2 whitespace-pre-wrap">
              {terminalOutput && (
                <div className="text-emerald-400 font-semibold">{terminalOutput}</div>
              )}
              {terminalError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {terminalError}
                </div>
              )}
              {!terminalOutput && !terminalError && (
                <div className="text-slate-600 italic">
                  Click &quot;Run Project&quot; above to play your game and view console output!
                </div>
              )}
            </div>

            <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: {isRunning ? 'Executing...' : 'Ready'}</span>
              <span className="text-[10px]">Real-Time Execution Sandbox</span>
            </div>
          </div>

          {/* Project Mission & Extension Challenges */}
          {activeProject && (
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-3.5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-amber-400" />
                  <span>Project Blueprint Guide</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Concepts Used */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Concepts Applied:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.conceptsUsed.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700/80"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extension Challenges */}
              {activeProject.instructions && activeProject.instructions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Level Up Challenges:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activeProject.instructions.map((inst, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
