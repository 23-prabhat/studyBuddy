import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { StudySession, DailyStats, TaskStats, AnalyticsData } from "@/types/analytics";
import type { Todo } from "@/types/todo";

const SESSIONS_COLLECTION = "studySessions";
const TASKS_COLLECTION = "tasks";

export const analyticsService = {
  async logStudySession(
    userId: string,
    duration: number,
    startTime: number,
    sessionName?: string
  ): Promise<string> {
    const endTime = Date.now();
    const date = new Date(startTime).toISOString().split("T")[0];

    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
      userId,
      duration,
      startTime,
      endTime,
      date,
      sessionName: sessionName || null,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async getUserSessions(userId: string, days: number = 30): Promise<StudySession[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffTimestamp = cutoffDate.getTime();

    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where("userId", "==", userId),
      where("startTime", ">=", cutoffTimestamp),
      orderBy("startTime", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        duration: data.duration,
        startTime: data.startTime,
        endTime: data.endTime,
        date: data.date,
        sessionName: data.sessionName || undefined,
      } as StudySession;
    });
  },

  async getDailyStats(userId: string, days: number = 7): Promise<DailyStats[]> {
    const sessions = await this.getUserSessions(userId, days);
    const statsMap = new Map<string, DailyStats>();

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      statsMap.set(dateStr, {
        date: dateStr,
        totalMinutes: 0,
        sessions: 0,
      });
    }

    // Aggregate session data
    sessions.forEach((session) => {
      const existing = statsMap.get(session.date);
      if (existing) {
        existing.totalMinutes += Math.round(session.duration / 60);
        existing.sessions += 1;
      }
    });

    return Array.from(statsMap.values()).reverse();
  },

  async getTaskStats(userId: string): Promise<TaskStats> {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => doc.data() as Todo);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionRate,
    };
  },

  async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    const [sessions, dailyStats, taskStats] = await Promise.all([
      this.getUserSessions(userId, 30),
      this.getDailyStats(userId, 7),
      this.getTaskStats(userId),
    ]);

    const totalFocusTime = Math.round(
      sessions.reduce((sum, s) => sum + s.duration, 0) / 60
    );
    const totalSessions = sessions.length;
    const averageSessionTime =
      totalSessions > 0 ? Math.round(totalFocusTime / totalSessions) : 0;

    // Calculate weekly focus time (last 7 days)
    const weekCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyFocusTime = Math.round(
      sessions
        .filter((s) => s.startTime >= weekCutoff)
        .reduce((sum, s) => sum + s.duration, 0) / 60
    );

    // Calculate monthly focus time (last 30 days)
    const monthlyFocusTime = totalFocusTime;

    return {
      totalFocusTime,
      totalSessions,
      averageSessionTime,
      dailyStats,
      taskStats,
      weeklyFocusTime,
      monthlyFocusTime,
    };
  },
};
