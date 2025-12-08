export interface TimerState {
  id?: string;
  userId: string;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  customMinutes: number;
  lastUpdated: number;
}
