import type { Question, Operation, Difficulty } from '../types';
import { type Lang, fractionPrompts, type FractionPrompts } from '../i18n';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getAdditionQuestion(difficulty: Difficulty): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 20], medium: [10, 100], hard: [100, 999] };
  const [lo, hi] = ranges[difficulty];
  const a = randomInt(lo, hi);
  const b = randomInt(lo, hi);
  return { prompt: `${a} + ${b}`, answer: a + b, points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30 };
}

function getSubtractionQuestion(difficulty: Difficulty): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 20], medium: [10, 100], hard: [100, 999] };
  const [lo, hi] = ranges[difficulty];
  const b = randomInt(lo, hi);
  const a = randomInt(b, hi);
  return { prompt: `${a} − ${b}`, answer: a - b, points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30 };
}

function getMultiplicationQuestion(difficulty: Difficulty): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 5], medium: [2, 10], hard: [6, 12] };
  const [lo, hi] = ranges[difficulty];
  const a = randomInt(lo, hi);
  const b = randomInt(lo, hi);
  return { prompt: `${a} × ${b}`, answer: a * b, points: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40 };
}

function getDivisionQuestion(difficulty: Difficulty): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 5], medium: [2, 10], hard: [6, 12] };
  const [lo, hi] = ranges[difficulty];
  const b = randomInt(lo, hi);
  const answer = randomInt(lo, hi);
  const a = b * answer;
  return { prompt: `${a} ÷ ${b}`, answer, points: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40 };
}

function getFractionQuestion(difficulty: Difficulty, prompts: FractionPrompts): { prompt: string; answer: number; points: number } {
  if (difficulty === 'easy') {
    const denom = randomInt(2, 4);
    const numer = randomInt(1, denom - 1);
    const whole = randomInt(1, 10);
    const answer = whole * denom + numer;
    return { prompt: prompts.improper(whole, numer, denom), answer, points: 20 };
  } else if (difficulty === 'medium') {
    const denom = randomInt(2, 6);
    const n1 = randomInt(1, denom - 1);
    const n2 = randomInt(1, denom - 1);
    return { prompt: prompts.sameDenom(n1, n2, denom), answer: n1 + n2, points: 30 };
  } else {
    const denom1 = randomInt(2, 4);
    const denom2 = randomInt(2, 4);
    const n1 = randomInt(1, denom1);
    const n2 = randomInt(1, denom2);
    const lcd = (denom1 * denom2) / gcd(denom1, denom2);
    const sum = n1 * (lcd / denom1) + n2 * (lcd / denom2);
    return { prompt: prompts.diffDenom(n1, denom1, n2, denom2, lcd), answer: sum, points: 50 };
  }
}

function getPercentageQuestion(difficulty: Difficulty): { prompt: string; answer: number; points: number } {
  if (difficulty === 'easy') {
    // Simple percentages: 10, 25, 50, 75 of small multiples
    const pctOptions: [number, number[]][] = [
      [10, [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]],
      [25, [4, 8, 12, 16, 20, 40, 60, 80, 100]],
      [50, [2, 4, 6, 8, 10, 20, 30, 40, 50]],
      [75, [4, 8, 12, 16, 20, 40]],
    ];
    const [pct, nums] = pctOptions[randomInt(0, pctOptions.length - 1)];
    const num = nums[randomInt(0, nums.length - 1)];
    const answer = Math.round(num * pct / 100);
    return { prompt: `${pct}% of ${num}`, answer, points: 20 };
  } else if (difficulty === 'medium') {
    // 10–90% (multiples of 10) of multiples of 10
    const pct = randomInt(1, 9) * 10;
    const num = randomInt(1, 10) * 10;
    const answer = Math.round(num * pct / 100);
    return { prompt: `${pct}% of ${num}`, answer, points: 35 };
  } else {
    // 5, 15, 25, 35, 45% of multiples of 20
    const pcts = [5, 15, 25, 35, 45];
    const pct = pcts[randomInt(0, pcts.length - 1)];
    const num = randomInt(1, 10) * 20;
    const answer = Math.round(num * pct / 100);
    return { prompt: `${pct}% of ${num}`, answer, points: 50 };
  }
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function generateChoices(answer: number): number[] {
  const wrong = new Set<number>();
  const spread = Math.max(3, Math.floor(answer * 0.3));
  while (wrong.size < 3) {
    const delta = randomInt(1, spread);
    const sign = Math.random() > 0.5 ? 1 : -1;
    const w = answer + sign * delta;
    if (w !== answer && w >= 0 && !wrong.has(w)) wrong.add(w);
  }
  return shuffle([answer, ...Array.from(wrong)]);
}

export function generateQuestion(operations: Operation[], difficulty: Difficulty, lang: Lang): Question {
  let raw: { prompt: string; answer: number; points: number };
  const effectiveOp = operations[randomInt(0, operations.length - 1)];

  switch (effectiveOp) {
    case 'addition':       raw = getAdditionQuestion(difficulty); break;
    case 'subtraction':    raw = getSubtractionQuestion(difficulty); break;
    case 'multiplication': raw = getMultiplicationQuestion(difficulty); break;
    case 'division':       raw = getDivisionQuestion(difficulty); break;
    case 'fractions':      raw = getFractionQuestion(difficulty, fractionPrompts[lang]); break;
    case 'percentages':    raw = getPercentageQuestion(difficulty); break;
    default:               raw = getAdditionQuestion(difficulty);
  }

  return {
    id: Math.random().toString(36).slice(2),
    prompt: raw.prompt,
    answer: raw.answer,
    choices: generateChoices(raw.answer),
    operation: effectiveOp,
    points: raw.points,
  };
}

export function generateQuestions(operations: Operation[], difficulty: Difficulty, count: number, lang: Lang): Question[] {
  const questions: Question[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  while (questions.length < count && attempts < count * 20) {
    attempts++;
    const q = generateQuestion(operations, difficulty, lang);
    if (!seen.has(q.prompt)) {
      seen.add(q.prompt);
      questions.push(q);
    }
  }
  return questions;
}

const DAILY_OPERATIONS: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'percentages'];

export function generateDailyQuestions(lang: Lang): Question[] {
  const today = new Date().toDateString();
  const cacheKey = `mathgame_daily_${lang}_${today}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as Question[];
  } catch { /* ignore */ }
  const questions = generateQuestions(DAILY_OPERATIONS, 'medium', 10, lang);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(questions));
  } catch { /* ignore */ }
  return questions;
}
