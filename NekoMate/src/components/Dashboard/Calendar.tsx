import { useMemo, useState } from "react";

const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth: Date = new Date(year, month, 1);
    const totalDays: number = new Date(year, month + 1, 0).getDate();
    const firstWeekday: number = firstDayOfMonth.getDay();

    const days: (number | null)[] = useMemo(() => {
        return Array.from({ length: firstWeekday + totalDays }, (_, index) =>
            index < firstWeekday ? null : index - firstWeekday + 1,
        );
    }, [firstWeekday, totalDays]);

    const prevMonth = (): void => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = (): void => setCurrentDate(new Date(year, month + 1, 1));

    const handleDayClick = (day: number | null): void => {
        if (!day) return;
        setSelectedDate(new Date(year, month, day));
    };

    const today = new Date();

    return (
        <section className="space-y-6 rounded-2xl border border-white/10 bg-[#161B22] p-6 shadow-lg">
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-wide text-orange-400/70">Calendar</p>
                    <h2 className="text-xl font-semibold">
                        {currentDate.toLocaleString("default", { month: "long" })} {year}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="rounded-lg border border-white/10 px-3 py-1 text-sm text-gray-300 transition hover:border-orange-500/60 hover:text-orange-400"
                    >
                        Prev
                    </button>
                    <button
                        onClick={nextMonth}
                        className="rounded-lg border border-white/10 px-3 py-1 text-sm text-gray-300 transition hover:border-orange-500/60 hover:text-orange-400"
                    >
                        Next
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-7 text-center text-xs uppercase tracking-wide text-gray-500">
                {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {days.map((day, index) => {
                    const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                    const isSelected =
                        selectedDate &&
                        day === selectedDate.getDate() &&
                        month === selectedDate.getMonth() &&
                        year === selectedDate.getFullYear();

                    return (
                        <button
                            type="button"
                            key={`${day}-${index}`}
                            onClick={() => handleDayClick(day)}
                            className={`flex h-11 items-center justify-center rounded-lg border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161B22] ${
                                day === null
                                    ? "cursor-default opacity-0"
                                    : isSelected
                                    ? "border-orange-500/70 bg-orange-500/20 text-orange-300"
                                    : isToday
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "text-gray-300 hover:border-orange-500/40 hover:bg-orange-500/10"
                            }`}
                            disabled={!day}
                        >
                            {day ?? ""}
                        </button>
                    );
                })}
            </div>

            {selectedDate && (
                <p className="text-sm text-gray-400">
                    Selected: {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </p>
            )}
        </section>
    );
}