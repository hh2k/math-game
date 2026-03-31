import { useState } from 'react';
import { loadStats, resetStats, DEFAULT_ACHIEVEMENTS } from '../utils/storage';
import type { GameResult } from '../types';

interface StatsScreenProps {
  onBack: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const OP_ICONS: Record<string, string> = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗',
  fractions: '½',
};

export default function StatsScreen({ onBack }: StatsScreenProps) {
  const [stats, setStats] = useState(loadStats);
  const [confirmReset, setConfirmReset] = useState(false);
  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;

  const handleReset = () => {
    resetStats();
    setStats(loadStats());
    setConfirmReset(false);
  };

  const achievements = DEFAULT_ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: stats.achievements.includes(a.id),
  }));

  return (
    <div className="stats-screen">
      <div className="stats-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>My Progress</h2>
        <button className="reset-btn" onClick={() => setConfirmReset(true)}>Reset progress</button>
      </div>

      {confirmReset && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h3>Reset Progress?</h3>
            <p>This will permanently delete all your scores, achievements, and game history.</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn--cancel" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="modal-btn modal-btn--danger" onClick={handleReset}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      <div className="stats-overview">
        <div className="ov-card">
          <span>🏆</span>
          <strong>{stats.bestScore}</strong>
          <small>Best Score</small>
        </div>
        <div className="ov-card">
          <span>🎮</span>
          <strong>{stats.gamesPlayed}</strong>
          <small>Games</small>
        </div>
        <div className="ov-card">
          <span>✅</span>
          <strong>{accuracy}%</strong>
          <small>Accuracy</small>
        </div>
        <div className="ov-card">
          <span>🔥</span>
          <strong>{stats.highestStreak}</strong>
          <small>Best Streak</small>
        </div>
        <div className="ov-card">
          <span>💯</span>
          <strong>{stats.totalAnswered}</strong>
          <small>Questions</small>
        </div>
        <div className="ov-card">
          <span>⭐</span>
          <strong>{stats.totalScore}</strong>
          <small>Total Score</small>
        </div>
      </div>

      <h3 className="section-title">🏅 Achievements ({stats.achievements.length}/{DEFAULT_ACHIEVEMENTS.length})</h3>
      <div className="achievements-grid">
        {achievements.map(a => (
          <div key={a.id} className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`}>
            <span className="ach-icon">{a.unlocked ? a.icon : '🔒'}</span>
            <div>
              <div className="ach-name">{a.name}</div>
              <div className="ach-desc">{a.unlocked ? a.description : '???'}</div>
            </div>
          </div>
        ))}
      </div>

      {stats.history.length > 0 && (
        <>
          <h3 className="section-title">📜 Recent Games</h3>
          <div className="history-list">
            {stats.history.slice(0, 10).map((r: GameResult, i) => (
              <div key={i} className="history-item">
                <span className="hist-op">{(r.operations ?? []).map(o => OP_ICONS[o] ?? o).join(' ')}</span>
                <span className="hist-diff" data-diff={r.difficulty}>{r.difficulty}</span>
                <span className="hist-score">⭐ {r.score}</span>
                <span className="hist-acc">{Math.round((r.correct / r.total) * 100)}%</span>
                <span className="hist-time">⏱ {formatTime(r.timeSeconds)}</span>
                <span className="hist-date">{formatDate(r.date)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
