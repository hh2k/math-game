import type { Question, Operation, Difficulty } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cap(value: number, max: number): number {
  return Math.min(value, max);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getAdditionQuestion(difficulty: Difficulty, maxNumber: number): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 20], medium: [10, 100], hard: [100, 999] };
  const [min, max] = ranges[difficulty];
  const hi = cap(max, maxNumber);
  const lo = Math.min(min, hi);
  const a = randomInt(lo, hi);
  const b = randomInt(lo, hi);
  return { prompt: `${a} + ${b}`, answer: a + b, points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30 };
}

function getSubtractionQuestion(difficulty: Difficulty, maxNumber: number): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 20], medium: [10, 100], hard: [100, 999] };
  const [min, max] = ranges[difficulty];
  const hi = cap(max, maxNumber);
  const lo = Math.min(min, hi);
  const b = randomInt(lo, hi);
  const a = randomInt(b, hi);
  return { prompt: `${a} − ${b}`, answer: a - b, points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30 };
}

function getMultiplicationQuestion(difficulty: Difficulty, maxNumber: number): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 5], medium: [2, 10], hard: [6, 12] };
  const [min, max] = ranges[difficulty];
  const hi = cap(max, maxNumber);
  const lo = Math.min(min, hi);
  const a = randomInt(lo, hi);
  const b = randomInt(lo, hi);
  return { prompt: `${a} × ${b}`, answer: a * b, points: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40 };
}

function getDivisionQuestion(difficulty: Difficulty, maxNumber: number): { prompt: string; answer: number; points: number } {
  const ranges = { easy: [1, 5], medium: [2, 10], hard: [6, 12] };
  const [min, max] = ranges[difficulty];
  const hi = cap(max, maxNumber);
  const lo = Math.min(min, hi);
  const b = randomInt(lo, hi);
  const answer = randomInt(lo, hi);
  const a = b * answer;
  return { prompt: `${a} ÷ ${b}`, answer, points: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40 };
}

function getFractionQuestion(difficulty: Difficulty): { prompt: string; answer: number; points: number } {
  if (difficulty === 'easy') {
    const denom = randomInt(2, 4);
    const numer = randomInt(1, denom - 1);
    const whole = randomInt(1, 10);
    const answer = whole * denom + numer;
    return { prompt: `What is ${whole} and ${numer}/${denom} as an improper fraction numerator (denom: ${denom})?`, answer, points: 20 };
  } else if (difficulty === 'medium') {
    const denom = randomInt(2, 6);
    const n1 = randomInt(1, denom - 1);
    const n2 = randomInt(1, denom - 1);
    return { prompt: `${n1}/${denom} + ${n2}/${denom} = ?/${denom}`, answer: n1 + n2, points: 30 };
  } else {
    const denom1 = randomInt(2, 4);
    const denom2 = randomInt(2, 4);
    const n1 = randomInt(1, denom1);
    const n2 = randomInt(1, denom2);
    const lcd = (denom1 * denom2) / gcd(denom1, denom2);
    const sum = n1 * (lcd / denom1) + n2 * (lcd / denom2);
    return { prompt: `${n1}/${denom1} + ${n2}/${denom2} = ?/${lcd}`, answer: sum, points: 50 };
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

export function generateQuestion(operations: Operation[], difficulty: Difficulty, maxNumber: number): Question {
  let raw: { prompt: string; answer: number; points: number };
  const effectiveOp = operations[randomInt(0, operations.length - 1)];

  switch (effectiveOp) {
    case 'addition':      raw = getAdditionQuestion(difficulty, maxNumber); break;
    case 'subtraction':   raw = getSubtractionQuestion(difficulty, maxNumber); break;
    case 'multiplication': raw = getMultiplicationQuestion(difficulty, maxNumber); break;
    case 'division':      raw = getDivisionQuestion(difficulty, maxNumber); break;
    case 'fractions':     raw = getFractionQuestion(difficulty); break;
    default:              raw = getAdditionQuestion(difficulty, maxNumber);
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

export function generateQuestions(operations: Operation[], difficulty: Difficulty, count: number, maxNumber: number): Question[] {
  return Array.from({ length: count }, () => generateQuestion(operations, difficulty, maxNumber));
}
