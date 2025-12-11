import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Image as ImageIcon, Filter } from "lucide-react";
import SideBar from "@/components/Dashboard/SideBar";
import { todoService } from "@/services/todoService";
import type { Todo, TodoInput } from "@/types/todo";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Tasktodo() {
  const [user] = useAuthState(auth);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [formData, setFormData] = useState<TodoInput>({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const fetchedTodos = await todoService.getUserTodos(user.uid);
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim()) return;

    try {
      setSubmitting(true);
      if (editingTodo) {
        await todoService.updateTodo(editingTodo.id, formData);
      } else {
        await todoService.createTodo(user.uid, formData, imageFile || undefined);
      }
      await loadTodos();
      resetForm();
    } catch (error: any) {
      console.error("Error saving todo:", error);
      alert(`Error creating task: ${error.message || "Unknown error"}. Check console for details.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await todoService.toggleComplete(todo.id, !todo.completed);
      await loadTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDelete = async (todoId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await todoService.deleteTodo(todoId);
      await loadTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      imageUrl: todo.imageUrl,
    });
    setImagePreview(todo.imageUrl || "");
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingTodo(null);
    setFormData({ title: "", description: "", imageUrl: "" });
    setImageFile(null);
    setImagePreview("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <p>Please login to view tasks</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <SideBar />

      <main className="flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3 flex-col sm:flex-row">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900">My Tasks</h1>
              <p className="mt-1 text-gray-600 text-sm sm:text-base">
                {stats.active > 0 
                  ? `You have ${stats.active} incomplete ${stats.active === 1 ? 'task' : 'tasks'}`
                  : 'All tasks completed! 🎉'
                }
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto flex items-center gap-2 rounded-xl bg-orange-500 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition hover:bg-orange-600"
            >
              <Plus size={20} />
              Add Task
            </button>
          </header>

          {/* Stats */}
          <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-600">Active</p>
              <p className="mt-2 text-3xl font-bold text-orange-500">{stats.active}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="mt-2 text-3xl font-bold text-green-500">{stats.completed}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <Filter size={18} className="text-gray-600" />
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                filter === "all" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                filter === "active" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                filter === "completed" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Todo List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="text-gray-600">No tasks found. Create your first task!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 ${
                    todo.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                        todo.completed
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {todo.completed && <Check size={16} className="text-white" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${
                          todo.completed ? "text-gray-400 line-through" : "text-gray-900"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
                      )}
                      {todo.imageUrl && (
                        <img
                          src={todo.imageUrl}
                          alt={todo.title}
                          className="mt-3 h-40 w-full rounded-lg object-cover"
                        />
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Created {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="rounded-lg bg-blue-500/20 p-2 text-blue-400 transition hover:bg-blue-500/30"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-blue-900">
                {editingTodo ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Enter task description (optional)"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Image</label>
                <div className="flex flex-col gap-3">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition hover:border-blue-400 hover:bg-blue-50">
                    <ImageIcon size={20} className="text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {imageFile ? imageFile.name : "Upload an image (optional)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-full rounded-lg object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-500 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingTodo ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}