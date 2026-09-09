export const asset=(file:string)=>`${document.documentElement.dataset.standalone?'./image/':import.meta.env.BASE_URL}${file}`;
export const manifest={title:'U01_TITLE_MAIN_MASTER.png',background:'A01.png',masters:['U01_TITLE_MAIN_MASTER.png','U02_1P_GAMEPLAY_MASTER_FINAL.png','U03.png','U04_RESULT_MASTER LOCK.png',...Array.from({length:12},(_,i)=>`U${String(i+5).padStart(2,'0')}.png`)]};
export function preload(file:string){const image=new Image();image.src=asset(file);void image.decode().catch(()=>{})}
