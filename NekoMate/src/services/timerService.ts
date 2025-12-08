import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { TimerNote, YouTubeLink } from "@/types/timer";
import type { TimerState } from "@/types/timerState";

const NOTES_COLLECTION = "timerNotes";
const LINKS_COLLECTION = "timerLinks";
const TIMER_STATE_COLLECTION = "timerStates";

// Timer Notes Functions
export const timerService = {
  // Create a new note
  async createNote(userId: string, content: string): Promise<TimerNote> {
    const noteData = {
      userId,
      content,
      createdAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, NOTES_COLLECTION), noteData);
    return {
      id: docRef.id,
      ...noteData,
    };
  },

  // Get all notes for a user
  async getUserNotes(userId: string): Promise<TimerNote[]> {
    const q = query(
      collection(db, NOTES_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      content: doc.data().content,
      createdAt: doc.data().createdAt,
    }));
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
  },

  // Create a new YouTube link
  async createLink(
    userId: string,
    title: string,
    url: string
  ): Promise<YouTubeLink> {
    const linkData = {
      userId,
      title,
      url,
      createdAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, LINKS_COLLECTION), linkData);
    return {
      id: docRef.id,
      ...linkData,
    };
  },

  // Get all YouTube links for a user
  async getUserLinks(userId: string): Promise<YouTubeLink[]> {
    const q = query(
      collection(db, LINKS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      url: doc.data().url,
      createdAt: doc.data().createdAt,
    }));
  },

  // Delete a YouTube link
  async deleteLink(linkId: string): Promise<void> {
    await deleteDoc(doc(db, LINKS_COLLECTION, linkId));
  },

  // Save timer state
  async saveTimerState(userId: string, state: Omit<TimerState, 'userId'>): Promise<void> {
    const timerStateRef = doc(db, TIMER_STATE_COLLECTION, userId);
    await setDoc(timerStateRef, {
      ...state,
      userId,
      lastUpdated: Date.now(),
    });
  },

  // Get timer state
  async getTimerState(userId: string): Promise<TimerState | null> {
    const timerStateRef = doc(db, TIMER_STATE_COLLECTION, userId);
    const docSnap = await getDoc(timerStateRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as TimerState;
    }
    return null;
  },

  // Subscribe to timer state changes
  subscribeToTimerState(userId: string, callback: (state: TimerState | null) => void) {
    const timerStateRef = doc(db, TIMER_STATE_COLLECTION, userId);
    return onSnapshot(timerStateRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as TimerState);
      } else {
        callback(null);
      }
    });
  },
};
