import { useEffect, useState } from 'react';
import type { Question } from '../types';

interface GameScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  streak: number;
  elapsed: number;
  progress: number;
  phase: 'playing' | 'feedback';
  lastCorrect: boolean | null;
  onAnswer: (choice: number) => void;
  onNext: () => void;
  onQuit: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function GameScreen({
  question,
  questionNumber,
  totalQuestions,
  score,
  streak,
  elapsed,
  progress,
  phase,
  lastCorrect,
  onAnswer,
  onNext,
  onQuit,
}: GameScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);

  useEffect(() => {
    setSelected(null);
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 400);
    return () => clearTimeout(t);
  }, [question.id]);

  const handleChoice = (choice: number) => {
    if (phase !== 'playing') return;
    setSelected(choice);
    onAnswer(choice);
  };

  const getChoiceClass = (choice: number) => {
    if (phase === 'playing') return 'choice-btn';
    if (choice === question.answer) return 'choice-btn correct';
    if (choice === selected && selected !== question.answer) return 'choice-btn wrong';
    return 'choice-btn dimmed';
  };

  return (
    <div className="game-screen">
      <div className="game-topbar">
        <button className="quit-btn" onClick={() => setConfirmQuit(true)}>✕ Quit</button>
        <div className="game-info">
          <span className="timer">⏱ {formatTime(elapsed)}</span>
          <span className="score-display">⭐ {score}</span>
          <span className={`streak-badge ${streak >= 2 ? '' : 'streak-badge--hidden'}`}>🔥 {streak}x</span>
        </div>
        <span className="q-counter">{questionNumber}/{totalQuestions}</span>
      </div>

      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
      </div>

      <div className={`question-area ${animate ? 'slide-in' : ''}`}>
        <div className="question-op-badge">{getOpEmoji(question.operation)}</div>
        <div className="question-prompt">{question.prompt} = ?</div>
        <div className="question-points">+{question.points} pts{streak >= 3 ? ` (+${Math.floor(question.points * 0.5)} bonus!)` : ''}</div>
      </div>

      <div className="choices-grid">
        {question.choices.map(choice => (
          <button
            key={choice}
            className={getChoiceClass(choice)}
            onClick={() => handleChoice(choice)}
            disabled={phase !== 'playing'}
          >
            {choice}
          </button>
        ))}
      </div>

      {confirmQuit && (
        <div className="quit-overlay">
          <div className="quit-dialog">
            <div className="quit-dialog-icon">🚪</div>
            <h3>Quit this game?</h3>
            <p>Your progress will be lost.</p>
            <div className="quit-dialog-actions">
              <button className="btn-start" onClick={onQuit}>Yes, Quit</button>
              <button className="btn-ghost" onClick={() => setConfirmQuit(false)}>Keep Playing</button>
            </div>
          </div>
        </div>
      )}

      <div className={`feedback-banner ${phase === 'feedback' ? (lastCorrect ? 'feedback-correct' : 'feedback-wrong') : 'feedback-hidden'}`}>
        <span className="feedback-icon">{lastCorrect ? '🎉' : '😅'}</span>
        <span>{lastCorrect ? 'Correct!' : `Oops! The answer was ${question.answer}`}</span>
        <span className={`streak-msg ${lastCorrect && streak >= 3 ? '' : 'streak-msg--hidden'}`}>🔥 {streak} in a row!</span>
        <button className="btn-next" onClick={onNext}>
          {questionNumber < totalQuestions ? 'Next →' : 'See Results →'}
        </button>
      </div>
    </div>
  );
}

function getOpEmoji(op: string): string {
  const map: Record<string, string> = {
    addition: '➕',
    subtraction: '➖',
    multiplication: '✖️',
    division: '➗',
    fractions: '½',
    mixed: '🎲',
  };
  return map[op] ?? '🔢';
}
