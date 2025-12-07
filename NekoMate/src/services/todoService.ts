import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/config/firebase";
import type { Todo, TodoInput } from "@/types/todo";

const TODOS_COLLECTION = "tasks";

export const todoService = {
  async createTodo(userId: string, todoData: TodoInput, imageFile?: File): Promise<string> {
    let imageUrl = todoData.imageUrl;

    if (imageFile) {
      const imageRef = ref(storage, `users/${userId}/tasks/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(collection(db, TODOS_COLLECTION), {
      title: todoData.title,
      description: todoData.description,
      imageUrl: imageUrl || null,
      completed: false,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async updateTodo(todoId: string, updates: Partial<TodoInput>): Promise<void> {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async toggleComplete(todoId: string, completed: boolean): Promise<void> {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      completed,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteTodo(todoId: string): Promise<void> {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await deleteDoc(todoRef);
  },

  async getUserTodos(userId: string): Promise<Todo[]> {
    const q = query(
      collection(db, TODOS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        imageUrl: data.imageUrl,
        userId: data.userId,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Todo;
    });
  },

  async getIncompleteTodos(userId: string, limit: number = 3): Promise<Todo[]> {
    const q = query(
      collection(db, TODOS_COLLECTION),
      where("userId", "==", userId),
      where("completed", "==", false),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const todos = querySnapshot.docs.slice(0, limit).map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        imageUrl: data.imageUrl,
        userId: data.userId,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Todo;
    });

    return todos;
  },
};
