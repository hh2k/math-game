import { useState, useEffect } from 'react';
import Home from './components/Home';
import GameScreen from './components/GameScreen';
import Results from './components/Results';
import StatsScreen from './components/StatsScreen';
import { useGame } from './hooks/useGame';
import type { GameConfig } from './types';
import { LangContext } from './LangContext';
import { translations, type Lang } from './i18n';
import './App.css';

type Screen = 'home' | 'game' | 'results' | 'stats';
export type Theme = 'blue' | 'pink' | 'natural';

function getSavedTheme(): Theme {
  return (localStorage.getItem('mathgame_theme') as Theme) ?? 'blue';
}

function getSavedLang(): Lang {
  return (localStorage.getItem('mathgame_lang') as Lang) ?? 'en';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const [lang, setLangState] = useState<Lang>(getSavedLang);
  const game = useGame(lang);

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

  const handleLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('mathgame_lang', l);
  };

  const handleStart = (config: GameConfig) => {
    game.startGame(config);
    setScreen('game');
  };

  const handleDailyChallenge = () => {
    game.startDaily();
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
    <LangContext.Provider value={{ lang, setLang: handleLang, t: translations[lang] }}>
      <div className="app">
        {screen === 'home' && (
          <Home
            onStart={handleStart}
            onDailyChallenge={handleDailyChallenge}
            onViewStats={() => setScreen('stats')}
            theme={theme}
            onTheme={handleTheme}
          />
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
            livesLeft={game.livesLeft}
            hintsLeft={game.hintsLeft}
            questionTimeLeft={game.questionTimeLeft}
            questionTimeLimit={game.questionTimeLimit}
            eliminatedChoice={game.eliminatedChoice}
            isGameOver={game.isGameOver}
            livesMode={game.livesMode}
            timedMode={game.timedMode}
            onAnswer={game.answer}
            onNext={game.next}
            onHint={game.useHint}
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
    </LangContext.Provider>
  );
}
