'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Key, Gamepad2, CheckCircle2, Code2, Terminal } from 'lucide-react';
import SmartCodersLogo from '@/components/ui/smartcoders-logo';
import GeminiKeyModal from '@/components/auth/gemini-key-modal';
import { QADatabase } from '@/lib/qa-db';

export default function SmartCodersHeader() {
  const searchParams = useSearchParams();
  const currentLang = searchParams?.get('lang') || 'python';
  const currentView = searchParams?.get('view') || '';

  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkKey = () => {
        const key = QADatabase.getUserGeminiKey();
        setHasGeminiKey(Boolean(key));
      };
      checkKey();
      window.addEventListener('intelligentqa_key_changed', checkKey);
      return () => window.removeEventListener('intelligentqa_key_changed', checkKey);
    }
  }, []);

  const handleOpenAskAI = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('intelligentqa_open_ask_ai'));
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <SmartCodersLogo />

          {/* Quick Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80 text-xs font-semibold">
            <Link
              href="/?lang=python"
              className={`px-3 py-1.5 rounded-xl transition ${
                currentLang === 'python' && !currentView
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🐍 Python
            </Link>
            <Link
              href="/?lang=javascript"
              className={`px-3 py-1.5 rounded-xl transition ${
                currentLang === 'javascript' && !currentView
                  ? 'bg-yellow-500/20 text-yellow-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ JavaScript
            </Link>
            <Link
              href="/?lang=java"
              className={`px-3 py-1.5 rounded-xl transition ${
                currentLang === 'java' && !currentView
                  ? 'bg-orange-500/20 text-orange-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ☕ Java
            </Link>
            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
            <Link
              href={`/?lang=${currentLang}&view=exercises`}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                currentView === 'exercises'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exercises</span>
            </Link>
            <Link
              href={`/?lang=${currentLang}&view=projects`}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                currentView === 'projects'
                  ? 'bg-purple-500/20 text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Game Studio</span>
            </Link>
          </nav>

          {/* Right Header Controls: Ask AI & Gemini Key */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gemini Key Config Button */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                hasGeminiKey
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-700/80'
              }`}
              title={hasGeminiKey ? 'Gemini Key Configured' : 'Configure Gemini API Key for AI features'}
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {hasGeminiKey ? 'Gemini Key Active' : 'Gemini Key'}
              </span>
            </button>

            {/* Ask AI Button */}
            <button
              type="button"
              onClick={handleOpenAskAI}
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Gemini Key Configuration Modal */}
      {showKeyModal && (
        <GeminiKeyModal
          isOpen={showKeyModal}
          onClose={() => setShowKeyModal(false)}
        />
      )}
    </>
  );
}
