import { useState, useEffect } from "react";
import { Bell, Clock, Check } from "lucide-react";
import { calendarService } from "@/services/calendarService";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import type { CalendarEvent } from "@/types/calendar";

export default function Notifications() {
    const [user] = useAuthState(auth);
    const [showNotifications, setShowNotifications] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        if (!user) return;
        
        const loadEvents = async () => {
            try {
                const today = new Date();
                const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                const eventsData = await calendarService.getUserEvents(user.uid, monthStr);
                setEvents(eventsData);
            } catch (error) {
                console.error("Error loading events:", error);
            }
        };

        loadEvents();
        
        // Refresh every minute
        const interval = setInterval(loadEvents, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const getTodayEvents = (): CalendarEvent[] => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        return events.filter(event => event.date === todayStr);
    };

    const getUnreadEvents = (): CalendarEvent[] => {
        return getTodayEvents().filter(event => !event.read);
    };

    const getPendingTasks = (): CalendarEvent[] => {
        return getTodayEvents().filter(event => event.type === 'task' && !event.completed);
    };

    const getTodayScheduledEvents = (): CalendarEvent[] => {
        return getTodayEvents().filter(event => event.type === 'event');
    };

    const handleMarkAsRead = async (eventId: string) => {
        try {
            await calendarService.markEventAsRead(eventId);
            
            // Update local state
            setEvents(prevEvents => 
                prevEvents.map(event => 
                    event.id === eventId ? { ...event, read: true } : event
                )
            );
        } catch (error) {
            console.error("Error marking event as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const unreadEvents = getUnreadEvents();
            await Promise.all(
                unreadEvents.map(event => calendarService.markEventAsRead(event.id))
            );
            
            // Update local state
            setEvents(prevEvents => 
                prevEvents.map(event => ({ ...event, read: true }))
            );
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleToggleComplete = async (event: CalendarEvent) => {
        if (event.type !== 'task') return;
        
        try {
            await calendarService.toggleEventComplete(event.id, !event.completed);
            
            // Update local state
            setEvents(prevEvents => 
                prevEvents.map(e => 
                    e.id === event.id ? { ...e, completed: !e.completed } : e
                )
            );
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const today = new Date();
    const todayEvents = getTodayEvents();
    const unreadCount = getUnreadEvents().length;
    const pendingTasks = getPendingTasks();

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowNotifications(false)}
                    />
                    
                    <div className="absolute right-0 sm:right-0 top-12 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md rounded-xl border border-gray-200 bg-white shadow-xl">
                        <div className="border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-blue-900">Today's Schedule</h3>
                                    <p className="text-xs text-gray-500">
                                        {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-[60vh] sm:max-h-[32rem] overflow-y-auto p-4">
                            {todayEvents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Bell size={48} className="text-gray-300 mb-2" />
                                    <p className="text-center text-sm text-gray-500">No events or tasks for today</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Scheduled Events */}
                                    {getTodayScheduledEvents().length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2 flex items-center gap-1">
                                                📅 Events ({getTodayScheduledEvents().length})
                                            </h4>
                                            <div className="space-y-2">
                                                {getTodayScheduledEvents().map((event) => (
                                                    <div 
                                                        key={event.id} 
                                                        className={`group relative rounded-lg border p-3 transition ${
                                                            event.read 
                                                                ? 'border-blue-100 bg-blue-50/50' 
                                                                : 'border-blue-200 bg-blue-50'
                                                        }`}
                                                    >
                                                        {!event.read && (
                                                            <div className="absolute top-2 right-2">
                                                                <button
                                                                    onClick={() => handleMarkAsRead(event.id)}
                                                                    className="opacity-0 group-hover:opacity-100 transition rounded-full p-1 hover:bg-blue-100"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check size={14} className="text-blue-600" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        <p className={`text-sm font-medium pr-6 ${event.read ? 'text-blue-700' : 'text-blue-900'}`}>
                                                            {event.title}
                                                        </p>
                                                        {event.time && (
                                                            <p className="text-xs text-blue-700 flex items-center gap-1 mt-1">
                                                                <Clock size={10} />
                                                                {event.time}
                                                            </p>
                                                        )}
                                                        {event.description && (
                                                            <p className="text-xs text-blue-600 mt-1">{event.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Pending Tasks */}
                                    {pendingTasks.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wide text-orange-600 mb-2 flex items-center gap-1">
                                                ✓ Pending Tasks ({pendingTasks.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {pendingTasks.map((task) => (
                                                    <div 
                                                        key={task.id} 
                                                        className={`group relative rounded-lg border p-3 transition ${
                                                            task.read 
                                                                ? 'border-orange-100 bg-orange-50/50' 
                                                                : 'border-orange-200 bg-orange-50'
                                                        }`}
                                                    >
                                                        {!task.read && (
                                                            <div className="absolute top-2 right-2">
                                                                <button
                                                                    onClick={() => handleMarkAsRead(task.id)}
                                                                    className="opacity-0 group-hover:opacity-100 transition rounded-full p-1 hover:bg-orange-100"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check size={14} className="text-orange-600" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        <div className="flex items-start gap-2">
                                                            <button
                                                                onClick={() => handleToggleComplete(task)}
                                                                className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 border-orange-400 hover:border-orange-600 transition"
                                                            />
                                                            <div className="flex-1 pr-6">
                                                                <p className={`text-sm font-medium ${task.read ? 'text-orange-700' : 'text-orange-900'}`}>
                                                                    {task.title}
                                                                </p>
                                                                {task.time && (
                                                                    <p className="text-xs text-orange-700 flex items-center gap-1 mt-1">
                                                                        <Clock size={10} />
                                                                        {task.time}
                                                                    </p>
                                                                )}
                                                                {task.description && (
                                                                    <p className="text-xs text-orange-600 mt-1">{task.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Completed Tasks */}
                                    {getTodayEvents().filter(e => e.type === 'task' && e.completed).length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-2 flex items-center gap-1">
                                                ✓ Completed ({getTodayEvents().filter(e => e.type === 'task' && e.completed).length})
                                            </h4>
                                            <div className="space-y-2">
                                                {getTodayEvents().filter(e => e.type === 'task' && e.completed).map((task) => (
                                                    <div key={task.id} className="rounded-lg border border-green-100 bg-green-50 p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 border-green-500 bg-green-500">
                                                                <Check size={12} className="text-white" />
                                                            </div>
                                                            <p className="text-sm font-medium text-green-700 line-through">{task.title}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 p-3">
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
