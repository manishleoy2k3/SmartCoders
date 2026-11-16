export interface CourseConcept {
  id: string;
  title: string;
  order: number;
  language: 'python' | 'javascript' | 'java';
  summary: string;
  overview: string;
  keyPoints: string[];
  starterCode: string;
  solutionCode?: string;
  bestPractices: string[];
}

export interface LanguageCourseMeta {
  id: 'python' | 'javascript' | 'java';
  name: string;
  version: string;
  tagline: string;
  badge: string;
  accentColor: string;
  badgeColor: string;
  description: string;
  whyLearn: string[];
  useCases: string[];
  executionModel: string;
  concepts: CourseConcept[];
}
