import { describe,expect,it } from 'vitest';
import { days } from '../data/gameData';
import { generateOrders,calculateScore } from './generator';
import { canSubtractWithoutRegrouping } from '../math/fractions';
describe('orders and score',()=>{
  it('same seed creates the same relay orders',()=>expect(generateOrders(days[5],42)).toEqual(generateOrders(days[5],42)));
  it('DAY 4 never needs regrouping',()=>generateOrders(days[3],7).forEach(o=>expect(canSubtractWithoutRegrouping(o.left,o.right)).toBe(true)));
  it('DAY 6 always needs regrouping',()=>generateOrders(days[5],7).forEach(o=>expect(canSubtractWithoutRegrouping(o.left,o.right)).toBe(false)));
  it('rewards accuracy, patience and combo',()=>expect(calculateScore(1,3,true)).toBeGreaterThan(calculateScore(.2,0,false)));
});
