import { ScriptRunStatusEnum } from "../enums/script-run-status.enum";

export type RunEvent = 
  | { type: 'status'; status: ScriptRunStatusEnum }
  | { type: 'resultUpdate'; change: { type: 'partial' | 'full', data: Record<string, any> } }
  | { type: 'log'; log: { type: 'info' | 'warn' | 'error', message: string }};