export type TimedState={elapsedMs:number;patience:number};
export function advanceTimedState(state:TimedState,deltaMs:number,patienceMs:number,paused:boolean):TimedState{
  if(paused)return state;
  return {elapsedMs:state.elapsedMs+deltaMs,patience:Math.max(0,state.patience-deltaMs/patienceMs)};
}
