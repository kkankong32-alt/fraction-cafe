import type { FractionValue } from '../types';

// `unit` renders as its own span, separate from numerator/bar/denominator, so it never reads as part of the
// fraction's math notation — it's a label ("컵") sitting next to the fraction, not a 4th line of it.
export function Fraction({ numerator, denominator, unit, className='' }: { numerator:number|'?'; denominator:number; unit?:string; className?:string }) {
  return <span className={`fraction ${className}`} aria-label={`${denominator}분의 ${numerator}${unit?' '+unit:''}`}><span className="numerator">{numerator}</span><span className="fraction-bar"/><span className="denominator">{denominator}</span>{unit&&<span className="unit">{unit}</span>}</span>;
}
export function MixedNumber({ whole, numerator, denominator, unit, className='' }: FractionValue & { unit?:string; className?:string }) {
  if (!numerator) return <span className={`whole-number ${className}`}>{whole}{unit&&<span className="unit">{unit}</span>}</span>;
  return <span className={`mixed-number ${className}`} aria-label={`${whole ? `${whole}와 ` : ''}${denominator}분의 ${numerator}${unit?' '+unit:''}`}>
    {whole > 0 && <span className="whole-number">{whole}</span>}<Fraction numerator={numerator} denominator={denominator} unit={unit}/>
  </span>;
}
export const FractionValueView = ({ value, unit, className='' }: { value:FractionValue; unit?:string; className?:string }) => <MixedNumber {...value} unit={unit} className={className}/>;

export function Equation({ left, op, right, answer, unit }: { left:FractionValue; op:string; right:FractionValue; answer?:FractionValue; unit?:string }) {
  return <div className="equation"><FractionValueView value={left} unit={unit}/><b>{op}</b><FractionValueView value={right} unit={unit}/>{answer && <><b>=</b><FractionValueView value={answer} unit={unit}/></>}</div>;
}
