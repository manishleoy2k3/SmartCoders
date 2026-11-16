import React from 'react';

export interface QABrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  textVariant?: 'full' | 'short';
  className?: string;
  sparkle?: boolean;
  showZeroCostBadge?: boolean;
}

export const QABrandLogo: React.FC<QABrandLogoProps> = ({
  size = 'md',
  showText = true,
  textVariant = 'full',
  className = '',
  sparkle = true,
  showZeroCostBadge = false,
}) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 28
      : size === 'md'
      ? 36
      : size === 'lg'
      ? 48
      : 64;

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Contemporary QA Brand Mark: Checkmark + Code Brackets + AI Spark */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="IntelligentQA Logo - Verified Code Augmented with AI"
      >
        <defs>
          {/* Main Slate & Tech Gradient */}
          <linearGradient id="qa-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B0F17" />
          </linearGradient>

          {/* Verification Checkmark (Emerald/Cyan Energy) */}
          <linearGradient id="check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Code Syntax Bracket (Sky Blue / Violet Glow) */}
          <linearGradient id="code-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* AI Neural Spark Gradient */}
          <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Soft outer glow */}
          <filter id="qa-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Squircle Container */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="url(#qa-bg-grad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Subtle grid pattern / matrix lines */}
        <line x1="8" y1="24" x2="40" y2="24" stroke="#1E293B" strokeWidth="0.75" strokeDasharray="2 2" />
        <line x1="24" y1="8" x2="24" y2="40" stroke="#1E293B" strokeWidth="0.75" strokeDasharray="2 2" />

        {/* 1. Left Code Syntax Bracket: < / { */}
        <path
          d="M15 14L9 24L15 34"
          stroke="url(#code-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Verification Checkmark: ✔ (Passionate Emerald) */}
        <path
          d="M17 25L23 31L35 15"
          stroke="url(#check-grad)"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#qa-glow)"
        />

        {/* 3. Right Code Syntax Bracket: > / } */}
        <path
          d="M33 14L39 24L33 34"
          stroke="url(#code-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* 4. The AI Neural Spark (✦) floating on top right */}
        {sparkle && (
          <g transform="translate(30, 6) scale(0.9)">
            <path
              d="M6 0C6 3.31 3.31 6 0 6C3.31 6 6 8.69 6 12C6 8.69 8.69 6 12 6C8.69 6 6 3.31 6 0Z"
              fill="url(#spark-grad)"
              filter="url(#qa-glow)"
            />
            <circle cx="6" cy="6" r="1.5" fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* Typography with clean Linear/Vercel style */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg">
              Intelligent<span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">QA</span>
            </span>
            {showZeroCostBadge && (
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Zero-Cost
              </span>
            )}
          </div>
          {textVariant === 'full' && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
              SDET & AI Transformation
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default QABrandLogo;
