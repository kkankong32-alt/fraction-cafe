import {act,cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import CafeApp,{Gameplay} from '../CafeApp';
import {days,drinks,ingredients} from '../data/gameData';
import {generateOrders} from './generator';
import {specialChallenge,denominatorChoices} from '../components/ConceptControls';
import type {Order} from '../types';
import {audio} from '../services/audio';
vi.mock('../services/audio',()=>({audio:{playSfx:vi.fn(),setTrack:vi.fn(),duck:vi.fn(),unlock:vi.fn()}}));
vi.mock('../services/analytics',()=>({event:vi.fn(),initAnalytics:vi.fn()}));
vi.mock('../assets',()=>({asset:(s:string)=>s,manifest:{},preload:vi.fn()}));
afterEach(()=>{cleanup();vi.useRealTimers()});
const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
const units=(v:{whole:number;numerator:number;denominator:number})=>v.whole*v.denominator+v.numerator;
function bonus(seed:number,dayId:number){if(!screen.queryByRole('heading',{name:/특별 주문|긴급 주문/}))return;const c=specialChallenge(seed,dayId);if(c.type==='combine'){click('탄산수 '+c.d+'분의 '+c.a+'컵');click('레몬 베이스 '+c.d+'분의 '+c.b+'컵');click('재료 조합 완성!')}else{click('사용량 '+c.d+'분의 '+c.use+'컵');click('사용량 선택 완료!')}click('보너스 받고 영업 계속하기')}
function measure(day:number,o:Order){if(day<3){for(const [i,v] of [o.left,o.right].entries()){click(ingredients[drinks[o.drink].ingredients[i]].name);for(let n=0;n<units(v);n++)click('붓기');click('계량 완료')}}else{click(ingredients[drinks[o.drink].ingredients[1]].name);if(day>=5)click(day===5?'새 병 열기':'온전한 1 바꾸기');for(let n=0;n<units(o.right);n++)click('재료 덜기');click('계량 완료')}click(day<3?'합치기':'재고 확인')}
function label(day:number,o:Order){const n=day<3?units(o.left)+units(o.right):units(o.left)-units(o.right);for(let i=0;i<Math.floor(n/o.denominator);i++)click('온전한 수 늘리기');if(n%o.denominator===0)click('분자 줄이기');else for(let i=0;i<n%o.denominator;i++)click('분자 늘리기');click(day<3?'완성량 확인':'남은 양 확인')}
const clickIn=(el:HTMLElement,name:string)=>fireEvent.click(within(el).getByRole('button',{name}));
function bonusIn(el:HTMLElement,seed:number,dayId:number){if(!within(el).queryByRole('heading',{name:/특별 주문|긴급 주문/}))return;const c=specialChallenge(seed,dayId);if(c.type==='combine'){clickIn(el,'탄산수 '+c.d+'분의 '+c.a+'컵');clickIn(el,'레몬 베이스 '+c.d+'분의 '+c.b+'컵');clickIn(el,'재료 조합 완성!')}else{clickIn(el,'사용량 '+c.d+'분의 '+c.use+'컵');clickIn(el,'사용량 선택 완료!')}clickIn(el,'보너스 받고 영업 계속하기')}
function measureIn(el:HTMLElement,day:number,o:Order){if(day<3){for(const [i,v] of [o.left,o.right].entries()){clickIn(el,ingredients[drinks[o.drink].ingredients[i]].name);for(let n=0;n<units(v);n++)clickIn(el,'붓기');clickIn(el,'계량 완료')}}else{clickIn(el,ingredients[drinks[o.drink].ingredients[1]].name);if(day>=5)clickIn(el,day===5?'새 병 열기':'온전한 1 바꾸기');for(let n=0;n<units(o.right);n++)clickIn(el,'재료 덜기');clickIn(el,'계량 완료')}clickIn(el,day<3?'합치기':'재고 확인')}
function labelIn(el:HTMLElement,day:number,o:Order){const n=day<3?units(o.left)+units(o.right):units(o.left)-units(o.right);for(let i=0;i<Math.floor(n/o.denominator);i++)clickIn(el,'온전한 수 늘리기');if(n%o.denominator===0)clickIn(el,'분자 줄이기');else for(let i=0;i<n%o.denominator;i++)clickIn(el,'분자 늘리기');clickIn(el,day<3?'완성량 확인':'남은 양 확인')}
function stubMultiTouch(points:number){const original=Object.getOwnPropertyDescriptor(navigator,'maxTouchPoints');Object.defineProperty(navigator,'maxTouchPoints',{value:points,configurable:true});return()=>{if(original)Object.defineProperty(navigator,'maxTouchPoints',original);else Object.defineProperty(navigator,'maxTouchPoints',{value:0,configurable:true})}}
for(const day of days)it('DAY '+day.id+': six gated orders, wrong answers, pause and duplicate serving',()=>{
 vi.useFakeTimers();const done=vi.fn();const props={day,mode:'1P' as const,player:1,staffId:0,seed:112233,paused:false,onHelp:vi.fn(),onLearn:vi.fn(),onSettings:vi.fn(),onExit:vi.fn(),onComplete:done};const view=render(<Gameplay {...props}/>);
 expect(view.container.querySelectorAll('.cup-division').length).toBe(0);expect((screen.getByRole('button',{name:'서빙하기'}) as HTMLButtonElement).disabled).toBe(true);
 const before=view.container.querySelector('.patience-gauge')!.getAttribute('aria-label');view.rerender(<Gameplay {...props} paused/>);act(()=>vi.advanceTimersByTime(5000));expect(view.container.querySelector('.patience-gauge')!.getAttribute('aria-label')).toBe(before);view.rerender(<Gameplay {...props}/>);
 for(const o of generateOrders(day,112233)){
 bonus(112233,day.id);if(o.id===1){click(denominatorChoices(o.denominator,112233).find(d=>d!==o.denominator)+'등분');expect(screen.getByRole('status').textContent).toContain('분모를 다시');expect(view.container.querySelectorAll('.cup-division').length).toBe(0)}
 click(o.denominator+'등분');if(o.id===1)click('계량 완료');measure(day.id,o);
 expect(view.container.querySelector('.answer-strip')).toBeNull();expect(view.container.querySelector('.result-clue .quantity-badge')).toBeNull();
 click(day.id<3?'완성량 확인':'남은 양 확인');expect((screen.getByRole('button',{name:'서빙하기'}) as HTMLButtonElement).disabled).toBe(true);expect(view.container.querySelector('.attached-label')).toBeNull();
 label(day.id,o);expect((screen.getByRole('button',{name:'서빙하기'}) as HTMLButtonElement).disabled).toBe(false);click('서빙하기');click('서빙하기');act(()=>vi.advanceTimersByTime(800));
 }
 expect(done).toHaveBeenCalledTimes(1);expect(done.mock.calls[0][0]).toMatchObject({correct:6,denominatorAttempts:7,resultAttempts:12,bestCombo:5});expect(done.mock.calls[0][0].score).toBeGreaterThan(1000);
});
// HoldButton (붓기/비우기/재료 덜기/되돌리기) drives every "pour" through audio.playSfx('pour'), so counting those
// calls is a precise, UI-agnostic way to check exactly how many steps a given input sequence produced — which is
// the thing that was breaking on some touch devices: setPointerCapture throwing mid-handler used to abort the
// whole pointerdown before the step (or the long-press timer) ever ran.
function setupPourButton(){
 vi.useFakeTimers();
 const props={day:days[0],mode:'1P' as const,player:1,staffId:0,seed:112233,paused:false,onHelp:vi.fn(),onLearn:vi.fn(),onSettings:vi.fn(),onExit:vi.fn(),onComplete:vi.fn()};
 render(<Gameplay {...props}/>);
 const o=generateOrders(days[0],112233)[0];
 click(o.denominator+'등분');
 click(ingredients[drinks[o.drink].ingredients[0]].name);
 const btn=screen.getByRole('button',{name:'붓기'}) as HTMLButtonElement;
 const pourCount=()=>(audio.playSfx as unknown as {mock:{calls:unknown[][]}}).mock.calls.filter(c=>c[0]==='pour').length;
 return {btn,pourCount};
}
it('a short click pours exactly once (Test A/C: plain tap/click)',()=>{
 const {btn,pourCount}=setupPourButton();
 const before=pourCount();
 fireEvent.click(btn);
 expect(pourCount()-before).toBe(1);
});
it('holding the button down keeps pouring roughly every 300ms, same as before (Test B: long-press repeat)',()=>{
 const {btn,pourCount}=setupPourButton();
 const before=pourCount();
 fireEvent.pointerDown(btn,{pointerId:1});
 act(()=>vi.advanceTimersByTime(900));
 fireEvent.pointerUp(btn,{pointerId:1});
 fireEvent.click(btn);
 expect(pourCount()-before).toBe(4);
});
it('a full pointerdown+pointerup+click tap — what real touch/mouse browsers actually dispatch for one press — pours exactly once, never twice (Test F: no duplicate firing)',()=>{
 const {btn,pourCount}=setupPourButton();
 const before=pourCount();
 fireEvent.pointerDown(btn,{pointerId:1});
 fireEvent.pointerUp(btn,{pointerId:1});
 fireEvent.click(btn);
 expect(pourCount()-before).toBe(1);
});
it('still pours exactly once even when setPointerCapture throws (device does not support it) — the interaction no longer gets silently swallowed (Test D)',()=>{
 const {btn,pourCount}=setupPourButton();
 const original=Element.prototype.setPointerCapture;
 Element.prototype.setPointerCapture=()=>{throw new Error('not supported on this device')};
 const before=pourCount();
 try{
  fireEvent.pointerDown(btn,{pointerId:1});
  fireEvent.pointerUp(btn,{pointerId:1});
  fireEvent.click(btn);
  expect(pourCount()-before).toBe(1);
 }finally{Element.prototype.setPointerCapture=original}
});
it('a pointercancel (e.g. a second touch appearing elsewhere in 2P) does not leave the button stuck forever — a later independent tap still pours (regression: reported 2P pour failures)',()=>{
 const {btn,pourCount}=setupPourButton();
 const before=pourCount();
 fireEvent.pointerDown(btn,{pointerId:1}); // pours once immediately
 fireEvent.pointerCancel(btn,{pointerId:1}); // no click follows a real cancel — the old boolean flag stayed "handled" forever after this
 act(()=>vi.advanceTimersByTime(500)); // well past the pointerup→click gap the skip-window is sized for
 fireEvent.click(btn); // a later, unrelated tap where pointerdown doesn't fire this time — must not be swallowed
 expect(pourCount()-before).toBe(2);
});
it('dragging off the button mid-hold stops the repeat, with no leftover interval still firing after release (Test E)',()=>{
 const {btn,pourCount}=setupPourButton();
 const before=pourCount();
 fireEvent.pointerDown(btn,{pointerId:1});
 act(()=>vi.advanceTimersByTime(650));
 fireEvent.pointerLeave(btn,{pointerId:1});
 act(()=>vi.advanceTimersByTime(1500));
 expect(pourCount()-before).toBe(3);
});
it('several quick taps in a row each pour exactly once, with none missed or duplicated (Test F)',()=>{
 const {btn,pourCount}=setupPourButton();
 const before=pourCount();
 for(let i=0;i<3;i++){fireEvent.pointerDown(btn,{pointerId:1});fireEvent.pointerUp(btn,{pointerId:1});fireEvent.click(btn)}
 expect(pourCount()-before).toBe(3);
});
it('2인 대결 is always clickable on a non-touch PC and opens an info modal instead of disabling anything',()=>{
 localStorage.clear();render(<CafeApp/>);
 click('2인 플레이');
 expect(screen.getByRole('heading',{name:'2인 대결 안내'})).not.toBeNull();
 click('돌아가기');
 expect(screen.queryByRole('heading',{name:'2인 대결 안내'})).toBeNull();
});
it('대결 시작! confirms the info modal and enables the full 2P flow with no disabled buttons anywhere, on a plain non-touch device',()=>{
 localStorage.clear();render(<CafeApp/>);
 click('2인 플레이');click('대결 시작!');
 expect(within(document.querySelector('.vs-preview')!).getByText('햇살')).not.toBeNull();
 expect(within(document.querySelector('.vs-preview')!).getByText('봄이')).not.toBeNull();
 expect(screen.queryByText(/PC 테스트 모드/)).toBeNull();
 click('2P 직원 선택 →');
 const startBtn=screen.getByRole('button',{name:'대결 준비 완료! ▶'}) as HTMLButtonElement;
 expect(startBtn.disabled).toBe(false);
 click('대결 준비 완료! ▶');
 expect(within(document.querySelector('.day-portrait.p1')!).getByText('햇살')).not.toBeNull();
 expect(within(document.querySelector('.day-portrait.p2')!).getByText('봄이')).not.toBeNull();
 expect(screen.queryByText(/PC 테스트 모드/)).toBeNull();
 const goBtn=screen.getByRole('button',{name:'영업 시작! ▶'}) as HTMLButtonElement;
 expect(goBtn.disabled).toBe(false);
});
it('touch capability never gates 2인 대결 — a multitouch device still sees the same one-time info modal, just with an extra informational hint',()=>{
 localStorage.clear();
 const restoreTouch=stubMultiTouch(2);
 render(<CafeApp/>);
 click('2인 플레이');
 expect(screen.getByRole('heading',{name:'2인 대결 안내'})).not.toBeNull();
 click('대결 시작!');
 expect(within(document.querySelector('.vs-preview')!).getByText('햇살')).not.toBeNull();
 expect(screen.getByText('✓ 동시 터치 사용 가능')).not.toBeNull();
 restoreTouch();
});
it('once the duo info modal has been confirmed, later 2인 대결 entries (touch or not) skip straight to 2P',()=>{
 localStorage.clear();
 localStorage.setItem('fractionCafe_duoInfoSeen','1');
 render(<CafeApp/>);
 click('2인 플레이');
 expect(screen.queryByRole('heading',{name:'2인 대결 안내'})).toBeNull();
 expect(within(document.querySelector('.vs-preview')!).getByText('햇살')).not.toBeNull();
});
it('2P battle: one shared order area (not duplicated) plus two independent workstations, progressing in lockstep to a shared result screen',()=>{
 localStorage.clear();
 vi.useFakeTimers();vi.setSystemTime(new Date(1000000));
 const {container}=render(<CafeApp/>);
 click('2인 플레이');click('대결 시작!');click('2P 직원 선택 →');click('대결 준비 완료! ▶');click('영업 시작! ▶');click('알겠어요!');
 const panes=[...container.querySelectorAll<HTMLElement>('.workstation-pane')];
 expect(panes.length).toBe(2);
 // The order/customer area is shared — exactly one ticket and one customer lane, not one per player.
 expect(container.querySelectorAll('.ticket').length).toBe(1);
 expect(container.querySelectorAll('.customer-lane').length).toBe(1);
 expect(container.querySelectorAll('.next-guest').length).toBe(1);
 for(const o of generateOrders(days[0],1000000)){
  for(const pane of panes){
   bonusIn(pane,1000000,1);clickIn(pane,o.denominator+'등분');measureIn(pane,1,o);labelIn(pane,1,o);clickIn(pane,'서빙하기');
  }
  // Two staged advances: the first crosses the 800ms "happy" threshold so both sides report in and the lockstep
  // effect registers its 1100ms release timer; the second lets that release timer actually fire. A single big
  // advance can jump the fake clock past where that timer would have landed before React gets to schedule it.
  act(()=>vi.advanceTimersByTime(900));
  act(()=>vi.advanceTimersByTime(1300));
 }
 expect(screen.getByRole('heading',{name:/완료|승리|무승부/})).not.toBeNull();
 expect(audio.setTrack).toHaveBeenLastCalledWith(3);
});
for(const [dayId,left,right,d] of [[1,3,2,8],[5,5,3,5],[6,16,9,5]])it('exact acceptance DAY '+dayId,()=>{
 const seed=Array.from({length:20000},(_,i)=>i).find(seed=>{const o=generateOrders(days[dayId-1],seed)[0];return o.denominator===d&&units(o.left)===left&&units(o.right)===right});expect(seed).toBeDefined();const o=generateOrders(days[dayId-1],seed!)[0];render(<Gameplay day={days[dayId-1]} mode="1P" player={1} staffId={0} seed={seed!} paused={false} onHelp={()=>{}} onLearn={()=>{}} onSettings={()=>{}} onExit={()=>{}} onComplete={()=>{}}/>);click(d+'등분');measure(dayId,o);
 if(dayId===1){for(let i=0;i<4;i++)click('분자 늘리기');click('완성량 확인');expect((screen.getByRole('button',{name:'서빙하기'}) as HTMLButtonElement).disabled).toBe(true);click('분자 늘리기');click('완성량 확인')}else label(dayId,o);expect((screen.getByRole('button',{name:'서빙하기'}) as HTMLButtonElement).disabled).toBe(false);
});
it('one reproducible bonus position in orders 3 to 5',()=>{for(let seed=0;seed<100;seed++){const c=specialChallenge(seed,1);if(c.type!=='combine')throw new Error('expected combine challenge for day 1');expect(c.index).toBeGreaterThanOrEqual(2);expect(c.index).toBeLessThanOrEqual(4);expect(c).toEqual(specialChallenge(seed,1));expect(c.choicesA).toContain(c.a);expect(c.choicesB).toContain(c.b);expect(c.a+c.b).toBe(c.target)}});
it('special order becomes an inventory-use challenge on DAY 3 to 6',()=>{for(const dayId of [3,4,5,6])for(let seed=0;seed<20;seed++){const c=specialChallenge(seed,dayId);if(c.type!=='use')throw new Error('expected use challenge for day '+dayId);expect(c.options).toContain(c.use);expect(c.use).toBe(c.stock-c.target);expect(c.use).toBeGreaterThan(0)}});
it('screen BGM mapping and gameplay help duck without changing tracks',()=>{render(<CafeApp/>);expect(audio.setTrack).toHaveBeenLastCalledWith(0);click('1인 플레이');click('영업 준비 완료! ▶');fireEvent.click(screen.getByRole('button',{name:/^DAY 4/}));click('영업 시작! ▶');click('알겠어요!');expect(audio.setTrack).toHaveBeenLastCalledWith(2);click('도움말');expect(audio.duck).toHaveBeenLastCalledWith(true);expect(audio.setTrack).toHaveBeenLastCalledWith(2);click('닫기');expect(audio.duck).toHaveBeenLastCalledWith(false);click('‹ DAY 선택');expect(audio.setTrack).toHaveBeenLastCalledWith(0);fireEvent.click(screen.getByRole('button',{name:/^DAY 1/}));click('영업 시작! ▶');click('알겠어요!');expect(audio.setTrack).toHaveBeenLastCalledWith(1)});
it('grand completion unlocks once all six days have a record and the flag persists',()=>{
 localStorage.clear();
 const rec=(id:number)=>({score:1000+id,correct:6,attempts:6,bestCombo:5,elapsedMs:60000,satisfaction:90,stars:3});
 const save={muted:false,selectedCharacter:0,tutorialSeen:true,masterCelebrated:false,records:Object.fromEntries(days.map(d=>[`day-${d.id}`,rec(d.id)]))};
 localStorage.setItem('fraction-cafe-save-v1',JSON.stringify(save));
 render(<CafeApp/>);click('1인 플레이');click('영업 준비 완료! ▶');
 expect(screen.getByRole('button',{name:'🏆 6일 영업 완주'})).not.toBeNull();
 click('🏆 6일 영업 완주');
 expect(screen.getByRole('heading',{name:'🎉 모든 영업 완료!'})).not.toBeNull();
 expect(audio.setTrack).toHaveBeenLastCalledWith(3);
 expect(JSON.parse(localStorage.getItem('fraction-cafe-save-v1')!).masterCelebrated).toBe(true);
 click('DAY 다시 골라 영업하기');
 expect(screen.getByRole('button',{name:'🏆 6일 영업 완주'})).not.toBeNull();
});
it('the grand completion badge stays hidden until every day has a record',()=>{
 localStorage.clear();
 const save={muted:false,selectedCharacter:0,tutorialSeen:true,masterCelebrated:false,records:{'day-1':{score:1000,correct:6,attempts:6,bestCombo:5,elapsedMs:60000,satisfaction:90,stars:3}}};
 localStorage.setItem('fraction-cafe-save-v1',JSON.stringify(save));
 render(<CafeApp/>);click('1인 플레이');click('영업 준비 완료! ▶');
 expect(screen.queryByRole('button',{name:'🏆 6일 영업 완주'})).toBeNull();
});
const rec=(id:number)=>({score:1000+id,correct:6,attempts:6,bestCombo:5,elapsedMs:60000,satisfaction:90,stars:3});
it('DAY record reset clears only that day and writes through to localStorage',()=>{
 localStorage.clear();
 const save={muted:false,selectedCharacter:0,tutorialSeen:true,masterCelebrated:false,records:{'day-1':rec(1),'day-2':rec(2)}};
 localStorage.setItem('fraction-cafe-save-v1',JSON.stringify(save));
 render(<CafeApp/>);click('1인 플레이');click('영업 준비 완료! ▶');
 click('소리 설정');
 click('DAY 1 기록 초기화');
 expect(screen.getByRole('heading',{name:'정말 초기화할까요?'})).not.toBeNull();
 click('초기화');
 const saved=JSON.parse(localStorage.getItem('fraction-cafe-save-v1')!);
 expect(saved.records['day-1']).toBeUndefined();
 expect(saved.records['day-2']).toBeDefined();
});
it('cancelling the reset confirmation leaves saved records untouched',()=>{
 localStorage.clear();
 const save={muted:false,selectedCharacter:0,tutorialSeen:true,masterCelebrated:false,records:{'day-1':rec(1)}};
 localStorage.setItem('fraction-cafe-save-v1',JSON.stringify(save));
 render(<CafeApp/>);click('1인 플레이');click('영업 준비 완료! ▶');
 click('소리 설정');
 click('전체 기록 초기화');
 click('취소');
 const saved=JSON.parse(localStorage.getItem('fraction-cafe-save-v1')!);
 expect(saved.records['day-1']).toBeDefined();
});
it('full record reset clears every day, the master-celebrated flag, and the grand-complete badge',()=>{
 localStorage.clear();
 const save={muted:false,selectedCharacter:0,tutorialSeen:true,masterCelebrated:true,records:Object.fromEntries(days.map(d=>[`day-${d.id}`,rec(d.id)]))};
 localStorage.setItem('fraction-cafe-save-v1',JSON.stringify(save));
 render(<CafeApp/>);click('1인 플레이');click('영업 준비 완료! ▶');
 expect(screen.getByRole('button',{name:'🏆 6일 영업 완주'})).not.toBeNull();
 click('소리 설정');
 click('전체 기록 초기화');
 click('초기화');
 const saved=JSON.parse(localStorage.getItem('fraction-cafe-save-v1')!);
 expect(Object.keys(saved.records).length).toBe(0);
 expect(saved.masterCelebrated).toBe(false);
 expect(screen.queryByRole('button',{name:'🏆 6일 영업 완주'})).toBeNull();
});
it('the reference-cup reminder shows on every start (not just the first ever), blocking gameplay input until dismissed each time',()=>{
 localStorage.clear();
 render(<CafeApp/>);
 click('1인 플레이');click('영업 준비 완료! ▶');click('영업 시작! ▶');
 expect(screen.getByRole('heading',{name:'분수카페의 기준컵'})).not.toBeNull();
 const denomButtons=[...document.querySelectorAll<HTMLButtonElement>('.division-choices button')];
 expect(denomButtons.length).toBeGreaterThan(0);
 expect(denomButtons.every(b=>b.disabled)).toBe(true);
 click('알겠어요!');
 expect(screen.queryByRole('heading',{name:'분수카페의 기준컵'})).toBeNull();
 click('‹ DAY 선택');click('영업 시작! ▶');
 expect(screen.getByRole('heading',{name:'분수카페의 기준컵'})).not.toBeNull();
 click('알겠어요!');
});
it('order ticket quantities carry a 컵 unit and the shared "기준컵 1컵 = 1" badge is shown once',()=>{
 localStorage.clear();
 render(<CafeApp/>);
 click('1인 플레이');click('영업 준비 완료! ▶');click('영업 시작! ▶');click('알겠어요!');
 expect(screen.getByText('기준컵 1컵 = 1')).not.toBeNull();
 expect(document.querySelectorAll('.ticket-row .unit').length).toBeGreaterThan(0);
 expect(document.querySelector('.ticket-row .unit')!.textContent).toBe('컵');
});
