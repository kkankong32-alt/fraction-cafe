export type FractionValue = { whole: number; numerator: number; denominator: number };
export type Mode = '1P' | '2P';
export type Screen = 'TITLE' | 'MODE_SELECT' | 'DAY_SELECT' | 'PLAYING' | 'RESULT' | 'GRAND_COMPLETE';
export type PlayPhase = 'PREP' | 'MEASURING' | 'READY_TO_COMBINE' | 'READY_TO_SERVE' | 'FEEDBACK';
export type CustomerMood = 'NORMAL' | 'IMPATIENT' | 'HAPPY';

export type DayConfig = {
  id: number; title: string; concept: string; mechanic: 'proper-addition' | 'mixed-addition' | 'proper-subtraction' | 'mixed-subtraction' | 'whole-subtraction' | 'regroup-subtraction';
  accent: string; short: string;
};

export type Order = {
  id: number; customer: number; drink: number; denominator: number;
  left: FractionValue; right: FractionValue; answer: FractionValue; patienceMs: number;
};

export type PlayerResult = { score: number; correct: number; attempts: number; bestCombo: number; elapsedMs: number; satisfaction: number; stars: number; denominatorAttempts?:number;resultAttempts?:number;measurementAccuracy?:number };
