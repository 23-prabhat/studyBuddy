const tasks = [
   "Learn Python basics",
   "Complete all the basics of Operating System",
   "Watch 10 episodes of One Piece",
];

export default function Task() {
   return (
      <section className="space-y-6 rounded-2xl border border-white/10 bg-[#161B22] p-6 shadow-lg">
         <h2 className="text-2xl font-semibold">Today's Tasks</h2>
         <ul className="space-y-4">
            {tasks.map((task) => (
               <li
                  key={task}
                  className="rounded-xl border border-white/5 bg-[#0D1117] px-4 py-4 text-sm text-gray-200 shadow-sm"
               >
                  {task}
               </li>
            ))}
         </ul>
      </section>
   );
}