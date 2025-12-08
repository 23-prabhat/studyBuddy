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
        <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-wide text-orange-500">Calendar</p>
                    <h2 className="text-xl font-semibold text-blue-900">
                        {currentDate.toLocaleString("default", { month: "long" })} {year}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                        Prev
                    </button>
                    <button
                        onClick={nextMonth}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                        Next
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-7 text-center text-xs uppercase tracking-wide text-gray-600">
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
                            className={`flex h-11 items-center justify-center rounded-lg border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                                day === null
                                    ? "cursor-default opacity-0"
                                    : isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                                    : isToday
                                    ? "border-orange-500 bg-orange-50 text-orange-700 font-medium"
                                    : "text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                            disabled={!day}
                        >
                            {day ?? ""}
                        </button>
                    );
                })}
            </div>

            {selectedDate && (
                <p className="text-sm text-gray-600">
                    Selected: {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </p>
            )}
        </section>
    );
}