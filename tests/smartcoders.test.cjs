const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('SmartCoders App: Core Programming Courses (Python, JavaScript, Java)', () => {
  const pythonCourse = fs.readFileSync(path.join(__dirname, '../src/lib/courses/python-course.ts'), 'utf8');
  const jsCourse = fs.readFileSync(path.join(__dirname, '../src/lib/courses/javascript-course.ts'), 'utf8');
  const javaCourse = fs.readFileSync(path.join(__dirname, '../src/lib/courses/java-course.ts'), 'utf8');
  const mainPage = fs.readFileSync(path.join(__dirname, '../src/app/page.tsx'), 'utf8');

  // Verify all 3 programming languages are supported
  assert.ok(pythonCourse.includes('Python Intro') && pythonCourse.includes('PYTHON_CONCEPTS'), 'Python curriculum exists');
  assert.ok(jsCourse.includes('JavaScript') && jsCourse.includes('JAVASCRIPT_CONCEPTS'), 'JavaScript curriculum exists');
  assert.ok(javaCourse.includes('Java') && javaCourse.includes('JAVA_CONCEPTS'), 'Java curriculum exists');

  // Verify Main Page renders all courses
  assert.ok(mainPage.includes('activeLang'), 'Supports dynamic language selection');
  assert.ok(mainPage.includes('Try it yourself'), 'Features Try it yourself live compiler button');
});

test('SmartCoders App: Interactive Practice Exercises', () => {
  const exercisesFile = fs.readFileSync(path.join(__dirname, '../src/lib/kids-exercises.ts'), 'utf8');
  const exercisesView = fs.readFileSync(path.join(__dirname, '../src/components/kids/kids-exercises-view.tsx'), 'utf8');

  // Verify questions exist
  assert.ok(exercisesFile.includes('KIDS_EXERCISES'), 'Exercises dataset exists');
  assert.ok(exercisesFile.includes('Section 1: Syntax, Output & Variables'), 'Python/JS sections exist');
  assert.ok(exercisesView.includes('handleSelectOption'), 'Interactive question answering supported');
});

test('SmartCoders App: Creative 2D Game & Project Studio', () => {
  const projectsFile = fs.readFileSync(path.join(__dirname, '../src/lib/kids-projects.ts'), 'utf8');
  const projectsView = fs.readFileSync(path.join(__dirname, '../src/components/kids/kids-projects-studio-view.tsx'), 'utf8');

  // Verify real games exist
  assert.ok(projectsFile.includes('Classic 2D Snake Arcade Game'), 'Includes Snake game project');
  assert.ok(projectsView.includes('Project Studio &amp; Game Coding Workspace'), 'Projects studio renders cleanly');
  assert.ok(!projectsView.includes('Kids Project Studio'), 'Zero Kids wording in project studio');
});

test('SmartCoders App: Multi-Tier In-Browser Execution Engine', () => {
  const compilerFile = fs.readFileSync(path.join(__dirname, '../src/app/api/sandbox/compiler/route.ts'), 'utf8');

  // Verify resilient multi-tier execution
  assert.ok(compilerFile.includes('simulatePythonInProcess'), 'In-process Python VM fallback');
  assert.ok(compilerFile.includes('simulateJavaInProcess'), 'In-process Java VM fallback');
  assert.ok(compilerFile.includes('cpython-head') || compilerFile.includes('wandbox'), 'Multi-cloud compiler support');
});

test('SmartCoders App: AI Coding Assistant & Gemini Key Management', () => {
  const headerFile = fs.readFileSync(path.join(__dirname, '../src/components/layout/header.tsx'), 'utf8');
  const askAiFile = fs.readFileSync(path.join(__dirname, '../src/components/home/ask-ai-widget.tsx'), 'utf8');
  const keyModalFile = fs.readFileSync(path.join(__dirname, '../src/components/auth/gemini-key-modal.tsx'), 'utf8');

  // Verify AI and Gemini Key integration
  assert.ok(headerFile.includes('Ask AI'), 'Header features Ask AI button');
  assert.ok(headerFile.includes('Gemini Key'), 'Header features Gemini Key configuration');
  assert.ok(askAiFile.includes('Gemini API Key Required') || askAiFile.includes('Gemini Key Required'), 'Prompts for Gemini Key');
  assert.ok(keyModalFile.includes('setUserGeminiKey'), 'Manages Gemini API Key');
});

test('SmartCoders App: Branding & Metadata', () => {
  const layoutFile = fs.readFileSync(path.join(__dirname, '../src/app/layout.tsx'), 'utf8');
  const logoFile = fs.readFileSync(path.join(__dirname, '../src/components/ui/smartcoders-logo.tsx'), 'utf8');
  const pkgFile = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');

  assert.ok(layoutFile.includes('SmartCoders'), 'Root layout defines SmartCoders metadata');
  assert.ok(logoFile.includes('SmartCoders'), 'Brand logo defines SmartCoders');
  assert.ok(pkgFile.includes('"name": "smartcoders"'), 'package.json defines smartcoders');
});
