import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";

export type RunEvent = 
  | { type: 'status'; status: ScriptRunStatusEnum }
  | { type: 'progress'; progress: number }
  | { type: 'log'; message: string; ts: number };