import { useState } from 'react';
import type { GameConfig, Operation, Difficulty } from '../types';
import type { Theme } from '../App';
import { loadStats } from '../utils/storage';
import { useLang } from '../LangContext';
import { LEVEL_NAMES } from '../i18n';

interface HomeProps {
  onStart: (config: GameConfig) => void;
  onDailyChallenge: () => void;
  onViewStats: () => void;
  theme: Theme;
  onTheme: (t: Theme) => void;
}

const OPERATION_IDS: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'percentages'];
const OPERATION_ICONS: Record<Operation, string> = {
  addition: '➕', subtraction: '➖', multiplication: '✖️',
  division: '➗', fractions: '½', percentages: '%',
};

const ALL_OPS = OPERATION_IDS;

const DIFFICULTY_IDS: Difficulty[] = ['easy', 'medium', 'hard'];
const DIFFICULTY_META: Record<Difficulty, { icon: string; color: string; range: string }> = {
  easy:   { icon: '⭐',     color: '#4caf50', range: '1 – 20' },
  medium: { icon: '⭐⭐',   color: '#ff9800', range: '10 – 100' },
  hard:   { icon: '⭐⭐⭐', color: '#f44336', range: '100 – 999' },
};

const QUESTION_COUNTS = [5, 10, 15, 20];
const HINT_OPTIONS = [0, 1, 2, 3];

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: 'blue',    label: 'Ocean',  color: '#00b4d8' },
  { id: 'pink',    label: 'Candy',  color: '#ec4899' },
  { id: 'natural', label: 'Forest', color: '#c49a2c' },
];

export default function Home({ onStart, onDailyChallenge, onViewStats, theme, onTheme }: HomeProps) {
  const { lang, setLang, t } = useLang();
  const [operations, setOperations] = useState<Operation[]>(['addition']);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questionCount, setQuestionCount] = useState(10);
  const [livesMode, setLivesMode] = useState(false);
  const [timedMode, setTimedMode] = useState(false);
  const [hintsPerGame, setHintsPerGame] = useState(0);
  const stats = loadStats();

  const toggleOp = (op: Operation) => {
    setOperations(prev => {
      if (prev.includes(op)) return prev.length === 1 ? prev : prev.filter(o => o !== op);
      return [...prev, op];
    });
  };

  const allSelected = ALL_OPS.every(op => operations.includes(op));
  const toggleAll = () => setOperations(allSelected ? ['addition'] : [...ALL_OPS]);

  const levelNames = LEVEL_NAMES[lang];
  const levelName = levelNames[(stats.level ?? 1) - 1] ?? levelNames[levelNames.length - 1];

  return (
    <div className="home">
      <div className="home-header">
        <div className="logo">🧮</div>
        <h1>Math Quest</h1>
        <p className="tagline">{t.home.tagline}</p>
        <div className="theme-switcher">
          {THEMES.map(th => (
            <button
              key={th.id}
              className={`theme-btn ${theme === th.id ? 'active' : ''}`}
              style={{ '--theme-color': th.color } as React.CSSProperties}
              onClick={() => onTheme(th.id)}
              title={th.label}
            >
              {theme === th.id && <span className="theme-check">✓</span>}
            </button>
          ))}
        </div>
        <div className="lang-switcher">
          <button
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
            title="English"
          >
            🇬🇧
          </button>
          <button
            className={`lang-btn ${lang === 'da' ? 'active' : ''}`}
            onClick={() => setLang('da')}
            title="Dansk"
          >
            🇩🇰
          </button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">🏆</span>
          <span className="stat-val">{stats.bestScore}</span>
          <span className="stat-label">{t.home.statLabels.bestScore}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎮</span>
          <span className="stat-val">{stats.gamesPlayed}</span>
          <span className="stat-label">{t.home.statLabels.games}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span className="stat-val">{stats.highestStreak}</span>
          <span className="stat-label">{t.home.statLabels.bestStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⬆️</span>
          <span className="stat-val">{t.level.prefix}{stats.level ?? 1}</span>
          <span className="stat-label">{levelName}</span>
        </div>
      </div>

      <div className="config-section">
        <div className="section-header">
          <h2>{t.home.topics.title}</h2>
          <button className="toggle-all-btn" onClick={toggleAll}>
            {allSelected ? t.home.topics.deselectAll : t.home.topics.selectAll}
          </button>
        </div>
        <p className="multi-hint">{t.home.topics.hint}</p>
        <div className="operation-grid">
          {OPERATION_IDS.map(id => {
            const opT = t.home.operations[id];
            return (
              <button
                key={id}
                className={`op-card ${operations.includes(id) ? 'selected' : ''}`}
                onClick={() => toggleOp(id)}
              >
                <span className="op-check">{operations.includes(id) ? '✓' : ''}</span>
                <span className="op-icon">{OPERATION_ICONS[id]}</span>
                <span className="op-label">{opT.label}</span>
                <span className="op-desc">{opT.desc}</span>
              </button>
            );
          })}
        </div>

        <h2>{t.home.difficultyTitle}</h2>
        <div className="difficulty-row">
          {DIFFICULTY_IDS.map(id => {
            const meta = DIFFICULTY_META[id];
            const label = t.home.difficulties[id];
            return (
              <button
                key={id}
                className={`diff-btn ${difficulty === id ? 'selected' : ''}`}
                style={difficulty === id ? { background: meta.color, borderColor: meta.color } : { borderColor: meta.color }}
                onClick={() => setDifficulty(id)}
              >
                <span>{meta.icon}</span>
                <span>{label}</span>
                <small className="diff-range">{meta.range}</small>
              </button>
            );
          })}
        </div>

        <h2>{t.home.questionsTitle}</h2>
        <div className="count-row">
          {QUESTION_COUNTS.map(n => (
            <button key={n} className={`count-btn ${questionCount === n ? 'selected' : ''}`} onClick={() => setQuestionCount(n)}>{n}</button>
          ))}
        </div>

        <h2>{t.home.gameModes.title}</h2>
        <div className="mode-row">
          <button className={`mode-btn ${livesMode ? 'selected' : ''}`} onClick={() => setLivesMode(v => !v)}>
            <span className="mode-btn-icon">❤️</span>
            <span className="mode-btn-label">{t.home.gameModes.livesLabel}</span>
            <small>{t.home.gameModes.livesDesc}</small>
          </button>
          <button className={`mode-btn ${timedMode ? 'selected' : ''}`} onClick={() => setTimedMode(v => !v)}>
            <span className="mode-btn-icon">⏱</span>
            <span className="mode-btn-label">{t.home.gameModes.timedLabel}</span>
            <small>{t.home.gameModes.timedDesc}</small>
          </button>
        </div>

        <h2>{t.home.hints.title} <span className="section-hint">{t.home.hints.desc}</span></h2>
        <div className="count-row">
          {HINT_OPTIONS.map(n => (
            <button key={n} className={`count-btn ${hintsPerGame === n ? 'selected' : ''}`} onClick={() => setHintsPerGame(n)}>
              {n === 0 ? t.home.hints.none : n}
            </button>
          ))}
        </div>
      </div>

      <div className="home-actions">
        <button className="btn-start" onClick={() => onStart({ operations, difficulty, questionCount, livesMode, timedMode, hintsPerGame, isDaily: false })}>
          {t.home.startGame}
        </button>
        <button className="btn-daily" onClick={onDailyChallenge}>
          {t.home.dailyChallenge}
        </button>
        <button className="btn-secondary" onClick={onViewStats}>
          {t.home.myProgress}
        </button>
      </div>
    </div>
  );
}
