import type { FractionValue } from '../types';

export const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
export const toImproper = (v: FractionValue) => v.whole * v.denominator + v.numerator;
export function normalizeFraction(v: FractionValue): FractionValue {
  const improper = toImproper(v); const whole = Math.trunc(improper / v.denominator); const remainder = Math.abs(improper % v.denominator);
  if (!remainder) return { whole, numerator: 0, denominator: v.denominator };
  const factor = gcd(remainder, v.denominator);
  return { whole, numerator: remainder / factor, denominator: v.denominator / factor };
}
export const toMixedNumber = (numerator: number, denominator: number): FractionValue => normalizeFraction({ whole: 0, numerator, denominator });
// This unit (같은 분모의 덧셈과 뺄셈) keeps the denominator as-is: whole/remainder split only, no GCD reduction.
export function toMixedSameDenominator(totalUnits: number, denominator: number): FractionValue {
  return { whole: Math.trunc(totalUnits / denominator), numerator: Math.abs(totalUnits % denominator), denominator };
}
export function addFractions(a: FractionValue, b: FractionValue): FractionValue {
  if (a.denominator === b.denominator) return toMixedSameDenominator(toImproper(a) + toImproper(b), a.denominator);
  const denominator = a.denominator * b.denominator;
  return toMixedSameDenominator(toImproper(a) * b.denominator + toImproper(b) * a.denominator, denominator);
}
export function subtractFractions(a: FractionValue, b: FractionValue): FractionValue {
  if (a.denominator === b.denominator) return toMixedSameDenominator(toImproper(a) - toImproper(b), a.denominator);
  const denominator = a.denominator * b.denominator;
  return toMixedSameDenominator(toImproper(a) * b.denominator - toImproper(b) * a.denominator, denominator);
}
export const compareFractions = (a: FractionValue, b: FractionValue) => Math.sign(toImproper(a) * b.denominator - toImproper(b) * a.denominator);
export const canSubtractWithoutRegrouping = (a: FractionValue, b: FractionValue) => a.numerator >= b.numerator;
export function regroupMixedNumber(v: FractionValue): FractionValue {
  if (v.whole < 1) return v;
  return { whole: v.whole - 1, numerator: v.numerator + v.denominator, denominator: v.denominator };
}
export const sameValue = (a: FractionValue, b: FractionValue) => toImproper(a) * b.denominator === toImproper(b) * a.denominator;
