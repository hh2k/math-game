export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions';

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
  maxNumber: number;
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
}
