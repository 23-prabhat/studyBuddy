export type StudySession = {
  id: string;
  userId: string;
  duration: number; 
  startTime: number;
  endTime: number;
  date: string;
  sessionName?: string;
};

export type DailyStats = {
  date: string;
  totalMinutes: number;
  sessions: number;
};

export type TaskStats = {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
};

export type AnalyticsData = {
  totalFocusTime: number; 
  totalSessions: number;
  averageSessionTime: number;
  dailyStats: DailyStats[];
  taskStats: TaskStats;
  weeklyFocusTime: number;
  monthlyFocusTime: number;
};
