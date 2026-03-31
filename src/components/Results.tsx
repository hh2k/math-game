import type { GameResult, Achievement } from '../types';

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

function getGrade(pct: number): { label: string; color: string; emoji: string } {
  if (pct === 100) return { label: 'Perfect!', color: '#ffd700', emoji: '🏆' };
  if (pct >= 90) return { label: 'Outstanding!', color: '#4caf50', emoji: '🌟' };
  if (pct >= 75) return { label: 'Great Job!', color: '#2196f3', emoji: '🎉' };
  if (pct >= 60) return { label: 'Good Work!', color: '#ff9800', emoji: '👍' };
  if (pct >= 40) return { label: 'Keep Trying!', color: '#ff7043', emoji: '💪' };
  return { label: 'Practice More!', color: '#f44336', emoji: '📚' };
}

export default function Results({ result, newAchievements, onPlayAgain, onHome, onViewStats }: ResultsProps) {
  const pct = Math.round((result.correct / result.total) * 100);
  const grade = getGrade(pct);

  return (
    <div className="results-screen">
      <div className="results-header" style={{ borderColor: grade.color }}>
        <div className="grade-emoji">{grade.emoji}</div>
        <h1 style={{ color: grade.color }}>{grade.label}</h1>
        <div className="score-big">{result.score} <span>points</span></div>
      </div>

      <div className="results-stats">
        <div className="res-stat">
          <span className="res-stat-icon">✅</span>
          <span className="res-stat-val">{result.correct}/{result.total}</span>
          <span className="res-stat-label">Correct</span>
        </div>
        <div className="res-stat">
          <span className="res-stat-icon">🎯</span>
          <span className="res-stat-val">{pct}%</span>
          <span className="res-stat-label">Accuracy</span>
        </div>
        <div className="res-stat">
          <span className="res-stat-icon">⏱</span>
          <span className="res-stat-val">{formatTime(result.timeSeconds)}</span>
          <span className="res-stat-label">Time</span>
        </div>
        <div className="res-stat">
          <span className="res-stat-icon">🔥</span>
          <span className="res-stat-val">{result.streak}</span>
          <span className="res-stat-label">Best Streak</span>
        </div>
      </div>

      <div className="accuracy-bar-wrap">
        <div className="accuracy-bar" style={{ width: `${pct}%`, background: grade.color }} />
      </div>

      {newAchievements.length > 0 && (
        <div className="achievements-section">
          <h3>🏅 New Achievements!</h3>
          <div className="achievements-list">
            {newAchievements.map(a => (
              <div key={a.id} className="achievement-card unlocked">
                <span className="ach-icon">{a.icon}</span>
                <div>
                  <div className="ach-name">{a.name}</div>
                  <div className="ach-desc">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-actions">
        <button className="btn-start" onClick={onPlayAgain}>Play Again 🎮</button>
        <button className="btn-secondary" onClick={onViewStats}>My Progress 📊</button>
        <button className="btn-ghost" onClick={onHome}>Home 🏠</button>
      </div>
    </div>
  );
}
