export type CalendarEvent = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time?: string;
  type: 'event' | 'task';
  completed?: boolean;
  createdAt: number;
};

export type CalendarEventInput = {
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'event' | 'task';
};
