import { addFractions, subtractFractions } from '../math/fractions';
import type { DayConfig, Order, FractionValue } from '../types';

export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => { state += 0x6D2B79F5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const frac = (whole: number, numerator: number, denominator: number): FractionValue => ({ whole, numerator, denominator });
const pick = <T,>(rng: () => number, arr: T[]) => arr[Math.floor(rng() * arr.length)];
const int = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

type Pair = { d: number; left: FractionValue; right: FractionValue };
const pairKey = (p: Pair) => `${p.d}:${p.left.whole}.${p.left.numerator}-${p.right.whole}.${p.right.numerator}`;

// Builds `count` order pairs from `make(index)`, re-rolling any pair whose operands duplicate an earlier one in the same day.
function buildSequence(count: number, make: (index: number) => Pair): Pair[] {
  const seen = new Set<string>();
  const out: Pair[] = [];
  for (let i = 0; i < count; i++) {
    let pair = make(i);
    let guard = 0;
    while (seen.has(pairKey(pair)) && guard++ < 25) pair = make(i);
    seen.add(pairKey(pair));
    out.push(pair);
  }
  return out;
}

// DAY 1 — 진분수의 덧셈: a + b always stays under one whole cup.
function day1Order(rng: () => number, denoms: number[]): Pair {
  const d = pick(rng, denoms);
  const a = int(rng, 1, d - 2);
  const b = int(rng, 1, d - 1 - a);
  return { d, left: frac(0, a, d), right: frac(0, b, d) };
}

// DAY 2 — 대분수의 덧셈: mixes no-carry, exactly-one, and carry cases across the six orders, with varied whole numbers.
type CarryKind = 'under' | 'exact' | 'over';
function day2Order(rng: () => number, denoms: number[], kind: CarryKind): Pair {
  const d = pick(rng, denoms);
  let a: number, b: number;
  if (kind === 'under') { a = int(rng, 1, d - 2); b = int(rng, 1, d - 1 - a); }
  else if (kind === 'exact') { a = int(rng, 1, d - 1); b = d - a; }
  else { a = int(rng, 2, d - 2); b = int(rng, d - a + 1, d - 1); }
  const leftWhole = int(rng, 1, 3), rightWhole = int(rng, 1, 3);
  return { d, left: frac(leftWhole, a, d), right: frac(rightWhole, b, d) };
}

// DAY 3 — 진분수의 뺄셈: left numerator always exceeds right.
function day3Order(rng: () => number, denoms: number[]): Pair {
  const d = pick(rng, denoms);
  const a = int(rng, 2, d - 1);
  const b = int(rng, 1, a - 1);
  return { d, left: frac(0, a, d), right: frac(0, b, d) };
}

// DAY 4 — 대분수의 뺄셈 ①: numerators never require regrouping (left numerator >= right numerator).
function day4Order(rng: () => number, denoms: number[]): Pair {
  const d = pick(rng, denoms);
  const b = int(rng, 1, d - 2);
  const a = int(rng, b, d - 1);
  const leftWhole = int(rng, 2, 3);
  return { d, left: frac(leftWhole, a, d), right: frac(1, b, d) };
}

// DAY 5 — 자연수와 분수의 뺄셈: fixed, pairwise-distinct starting whole numbers guarantee natural-number variety;
// the first three orders subtract a proper fraction, the last three subtract a mixed number.
function day5Order(rng: () => number, denoms: number[], leftWhole: number, type: 'proper' | 'mixed'): Pair {
  const d = pick(rng, denoms);
  if (type === 'proper') return { d, left: frac(leftWhole, 0, d), right: frac(0, int(rng, 1, d - 1), d) };
  const rightWhole = int(rng, 1, leftWhole - 1);
  return { d, left: frac(leftWhole, 0, d), right: frac(rightWhole, int(rng, 1, d - 1), d) };
}

// DAY 6 — 대분수의 뺄셈 ②: always needs regrouping (left numerator < right numerator); result whole numbers are
// driven by a fixed target list so at least three distinct whole numbers appear across the six orders.
function day6Order(rng: () => number, denoms: number[], resultWhole: number): Pair {
  const d = pick(rng, denoms);
  const rightWhole = int(rng, 1, 3);
  const leftWhole = resultWhole + rightWhole + 1;
  // rightNumerator starts at 2 so leftNumerator (>=1, keeping the left side a genuine mixed number) still has room below it.
  const rightNumerator = int(rng, 2, d - 1);
  const leftNumerator = int(rng, 1, rightNumerator - 1);
  return { d, left: frac(leftWhole, leftNumerator, d), right: frac(rightWhole, rightNumerator, d) };
}

function buildDayPairs(day: DayConfig, rng: () => number, denoms: number[]): Pair[] {
  switch (day.mechanic) {
    case 'proper-addition': return buildSequence(6, () => day1Order(rng, denoms));
    case 'mixed-addition': {
      const kinds: CarryKind[] = ['under', 'under', 'exact', 'over', 'over', 'over'];
      return buildSequence(6, i => day2Order(rng, denoms, kinds[i]));
    }
    case 'proper-subtraction': return buildSequence(6, () => day3Order(rng, denoms));
    case 'mixed-subtraction': return buildSequence(6, () => day4Order(rng, denoms));
    case 'whole-subtraction': {
      const wholes = [1, 2, 4, 3, 5, 6];
      const types: Array<'proper' | 'mixed'> = ['proper', 'proper', 'proper', 'mixed', 'mixed', 'mixed'];
      return buildSequence(6, i => day5Order(rng, denoms, wholes[i], types[i]));
    }
    case 'regroup-subtraction': {
      const resultWholes = [1, 2, 3, 1, 2, 4];
      return buildSequence(6, i => day6Order(rng, denoms, resultWholes[i]));
    }
  }
}

export function generateOrders(day: DayConfig, seed: number): Order[] {
  const rng = seededRandom(seed + day.id * 1009);
  const denoms = day.id < 3 ? [4, 5, 6, 8] : [4, 5, 6, 8, 10];
  const queue = customerSequence(rng, 6);
  const pairs = buildDayPairs(day, rng, denoms);
  return pairs.map(({ d, left, right }, index) => {
    const answer = day.mechanic.includes('addition') ? addFractions(left, right) : subtractFractions(left, right);
    return { id: index + 1, customer: queue[index], drink: Math.floor(rng() * 4), denominator: d, left, right, answer, patienceMs: (day.id === 4 ? 30000 : 45000) + Math.floor(rng() * 9000) };
  });
}

export function customerSequence(rng:()=>number,count:number){const sequence:number[]=[];let bag:number[]=[];while(sequence.length<count){if(!bag.length)bag=[1,2,3,4,5];const candidates=bag.filter(id=>!sequence.slice(-2).includes(id));const pool=candidates.length?candidates:bag.filter(id=>id!==sequence.at(-1));const id=pool[Math.floor(rng()*pool.length)];sequence.push(id);bag.splice(bag.indexOf(id),1)}return sequence}

export const calculateScore = (patience: number, combo: number, firstTry: boolean) =>
  100 + (firstTry ? 35 : 10) + Math.round(Math.max(0, patience) * 45) + Math.min(60, combo * 10);
