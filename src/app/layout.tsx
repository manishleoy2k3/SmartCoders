import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import SmartCodersHeader from '@/components/layout/header';
import AskAIWidget from '@/components/home/ask-ai-widget';

export const metadata: Metadata = {
  title: 'SmartCoders - Interactive Programming Tutorials, Exercises & Game Studio',
  description:
    'Master Python, JavaScript, and Java from scratch with live in-browser execution sandboxes, interactive knowledge testing exercises, and creative 2D game projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#111111] text-[#FFFFFF] font-sans antialiased selection:bg-[#81FF89]/30 selection:text-[#81FF89]">
        <Suspense fallback={<header className="h-20 bg-[#111111] border-b border-[#262626]" />}>
          <SmartCodersHeader />
        </Suspense>
        <main className="min-h-[calc(100vh-80px)] flex flex-col">{children}</main>
        {/* Floating Ask AI Coding Assistant Widget */}
        <AskAIWidget />
      </body>
    </html>
  );
}
