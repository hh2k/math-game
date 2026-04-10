export type Lang = 'en' | 'da';

export const translations = {
  en: {
    home: {
      tagline: 'Learn math the fun way!',
      statLabels: { bestScore: 'Best Score', games: 'Games', bestStreak: 'Best Streak', accuracy: 'Accuracy' },
      topics: { title: 'Choose Topics', selectAll: 'Select All', deselectAll: 'Deselect All', hint: 'Pick one or more — questions will mix them!' },
      difficultyTitle: 'Difficulty',
      questionsTitle: 'Questions',
      gameModes: { title: 'Game Modes', livesLabel: 'Lives Mode', livesDesc: '3 chances per game', timedLabel: 'Timed Mode', timedDesc: 'Race the clock!' },
      hints: { title: 'Hints', desc: 'eliminate a wrong answer', none: 'None' },
      startGame: 'Start Game',
      dailyChallenge: 'Daily Challenge',
      myProgress: 'My Progress',
      operations: {
        addition:       { label: 'Addition',       desc: 'Add numbers together' },
        subtraction:    { label: 'Subtraction',    desc: 'Find the difference' },
        multiplication: { label: 'Multiplication', desc: 'Multiply numbers' },
        division:       { label: 'Division',       desc: 'Divide numbers evenly' },
        fractions:      { label: 'Fractions',      desc: 'Work with fractions' },
        percentages:    { label: 'Percentages',    desc: 'Work with percentages' },
      },
      difficulties: {
        easy: 'Easy', medium: 'Medium', hard: 'Hard',
      },
    },
    game: {
      quit: 'Quit',
      correct: [
        'Correct! Keep it up!',
        'Amazing! You nailed it!',
        "That's right! You're on fire!",
        'Brilliant! Well done!',
        'Spot on! You\'re a math star!',
        'Yes! You got it right!',
        'Awesome job! Keep going!',
        'Perfect answer! Great work!',
      ],
      oops: (answer: number) => `Oops! The answer was ${answer}`,
      inARow: (streak: number) => `${streak} in a row!`,
      next: 'Next',
      seeResults: 'See Results',
      gameOver: 'Game Over! No lives left.',
      useHint: (n: number) => `Use Hint (${n} left)`,
      bonusPts: (pts: number) => `(+${pts} bonus!)`,
      quitDialog: { title: 'Quit this game?', message: 'Your progress will be lost.', yes: 'Yes, Quit', keep: 'Keep Playing' },
    },
    results: {
      grades: { perfect: 'Perfect!', outstanding: 'Outstanding!', greatJob: 'Great Job!', goodWork: 'Good Work!', keepTrying: 'Keep Trying!', practiceMore: 'Practice More!' },
      points: 'points',
      xpLabel: (xp: number, level: number, name: string) => `+${xp} XP · Lv.${level} ${name}`,
      stats: { correct: 'Correct', accuracy: 'Accuracy', time: 'Time', bestStreak: 'Best Streak' },
      newAchievements: 'New Achievements!',
      playAgain: 'Play Again',
      myProgress: 'My Progress',
      home: 'Home',
    },
    stats: {
      title: 'My Progress',
      resetBtn: 'Reset progress',
      resetModal: { title: 'Reset Progress?', message: 'This will permanently delete all your scores, achievements, and game history.', cancel: 'Cancel', yes: 'Yes, Reset' },
      xpMaxLevel: 'Max Level!',
      overview: { bestScore: 'Best Score', games: 'Games', accuracy: 'Accuracy', bestStreak: 'Best Streak', questions: 'Questions', totalScore: 'Total Score' },
      achievementsTitle: (unlocked: number, total: number) => `Achievements (${unlocked}/${total})`,
      recentGames: 'Recent Games',
      back: 'Back',
    },
    level: { prefix: 'Lv.' },
  },
  da: {
    home: {
      tagline: 'Lær matematik på den sjove måde!',
      statLabels: { bestScore: 'Bedste score', games: 'Spil', bestStreak: 'Bedste serie', accuracy: 'Præcision' },
      topics: { title: 'Vælg emner', selectAll: 'Vælg alle', deselectAll: 'Fravælg alle', hint: 'Vælg et eller flere — spørgsmål blandes!' },
      difficultyTitle: 'Sværhedsgrad',
      questionsTitle: 'Spørgsmål',
      gameModes: { title: 'Spiltilstande', livesLabel: 'Liv-tilstand', livesDesc: '3 chancer per spil', timedLabel: 'Tidsbegrænset', timedDesc: 'Kap med uret!' },
      hints: { title: 'Hints', desc: 'fjern et forkert svar', none: 'Ingen' },
      startGame: 'Start spil',
      dailyChallenge: 'Dagens udfordring',
      myProgress: 'Min fremgang',
      operations: {
        addition:       { label: 'Addition',       desc: 'Læg tal sammen' },
        subtraction:    { label: 'Subtraktion',    desc: 'Find forskellen' },
        multiplication: { label: 'Multiplikation', desc: 'Gang tal' },
        division:       { label: 'Division',       desc: 'Del tal ligeligt' },
        fractions:      { label: 'Brøker',         desc: 'Arbejd med brøker' },
        percentages:    { label: 'Procenter',      desc: 'Arbejd med procenter' },
      },
      difficulties: {
        easy: 'Let', medium: 'Mellem', hard: 'Svær',
      },
    },
    game: {
      quit: 'Afslut',
      correct: [
        'Rigtigt! Fortsæt sådan!',
        'Fantastisk! Du ramte den!',
        'Præcis rigtigt! Du er på vej!',
        'Brilliant! Godt gjort!',
        'Du er en mattestjerne!',
        'Ja! Du fik det rigtigt!',
        'Flot arbejde! Bliv ved!',
        'Perfekt svar! Godt klaret!',
      ],
      oops: (answer: number) => `Ups! Svaret var ${answer}`,
      inARow: (streak: number) => `${streak} i træk!`,
      next: 'Næste',
      seeResults: 'Se resultater',
      gameOver: 'Spillet er slut! Ingen liv tilbage.',
      useHint: (n: number) => `Brug hint (${n} tilbage)`,
      bonusPts: (pts: number) => `(+${pts} bonus!)`,
      quitDialog: { title: 'Afslut spillet?', message: 'Din fremgang vil gå tabt.', yes: 'Ja, afslut', keep: 'Fortsæt spillet' },
    },
    results: {
      grades: { perfect: 'Perfekt!', outstanding: 'Fremragende!', greatJob: 'Godt arbejde!', goodWork: 'Godt klaret!', keepTrying: 'Bliv ved!', practiceMore: 'Øv dig mere!' },
      points: 'point',
      xpLabel: (xp: number, level: number, name: string) => `+${xp} XP · Niv.${level} ${name}`,
      stats: { correct: 'Rigtige', accuracy: 'Præcision', time: 'Tid', bestStreak: 'Bedste serie' },
      newAchievements: 'Nye præstationer!',
      playAgain: 'Spil igen',
      myProgress: 'Min fremgang',
      home: 'Hjem',
    },
    stats: {
      title: 'Min fremgang',
      resetBtn: 'Nulstil fremgang',
      resetModal: { title: 'Nulstil fremgang?', message: 'Dette vil permanent slette alle dine scores, præstationer og spilhistorik.', cancel: 'Annuller', yes: 'Ja, nulstil' },
      xpMaxLevel: 'Maks niveau!',
      overview: { bestScore: 'Bedste score', games: 'Spil', accuracy: 'Præcision', bestStreak: 'Bedste serie', questions: 'Spørgsmål', totalScore: 'Total score' },
      achievementsTitle: (unlocked: number, total: number) => `Præstationer (${unlocked}/${total})`,
      recentGames: 'Seneste spil',
      back: 'Tilbage',
    },
    level: { prefix: 'Niv.' },
  },
};

