import { describe,expect,it } from 'vitest';
import { addFractions,subtractFractions,toMixedNumber,canSubtractWithoutRegrouping,regroupMixedNumber } from './fractions';
const f=(whole:number,numerator:number,denominator:number)=>({whole,numerator,denominator});
describe('fraction engine',()=>{
  it('adds fractions',()=>expect(addFractions(f(0,3,8),f(0,2,8))).toEqual(f(0,5,8)));
  it('subtracts fractions without auto-reducing the denominator',()=>expect(subtractFractions(f(0,7,8),f(0,3,8))).toEqual(f(0,4,8)));
  it('converts to a mixed number',()=>expect(toMixedNumber(12,5)).toEqual(f(2,2,5)));
  it('detects and performs regrouping',()=>{expect(canSubtractWithoutRegrouping(f(3,1,5),f(1,4,5))).toBe(false);expect(regroupMixedNumber(f(3,1,5))).toEqual(f(2,6,5));});
});
