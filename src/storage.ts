import type { PlayerResult } from './types';
export type SaveData={muted:boolean;selectedCharacter:number;records:Record<string,PlayerResult>;tutorialSeen:boolean;masterCelebrated:boolean};
const KEY='fraction-cafe-save-v1';
const initial:SaveData={muted:false,selectedCharacter:0,records:{},tutorialSeen:false,masterCelebrated:false};
export function loadSave():SaveData{try{const raw=localStorage.getItem(KEY);return raw?{...initial,...JSON.parse(raw)}:initial}catch{return initial}}
export function saveData(data:SaveData){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{/* private mode: game still runs */}}
