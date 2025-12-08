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
} from "lucide-react";
import SideBar from "@/components/Dashboard/SideBar";
import { analyticsService } from "@/services/analyticsService";
import { timerService } from "@/services/timerService";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import type { TimerNote, YouTubeLink, TimerPreset } from "@/types/timer";

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

  // Load notes and links from Firebase
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoadingNotes(true);
        setLoadingLinks(true);

        const [notesData, linksData] = await Promise.all([
          timerService.getUserNotes(user.uid),
          timerService.getUserLinks(user.uid),
        ]);

        setNotes(notesData);
        setLinks(linksData);
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
        await analyticsService.logStudySession(user.uid, duration, sessionStartTime.current);
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
    <div className="flex min-h-screen bg-[#0D1117] text-white font-sans">
      <SideBar />

      <main className="flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold">Focus Timer</h1>
            <p className="mt-1 text-gray-400">Stay focused and track your study sessions</p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Timer Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-[#161B22] p-8">
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
                        stroke="#1f2937"
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke="#f97316"
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
                        <div className="text-7xl font-bold">
                          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          {isRunning ? "Focus Mode" : "Ready to start"}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Control Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartPause}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
                    >
                      {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#0D1117] transition hover:border-orange-500/50"
                    >
                      <RotateCcw size={24} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSettings(!showSettings)}
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#0D1117] transition hover:border-orange-500/50"
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
                      className="overflow-hidden border-t border-white/10 pt-6"
                    >
                      <h3 className="mb-4 text-lg font-semibold">Timer Presets</h3>
                      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {TIMER_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className="rounded-lg border border-white/10 bg-[#0D1117] px-4 py-3 text-sm transition hover:border-orange-500/50 hover:bg-orange-500/10"
                          >
                            <p className="font-medium">{preset.name}</p>
                            <p className="text-xs text-gray-400">{preset.minutes} min</p>
                          </button>
                        ))}
                      </div>

                      <h3 className="mb-4 text-lg font-semibold">Custom Time</h3>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(Number(e.target.value))}
                          className="flex-1 rounded-lg border border-white/10 bg-[#0D1117] px-4 py-2 focus:border-orange-500 focus:outline-none"
                          min="1"
                          max="180"
                        />
                        <button
                          onClick={applyCustomTime}
                          className="rounded-lg bg-orange-500 px-6 py-2 font-medium transition hover:bg-orange-600"
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
              <div className="rounded-2xl border border-white/10 bg-[#161B22] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5 text-orange-400" />
                    <h3 className="text-lg font-semibold">Quick Notes</h3>
                  </div>
                  <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="rounded-lg bg-orange-500/20 p-2 text-orange-400 transition hover:bg-orange-500/30"
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
                        className="w-full resize-none rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                        rows={3}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={addNote}
                          className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium transition hover:bg-orange-600"
                        >
                          Add Note
                        </button>
                        <button
                          onClick={() => {
                            setShowNoteInput(false);
                            setNewNote("");
                          }}
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
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
                          className="group rounded-lg border border-white/5 bg-[#0D1117] p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="flex-1 text-sm text-gray-300">{note.content}</p>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="opacity-0 transition group-hover:opacity-100"
                            >
                              <Trash2 size={14} className="text-red-400" />
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
              <div className="rounded-2xl border border-white/10 bg-[#161B22] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold">Study Links</h3>
                  </div>
                  <button
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30"
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
                        className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      />
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="YouTube URL..."
                        className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addLink}
                          className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium transition hover:bg-orange-600"
                        >
                          Add Link
                        </button>
                        <button
                          onClick={() => {
                            setShowLinkInput(false);
                            setNewLinkTitle("");
                            setNewLinkUrl("");
                          }}
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
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
                          className="group rounded-lg border border-white/5 bg-[#0D1117] p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-sm text-blue-400 hover:underline"
                            >
                              {link.title}
                            </a>
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="opacity-0 transition group-hover:opacity-100"
                            >
                              <Trash2 size={14} className="text-red-400" />
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
