export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions' | 'percentages';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  prompt: string;
  answer: number;
  choices: number[];
  operation: Operation;
  points: number;
}

export interface GameConfig {
  operations: Operation[];
  difficulty: Difficulty;
  questionCount: number;
  livesMode: boolean;
  timedMode: boolean;
  hintsPerGame: number;
  isDaily?: boolean;
}

export interface GameResult {
  score: number;
  totalPoints: number;
  correct: number;
  total: number;
  timeSeconds: number;
  streak: number;
  operations: Operation[];
  difficulty: Difficulty;
  date: number;
  xpGained: number;
  hadBounceBack: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface PlayerStats {
  totalScore: number;
  totalCorrect: number;
  totalAnswered: number;
  highestStreak: number;
  bestScore: number;
  gamesPlayed: number;
  achievements: string[];
  history: GameResult[];
  xp: number;
  level: number;
  consecutiveDays: number;
  lastPlayedDate: string;
}
