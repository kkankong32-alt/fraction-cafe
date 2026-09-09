import {describe,expect,it,beforeEach} from 'vitest';
import {days} from '../data/gameData';
import {generateOrders,calculateScore} from './generator';
import {canSubtractWithoutRegrouping} from '../math/fractions';
import {advanceTimedState} from './clock';
import {loadSave,saveData} from '../storage';

describe('game rules',()=>{
  it('DAY 4 only generates no-regrouping orders',()=>expect(generateOrders(days[3],42).every(o=>canSubtractWithoutRegrouping(o.left,o.right))).toBe(true));
  it('DAY 6 always generates regrouping orders',()=>expect(generateOrders(days[5],42).every(o=>!canSubtractWithoutRegrouping(o.left,o.right))).toBe(true));
  it('same seed produces identical sequences',()=>expect(generateOrders(days[1],2026)).toEqual(generateOrders(days[1],2026)));
  it('rewards accuracy, speed and combo',()=>expect(calculateScore(1,4,true)).toBeGreaterThan(calculateScore(.2,0,false)));
  it('freezes timer and patience while paused',()=>{const s={elapsedMs:1000,patience:.8};expect(advanceTimedState(s,500,10000,true)).toEqual(s)});
  it('advances timer and patience while playing',()=>expect(advanceTimedState({elapsedMs:0,patience:1},1000,10000,false)).toEqual({elapsedMs:1000,patience:.9}));
  it('DAY 2 mixes no-carry, exact-one, and carry addition with varied whole numbers',()=>{for(let seed=0;seed<20;seed++){const orders=generateOrders(days[1],seed);const kinds=orders.map(o=>{const sum=o.left.numerator+o.right.numerator;return sum<o.denominator?'under':sum===o.denominator?'exact':'over'});expect(kinds.filter(k=>k==='under').length).toBeGreaterThanOrEqual(2);expect(kinds.filter(k=>k==='exact').length).toBeGreaterThanOrEqual(1);expect(kinds.filter(k=>k==='over').length).toBeGreaterThanOrEqual(2);expect(new Set(orders.flatMap(o=>[o.left.whole,o.right.whole])).size).toBeGreaterThan(1)}});
  it('DAY 5 starting natural numbers are varied and both proper and mixed subtrahends appear',()=>{for(let seed=0;seed<20;seed++){const orders=generateOrders(days[4],seed);expect(new Set(orders.map(o=>o.left.whole)).size).toBeGreaterThanOrEqual(4);expect(orders.some(o=>o.right.whole===0)).toBe(true);expect(orders.some(o=>o.right.whole>0)).toBe(true);orders.forEach(o=>expect(o.answer.whole*o.denominator+o.answer.numerator).toBeGreaterThan(0))}});
  it('DAY 6 result whole numbers are varied and every order regroups',()=>{for(let seed=0;seed<20;seed++){const orders=generateOrders(days[5],seed);expect(new Set(orders.map(o=>o.answer.whole)).size).toBeGreaterThanOrEqual(3);orders.forEach(o=>expect(o.left.numerator).toBeLessThan(o.right.numerator))}});
  it('no seed repeats the same operand pair twice within a day',()=>{for(const day of days)for(let seed=0;seed<10;seed++){const seen=new Set<string>();generateOrders(day,seed).forEach(o=>{const k=`${o.denominator}:${o.left.whole}.${o.left.numerator}-${o.right.whole}.${o.right.numerator}`;expect(seen.has(k)).toBe(false);seen.add(k)})}});
});
describe('save data',()=>{beforeEach(()=>localStorage.clear());it('round-trips localStorage',()=>{const data=loadSave();data.muted=true;saveData(data);expect(loadSave().muted).toBe(true)})});
