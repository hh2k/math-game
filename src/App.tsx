import { useState, useEffect } from 'react';
import Home from './components/Home';
import GameScreen from './components/GameScreen';
import Results from './components/Results';
import StatsScreen from './components/StatsScreen';
import { useGame } from './hooks/useGame';
import type { GameConfig } from './types';
import './App.css';

type Screen = 'home' | 'game' | 'results' | 'stats';
export type Theme = 'blue' | 'pink' | 'natural';

function getSavedTheme(): Theme {
  return (localStorage.getItem('mathgame_theme') as Theme) ?? 'blue';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const game = useGame();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (screen === 'game') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [screen]);

  const handleTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('mathgame_theme', t);
  };

  const handleStart = (config: GameConfig) => {
    game.startGame(config);
    setScreen('game');
  };

  const handleQuit = () => {
    game.reset();
    setScreen('home');
  };

  if (screen === 'game' && game.phase === 'finished' && game.result) {
    setScreen('results');
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <Home onStart={handleStart} onViewStats={() => setScreen('stats')} theme={theme} onTheme={handleTheme} />
      )}

      {screen === 'game' && game.currentQuestion && (
        <GameScreen
          question={game.currentQuestion}
          questionNumber={game.currentIndex + 1}
          totalQuestions={game.questions.length}
          score={game.score}
          streak={game.streak}
          elapsed={game.elapsed}
          progress={(game.currentIndex / game.questions.length) * 100}
          phase={game.phase as 'playing' | 'feedback'}
          lastCorrect={game.lastCorrect}
          onAnswer={game.answer}
          onNext={game.next}
          onQuit={handleQuit}
        />
      )}

      {screen === 'results' && game.result && (
        <Results
          result={game.result}
          newAchievements={game.newAchievements}
          onPlayAgain={() => { game.reset(); setScreen('home'); }}
          onHome={() => { game.reset(); setScreen('home'); }}
          onViewStats={() => setScreen('stats')}
        />
      )}

      {screen === 'stats' && (
        <StatsScreen onBack={() => setScreen('home')} />
      )}
    </div>
  );
}
