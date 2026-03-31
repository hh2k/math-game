import type { PlayerStats, GameResult, Achievement } from '../types';

const STORAGE_KEY = 'mathgame_stats';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_game', name: 'First Steps', description: 'Complete your first game!', icon: '🎯', unlocked: false },
  { id: 'perfect_10', name: 'Perfect 10', description: 'Answer 10 questions in a row correctly', icon: '🔥', unlocked: false },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Finish a 10-question game in under 60 seconds', icon: '⚡', unlocked: false },
  { id: 'math_whiz', name: 'Math Whiz', description: 'Score 500+ points in a single game', icon: '🧠', unlocked: false },
  { id: 'streak_5', name: 'On Fire', description: 'Get a 5-answer streak', icon: '🔥', unlocked: false },
  { id: 'hundred_answers', name: 'Century Club', description: 'Answer 100 questions total', icon: '💯', unlocked: false },
  { id: 'hard_mode', name: 'Hard Core', description: 'Complete a hard difficulty game', icon: '💪', unlocked: false },
  { id: 'all_ops', name: 'All Rounder', description: 'Play all 5 operation types', icon: '🌟', unlocked: false },
];

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PlayerStats;
  } catch {
    // ignore
  }
  return {
    totalScore: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    highestStreak: 0,
    bestScore: 0,
    gamesPlayed: 0,
    achievements: [],
    history: [],
  };
}

export function saveStats(stats: PlayerStats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function resetStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function recordGame(result: GameResult): { stats: PlayerStats; newAchievements: Achievement[] } {
  const stats = loadStats();
  stats.totalScore += result.score;
  stats.totalCorrect += result.correct;
  stats.totalAnswered += result.total;
  stats.gamesPlayed += 1;
  if (result.score > stats.bestScore) stats.bestScore = result.score;
  if (result.streak > stats.highestStreak) stats.highestStreak = result.streak;
  stats.history = [result, ...stats.history].slice(0, 20);

  const newAchievements: Achievement[] = [];

  const check = (id: string, cond: boolean) => {
    if (cond && !stats.achievements.includes(id)) {
      stats.achievements.push(id);
      const a = DEFAULT_ACHIEVEMENTS.find(a => a.id === id);
      if (a) newAchievements.push({ ...a, unlocked: true });
    }
  };

  check('first_game', stats.gamesPlayed >= 1);
  check('streak_5', result.streak >= 5);
  check('perfect_10', result.streak >= 10);
  check('speed_demon', result.timeSeconds < 60 && result.total === 10);
  check('math_whiz', result.score >= 500);
  check('hundred_answers', stats.totalAnswered >= 100);
  check('hard_mode', result.difficulty === 'hard' && result.correct === result.total);

  const ops = new Set(stats.history.flatMap(h => h.operations ?? []));
  check('all_ops', ops.size >= 5);

  saveStats(stats);
  return { stats, newAchievements };
}
