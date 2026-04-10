import { useEffect, useState } from 'react';
import type { Question } from '../types';
import { useLang } from '../LangContext';

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
  livesLeft: number;
  hintsLeft: number;
  questionTimeLeft: number;
  questionTimeLimit: number;
  eliminatedChoice: number | null;
  isGameOver: boolean;
  livesMode: boolean;
  timedMode: boolean;
  onAnswer: (choice: number) => void;
  onNext: () => void;
  onHint: () => void;
  onQuit: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getOpEmoji(op: string): string {
  const map: Record<string, string> = {
    addition: '➕', subtraction: '➖', multiplication: '✖️',
    division: '➗', fractions: '½', percentages: '%',
  };
  return map[op] ?? '🔢';
}

export default function GameScreen({
  question, questionNumber, totalQuestions, score, streak, elapsed, progress,
  phase, lastCorrect, livesLeft, hintsLeft, questionTimeLeft, questionTimeLimit,
  eliminatedChoice, isGameOver, livesMode, timedMode,
  onAnswer, onNext, onHint, onQuit,
}: GameScreenProps) {
  const { t } = useLang();
  const [selected, setSelected] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [correctMsg, setCorrectMsg] = useState('');

  useEffect(() => {
    setSelected(null);
    setAnimate(true);
    const msgs = t.game.correct;
    setCorrectMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    const timer = setTimeout(() => setAnimate(false), 400);
    return () => clearTimeout(timer);
  }, [question.id, t.game.correct]);

  // Keyboard 1-4
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== 'playing') return;
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx !== -1 && idx < question.choices.length) {
        const choice = question.choices[idx];
        if (choice !== eliminatedChoice) {
          setSelected(choice);
          onAnswer(choice);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, question.choices, eliminatedChoice, onAnswer]);

  const handleChoice = (choice: number) => {
    if (phase !== 'playing' || choice === eliminatedChoice) return;
    setSelected(choice);
    onAnswer(choice);
  };

  const getChoiceClass = (choice: number) => {
    if (choice === eliminatedChoice) return 'choice-btn eliminated';
    if (phase === 'playing') return 'choice-btn';
    if (choice === question.answer) return 'choice-btn correct';
    if (choice === selected && selected !== question.answer) return 'choice-btn wrong';
    return 'choice-btn dimmed';
  };

  const timerPct = questionTimeLimit > 0 ? (questionTimeLeft / questionTimeLimit) * 100 : 100;
  const timerColor = questionTimeLeft <= 3 ? '#f44336' : questionTimeLeft <= 6 ? '#ff9800' : '#4caf50';

  const maxLives = 3;
  const livesDisplay = livesMode ? Array.from({ length: maxLives }, (_, i) => i < livesLeft ? '❤️' : '🖤') : [];

  const streakBonus = streak >= 3 ? Math.floor(question.points * 0.5) : 0;

  return (
    <div className="game-screen">
      <div className="game-topbar">
        <button className="quit-btn" onClick={() => setConfirmQuit(true)}>{t.game.quit}</button>
        <div className="game-info">
          <span className="timer">⏱ {formatTime(elapsed)}</span>
          <span className="score-display">⭐ {score}</span>
          <span className={`streak-badge ${streak >= 2 ? '' : 'streak-badge--hidden'}`}>🔥 {streak}x</span>
          {livesMode && (
            <span className="lives-display">{livesDisplay.map((h, i) => <span key={i} className="heart">{h}</span>)}</span>
          )}
        </div>
        <span className="q-counter">{questionNumber}/{totalQuestions}</span>
      </div>

      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
      </div>

      <div className={`question-timer ${!timedMode ? 'question-timer--inactive' : ''}`}>
        <div className="question-timer-bar" style={{ width: `${timerPct}%`, background: timerColor }} />
        <span className="question-timer-text" style={{ color: timerColor }}>{timedMode ? `${questionTimeLeft}s` : ''}</span>
      </div>

      <div className={`question-area ${animate ? 'slide-in' : ''}`}>
        <div className="question-op-badge">{getOpEmoji(question.operation)}</div>
        <div className="question-prompt">{question.prompt} = ?</div>
        <div className="question-points">
          +{question.points} pts{streak >= 3 ? ` ${t.game.bonusPts(streakBonus)}` : ''}
        </div>
      </div>

      <div className="choices-grid">
        {question.choices.map((choice, idx) => (
          <button
            key={choice}
            className={getChoiceClass(choice)}
            onClick={() => handleChoice(choice)}
            disabled={phase !== 'playing' || choice === eliminatedChoice}
            data-key={idx + 1}
          >
            {choice === eliminatedChoice ? '✗' : choice}
          </button>
        ))}
      </div>

      {hintsLeft > 0 && phase === 'playing' && (
        <div className="hint-row">
          <button className="hint-btn" onClick={onHint}>
            {t.game.useHint(hintsLeft)}
          </button>
        </div>
      )}

      {confirmQuit && (
        <div className="quit-overlay">
          <div className="quit-dialog">
            <div className="quit-dialog-icon">🚪</div>
            <h3>{t.game.quitDialog.title}</h3>
            <p>{t.game.quitDialog.message}</p>
            <div className="quit-dialog-actions">
              <button className="btn-start" onClick={onQuit}>{t.game.quitDialog.yes}</button>
              <button className="btn-ghost" onClick={() => setConfirmQuit(false)}>{t.game.quitDialog.keep}</button>
            </div>
          </div>
        </div>
      )}

      <div className={`feedback-banner ${phase === 'feedback' ? (lastCorrect ? 'feedback-correct' : 'feedback-wrong') : 'feedback-hidden'}`}>
        <span className="feedback-icon">{isGameOver ? '💔' : lastCorrect ? '🎉' : '😅'}</span>
        <span>
          {isGameOver
            ? t.game.gameOver
            : lastCorrect
              ? correctMsg
              : t.game.oops(question.answer)}
        </span>
        <span className={`streak-msg ${lastCorrect && streak >= 3 ? '' : 'streak-msg--hidden'}`}>
          {t.game.inARow(streak)}
        </span>
        <button className="btn-next" onClick={onNext}>
          {isGameOver || questionNumber >= totalQuestions ? t.game.seeResults : t.game.next}
        </button>
      </div>
    </div>
  );
}
