import { useState, useCallback, useRef, useEffect } from 'react';
import { generateQuestions, generateDailyQuestions } from '../utils/mathGenerator';
import { recordGame } from '../utils/storage';
import type { GameConfig, Question, GameResult, Achievement } from '../types';
import type { Lang } from '../i18n';

type GamePhase = 'idle' | 'playing' | 'feedback' | 'finished';

interface GameState {
  phase: GamePhase;
  questions: Question[];
  currentIndex: number;
  score: number;
  correct: number;
  streak: number;
  bestStreak: number;
  elapsed: number;
  lastCorrect: boolean | null;
  result: GameResult | null;
  newAchievements: Achievement[];
  livesLeft: number;        // -1 = unlimited
  hintsLeft: number;
  questionTimeLeft: number; // 0 = no timer active
  questionTimeLimit: number;
  eliminatedChoice: number | null;
  isGameOver: boolean;
  hadBounceBack: boolean;
  lastWasWrong: boolean;
}

const INITIAL_STATE: GameState = {
  phase: 'idle',
  questions: [],
  currentIndex: 0,
  score: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  elapsed: 0,
  lastCorrect: null,
  result: null,
  newAchievements: [],
  livesLeft: -1,
  hintsLeft: 0,
  questionTimeLeft: 0,
  questionTimeLimit: 0,
  eliminatedChoice: null,
  isGameOver: false,
  hadBounceBack: false,
  lastWasWrong: false,
};

function getTimeLimit(difficulty: string, timedMode: boolean): number {
  if (!timedMode) return 0;
  return ({ easy: 15, medium: 10, hard: 7 } as Record<string, number>)[difficulty] ?? 10;
}

export function useGame(lang: Lang) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setState(s => ({ ...s, elapsed: s.elapsed + 1 }));
    }, 1000);
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const initGame = useCallback((cfg: GameConfig, questions: Question[]) => {
    const timeLimit = getTimeLimit(cfg.difficulty, cfg.timedMode);
    setConfig(cfg);
    setState({
      ...INITIAL_STATE,
      phase: 'playing',
      questions,
      livesLeft: cfg.livesMode ? 3 : -1,
      hintsLeft: cfg.hintsPerGame,
      questionTimeLeft: timeLimit,
      questionTimeLimit: timeLimit,
    });
    startTimer();
  }, [startTimer]);

  const startGame = useCallback((cfg: GameConfig) => {
    const questions = generateQuestions(cfg.operations, cfg.difficulty, cfg.questionCount, lang);
    initGame(cfg, questions);
  }, [initGame, lang]);

  const startDaily = useCallback(() => {
    const questions = generateDailyQuestions(lang);
    const cfg: GameConfig = {
      operations: ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'percentages'],
      difficulty: 'medium',
      questionCount: 10,
      livesMode: false,
      timedMode: false,
      hintsPerGame: 2,
      isDaily: true,
    };
    initGame(cfg, questions);
  }, [initGame, lang]);

  const answer = useCallback((choice: number) => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      const q = prev.questions[prev.currentIndex];
      const correct = choice === q.answer;
      const streak = correct ? prev.streak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, streak);
      const streakBonus = streak >= 3 ? Math.floor(q.points * 0.5) : 0;
      const score = prev.score + (correct ? q.points + streakBonus : 0);
      const livesLeft = !correct && prev.livesLeft !== -1 ? prev.livesLeft - 1 : prev.livesLeft;
      const hadBounceBack = prev.hadBounceBack || (correct && prev.lastWasWrong);
      return {
        ...prev,
        phase: 'feedback',
        score,
        correct: prev.correct + (correct ? 1 : 0),
        streak,
        bestStreak,
        lastCorrect: correct,
        livesLeft,
        isGameOver: livesLeft === 0,
        hadBounceBack,
        lastWasWrong: !correct,
      };
    });
  }, []);

  const next = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'feedback') return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex < prev.questions.length && !prev.isGameOver) {
        return {
          ...prev,
          phase: 'playing',
          currentIndex: nextIndex,
          lastCorrect: null,
          eliminatedChoice: null,
          questionTimeLeft: prev.questionTimeLimit,
        };
      }
      return { ...prev, phase: 'finished' as GamePhase };
    });
  }, []);

  const useHint = useCallback(() => {
    setState(prev => {
      if (prev.hintsLeft <= 0 || prev.phase !== 'playing') return prev;
      const q = prev.questions[prev.currentIndex];
      const wrong = q.choices.filter(c => c !== q.answer && c !== prev.eliminatedChoice);
      if (wrong.length === 0) return prev;
      const toEliminate = wrong[Math.floor(Math.random() * wrong.length)];
      return { ...prev, hintsLeft: prev.hintsLeft - 1, eliminatedChoice: toEliminate };
    });
  }, []);

  // Per-question countdown
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    if (state.phase !== 'playing' || !configRef.current?.timedMode || state.questionTimeLeft <= 0) return;
    const t = setTimeout(() => {
      setState(s => {
        if (s.phase !== 'playing') return s;
        if (s.questionTimeLeft <= 1) {
          const cfg = configRef.current!;
          const livesLeft = cfg.livesMode && s.livesLeft !== -1 ? s.livesLeft - 1 : s.livesLeft;
          return {
            ...s,
            phase: 'feedback',
            streak: 0,
            lastCorrect: false,
            livesLeft,
            isGameOver: livesLeft === 0,
            lastWasWrong: true,
            questionTimeLeft: 0,
          };
        }
        return { ...s, questionTimeLeft: s.questionTimeLeft - 1 };
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [state.phase, state.questionTimeLeft]);

  // Finish effect — runs recordGame outside setState updater (Strict Mode safe)
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.phase !== 'finished' || state.result) return;
    stopTimer();
    const s = stateRef.current;
    const cfg = configRef.current!;
    const result: GameResult = {
      score: s.score,
      totalPoints: s.questions.reduce((acc, q) => acc + q.points, 0),
      correct: s.correct,
      total: s.questions.length,
      timeSeconds: s.elapsed,
      streak: s.bestStreak,
      operations: cfg.operations,
      difficulty: cfg.difficulty,
      date: Date.now(),
      xpGained: s.score,
      hadBounceBack: s.hadBounceBack,
      livesMode: cfg.livesMode,
    };
    const { newAchievements } = recordGame(result);
    setState(prev => ({ ...prev, result, newAchievements }));
  }, [state.phase, state.result, stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    setState(INITIAL_STATE);
    setConfig(null);
  }, [stopTimer]);

  return {
    ...state,
    config,
    currentQuestion: state.questions[state.currentIndex] ?? null,
    progress: state.questions.length > 0 ? (state.currentIndex / state.questions.length) * 100 : 0,
    livesMode: config?.livesMode ?? false,
    timedMode: config?.timedMode ?? false,
    startGame,
    startDaily,
    answer,
    next,
    useHint,
    reset,
  };
}
