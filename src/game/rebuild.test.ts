import {describe,it,expect} from 'vitest';
import {customerSequence,seededRandom,generateOrders} from './generator';
import {days} from '../data/gameData';
import {toImproper,compareFractions} from '../math/fractions';
describe('rebuild invariants',()=>{
 it('shuffled bags avoid the previous two customers over 100 seeds',()=>{for(let seed=0;seed<100;seed++){const q=customerSequence(seededRandom(seed),100);q.forEach((id,i)=>expect(q.slice(Math.max(0,i-2),i)).not.toContain(id));for(let i=0;i<100;i+=5)expect(new Set(q.slice(i,i+5)).size).toBe(5)}});
 it('all six days preserve nonnegative valid same-denominator problems and relay equality',()=>{for(const day of days)for(let s=0;s<50;s++){const q=generateOrders(day,s);expect(q).toEqual(generateOrders(day,s));q.forEach(o=>{expect(o.left.denominator).toBe(o.right.denominator);expect(toImproper(o.answer)).toBeGreaterThan(0);if(day.id===4)expect(o.left.numerator).toBeGreaterThanOrEqual(o.right.numerator);if(day.id===6)expect(o.left.numerator).toBeLessThan(o.right.numerator);if(day.id>2)expect(compareFractions(o.left,o.right)).toBe(1)})}});
});
