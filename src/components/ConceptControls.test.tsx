import {describe,expect,it,vi} from 'vitest';
import {fireEvent,render,screen} from '@testing-library/react';
import {ResultLabel} from './ConceptControls';

describe('ResultLabel whole-number stepper',()=>{
  it('lets the whole number reach the actual correct answer even when it is above the old hardcoded cap of 6',()=>{
    // 3 4/8 + 3 5/8 = 57/8 = 7 1/8: the whole number needed is 7, one past the old fixed limit.
    render(<ResultLabel d={8} total={57} mixed addition color="#000" disabled={false} onAttempt={vi.fn()}/>);
    const inc=()=>fireEvent.click(screen.getByRole('button',{name:'온전한 수 늘리기'}));
    for(let i=0;i<7;i++)inc();
    const readouts=screen.getAllByText('7');
    expect(readouts.length).toBeGreaterThan(0);
    expect((screen.getByRole('button',{name:'온전한 수 늘리기'}) as HTMLButtonElement).disabled).toBe(false);
  });
  it('still stops climbing well past any answer the current problems would ever need',()=>{
    render(<ResultLabel d={4} total={3} mixed addition color="#000" disabled={false} onAttempt={vi.fn()}/>);
    const inc=()=>fireEvent.click(screen.getByRole('button',{name:'온전한 수 늘리기'}));
    for(let i=0;i<20;i++)inc();
    expect((screen.getByRole('button',{name:'온전한 수 늘리기'}) as HTMLButtonElement).disabled).toBe(true);
  });
});
