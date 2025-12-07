export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  imageUrl?: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
};

export type TodoInput = {
  title: string;
  description: string;
  imageUrl?: string;
};
