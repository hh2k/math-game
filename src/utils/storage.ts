import type { PlayerStats, GameResult, Achievement } from '../types';

const STORAGE_KEY = 'mathgame_stats';

export const LEVEL_XP = [0, 150, 350, 600, 1000, 1500, 2200, 3000, 4000, 5500];
export const LEVEL_NAMES = [
  'Math Seedling', 'Math Sprout', 'Math Student', 'Math Thinker', 'Math Solver',
  'Math Expert', 'Math Master', 'Math Wizard', 'Math Legend', 'Math Prodigy',
];

export function calcLevel(xp: number): number {
  let lvl = 1;
  for (let i = 1; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) lvl = i + 1;
    else break;
  }
  return lvl;
}

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Original 8
  { id: 'first_game',     name: 'First Steps',    description: 'Complete your first game!',                         icon: '🎯', unlocked: false },
  { id: 'perfect_10',     name: 'Perfect 10',      description: 'Get a 10-answer streak in one game',               icon: '🔟', unlocked: false },
  { id: 'speed_demon',    name: 'Speed Demon',     description: 'Finish a 10-question game in under 60 seconds',    icon: '⚡', unlocked: false },
  { id: 'math_whiz',      name: 'Math Whiz',       description: 'Score 500+ points in a single game',              icon: '🧠', unlocked: false },
  { id: 'streak_5',       name: 'On Fire',         description: 'Get a 5-answer streak',                           icon: '🔥', unlocked: false },
  { id: 'hundred_answers',name: 'Century Club',    description: 'Answer 100 questions total',                      icon: '💯', unlocked: false },
  { id: 'hard_mode',      name: 'Hard Core',       description: 'Complete a hard game with all correct answers',   icon: '💪', unlocked: false },
  { id: 'all_ops',        name: 'All Rounder',     description: 'Play all 6 operation types',                      icon: '🌟', unlocked: false },
  // New 8
  { id: 'sharpshooter',   name: 'Sharpshooter',   description: '100% accuracy in a game with 5+ questions',       icon: '🎯', unlocked: false },
  { id: 'lightning',      name: 'Lightning',       description: 'Finish a 10-question game in under 40 seconds',  icon: '⚡', unlocked: false },
  { id: 'ice_cold',       name: 'Ice Cold',        description: 'Answer correctly right after getting one wrong',  icon: '🧊', unlocked: false },
  { id: 'consistent',     name: 'Consistent',      description: 'Play 3 days in a row',                           icon: '📅', unlocked: false },
  { id: 'big_numbers',    name: 'Big Numbers',     description: 'Complete a hard difficulty game',                icon: '🔢', unlocked: false },
  { id: 'veteran',        name: 'Veteran',         description: 'Play 25 total games',                            icon: '🏅', unlocked: false },
  { id: 'night_owl',      name: 'Night Owl',       description: 'Play after 10pm',                                icon: '🌙', unlocked: false },
  { id: 'slow_steady',    name: 'Slow & Steady',   description: 'Complete a hard game with all correct answers (no lives mode)', icon: '🐢', unlocked: false },
];

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as PlayerStats;
      // Ensure new fields have defaults for old saves
      return {
        xp: 0, level: 1, consecutiveDays: 0, lastPlayedDate: '',
        ...s,
      };
    }
  } catch { /* ignore */ }
  return {
    totalScore: 0, totalCorrect: 0, totalAnswered: 0,
    highestStreak: 0, bestScore: 0, gamesPlayed: 0,
    achievements: [], history: [],
    xp: 0, level: 1, consecutiveDays: 0, lastPlayedDate: '',
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

  // Core stats
  stats.totalScore += result.score;
  stats.totalCorrect += result.correct;
  stats.totalAnswered += result.total;
  stats.gamesPlayed += 1;
  if (result.score > stats.bestScore) stats.bestScore = result.score;
  if (result.streak > stats.highestStreak) stats.highestStreak = result.streak;
  stats.history = [result, ...stats.history].slice(0, 20);

  // XP & level
  stats.xp = (stats.xp ?? 0) + (result.xpGained ?? result.score);
  stats.level = calcLevel(stats.xp);

  // Consecutive days
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (stats.lastPlayedDate === yesterday) {
    stats.consecutiveDays = (stats.consecutiveDays ?? 0) + 1;
  } else if (stats.lastPlayedDate !== today) {
    stats.consecutiveDays = 1;
  }
  stats.lastPlayedDate = today;

  // Achievements
  const newAchievements: Achievement[] = [];
  const check = (id: string, cond: boolean) => {
    if (cond && !stats.achievements.includes(id)) {
      stats.achievements.push(id);
      const a = DEFAULT_ACHIEVEMENTS.find(a => a.id === id);
      if (a) newAchievements.push({ ...a, unlocked: true });
    }
  };

  check('first_game',      stats.gamesPlayed >= 1);
  check('streak_5',        result.streak >= 5);
  check('perfect_10',      result.streak >= 10);
  check('speed_demon',     result.timeSeconds < 60 && result.total === 10);
  check('math_whiz',       result.score >= 500);
  check('hundred_answers', stats.totalAnswered >= 100);
  check('hard_mode',       result.difficulty === 'hard' && result.correct === result.total);
  const ops = new Set(stats.history.flatMap(h => h.operations ?? []));
  check('all_ops',         ops.size >= 6);

  // New achievements
  check('sharpshooter',    result.correct === result.total && result.total >= 5);
  check('lightning',       result.timeSeconds < 40 && result.total === 10);
  check('ice_cold',        result.hadBounceBack === true);
  check('consistent',      (stats.consecutiveDays ?? 0) >= 3);
  check('big_numbers',     result.difficulty === 'hard');
  check('veteran',         stats.gamesPlayed >= 25);
  check('night_owl',       new Date().getHours() >= 22);
  check('slow_steady',     result.difficulty === 'hard' && result.correct === result.total && !result.livesMode);

  saveStats(stats);
  return { stats, newAchievements };
}
