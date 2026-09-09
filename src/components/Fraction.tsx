import type { FractionValue } from '../types';

export function Fraction({ numerator, denominator, className='' }: { numerator:number|'?'; denominator:number; className?:string }) {
  return <span className={`fraction ${className}`} aria-label={`${denominator}분의 ${numerator}`}><span className="numerator">{numerator}</span><span className="fraction-bar"/><span className="denominator">{denominator}</span></span>;
}
export function MixedNumber({ whole, numerator, denominator, className='' }: FractionValue & { className?:string }) {
  if (!numerator) return <span className={`whole-number ${className}`}>{whole}</span>;
  return <span className={`mixed-number ${className}`} aria-label={`${whole ? `${whole}와 ` : ''}${denominator}분의 ${numerator}`}>
    {whole > 0 && <span className="whole-number">{whole}</span>}<Fraction numerator={numerator} denominator={denominator}/>
  </span>;
}
export const FractionValueView = ({ value, className='' }: { value:FractionValue; className?:string }) => <MixedNumber {...value} className={className}/>;

export function Equation({ left, op, right, answer }: { left:FractionValue; op:string; right:FractionValue; answer?:FractionValue }) {
  return <div className="equation"><FractionValueView value={left}/><b>{op}</b><FractionValueView value={right}/>{answer && <><b>=</b><FractionValueView value={answer}/></>}</div>;
}
