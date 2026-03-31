import { useState } from 'react';
import type { GameConfig, Operation, Difficulty } from '../types';
import type { Theme } from '../App';
import { loadStats } from '../utils/storage';

interface HomeProps {
  onStart: (config: GameConfig) => void;
  onViewStats: () => void;
  theme: Theme;
  onTheme: (t: Theme) => void;
}

const OPERATIONS: { id: Operation; label: string; icon: string; desc: string }[] = [
  { id: 'addition', label: 'Addition', icon: '➕', desc: 'Add numbers together' },
  { id: 'subtraction', label: 'Subtraction', icon: '➖', desc: 'Find the difference' },
  { id: 'multiplication', label: 'Multiplication', icon: '✖️', desc: 'Multiply numbers' },
  { id: 'division', label: 'Division', icon: '➗', desc: 'Divide numbers evenly' },
  { id: 'fractions', label: 'Fractions', icon: '½', desc: 'Work with fractions' },
];

const ALL_OPS = OPERATIONS.map(o => o.id);

const DIFFICULTIES: { id: Difficulty; label: string; icon: string; color: string }[] = [
  { id: 'easy', label: 'Easy', icon: '⭐', color: '#4caf50' },
  { id: 'medium', label: 'Medium', icon: '⭐⭐', color: '#ff9800' },
  { id: 'hard', label: 'Hard', icon: '⭐⭐⭐', color: '#f44336' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];
const MAX_NUMBERS = [5, 10, 20, 50, 100];

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: 'blue',    label: 'Ocean',   color: '#00b4d8' },
  { id: 'pink',    label: 'Candy',   color: '#ec4899' },
  { id: 'natural', label: 'Forest',  color: '#c49a2c' },
];

export default function Home({ onStart, onViewStats, theme, onTheme }: HomeProps) {
  const [operations, setOperations] = useState<Operation[]>(['addition']);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questionCount, setQuestionCount] = useState(10);
  const [maxNumber, setMaxNumber] = useState(20);
  const stats = loadStats();

  const toggleOp = (op: Operation) => {
    setOperations(prev => {
      if (prev.includes(op)) return prev.length === 1 ? prev : prev.filter(o => o !== op);
      return [...prev, op];
    });
  };

  const allSelected = ALL_OPS.every(op => operations.includes(op));
  const toggleAll = () => setOperations(allSelected ? ['addition'] : [...ALL_OPS]);

  return (
    <div className="home">
      <div className="home-header">
        <div className="logo">🧮</div>
        <h1>Math Quest</h1>
        <p className="tagline">Learn math the fun way!</p>
        <div className="theme-switcher">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`theme-btn ${theme === t.id ? 'active' : ''}`}
              style={{ '--theme-color': t.color } as React.CSSProperties}
              onClick={() => onTheme(t.id)}
              title={t.label}
            >
              {theme === t.id && <span className="theme-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">🏆</span>
          <span className="stat-val">{stats.bestScore}</span>
          <span className="stat-label">Best Score</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎮</span>
          <span className="stat-val">{stats.gamesPlayed}</span>
          <span className="stat-label">Games</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span className="stat-val">{stats.highestStreak}</span>
          <span className="stat-label">Best Streak</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">✅</span>
          <span className="stat-val">{stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
      </div>

      <div className="config-section">
        <div className="section-header">
          <h2>Choose Topics</h2>
          <button className="toggle-all-btn" onClick={toggleAll}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <p className="multi-hint">Pick one or more — questions will mix them!</p>
        <div className="operation-grid">
          {OPERATIONS.map(op => (
            <button
              key={op.id}
              className={`op-card ${operations.includes(op.id) ? 'selected' : ''}`}
              onClick={() => toggleOp(op.id)}
            >
              <span className="op-check">{operations.includes(op.id) ? '✓' : ''}</span>
              <span className="op-icon">{op.icon}</span>
              <span className="op-label">{op.label}</span>
              <span className="op-desc">{op.desc}</span>
            </button>
          ))}
        </div>

        <h2>Difficulty</h2>
        <div className="difficulty-row">
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              className={`diff-btn ${difficulty === d.id ? 'selected' : ''}`}
              style={difficulty === d.id ? { background: d.color, borderColor: d.color } : { borderColor: d.color }}
              onClick={() => setDifficulty(d.id)}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        <h2>Questions</h2>
        <div className="count-row">
          {QUESTION_COUNTS.map(n => (
            <button
              key={n}
              className={`count-btn ${questionCount === n ? 'selected' : ''}`}
              onClick={() => setQuestionCount(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <h2>Max Number <span className="section-hint">limit how big the numbers get</span></h2>
        <div className="count-row">
          {MAX_NUMBERS.map(n => (
            <button
              key={n}
              className={`count-btn ${maxNumber === n ? 'selected' : ''}`}
              onClick={() => setMaxNumber(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="home-actions">
        <button className="btn-start" onClick={() => onStart({ operations, difficulty, questionCount, maxNumber })}>
          Start Game 🚀
        </button>
        <button className="btn-secondary" onClick={onViewStats}>
          My Progress 📊
        </button>
      </div>
    </div>
  );
}
