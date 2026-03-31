import { useState, useCallback, useRef, useEffect } from 'react';
import { generateQuestions } from '../utils/mathGenerator';
import { recordGame } from '../utils/storage';
import type { GameConfig, Question, GameResult, Achievement } from '../types';

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
};

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setState(s => ({ ...s, elapsed: s.elapsed + 1 }));
    }, 1000);
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const startGame = useCallback((cfg: GameConfig) => {
    const questions = generateQuestions(cfg.operations, cfg.difficulty, cfg.questionCount, cfg.maxNumber);
    setConfig(cfg);
    setState({ ...INITIAL_STATE, phase: 'playing', questions });
    startTimer();
  }, [startTimer]);

  const answer = useCallback((choice: number) => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      const q = prev.questions[prev.currentIndex];
      const correct = choice === q.answer;
      const streak = correct ? prev.streak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, streak);
      const streakBonus = streak >= 3 ? Math.floor(q.points * 0.5) : 0;
      const score = prev.score + (correct ? q.points + streakBonus : 0);

      return {
        ...prev,
        phase: 'feedback',
        score,
        correct: prev.correct + (correct ? 1 : 0),
        streak,
        bestStreak,
        lastCorrect: correct,
      };
    });
  }, []);

  const next = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'feedback') return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex < prev.questions.length) {
        return { ...prev, phase: 'playing', currentIndex: nextIndex, lastCorrect: null };
      }
      // Signal that we're ready to finish — actual recordGame happens in the effect below
      return { ...prev, phase: 'finished' as GamePhase };
    });
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.phase !== 'finished' || state.result) return;
    stopTimer();
    const prev = stateRef.current;
    const result: GameResult = {
      score: prev.score,
      totalPoints: prev.questions.reduce((s, q) => s + q.points, 0),
      correct: prev.correct,
      total: prev.questions.length,
      timeSeconds: prev.elapsed,
      streak: prev.bestStreak,
      operations: config!.operations,
      difficulty: config!.difficulty,
      date: Date.now(),
    };
    const { newAchievements } = recordGame(result);
    setState(s => ({ ...s, result, newAchievements }));
  }, [state.phase, state.result, config, stopTimer]);

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
    startGame,
    answer,
    next,
    reset,
  };
}
