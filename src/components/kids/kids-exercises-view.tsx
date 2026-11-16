'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Terminal,
  Code2,
  Laptop,
  Check,
  Lightbulb,
} from 'lucide-react';
import { KIDS_EXERCISES, ExerciseQuestion } from '@/lib/kids-exercises';
import { QADatabase } from '@/lib/qa-db';
import { UserProfile } from '@/types/qa';

interface KidsExercisesViewProps {
  language: 'python' | 'javascript' | 'java';
  onSwitchLanguage?: (lang: 'python' | 'javascript' | 'java') => void;
}

export default function KidsExercisesView({ language, onSwitchLanguage }: KidsExercisesViewProps) {
  const courseExercises = KIDS_EXERCISES[language];
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [dbSyncStatus, setDbSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');

  // Load user profile and user-scoped exercise progress from Database
  useEffect(() => {
    const fetchUserAndProgress = async () => {
      const user = QADatabase.getCurrentUser();
      setCurrentUser(user);
      const uid = user ? user.id : 'usr_guest';

      try {
        // 1. Load from QADatabase (Row-Level Security: scoped to user.id)
        const record = await QADatabase.getUserExerciseProgress(uid, language);
        if (record && record.userAnswers) {
          setUserAnswers(record.userAnswers);
        } else {
          // If no local record, try server database endpoint
          const res = await fetch(`/api/db/user-data?userId=${encodeURIComponent(uid)}&type=exercises&language=${language}`).catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            if (data?.record?.userAnswers) {
              setUserAnswers(data.record.userAnswers);
            } else {
              setUserAnswers({});
            }
          } else {
            setUserAnswers({});
          }
        }
      } catch {
        setUserAnswers({});
      }
    };

    fetchUserAndProgress();

    // Listen for auth changes (login / logout) to switch user records immediately with zero data leakage
    const handleAuthChange = () => {
      fetchUserAndProgress();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('intelligentqa_auth_changed', handleAuthChange);
      return () => {
        window.removeEventListener('intelligentqa_auth_changed', handleAuthChange);
      };
    }
  }, [language]);

  const handleSelectOption = async (questionId: string, optionIndex: number) => {
    const updated = { ...userAnswers, [questionId]: optionIndex };
    setUserAnswers(updated);
    setDbSyncStatus('saving');

    const uid = currentUser ? currentUser.id : 'usr_guest';

    // Calculate score
    const allQuestions = courseExercises.sections.flatMap((s) => s.questions);
    let correct = 0;
    allQuestions.forEach((q) => {
      if (updated[q.id] === q.correctIndex) correct++;
    });
    const answeredCount = Object.keys(updated).length;

    // Persist to Database with strict userId scoping
    try {
      await QADatabase.saveUserExerciseProgress(uid, language, updated, correct, answeredCount);
      setDbSyncStatus('synced');
    } catch {
      setDbSyncStatus('offline');
    }
  };

  const handleResetProgress = async () => {
    if (window.confirm(`Are you sure you want to reset all your ${courseExercises.title} answers in the database?`)) {
      setUserAnswers({});
      setRevealedHints({});
      const uid = currentUser ? currentUser.id : 'usr_guest';
      await QADatabase.resetUserExerciseProgress(uid, language);
      setDbSyncStatus('synced');
    }
  };

  const toggleHint = (questionId: string) => {
    setRevealedHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Calculate overall metrics
  const allQuestions: ExerciseQuestion[] = courseExercises.sections.flatMap((s) => s.questions);
  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;

  let correctCount = 0;
  allQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correctIndex) {
      correctCount++;
    }
  });

  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const currentSection = courseExercises.sections[selectedSectionIndex] || courseExercises.sections[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Knowledge Quizzes · 4-5 Questions Per Section</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>{courseExercises.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {courseExercises.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <div className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentUser ? `DB Saved: ${currentUser.displayName || currentUser.email}` : 'DB: Guest Mode'}</span>
            </div>

            <button
              type="button"
              onClick={handleResetProgress}
              className="py-1.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Reset answers in database to try exercises again"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>
          </div>
        </div>

        {/* Scoreboard Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Completed</span>
            <span className="text-lg font-black text-white">
              {answeredCount} <span className="text-xs text-slate-500 font-normal">/ {totalQuestions}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Score</span>
            <span className="text-lg font-black text-emerald-400">
              {correctCount} <span className="text-xs text-slate-500 font-normal">correct</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Accuracy</span>
            <span className="text-lg font-black text-amber-400">
              {accuracyPct}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Course Progress</span>
            <span className="text-lg font-black text-cyan-400">
              {progressPct}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {courseExercises.sections.map((section, idx) => {
          const sectionQuestions = section.questions;
          const sectionAnswered = sectionQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
          const isSelected = selectedSectionIndex === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedSectionIndex(idx)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <span>{section.name.split(':')[0]}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-black/20 text-inherit' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sectionAnswered}/{sectionQuestions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Section Questions */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{currentSection.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{currentSection.description}</p>
          </div>
          <span className="text-xs text-slate-400 font-mono font-bold bg-slate-800 px-2.5 py-1 rounded-lg">
            {currentSection.questions.length} Questions
          </span>
        </div>

        {/* Questions Cards */}
        {currentSection.questions.map((q, qIndex) => {
          const selectedAnswer = userAnswers[q.id];
          const isAnswered = selectedAnswer !== undefined;
          const isCorrect = isAnswered && selectedAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-750'
              } shadow-sm space-y-4`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Q{qIndex + 1} · {q.topic}
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isCorrect ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white pt-1">
                    {q.question}
                  </h3>
                </div>

                {q.hint && (
                  <button
                    type="button"
                    onClick={() => toggleHint(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition text-xs shrink-0 cursor-pointer"
                    title="Click to toggle hint"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Code Snippet (if available) */}
              {q.codeSnippet && (
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                  {q.codeSnippet}
                </pre>
              )}

              {/* Hint Callout (if toggled) */}
              {revealedHints[q.id] && q.hint && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Hint:</strong> {q.hint}</span>
                </div>
              )}

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedAnswer === optIdx;
                  const isThisOptionCorrect = optIdx === q.correctIndex;

                  let optionStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (isAnswered) {
                    if (isThisOptionCorrect) {
                      optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                    } else {
                      optionStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between gap-2 cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400 shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswered && isThisOptionCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isThisOptionCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Dropdown on Answer */}
              {isAnswered && (
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <strong className={isCorrect ? 'text-emerald-400' : 'text-amber-400'}>
                    Explanation:
                  </strong>{' '}
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
