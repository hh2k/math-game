import { useState } from 'react';
import { loadStats, resetStats, DEFAULT_ACHIEVEMENTS, LEVEL_XP, calcLevel } from '../utils/storage';
import type { GameResult } from '../types';
import { useLang } from '../LangContext';
import { LEVEL_NAMES, ACHIEVEMENT_STRINGS } from '../i18n';

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
  addition: '➕', subtraction: '➖', multiplication: '✖️',
  division: '➗', fractions: '½', percentages: '%',
};

export default function StatsScreen({ onBack }: StatsScreenProps) {
  const { lang, setLang, t } = useLang();
  const [stats, setStats] = useState(loadStats);
  const [confirmReset, setConfirmReset] = useState(false);

  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;

  const handleReset = () => {
    resetStats();
    setStats(loadStats());
    setConfirmReset(false);
  };

  const achStrings = ACHIEVEMENT_STRINGS[lang];

  const achievements = DEFAULT_ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: stats.achievements.includes(a.id),
  }));

  const xp = stats.xp ?? 0;
  const level = calcLevel(xp);
  const levelNames = LEVEL_NAMES[lang];
  const levelName = levelNames[level - 1] ?? levelNames[levelNames.length - 1];
  const xpForThisLevel = LEVEL_XP[level - 1] ?? 0;
  const xpForNextLevel = LEVEL_XP[level] ?? null;
  const xpProgress = xpForNextLevel != null
    ? Math.round(((xp - xpForThisLevel) / (xpForNextLevel - xpForThisLevel)) * 100)
    : 100;

  return (
    <div className="stats-screen">
      <div className="stats-topbar">
        <button className="back-btn" onClick={onBack}>{t.stats.back}</button>
        <h2>{t.stats.title}</h2>
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
        <button className="reset-btn" onClick={() => setConfirmReset(true)}>{t.stats.resetBtn}</button>
      </div>

      {confirmReset && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h3>{t.stats.resetModal.title}</h3>
            <p>{t.stats.resetModal.message}</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn--cancel" onClick={() => setConfirmReset(false)}>{t.stats.resetModal.cancel}</button>
              <button className="modal-btn modal-btn--danger" onClick={handleReset}>{t.stats.resetModal.yes}</button>
            </div>
          </div>
        </div>
      )}

      {/* Level card */}
      <div className="level-card">
        <div className="level-card-left">
          <span className="level-badge">{t.level.prefix}{level}</span>
          <span className="level-name">{levelName}</span>
        </div>
        <div className="level-card-right">
          <div className="xp-bar-wrap">
            <div className="xp-bar" style={{ width: `${xpProgress}%` }} />
          </div>
          <div className="xp-label">
            {xpForNextLevel != null
              ? `${xp - xpForThisLevel} / ${xpForNextLevel - xpForThisLevel} XP`
              : `${xp} XP · ${t.stats.xpMaxLevel}`}
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="ov-card"><span>🏆</span><strong>{stats.bestScore}</strong><small>{t.stats.overview.bestScore}</small></div>
        <div className="ov-card"><span>🎮</span><strong>{stats.gamesPlayed}</strong><small>{t.stats.overview.games}</small></div>
        <div className="ov-card"><span>✅</span><strong>{accuracy}%</strong><small>{t.stats.overview.accuracy}</small></div>
        <div className="ov-card"><span>🔥</span><strong>{stats.highestStreak}</strong><small>{t.stats.overview.bestStreak}</small></div>
        <div className="ov-card"><span>💯</span><strong>{stats.totalAnswered}</strong><small>{t.stats.overview.questions}</small></div>
        <div className="ov-card"><span>⭐</span><strong>{stats.totalScore}</strong><small>{t.stats.overview.totalScore}</small></div>
      </div>

      <h3 className="section-title">{t.stats.achievementsTitle(stats.achievements.length, DEFAULT_ACHIEVEMENTS.length)}</h3>
      <div className="achievements-grid">
        {achievements.map(a => {
          const strings = achStrings[a.id];
          const name = strings ? strings.name : a.name;
          const description = strings ? strings.description : a.description;
          return (
            <div key={a.id} className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`}>
              <span className="ach-icon">{a.unlocked ? a.icon : '🔒'}</span>
              <div>
                <div className="ach-name">{name}</div>
                <div className="ach-desc">{a.unlocked ? description : '???'}</div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.history.length > 0 && (
        <>
          <h3 className="section-title">{t.stats.recentGames}</h3>
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
