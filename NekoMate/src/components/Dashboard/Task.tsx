import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { todoService } from "@/services/todoService";
import type { Todo } from "@/types/todo";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Task() {
   const [user] = useAuthState(auth);
   const [todos, setTodos] = useState<Todo[]>([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      if (user) {
         loadIncompleteTodos();
      }
   }, [user]);

   const loadIncompleteTodos = async () => {
      if (!user) return;
      try {
         setLoading(true);
         const fetchedTodos = await todoService.getIncompleteTodos(user.uid, 3);
         setTodos(fetchedTodos);
      } catch (error) {
         console.error("Error loading todos:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleToggleComplete = async (todo: Todo) => {
      try {
         await todoService.toggleComplete(todo.id, !todo.completed);
         await loadIncompleteTodos();
      } catch (error) {
         console.error("Error toggling todo:", error);
      }
   };

   return (
      <section className="space-y-6 rounded-2xl border border-white/10 bg-[#161B22] p-6 shadow-lg">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Today's Tasks</h2>
            <button
               onClick={() => navigate("/task")}
               className="flex items-center gap-1 text-sm text-orange-400 transition hover:text-orange-300"
            >
               View All
               <ArrowRight size={16} />
            </button>
         </div>

         {loading ? (
            <div className="flex justify-center py-8">
               <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
            </div>
         ) : todos.length === 0 ? (
            <div className="rounded-lg border border-white/5 bg-[#0D1117] p-6 text-center">
               <p className="text-sm text-gray-400">No active tasks. Great job!</p>
               <button
                  onClick={() => navigate("/task")}
                  className="mt-3 text-sm text-orange-400 hover:text-orange-300"
               >
                  Create a new task
               </button>
            </div>
         ) : (
            <ul className="space-y-4">
               {todos.map((todo) => (
                  <li
                     key={todo.id}
                     className="group flex items-start gap-3 rounded-xl border border-white/5 bg-[#0D1117] px-4 py-4 text-sm text-gray-200 shadow-sm transition hover:border-orange-500/30"
                  >
                     <button
                        onClick={() => handleToggleComplete(todo)}
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 border-gray-500 transition hover:border-orange-500"
                     >
                        {todo.completed && <Check size={14} className="text-orange-500" />}
                     </button>
                     <div className="flex-1">
                        <p className="font-medium text-white">{todo.title}</p>
                        {todo.description && (
                           <p className="mt-1 text-xs text-gray-400 line-clamp-1">{todo.description}</p>
                        )}
                     </div>
                  </li>
               ))}
            </ul>
         )}
      </section>
   );
}