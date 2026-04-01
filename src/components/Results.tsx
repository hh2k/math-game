import { useMemo } from 'react';
import type { GameResult, Achievement } from '../types';
import { loadStats } from '../utils/storage';
import { useLang } from '../LangContext';
import { LEVEL_NAMES, ACHIEVEMENT_STRINGS } from '../i18n';

interface ResultsProps {
  result: GameResult;
  newAchievements: Achievement[];
  onPlayAgain: () => void;
  onHome: () => void;
  onViewStats: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

type GradeKey = 'perfect' | 'outstanding' | 'greatJob' | 'goodWork' | 'keepTrying' | 'practiceMore';

function getGradeKey(pct: number): GradeKey {
  if (pct === 100) return 'perfect';
  if (pct >= 90)   return 'outstanding';
  if (pct >= 75)   return 'greatJob';
  if (pct >= 60)   return 'goodWork';
  if (pct >= 40)   return 'keepTrying';
  return 'practiceMore';
}

function getGradeMeta(pct: number): { color: string; emoji: string } {
  if (pct === 100) return { color: '#ffd700', emoji: '🏆' };
  if (pct >= 90)   return { color: '#4caf50', emoji: '🌟' };
  if (pct >= 75)   return { color: '#2196f3', emoji: '🎉' };
  if (pct >= 60)   return { color: '#ff9800', emoji: '👍' };
  if (pct >= 40)   return { color: '#ff7043', emoji: '💪' };
  return               { color: '#f44336', emoji: '📚' };
}

const CONFETTI_COLORS = ['#ffd700', '#ff6b9d', '#00d4ff', '#7fff00', '#ff4500', '#da70d6', '#00e5ff', '#ff1744'];

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: `${(i / 36) * 100 + (Math.random() - 0.5) * 8}%`,
      delay: `${(i * 0.06).toFixed(2)}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: `${7 + (i % 5)}px`,
      duration: `${1.4 + (i % 4) * 0.25}s`,
      rotate: i % 2 === 0 ? 'confetti-fall-l' : 'confetti-fall-r',
    })),
  []);

  return (
    <div className="confetti-wrap" aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          className={`confetti-piece ${p.rotate}`}
          style={{
            left: p.left,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function Results({ result, newAchievements, onPlayAgain, onHome, onViewStats }: ResultsProps) {
  const { lang, t } = useLang();
  const pct = Math.round((result.correct / result.total) * 100);
  const gradeKey = getGradeKey(pct);
  const gradeMeta = getGradeMeta(pct);
  const stats = loadStats();
  const levelNames = LEVEL_NAMES[lang];
  const levelName = levelNames[(stats.level ?? 1) - 1] ?? levelNames[levelNames.length - 1];
  const achStrings = ACHIEVEMENT_STRINGS[lang];

  return (
    <div className="results-screen">
      {pct === 100 && <Confetti />}

      <div className="results-header" style={{ borderColor: gradeMeta.color }}>
        <div className="grade-emoji">{gradeMeta.emoji}</div>
        <h1 style={{ color: gradeMeta.color }}>{t.results.grades[gradeKey]}</h1>
        <div className="score-big">{result.score} <span>{t.results.points}</span></div>
        <div className="xp-gained">
          {t.results.xpLabel(result.xpGained ?? result.score, stats.level, levelName)}
        </div>
      </div>

      <div className="results-stats">
        <div className="res-stat">
          <span className="res-stat-icon">✅</span>
          <span className="res-stat-val">{result.correct}/{result.total}</span>
          <span className="res-stat-label">{t.results.stats.correct}</span>
        </div>
        <div className="res-stat">
          <span className="res-stat-icon">🎯</span>
          <span className="res-stat-val">{pct}%</span>
          <span className="res-stat-label">{t.results.stats.accuracy}</span>
        </div>
        <div className="res-stat">
          <span className="res-stat-icon">⏱</span>
          <span className="res-stat-val">{formatTime(result.timeSeconds)}</span>
          <span className="res-stat-label">{t.results.stats.time}</span>
        </div>
        <div className="res-stat">
          <span className="res-stat-icon">🔥</span>
          <span className="res-stat-val">{result.streak}</span>
          <span className="res-stat-label">{t.results.stats.bestStreak}</span>
        </div>
      </div>

      <div className="accuracy-bar-wrap">
        <div className="accuracy-bar" style={{ width: `${pct}%`, background: gradeMeta.color }} />
      </div>

      {newAchievements.length > 0 && (
        <div className="achievements-section">
          <h3>{t.results.newAchievements}</h3>
          <div className="achievements-list">
            {newAchievements.map(a => {
              const strings = achStrings[a.id];
              return (
                <div key={a.id} className="achievement-card unlocked">
                  <span className="ach-icon">{a.icon}</span>
                  <div>
                    <div className="ach-name">{strings ? strings.name : a.name}</div>
                    <div className="ach-desc">{strings ? strings.description : a.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="results-actions">
        <button className="btn-start" onClick={onPlayAgain}>{t.results.playAgain}</button>
        <button className="btn-secondary" onClick={onViewStats}>{t.results.myProgress}</button>
        <button className="btn-ghost" onClick={onHome}>{t.results.home}</button>
      </div>
    </div>
  );
}
