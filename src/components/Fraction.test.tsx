import {describe,expect,it} from 'vitest';
import {render,screen} from '@testing-library/react';
import {Fraction,MixedNumber} from './Fraction';
describe('textbook fraction UI',()=>{
  it('uses stacked DOM and Korean aria label without slash math',()=>{const {container}=render(<Fraction numerator={3} denominator={8}/>);expect(screen.getByLabelText('8분의 3')).not.toBeNull();expect(container.textContent).not.toMatch(/\d+\s*\/\s*\d+/)});
  it('renders mixed numbers without slash text',()=>{const {container}=render(<MixedNumber whole={2} numerator={1} denominator={5}/>);expect(container.textContent).not.toContain('/')});
});
