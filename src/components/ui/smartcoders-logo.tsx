'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, Sparkles, Terminal } from 'lucide-react';

interface SmartCodersLogoProps {
  size?: number;
  showText?: boolean;
}

export default function SmartCodersLogo({ size = 28, showText = true }: SmartCodersLogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group select-none focus:outline-none">
      <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
        <Terminal className="w-5 h-5 text-white" />
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-black text-lg tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              SmartCoders
            </span>
          </div>
          <span className="text-[10px] font-semibold text-indigo-300/80 tracking-wide uppercase">
            Interactive Code &amp; Game Studio
          </span>
        </div>
      )}
    </Link>
  );
}