export type T = typeof translations.en;

export const LEVEL_NAMES: Record<Lang, string[]> = {
  en: ['Math Seedling', 'Math Sprout', 'Math Student', 'Math Thinker', 'Math Solver', 'Math Expert', 'Math Master', 'Math Wizard', 'Math Legend', 'Math Prodigy'],
  da: ['Matematik Frø', 'Matematik Spire', 'Matematik Elev', 'Matematik Tænker', 'Matematik Løser', 'Matematik Ekspert', 'Matematik Mester', 'Matematik Troldmand', 'Matematik Legende', 'Matematik Vidunderbarn'],
};

export const ACHIEVEMENT_STRINGS: Record<Lang, Record<string, { name: string; description: string }>> = {
  en: {
    first_game:      { name: 'First Steps',    description: 'Complete your first game!' },
    perfect_10:      { name: 'Perfect 10',     description: 'Get a 10-answer streak in one game' },
    speed_demon:     { name: 'Speed Demon',    description: 'Finish a 10-question game in under 60 seconds' },
    math_whiz:       { name: 'Math Whiz',      description: 'Score 500+ points in a single game' },
    streak_5:        { name: 'On Fire',        description: 'Get a 5-answer streak' },
    hundred_answers: { name: 'Century Club',   description: 'Answer 100 questions total' },
    hard_mode:       { name: 'Hard Core',      description: 'Complete a hard game with all correct answers' },
    all_ops:         { name: 'All Rounder',    description: 'Play all 6 operation types' },
    sharpshooter:    { name: 'Sharpshooter',   description: '100% accuracy in a game with 5+ questions' },
    lightning:       { name: 'Lightning',      description: 'Finish a 10-question game in under 40 seconds' },
    ice_cold:        { name: 'Ice Cold',       description: 'Answer correctly right after getting one wrong' },
    consistent:      { name: 'Consistent',     description: 'Play 3 days in a row' },
    big_numbers:     { name: 'Big Numbers',    description: 'Complete a hard difficulty game' },
    veteran:         { name: 'Veteran',        description: 'Play 25 total games' },
    night_owl:       { name: 'Night Owl',      description: 'Play after 10pm' },
    slow_steady:     { name: 'Slow & Steady',  description: 'Complete a hard game with all correct answers (no lives mode)' },
  },
  da: {
    first_game:      { name: 'Første skridt',       description: 'Gennemfør dit første spil!' },
    perfect_10:      { name: 'Perfekte 10',          description: 'Få 10 rigtige i træk i ét spil' },
    speed_demon:     { name: 'Speedster',            description: 'Gennemfør et spil med 10 spørgsmål på under 60 sekunder' },
    math_whiz:       { name: 'Matematikgeni',        description: 'Score 500+ point i et enkelt spil' },
    streak_5:        { name: 'På den varme',         description: 'Få 5 rigtige i træk' },
    hundred_answers: { name: 'Hundredklubben',       description: 'Besvar 100 spørgsmål i alt' },
    hard_mode:       { name: 'Hård kerne',           description: 'Gennemfør et svært spil med alle rigtige svar' },
    all_ops:         { name: 'Altmuligmand',         description: 'Spil alle 6 operationstyper' },
    sharpshooter:    { name: 'Skarpskytter',         description: '100% præcision i et spil med 5+ spørgsmål' },
    lightning:       { name: 'Lyn',                  description: 'Gennemfør et spil med 10 spørgsmål på under 40 sekunder' },
    ice_cold:        { name: 'Iskold',               description: 'Svar rigtigt lige efter et forkert svar' },
    consistent:      { name: 'Konsekvent',           description: 'Spil 3 dage i træk' },
    big_numbers:     { name: 'Store tal',            description: 'Gennemfør et spil på svær sværhedsgrad' },
    veteran:         { name: 'Veteran',              description: 'Spil 25 spil i alt' },
    night_owl:       { name: 'Nattugle',             description: 'Spil efter kl. 22' },
    slow_steady:     { name: 'Langsomt og støt',     description: 'Gennemfør et svært spil med alle rigtige svar (uden liv-tilstand)' },
  },
};

export interface FractionPrompts {
  improper: (whole: number, numer: number, denom: number) => string;
  sameDenom: (n1: number, n2: number, denom: number) => string;
  diffDenom: (n1: number, denom1: number, n2: number, denom2: number, lcd: number) => string;
}

export const fractionPrompts: Record<Lang, FractionPrompts> = {
  en: {
    improper: (w, n, d) => `What is ${w} and ${n}/${d} as an improper fraction numerator (denom: ${d})?`,
    sameDenom: (n1, n2, d) => `${n1}/${d} + ${n2}/${d} = ?/${d}`,
    diffDenom: (n1, d1, n2, d2, lcd) => `${n1}/${d1} + ${n2}/${d2} = ?/${lcd}`,
  },
  da: {
    improper: (w, n, d) => `Hvad er ${w} og ${n}/${d} som uægte brøk tæller (nævner: ${d})?`,
    sameDenom: (n1, n2, d) => `${n1}/${d} + ${n2}/${d} = ?/${d}`,
    diffDenom: (n1, d1, n2, d2, lcd) => `${n1}/${d1} + ${n2}/${d2} = ?/${lcd}`,
  },
};
