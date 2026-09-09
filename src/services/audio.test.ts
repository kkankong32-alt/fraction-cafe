import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {AudioManager,tracks} from './audio';
let instances:FakeAudio[]=[];
class FakeAudio{src='';volume=1;loop=false;preload='';load=vi.fn();play=vi.fn(()=>Promise.resolve());pause=vi.fn();constructor(){instances.push(this)}}
beforeEach(()=>{localStorage.clear();instances=[];vi.stubGlobal('Audio',FakeAudio);vi.stubGlobal('requestAnimationFrame',vi.fn(()=>1));vi.stubGlobal('cancelAnimationFrame',vi.fn())});
afterEach(()=>vi.unstubAllGlobals());
it('exact audio paths, same track does not restart, all four categories change',()=>{const a=new AudioManager();a.unlock();expect(instances[1].src).toBe('./audio/'+tracks[0]);a.setTrack(0);a.setTrack(0);expect(instances[1].load).toHaveBeenCalledTimes(1);for(let i=1;i<4;i++){a.setTrack(i);expect(instances.some(x=>x.src==='./audio/'+tracks[i])).toBe(true)}});
it('help ducks current music to 38% and restores without restarting',()=>{const a=new AudioManager();a.unlock();a.duck(true);expect(instances[1].volume).toBeCloseTo(.22*.38);a.duck(false);expect(instances[1].volume).toBe(.22);expect(instances[1].load).toHaveBeenCalledTimes(1)});
it('independent switches and volume values survive a new manager',()=>{const a=new AudioManager();a.unlock();a.set('bgm',false);expect(instances[1].pause).toHaveBeenCalled();expect(a.sfxEnabled).toBe(true);a.set('sfx',false);const b=new AudioManager();expect(b.bgmEnabled).toBe(false);expect(b.sfxEnabled).toBe(false);expect(b.bgmVolume).toBe(.22);expect(b.sfxVolume).toBe(.55);a.set('bgm',true);expect(a.sfxEnabled).toBe(false)});
it('SFX disabled never creates an audio context',()=>{const ctor=vi.fn();vi.stubGlobal('AudioContext',ctor);const a=new AudioManager();a.set('sfx',false);a.playSfx('wrong');expect(ctor).not.toHaveBeenCalled()});
