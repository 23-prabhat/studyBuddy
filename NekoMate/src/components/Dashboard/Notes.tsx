export default function Notes() {
    return (
        <section className="space-y-4 rounded-2xl border border-white/10 bg-[#161B22] p-6 shadow-lg">
            <h2 className="text-2xl font-semibold">Quick Notes</h2>
            <textarea
                className="min-h-[180px] w-full resize-none rounded-xl border border-white/10 bg-[#0D1117] p-4 text-sm text-gray-200 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                placeholder="Capture your ideas, todos, or reminders..."
            />
        </section>
    );
}