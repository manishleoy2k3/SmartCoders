'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Sparkles } from 'lucide-react';

interface SmartCodersLogoProps {
  size?: number;
  showText?: boolean;
}

export default function SmartCodersLogo({ showText = true }: SmartCodersLogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3 group select-none focus:outline-none">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#81FF89]/60 transition-all duration-300 shadow-sm">
        <Terminal className="w-5 h-5 text-[#81FF89] group-hover:scale-110 transition-transform duration-200" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#81FF89] animate-pulse shadow-[0_0_8px_#81FF89]" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-white transition-colors">
              SmartCoders
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded-full bg-[#81FF89]/10 text-[#81FF89] border border-[#81FF89]/25">
              v1.0
            </span>
          </div>
          <span className="text-xs font-medium text-zinc-400 tracking-normal">
            Interactive Code &amp; Game Studio
          </span>
        </div>
      )}
    </Link>
  );
}
