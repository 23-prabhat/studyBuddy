export type TimerNote = {
  id: string;
  content: string;
  createdAt: number;
};

export type YouTubeLink = {
  id: string;
  title: string;
  url: string;
  createdAt: number;
};

export type TimerPreset = {
  name: string;
  minutes: number;
};
