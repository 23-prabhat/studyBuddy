import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Plus,
  Trash2,
  X,
  Youtube,
  StickyNote,
  Clock,
  Calendar,
} from "lucide-react";
import SideBar from "@/components/Dashboard/SideBar";
import { analyticsService } from "@/services/analyticsService";
import { timerService } from "@/services/timerService";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import type { TimerNote, YouTubeLink, TimerPreset } from "@/types/timer";
import type { StudySession } from "@/types/analytics";

const TIMER_PRESETS: TimerPreset[] = [
  { name: "Pomodoro", minutes: 25 },
  { name: "Short Break", minutes: 5 },
  { name: "Long Break", minutes: 15 },
  { name: "Deep Work", minutes: 45 },
  { name: "Quick Focus", minutes: 10 },
];

export default function TimerPage() {
  const [user] = useAuthState(auth);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const sessionStartTime = useRef<number | null>(null);

  // Notes state
  const [notes, setNotes] = useState<TimerNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // YouTube links state
  const [links, setLinks] = useState<YouTubeLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(true);

  // Last session state
  const [lastSession, setLastSession] = useState<StudySession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<StudySession[]>([]);
  
  // Session name state
  const [sessionName, setSessionName] = useState("");
  const [showSessionNameInput, setShowSessionNameInput] = useState(false);

  // Load notes and links from Firebase
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoadingNotes(true);
        setLoadingLinks(true);

        const [notesData, linksData, sessions, timerState] = await Promise.all([
          timerService.getUserNotes(user.uid),
          timerService.getUserLinks(user.uid),
          analyticsService.getUserSessions(user.uid, 7),
          timerService.getTimerState(user.uid),
        ]);

        setNotes(notesData);
        setLinks(linksData);
        if (sessions.length > 0) {
          setLastSession(sessions[0]);
          setSessionHistory(sessions.slice(0, 5));
        }
        
        // Load saved timer state
        if (timerState) {
          setMinutes(timerState.minutes);
          setSeconds(timerState.seconds);
          setIsRunning(false); // Don't auto-resume on page load
          setCustomMinutes(timerState.customMinutes);
        }
      } catch (error) {
        console.error("Error loading timer data:", error);
      } finally {
        setLoadingNotes(false);
        setLoadingLinks(false);
      }
    };

    loadData();
  }, [user]);

  // Subscribe to timer state changes from Firebase
  useEffect(() => {
    if (!user) return;

    const unsubscribe = timerService.subscribeToTimerState(user.uid, (state) => {
      if (state) {
        setMinutes(state.minutes);
        setSeconds(state.seconds);
        setIsRunning(state.isRunning);
        setCustomMinutes(state.customMinutes);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Save timer state to Firebase whenever it changes
  useEffect(() => {
    if (!user) return;

    const saveState = async () => {
      try {
        await timerService.saveTimerState(user.uid, {
          minutes,
          seconds,
          isRunning,
          customMinutes,
          lastUpdated: Date.now(),
        });
      } catch (error) {
        console.error("Error saving timer state:", error);
      }
    };

    saveState();
  }, [user, minutes, seconds, isRunning, customMinutes]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      if (!sessionStartTime.current) {
        sessionStartTime.current = Date.now();
      }

      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          clearInterval(timer);
          setIsRunning(false);
          handleSessionComplete();
          playNotificationSound();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds]);

  const handleSessionComplete = async () => {
    if (!user || !sessionStartTime.current) return;

    const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);

    if (duration > 60) {
      try {
        await analyticsService.logStudySession(
          user.uid,
          duration,
          sessionStartTime.current,
          sessionName || undefined
        );
        
        // Reload session history
        const sessions = await analyticsService.getUserSessions(user.uid, 7);
        if (sessions.length > 0) {
          setLastSession(sessions[0]);
          setSessionHistory(sessions.slice(0, 5));
        }
        
        // Reset session name
        setSessionName("");
        setShowSessionNameInput(false);
      } catch (error) {
        console.error("Error logging study session:", error);
      }
    }

    sessionStartTime.current = null;
  };

  const playNotificationSound = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTR0NVKzo8bllHgg+ltryxngoBS2Azvr");
    audio.play().catch(() => {});
  };

  const handleStartPause = () => {
    if (isRunning) {
      handleSessionComplete();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (isRunning) {
      handleSessionComplete();
    }
    setMinutes(customMinutes);
    setSeconds(0);
    setIsRunning(false);
    sessionStartTime.current = null;
  };

  const applyPreset = (preset: TimerPreset) => {
    setMinutes(preset.minutes);
    setSeconds(0);
    setCustomMinutes(preset.minutes);
    setIsRunning(false);
    sessionStartTime.current = null;
    setShowSettings(false);
  };

  const applyCustomTime = () => {
    setMinutes(customMinutes);
    setSeconds(0);
    setIsRunning(false);
    sessionStartTime.current = null;
    setShowSettings(false);
  };

  // Notes functions
  const addNote = async () => {
    if (!newNote.trim() || !user) return;

    try {
      const note = await timerService.createNote(user.uid, newNote);
      setNotes([note, ...notes]);
      setNewNote("");
      setShowNoteInput(false);
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note. Please try again.");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await timerService.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  // YouTube links functions
  const addLink = async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim() || !user) return;

    try {
      const link = await timerService.createLink(user.uid, newLinkTitle, newLinkUrl);
      setLinks([link, ...links]);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setShowLinkInput(false);
    } catch (error) {
      console.error("Error adding link:", error);
      alert("Failed to add link. Please try again.");
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await timerService.deleteLink(id);
      setLinks(links.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Failed to delete link. Please try again.");
    }
  };

  const totalSeconds = minutes * 60 + seconds;
  const progress = ((customMinutes * 60 - totalSeconds) / (customMinutes * 60)) * 100;

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <SideBar />

      <main className="flex-1 overflow-y-auto px-8 py-10 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-blue-900">Focus Timer</h1>
            <p className="mt-1 text-gray-600">Stay focused and track your study sessions</p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Timer Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                {/* Timer Display */}
                <div className="mb-8 flex flex-col items-center">
                  <motion.div
                    className="relative mb-8"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Progress Circle */}
                    <svg className="h-80 w-80 -rotate-90 transform">
                      <circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 140}
                        initial={{ strokeDashoffset: 2 * Math.PI * 140 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 140 * (1 - progress / 100),
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="text-center"
                        animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="text-7xl font-bold text-blue-900">
                          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {isRunning ? "Focus Mode" : "Ready to start"}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Session Name Input */}
                  <div className="mb-6">
                    {!showSessionNameInput ? (
                      <button
                        onClick={() => setShowSessionNameInput(true)}
                        className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                      >
                        + Add session name (optional)
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={sessionName}
                          onChange={(e) => setSessionName(e.target.value)}
                          placeholder="e.g., Python Learning Session"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          maxLength={50}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowSessionNameInput(false)}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setShowSessionNameInput(false)}
                            disabled={!sessionName.trim()}
                            className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-sm text-white transition hover:bg-blue-600 disabled:opacity-50"
                          >
                            Save Name
                          </button>
                        </div>
                      </div>
                    )}
                    {sessionName && !showSessionNameInput && (
                      <div className="mt-2 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2">
                        <span className="text-sm font-medium text-blue-900">📝 {sessionName}</span>
                        <button
                          onClick={() => {
                            setSessionName("");
                            setShowSessionNameInput(false);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartPause}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 text-white transition hover:bg-blue-600"
                    >
                      {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
                    >
                      <RotateCcw size={24} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSettings(!showSettings)}
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-blue-500 hover:text-blue-500"
                    >
                      <Settings size={24} />
                    </motion.button>
                  </div>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-gray-200 pt-6"
                    >
                      <h3 className="mb-4 text-lg font-semibold text-blue-900">Timer Presets</h3>
                      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {TIMER_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition hover:border-blue-500 hover:bg-blue-50"
                          >
                            <p className="font-medium text-gray-900">{preset.name}</p>
                            <p className="text-xs text-gray-600">{preset.minutes} min</p>
                          </button>
                        ))}
                      </div>

                      <h3 className="mb-4 text-lg font-semibold text-blue-900">Custom Time</h3>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(Number(e.target.value))}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          min="1"
                          max="180"
                        />
                        <button
                          onClick={applyCustomTime}
                          className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition hover:bg-blue-600"
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Notes & Links Section */}
            <div className="space-y-6">
              {/* Notes */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-blue-900">Quick Notes</h3>
                  </div>
                  <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="rounded-lg bg-orange-100 p-2 text-orange-600 transition hover:bg-orange-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <AnimatePresence>
                  {showNoteInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a quick note..."
                        className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows={3}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={addNote}
                          className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                        >
                          Add Note
                        </button>
                        <button
                          onClick={() => {
                            setShowNoteInput(false);
                            setNewNote("");
                          }}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {loadingNotes ? (
                    <p className="py-8 text-center text-sm text-gray-500">Loading notes...</p>
                  ) : (
                    <AnimatePresence>
                      {notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="group rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="flex-1 text-sm text-gray-700">{note.content}</p>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="opacity-0 transition group-hover:opacity-100"
                            >
                              <Trash2 size={14} className="text-red-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  {!loadingNotes && notes.length === 0 && (
                    <p className="py-8 text-center text-sm text-gray-500">No notes yet</p>
                  )}
                </div>
              </div>

              {/* YouTube Links */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-blue-900">Study Links</h3>
                  </div>
                  <button
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <AnimatePresence>
                  {showLinkInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 space-y-2 overflow-hidden"
                    >
                      <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Link title..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="YouTube URL..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addLink}
                          className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                        >
                          Add Link
                        </button>
                        <button
                          onClick={() => {
                            setShowLinkInput(false);
                            setNewLinkTitle("");
                            setNewLinkUrl("");
                          }}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {loadingLinks ? (
                    <p className="py-8 text-center text-sm text-gray-500">Loading links...</p>
                  ) : (
                    <AnimatePresence>
                      {links.map((link) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="group rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-sm text-blue-600 hover:underline"
                            >
                              {link.title}
                            </a>
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="opacity-0 transition group-hover:opacity-100"
                            >
                              <Trash2 size={14} className="text-red-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  {!loadingLinks && links.length === 0 && (
                    <p className="py-8 text-center text-sm text-gray-500">No links yet</p>
                  )}
                </div>
              </div>

              {/* Last Session Details */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-blue-900">Last Session</h3>
                </div>

                {lastSession ? (
                  <div className="space-y-3">
                    {lastSession.sessionName && (
                      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">📝 {lastSession.sessionName}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Duration</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {Math.floor(lastSession.duration / 60)} min
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">Date</span>
                      </div>
                      <span className="font-semibold text-green-600">
                        {new Date(lastSession.startTime).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-gray-700">Time</span>
                      </div>
                      <span className="font-semibold text-orange-600">
                        {new Date(lastSession.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">No sessions yet</p>
                    <p className="mt-1 text-xs text-gray-400">Start a timer to track your focus time</p>
                  </div>
                )}
              </div>

              {/* Session History */}
              {sessionHistory.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                  <div className="mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-blue-900">Recent Sessions</h3>
                  </div>

                  <div className="space-y-2">
                    {sessionHistory.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 transition"
                      >
                        {session.sessionName && (
                          <p className="mb-1 text-sm font-medium text-gray-900">
                            📝 {session.sessionName}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {new Date(session.startTime).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="font-semibold text-blue-600">
                            {Math.floor(session.duration / 60)} min
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {new Date(session.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-3 text-center border border-purple-200">
                    <p className="text-xs text-gray-700">
                      Keep up the great work! 🎯
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
