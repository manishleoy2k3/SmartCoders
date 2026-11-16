'use client';

import React, { useState } from 'react';
import {
  X,
  FileDown,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Edit2,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Plus,
} from 'lucide-react';
import {
  CourseConcept,
  generateCourseImportTemplate,
  downloadCourseImportTemplate,
  saveCustomLesson,
} from '@/lib/kids-courses';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'python' | 'javascript' | 'java';
}

export function KidsCourseTemplateModal({ isOpen, onClose, language }: TemplateModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<'json' | 'csv' | null>(null);

  if (!isOpen) return null;

  const handleCopy = (format: 'json' | 'csv') => {
    const text = generateCourseImportTemplate(format, language);
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileDown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language.toUpperCase()} Course Import Template
              </h3>
              <p className="text-xs text-slate-400">
                Download standardized template with mandatory fields to import programming lessons.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Fields Guide */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
          <div className="font-bold text-slate-200">Mandatory Schema Fields:</div>
          <div className="grid grid-cols-2 gap-2 text-slate-400">
            <div><strong className="text-amber-400">Title</strong> (String): Lesson name</div>
            <div><strong className="text-amber-400">Module</strong> (String): Category / Chapter</div>
            <div><strong className="text-amber-400">Language</strong> (String): python | javascript | java</div>
            <div><strong className="text-amber-400">StarterCode</strong> (String): Code for compiler</div>
            <div><strong className="text-amber-400">Summary</strong> (String): What student learns</div>
            <div><strong className="text-amber-400">Exercise</strong> (String): Mission challenge task</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* JSON Download */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>JSON Format (.json)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Structured array format with complete code indentation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadCourseImportTemplate('json', language)}
                className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy('json')}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition"
                title="Copy JSON Template"
              >
                {copiedFormat === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* CSV Download */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>CSV / Excel Format (.csv)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                  Spreadsheet
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Comma-separated format compatible with Excel and Google Sheets.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadCourseImportTemplate('csv', language)}
                className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy('csv')}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition"
                title="Copy CSV Template"
              >
                {copiedFormat === 'csv' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'python' | 'javascript' | 'java';
  onCourseAdded: () => void;
}

export function KidsCourseUploadModal({ isOpen, onClose, language, onCourseAdded }: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [jsonInput, setJsonInput] = useState('');
  const [stagedLessons, setStagedLessons] = useState<CourseConcept[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Manual Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [overview, setOverview] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        parseAndStage(text, file.name);
      } catch (err: any) {
        setErrorMsg('Failed to parse file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const parseAndStage = (content: string, filename: string) => {
    try {
      if (filename.endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{')) {
        const parsed = JSON.parse(content);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const staged: CourseConcept[] = list.map((item, i) => ({
          id: `custom-${language}-${Date.now()}-${i}`,
          title: item.title || `Concept ${i + 1}`,
          order: 10 + i,
          language: language,
          summary: item.summary || 'Imported programming concept.',
          overview: item.overview || '',
          keyPoints: item.keyPoints || [],
          starterCode: item.starterCode || item.code || '# Write code here',
          solutionCode: item.solutionCode || '',
          bestPractices: item.bestPractices || [],
        }));
        setStagedLessons(prev => [...prev, ...staged]);
      } else {
        // Simple CSV parser
        const lines = content.split('\n').filter(Boolean);
        const staged: CourseConcept[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(s => s.replace(/^"|"$/g, '').trim());
          if (parts[0]) {
            staged.push({
              id: `custom-${language}-${Date.now()}-${i}`,
              title: parts[0],
              order: 10 + i,
              language: language,
              summary: parts[2] || 'Imported concept',
              overview: parts[3] || '',
              keyPoints: [],
              starterCode: parts[4] || '',
              solutionCode: parts[5] || '',
              bestPractices: [],
            });
          }
        }
        setStagedLessons(prev => [...prev, ...staged]);
      }
    } catch (err: any) {
      setErrorMsg('Invalid template format. Please download and check the Import Template.');
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newLesson: CourseConcept = {
      id: `custom-${language}-${Date.now()}`,
      title: title.trim(),
      order: 10 + stagedLessons.length,
      language: language,
      summary: summary.trim() || 'Interactive programming concept.',
      overview: overview.trim() || '',
      keyPoints: [],
      starterCode: starterCode.trim() || '# Write code here',
      bestPractices: [],
    };

    if (editingIndex !== null) {
      const updated = [...stagedLessons];
      updated[editingIndex] = newLesson;
      setStagedLessons(updated);
      setEditingIndex(null);
    } else {
      setStagedLessons(prev => [...prev, newLesson]);
    }

    // Reset Form
    setTitle('');
    setSummary('');
    setOverview('');
    setStarterCode('');
  };

  const handleEditStaged = (index: number) => {
    const item = stagedLessons[index];
    setTitle(item.title);
    setSummary(item.summary);
    setOverview(item.overview || '');
    setStarterCode(item.starterCode);
    setEditingIndex(index);
    setActiveTab('manual');
  };

  const handleDeleteStaged = (index: number) => {
    setStagedLessons(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleConfirmAndSubmit = () => {
    stagedLessons.forEach(lesson => {
      saveCustomLesson(lesson);
    });
    setStagedLessons([]);
    onCourseAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Import {language.toUpperCase()} Course Content
              </h3>
              <p className="text-xs text-slate-400">
                Upload files or add lessons manually to expand the curriculum.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800/80 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              File Upload / Paste
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition ${
                activeTab === 'manual'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {editingIndex !== null ? 'Edit Staged Lesson' : 'Add Manually'}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'upload' ? (
            <div className="space-y-4">
              {/* Drop Area */}
              <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/40 group">
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-amber-400 transition" />
                <span className="text-xs font-bold text-slate-200 mt-2">
                  Click to browse or drop JSON / CSV course file
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Supports JSON and CSV exported with the Course Template
                </span>
                <input
                  type="file"
                  accept=".json,.csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Direct JSON Paste */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Or Paste JSON Data:</label>
                <textarea
                  rows={4}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste JSON array matching import template schema..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (jsonInput.trim()) {
                      parseAndStage(jsonInput, 'pasted.json');
                      setJsonInput('');
                    }
                  }}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Parse &amp; Stage Pasted Data
                </button>
              </div>
            </div>
          ) : (
            /* Manual Form */
            <form onSubmit={handleAddManual} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Lesson Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Secret Number Guessing Game"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Concept Overview</label>
                  <input
                    type="text"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="e.g. Detailed explanation of this concept"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Concept Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short explanation of what the concept teaches"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Starter Code</label>
                <textarea
                  rows={4}
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  placeholder="Code template loaded into the online compiler"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{editingIndex !== null ? 'Update Staged Lesson' : 'Add to Staged List'}</span>
              </button>
            </form>
          )}

          {/* Staged Content Review */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span>Staged Lessons for Review</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">
                  {stagedLessons.length} Staged
                </span>
              </span>
            </div>

            {stagedLessons.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-950/40">
                No lessons staged yet. Upload a template file or add a lesson manually above.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stagedLessons.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.summary}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditStaged(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                        title="Edit staged lesson"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStaged(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Delete staged lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={stagedLessons.length === 0}
            onClick={handleConfirmAndSubmit}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Add ({stagedLessons.length}) to Course</span>
          </button>
        </div>
      </div>
    </div>
  );
}
