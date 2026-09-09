import { beforeEach,describe,expect,it } from 'vitest';
import { loadSave,saveData } from './storage';
describe('save data',()=>{beforeEach(()=>localStorage.clear());it('round-trips local storage',()=>{const d={...loadSave(),muted:true};saveData(d);expect(loadSave().muted).toBe(true)})});
