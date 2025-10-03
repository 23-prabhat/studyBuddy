function TodoCard() {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-xl w-72 h-auto bg-white hover:shadow-2xl transition duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Todo for Today
        </h2>
      </div>

      {/* Todo List */}
      <ul className="space-y-5">
        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-lg transition">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-400 text-blue-500 focus:ring-blue-400"
          />
          <span className="text-gray-700 font-medium">
            Complete TypeScript Project
          </span>
        </li>

        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-lg transition">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-400 text-blue-500 focus:ring-blue-400"
          />
          <span className="text-gray-700 font-medium">
            Read Python Documentation
          </span>
        </li>

        <li className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-lg transition">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-400 text-blue-500 focus:ring-blue-400"
          />
          <span className="text-gray-700 font-medium">Drop Vibe Coding</span>
        </li>
      </ul>
    </div>
  );
}

export default TodoCard;
