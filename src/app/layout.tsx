import type { Metadata } from 'next';
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <SmartCodersHeader />
        <main className="min-h-[calc(100vh-64px)] flex flex-col">{children}</main>
        {/* Floating Ask AI Coding Assistant Widget */}
        <AskAIWidget />
      </body>
    </html>
  );
}
