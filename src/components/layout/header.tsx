'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Key, Gamepad2, CheckCircle2 } from 'lucide-react';
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
      <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-[#111111]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <SmartCodersLogo />

          {/* Emergent Center Pill Navigation */}
          <nav className="hidden lg:flex items-center gap-1 emergent-pill-nav p-1.5 shadow-lg">
            <Link
              href="/?lang=python"
              className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentLang === 'python' && !currentView
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Python</span>
            </Link>

            <Link
              href="/?lang=javascript"
              className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentLang === 'javascript' && !currentView
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>JavaScript</span>
            </Link>

            <Link
              href="/?lang=java"
              className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentLang === 'java' && !currentView
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Java</span>
            </Link>

            <div className="w-[1px] h-5 bg-[#2A2A2A] mx-1.5" />

            <Link
              href={`/?lang=${currentLang}&view=exercises`}
              className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentView === 'exercises'
                  ? 'bg-[#81FF89] text-black shadow-[0_0_15px_rgba(129,255,137,0.35)] font-bold'
                  : 'text-zinc-400 hover:text-[#81FF89]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Exercises</span>
            </Link>

            <Link
              href={`/?lang=${currentLang}&view=projects`}
              className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentView === 'projects'
                  ? 'bg-[#80FFF9] text-black shadow-[0_0_15px_rgba(128,255,249,0.35)] font-bold'
                  : 'text-zinc-400 hover:text-[#80FFF9]'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Game Studio</span>
            </Link>
          </nav>

          {/* Right Action Controls: Pill Buttons */}
          <div className="flex items-center gap-3">
            {/* Gemini Key Config Button */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className={`px-4 py-2.5 rounded-full text-[14px] font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                hasGeminiKey
                  ? 'bg-[#81FF89]/10 text-[#81FF89] border-[#81FF89]/35 hover:bg-[#81FF89]/20'
                  : 'bg-[#1A1A1A] hover:bg-[#242424] text-zinc-300 border-[#2E2E2E]'
              }`}
              title={hasGeminiKey ? 'Gemini Key Active' : 'Configure Gemini API Key'}
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">
                {hasGeminiKey ? 'Key Active' : 'API Key'}
              </span>
            </button>

            {/* Emergent White CTA Pill Button */}
            <button
              type="button"
              onClick={handleOpenAskAI}
              className="px-5 py-2.5 bg-white hover:bg-zinc-100 text-[#111111] font-semibold rounded-full text-[14px] flex items-center gap-2 shadow-[0_2px_14px_rgba(255,255,255,0.18)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Gemini Key Modal */}
      {showKeyModal && (
        <GeminiKeyModal
          isOpen={showKeyModal}
          onClose={() => setShowKeyModal(false)}
        />
      )}
    </>
  );
}
