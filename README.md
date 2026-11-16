# 🚀 SmartCoders

**SmartCoders** is a modern, standalone, interactive programming education platform designed for learning **Python, JavaScript, and Java** from scratch through hands-on coding, live in-browser compiler execution, interactive knowledge exercises, and creative 2D game development.

---

## 🌟 Key Features

1. **Structured Programming Tracks**:
   - 🐍 **Python 3**: 30 comprehensive lessons covering syntax, data types, numbers, casting, strings, booleans, operators, lists, tuples, sets, dictionaries, if/else, match, loops, functions, range, arrays, iterators, modules, and OOP.
   - ⚡ **JavaScript (ES2024+)**: 27 lessons covering modern variables (`let`/`const`), template literals, arrow functions, arrays, objects, destructuring, promises, async/await, and DOM manipulation.
   - ☕ **Java 21**: 29 lessons covering JVM basics, data types, control flow, loops, OOP (Encapsulation, Inheritance, Polymorphism, Abstraction), interfaces, collections, and exceptions.

2. **Split-Screen In-Browser Compiler IDE**:
   - Live code editing with synchronized line numbers and error diagnostics.
   - Resizable split panels (Horizontal: Concept vs. Compiler; Vertical: Code Editor vs. Terminal Console).
   - Multi-tier resilient code execution (local Node/Python/JDK, cloud mirrors, and zero-dependency in-process VM fallback).

3. **Interactive Knowledge Testing Exercises**:
   - 4–5 practice questions per section for testing comprehension.
   - Real-time evaluation, instant answer explanations, hints, and score tracking.

4. **Creative 2D Game & Project Studio**:
   - 9 complete, playable projects including classic arcade games:
     - 🐍 Classic 2D Snake Game (HTML5 Canvas)
     - 🏓 Retro Pong Table Tennis (Canvas + AI Paddle)
     - 🚀 Space Invaders Alien Defender
     - 🍎 Fruit Catcher Physics Game
     - 📝 Interactive Quiz & Utility Simulators
   - Live canvas preview, editable starter code, and instant restart.

5. **AI Coding Assistant & Debugger**:
   - Integrated **Ask AI** powered by Google Gemini Flash Lite for personalized syntax help and error explanation.
   - Zero-signup Gemini API key support to protect user privacy and shared quota.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS & Lucide Icons
- **Compiler**: Multi-tier execution engine supporting Python 3, Node.js, and Java 21
- **Storage**: Client-side resilient storage for user progress, custom projects, and Gemini keys

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smartcoders.git
cd smartcoders

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

---

## 📄 License
MIT License. Free and open source for everyone.
