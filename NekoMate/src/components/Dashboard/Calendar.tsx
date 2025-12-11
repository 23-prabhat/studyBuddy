import { useMemo, useState, useEffect } from "react";
import { Plus, X, Check, Trash2, Clock } from "lucide-react";
import { calendarService } from "@/services/calendarService";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import type { CalendarEvent } from "@/types/calendar";

const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
    const [user] = useAuthState(auth);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventType, setEventType] = useState<'event' | 'task'>('event');
    const [loading, setLoading] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth: Date = new Date(year, month, 1);
    const totalDays: number = new Date(year, month + 1, 0).getDate();
    const firstWeekday: number = firstDayOfMonth.getDay();

    // Load events when month changes
    useEffect(() => {
        if (!user) return;
        
        const loadEvents = async () => {
            try {
                const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
                const eventsData = await calendarService.getUserEvents(user.uid, monthStr);
                setEvents(eventsData);
            } catch (error) {
                console.error("Error loading events:", error);
            }
        };

        loadEvents();
    }, [user, year, month]);

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

    const handleAddEvent = async () => {
        if (!user || !selectedDate || !eventTitle.trim()) return;

        setLoading(true);
        try {
            const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
            
            console.log("Creating event:", { dateStr, eventTitle, eventType });
            
            await calendarService.createEvent(user.uid, {
                title: eventTitle,
                description: eventDescription,
                date: dateStr,
                time: eventTime,
                type: eventType,
            });

            console.log("Event created successfully");

            // Reload events
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            const eventsData = await calendarService.getUserEvents(user.uid, monthStr);
            setEvents(eventsData);

            // Reset form
            setEventTitle("");
            setEventDescription("");
            setEventTime("");
            setEventType('event');
            setShowEventModal(false);
        } catch (error: any) {
            console.error("Error creating event:", error);
            alert(`Failed to create event: ${error.message || 'Unknown error'}\n\nPlease make sure Firebase indexes are deployed.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!user) return;
        
        try {
            await calendarService.deleteEvent(eventId);
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            const eventsData = await calendarService.getUserEvents(user.uid, monthStr);
            setEvents(eventsData);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleToggleComplete = async (event: CalendarEvent) => {
        if (!user || event.type !== 'task') return;
        
        try {
            await calendarService.toggleEventComplete(event.id, !event.completed);
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            const eventsData = await calendarService.getUserEvents(user.uid, monthStr);
            setEvents(eventsData);
        } catch (error) {
            console.error("Error toggling event:", error);
        }
    };

    const getEventsForDate = (day: number): CalendarEvent[] => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.date === dateStr);
    };

    const today = new Date();

    return (
        <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg">
            <header className="flex items-center justify-between gap-3 flex-col sm:flex-row">
                <div>
                    <p className="text-xs sm:text-sm uppercase tracking-wide text-orange-500">Calendar</p>
                    <h2 className="text-lg sm:text-xl font-semibold text-blue-900">
                        {currentDate.toLocaleString("default", { month: "long" })} {year}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="rounded-lg border border-gray-300 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                        Prev
                    </button>
                    <button
                        onClick={nextMonth}
                        className="rounded-lg border border-gray-300 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                        Next
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs uppercase tracking-wide text-gray-600">
                {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
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

                    const dayEvents = day ? getEventsForDate(day) : [];
                    const hasEvents = dayEvents.length > 0;

                    return (
                        <button
                            type="button"
                            key={`${day}-${index}`}
                            onClick={() => handleDayClick(day)}
                            className={`relative flex h-8 sm:h-11 items-center justify-center rounded-lg border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
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
                            {hasEvents && (
                                <div className="absolute bottom-0 sm:bottom-1 flex gap-0.5">
                                    {dayEvents.slice(0, 3).map((_, i) => (
                                        <div key={i} className="h-1 w-1 rounded-full bg-blue-500"></div>
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {selectedDate && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                            {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                        <button
                            onClick={() => setShowEventModal(true)}
                            className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600"
                        >
                            <Plus size={14} />
                            Add Event
                        </button>
                    </div>

                    {/* Events for selected date */}
                    <div className="space-y-2">
                        {getEventsForDate(selectedDate.getDate()).length > 0 ? (
                            getEventsForDate(selectedDate.getDate()).map((event) => (
                                <div
                                    key={event.id}
                                    className="group flex items-start justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
                                >
                                    <div className="flex items-start gap-2 flex-1">
                                        {event.type === 'task' && (
                                            <button
                                                onClick={() => handleToggleComplete(event)}
                                                className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition ${
                                                    event.completed
                                                        ? "border-green-500 bg-green-500"
                                                        : "border-gray-400 hover:border-blue-500"
                                                }`}
                                            >
                                                {event.completed && <Check size={12} className="text-white" />}
                                            </button>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${event.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                {event.type === 'event' ? '📅' : '✓'} {event.title}
                                            </p>
                                            {event.time && (
                                                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                                                    <Clock size={10} />
                                                    {event.time}
                                                </p>
                                            )}
                                            {event.description && (
                                                <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="opacity-0 transition group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} className="text-red-500" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-xs text-gray-500 py-2">No events for this day</p>
                        )}
                    </div>
                </div>
            )}

            {/* Add Event Modal */}
            {showEventModal && selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-blue-900">Add Event</h3>
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="rounded-lg p-1 text-gray-600 transition hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Event Type Toggle */}
                            <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                                <button
                                    onClick={() => setEventType('event')}
                                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                        eventType === 'event'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    📅 Event
                                </button>
                                <button
                                    onClick={() => setEventType('task')}
                                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                        eventType === 'task'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    ✓ Task
                                </button>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    placeholder={eventType === 'event' ? 'Meeting with team' : 'Complete homework'}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Time (Optional)</label>
                                <input
                                    type="time"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Description (Optional)</label>
                                <textarea
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                    placeholder="Add details..."
                                    rows={2}
                                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddEvent}
                                    disabled={!eventTitle.trim() || loading}
                                    className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}