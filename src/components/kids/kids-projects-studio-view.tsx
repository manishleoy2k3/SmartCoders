'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Play,
  RotateCcw,
  Save,
  Download,
  Sparkles,
  Rocket,
  Terminal,
  Laptop,
  Check,
  ChevronRight,
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
          const savedCode = await QADatabase.getUserProjectCode(uid, language, activeProject.id);
          if (savedCode) {
            setEditorCode(savedCode);
            setTerminalOutput(`Loaded saved progress for "${activeProject.title}".`);
          } else {
            setEditorCode(activeProject.starterCode);
            setTerminalOutput(`Loaded "${activeProject.title}" starter blueprint.`);
          }
          setTerminalError('');
        } catch {
          setEditorCode(activeProject.starterCode);
        }
      }
    };

    loadProjectCode();
  }, [selectedProjectId, language, activeProject?.id]);

  // Synchronized scroll handlers
  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Keyboard shortcut & Tab indentation support
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

  // Save current project code to database
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Studio Header Banner - Emergent Scale */}
      <div className="p-8 sm:p-10 rounded-[28px] bg-gradient-to-b from-[#181818] via-[#141414] to-[#101010] border border-[#262626] shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#81FF89] font-mono">
              <Gamepad2 className="w-4 h-4" />
              <span>Project Studio &amp; Game Coding Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight emergent-headline">
              Build Real Games &amp; Apps with {language.toUpperCase()}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
              Apply everything you learned in the programming lessons to build playable games, interactive simulators, and creative applications!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-mono text-[#81FF89] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#81FF89] animate-pulse" />
              <span>{currentUser ? `Saved: ${currentUser.displayName || currentUser.email}` : 'Guest Mode'}</span>
            </div>

            <button
              type="button"
              onClick={handleSaveProject}
              className={`py-2 px-4 rounded-full font-semibold text-sm flex items-center gap-2 transition cursor-pointer shadow-sm ${
                savedFeedback
                  ? 'bg-[#81FF89] text-black font-bold'
                  : 'bg-[#1A1A1A] hover:bg-[#222222] text-zinc-200 border border-[#2A2A2A]'
              }`}
              title="Save project progress to database"
            >
              {savedFeedback ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedFeedback ? 'Saved!' : 'Save Game'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadScript}
              className="py-2 px-4 rounded-full bg-[#1A1A1A] hover:bg-[#222222] text-zinc-200 border border-[#2A2A2A] font-semibold text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
              title="Download source code to your computer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Selector Gallery - Emergent Card Scale */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#81FF89]" />
          <span>Choose a Project Blueprint</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((project) => {
            const isSelected = selectedProjectId === project.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedProjectId(project.id)}
                className={`p-5 rounded-[22px] border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-[#18201a] border-[#81FF89] shadow-[0_0_20px_rgba(129,255,137,0.15)] ring-1 ring-[#81FF89]'
                    : 'bg-[#161616] border-[#262626] hover:border-[#383838] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                        project.difficulty === 'Beginner'
                          ? 'bg-[#81FF89]/15 text-[#81FF89] border border-[#81FF89]/30'
                          : 'bg-[#80FFF9]/15 text-[#80FFF9] border border-[#80FFF9]/30'
                      }`}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{project.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-semibold text-[#81FF89]">
                  <span>{isSelected ? '● Active Studio' : 'Load Project'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Coding Workspace & Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Full Code Editor (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#262626] rounded-[26px] overflow-hidden shadow-2xl flex flex-col">
          {/* Action Bar */}
          <div className="p-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-[#81FF89]" />
              <span className="font-bold text-white font-mono text-base">
                {activeProject?.title || 'Coding Workspace'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetToTemplate}
                className="py-1.5 px-3.5 rounded-full text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 bg-[#202020] border border-[#2C2C2C] transition"
                title="Reset to starter blueprint"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={handleRunProject}
                className="py-2 px-6 bg-[#81FF89] hover:bg-[#97FFA0] disabled:opacity-60 text-black font-bold rounded-full text-sm flex items-center gap-2 shadow-[0_2px_15px_rgba(129,255,137,0.35)] transition active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Project'}</span>
              </button>
            </div>
          </div>

          {/* Editor Area with Line Numbers */}
          <div className="flex bg-[#101010] font-mono text-sm sm:text-base relative min-h-[460px] max-h-[620px] overflow-hidden">
            {/* Gutter */}
            <div
              ref={lineNumbersRef}
              className="w-12 py-5 px-2 bg-[#141414] text-zinc-500 text-right select-none border-r border-[#262626] shrink-0 overflow-hidden font-mono text-sm leading-6"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6 pr-1 text-zinc-600">
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
              className="flex-1 w-full p-5 bg-transparent text-zinc-100 font-mono text-sm sm:text-base leading-6 resize-none focus:outline-none focus:ring-0 whitespace-pre overflow-auto"
              spellCheck={false}
              placeholder="Write your game code here..."
            />
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-[#141414] border-t border-[#262626] flex items-center justify-between text-xs text-zinc-400">
            <span>{lineCount} lines · {language.toUpperCase()} Game Studio</span>
            <span>Shortcut: <kbd className="px-2 py-0.5 rounded bg-[#222222] border border-[#333333] text-zinc-200">Ctrl</kbd> + <kbd className="px-2 py-0.5 rounded bg-[#222222] border border-[#333333] text-zinc-200">Enter</kbd> to Run</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Execution Console & Project Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Output Terminal */}
          <div className="bg-[#141414] border border-[#262626] rounded-[26px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between text-sm font-mono text-zinc-300">
              <div className="flex items-center gap-2.5">
                <Laptop className="w-4 h-4 text-[#80FFF9]" />
                <span className="font-bold text-white text-base">Game Output / Live Console</span>
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

            <div className="p-5 bg-[#101010] font-mono text-sm sm:text-base text-zinc-200 min-h-[240px] max-h-[340px] overflow-y-auto space-y-2 whitespace-pre-wrap">
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
                  Click &quot;Run Project&quot; above to play your game and view console output!
                </div>
              )}
            </div>

            <div className="p-3 bg-[#141414] border-t border-[#262626] flex items-center justify-between text-xs text-zinc-400">
              <span>Status: {isRunning ? 'Executing...' : 'Ready'}</span>
              <span className="text-xs">Real-Time Execution Sandbox</span>
            </div>
          </div>

          {/* Project Mission & Extension Challenges */}
          {activeProject && (
            <div className="p-6 rounded-[26px] bg-[#161616] border border-[#262626] shadow-xl space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2.5">
                  <Rocket className="w-5 h-5 text-[#81FF89]" />
                  <span>Project Blueprint Guide</span>
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Concepts Used */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Concepts Applied:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeProject.conceptsUsed.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-xs font-mono border border-white/10"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extension Challenges */}
              {activeProject.instructions && activeProject.instructions.length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-[#262626]">
                  <span className="text-xs font-bold text-[#81FF89] uppercase tracking-wider block">
                    Level Up Challenges:
                  </span>
                  <ul className="space-y-1.5 text-sm text-zinc-300">
                    {activeProject.instructions.map((inst, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#81FF89] shrink-0 mt-0.5" />
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
