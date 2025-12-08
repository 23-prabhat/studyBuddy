import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { CalendarEvent, CalendarEventInput } from "@/types/calendar";

const EVENTS_COLLECTION = "calendarEvents";

export const calendarService = {
  async createEvent(userId: string, eventData: CalendarEventInput): Promise<string> {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      userId,
      title: eventData.title,
      description: eventData.description || null,
      date: eventData.date,
      time: eventData.time || null,
      type: eventData.type,
      completed: eventData.type === 'task' ? false : undefined,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async getUserEvents(userId: string, month?: string): Promise<CalendarEvent[]> {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);
    let events = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        type: data.type,
        completed: data.completed,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      } as CalendarEvent;
    });

    // Filter by month in code if month is specified
    if (month) {
      events = events.filter(event => event.date.startsWith(month));
    }

    return events;
  },

  async toggleEventComplete(eventId: string, completed: boolean): Promise<void> {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, { completed });
  },

  async deleteEvent(eventId: string): Promise<void> {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(eventRef);
  },
};
