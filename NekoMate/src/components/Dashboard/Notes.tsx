export default function Notes() {
    return (
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-900">Quick Notes</h2>
            <textarea
                className="min-h-[140px] sm:min-h-[180px] w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 sm:p-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Capture your ideas, todos, or reminders..."
            />
        </section>
    );
}