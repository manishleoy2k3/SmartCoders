'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
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

export default function KidsExercisesView({ language }: KidsExercisesViewProps) {
  const courseExercises = KIDS_EXERCISES[language];
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Load user profile and user-scoped exercise progress from Database
  useEffect(() => {
    const fetchUserAndProgress = async () => {
      const user = QADatabase.getCurrentUser();
      setCurrentUser(user);
      const uid = user ? user.id : 'usr_guest';

      try {
        const record = await QADatabase.getUserExerciseProgress(uid, language);
        if (record && record.userAnswers) {
          setUserAnswers(record.userAnswers);
        } else {
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
  }, [language]);

  const handleSelectOption = async (questionId: string, optionIndex: number) => {
    const updated = { ...userAnswers, [questionId]: optionIndex };
    setUserAnswers(updated);

    const uid = currentUser ? currentUser.id : 'usr_guest';
    let correct = 0;
    allQuestions.forEach((q) => {
      if (updated[q.id] === q.correctIndex) correct++;
    });

    await QADatabase.saveUserExerciseProgress(uid, language, updated, correct, Object.keys(updated).length);
  };

  const handleResetProgress = async () => {
    if (confirm('Are you sure you want to reset your score and answer progress?')) {
      setUserAnswers({});
      setRevealedHints({});
      const uid = currentUser ? currentUser.id : 'usr_guest';
      await QADatabase.resetUserExerciseProgress(uid, language);
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner - Emergent Card Scale */}
      <div className="p-8 sm:p-10 rounded-[28px] bg-gradient-to-b from-[#181818] via-[#141414] to-[#101010] border border-[#262626] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#81FF89] font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Knowledge Quizzes · 4-5 Questions Per Section</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight emergent-headline">
              {courseExercises.title}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
              {courseExercises.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            <div className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-mono text-[#81FF89] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#81FF89] animate-pulse" />
              <span>{currentUser ? `Saved: ${currentUser.displayName || currentUser.email}` : 'Guest Mode'}</span>
            </div>

            <button
              type="button"
              onClick={handleResetProgress}
              className="py-2 px-4 rounded-full bg-[#1A1A1A] hover:bg-[#222222] text-zinc-300 border border-[#2A2A2A] text-sm font-medium flex items-center gap-2 transition cursor-pointer"
              title="Reset answers to try exercises again"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Scoreboard Metrics - Emergent Tile Sizing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#262626]">
          <div className="p-5 rounded-[20px] bg-[#1A1A1A] border border-[#2A2A2A]">
            <span className="text-xs text-zinc-400 font-medium block">Completed</span>
            <span className="text-2xl font-extrabold text-white">
              {answeredCount} <span className="text-sm text-zinc-500 font-normal">/ {totalQuestions}</span>
            </span>
          </div>

          <div className="p-5 rounded-[20px] bg-[#1A1A1A] border border-[#2A2A2A]">
            <span className="text-xs text-zinc-400 font-medium block">Score</span>
            <span className="text-2xl font-extrabold text-[#81FF89]">
              {correctCount} <span className="text-sm text-zinc-500 font-normal">correct</span>
            </span>
          </div>

          <div className="p-5 rounded-[20px] bg-[#1A1A1A] border border-[#2A2A2A]">
            <span className="text-xs text-zinc-400 font-medium block">Accuracy</span>
            <span className="text-2xl font-extrabold text-[#80FFF9]">
              {accuracyPct}%
            </span>
          </div>

          <div className="p-5 rounded-[20px] bg-[#1A1A1A] border border-[#2A2A2A]">
            <span className="text-xs text-zinc-400 font-medium block">Course Progress</span>
            <span className="text-2xl font-extrabold text-white">
              {progressPct}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#202020] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#80FFF9] via-[#81FF89] to-[#00FF37] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Section Navigation Tabs - Emergent Pill Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {courseExercises.sections.map((section, idx) => {
          const sectionQuestions = section.questions;
          const sectionAnswered = sectionQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
          const isSelected = selectedSectionIndex === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedSectionIndex(idx)}
              className={`py-2.5 px-4 rounded-full text-sm font-semibold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black shadow-md font-bold'
                  : 'bg-[#161616] border border-[#262626] text-zinc-300 hover:bg-[#202020]'
              }`}
            >
              <span>{section.name.split(':')[0]}</span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-black/15 text-inherit' : 'bg-[#222222] text-zinc-400'
                }`}
              >
                {sectionAnswered}/{sectionQuestions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Section Header */}
      <div className="space-y-5">
        <div className="p-5 sm:p-6 rounded-[22px] bg-[#161616] border border-[#262626] flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#81FF89]" />
              <span>{currentSection.name}</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-1">{currentSection.description}</p>
          </div>
          <span className="text-xs text-zinc-300 font-mono font-bold bg-[#202020] border border-[#2C2C2C] px-3 py-1.5 rounded-full">
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
              className={`emergent-card p-6 sm:p-8 space-y-5 transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-[#81FF89]/50 bg-[#141d16]'
                    : 'border-rose-500/40 bg-[#1c1214]'
                  : 'hover:border-[#333333]'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                      Q{qIndex + 1} · {q.topic}
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                          isCorrect
                            ? 'bg-[#81FF89]/20 text-[#81FF89] border border-[#81FF89]/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isCorrect ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white pt-1 leading-snug">
                    {q.question}
                  </h3>
                </div>

                {q.hint && (
                  <button
                    type="button"
                    onClick={() => toggleHint(q.id)}
                    className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-[#222222] transition shrink-0 cursor-pointer border border-transparent hover:border-[#333333]"
                    title="Click to toggle hint"
                  >
                    <Lightbulb className="w-4 h-4 text-[#81FF89]" />
                  </button>
                )}
              </div>

              {/* Code Snippet (if available) */}
              {q.codeSnippet && (
                <pre className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#262626] font-mono text-sm text-[#80FFF9] overflow-x-auto whitespace-pre leading-relaxed">
                  {q.codeSnippet}
                </pre>
              )}

              {/* Hint Callout (if toggled) */}
              {revealedHints[q.id] && q.hint && (
                <div className="p-4 rounded-2xl bg-[#81FF89]/10 border border-[#81FF89]/25 text-zinc-200 text-sm flex items-start gap-2.5 leading-relaxed">
                  <Lightbulb className="w-4 h-4 text-[#81FF89] shrink-0 mt-0.5" />
                  <span><strong>Hint:</strong> {q.hint}</span>
                </div>
              )}

              {/* Multiple Choice Options - Spacious Pill Rectangles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedAnswer === optIdx;
                  const isThisOptionCorrect = optIdx === q.correctIndex;

                  let optionStyle = 'bg-[#181818] border-[#2A2A2A] hover:border-[#3A3A3A] hover:bg-[#1E1E1E] text-zinc-200';
                  if (isAnswered) {
                    if (isThisOptionCorrect) {
                      optionStyle = 'bg-[#81FF89]/15 border-[#81FF89] text-[#81FF89] font-bold';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    } else {
                      optionStyle = 'bg-[#141414] border-[#222222] text-zinc-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-4 rounded-2xl border text-sm sm:text-base text-left transition flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#222222] flex items-center justify-center font-mono text-xs text-zinc-300 font-semibold shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswered && isThisOptionCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#81FF89] shrink-0" />
                      )}
                      {isAnswered && isSelected && !isThisOptionCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Dropdown on Answer */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                    isCorrect
                      ? 'bg-[#81FF89]/10 border-[#81FF89]/25 text-zinc-200'
                      : 'bg-[#141414] border-[#2A2A2A] text-zinc-300'
                  }`}
                >
                  <strong className={isCorrect ? 'text-[#81FF89]' : 'text-amber-400'}>
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
