import { PauseIcon, PlayIcon, TimerResetIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { analyticsService } from "@/services/analyticsService";
import { timerService } from "@/services/timerService";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Timer() {
  const [user] = useAuthState(auth);
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setRunning] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const sessionStartTime = useRef<number | null>(null);

  // Load initial timer state from Firebase
  useEffect(() => {
    if (!user || isLoaded) return;

    const loadInitialState = async () => {
      try {
        const state = await timerService.getTimerState(user.uid);
        if (state) {
          setMinutes(state.minutes);
          setSeconds(state.seconds);
          setRunning(false); // Don't auto-resume
          setCustomMinutes(state.customMinutes);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading timer state:", error);
        setIsLoaded(true);
      }
    };

    loadInitialState();
  }, [user, isLoaded]);

  // Subscribe to timer state changes from Firebase
  useEffect(() => {
    if (!user || !isLoaded) return;

    const unsubscribe = timerService.subscribeToTimerState(user.uid, (state) => {
      if (state) {
        setMinutes(state.minutes);
        setSeconds(state.seconds);
        setRunning(state.isRunning);
        setCustomMinutes(state.customMinutes);
      }
    });

    return () => unsubscribe();
  }, [user, isLoaded]);

  // Save timer state to Firebase whenever it changes (debounced)
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

    // Debounce saves to prevent conflicts
    const timeoutId = setTimeout(saveState, 500);
    return () => clearTimeout(timeoutId);
  }, [user, minutes, seconds, isRunning, customMinutes]);

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
          setRunning(false);
          handleSessionComplete();
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
        console.log("Study session logged:", duration, "seconds");
      } catch (error) {
        console.error("Error logging study session:", error);
      }
    }

    sessionStartTime.current = null;
  };

  const handleStartPause = (): void => {
    if (isRunning) {
      handleSessionComplete();
    }
    setRunning((prev) => !prev);
  };

  const handleReset = (): void => {
    if (isRunning) {
      handleSessionComplete();
    }
    setMinutes(customMinutes);
    setSeconds(0);
    setRunning(false);
    sessionStartTime.current = null;
  };

  const display = useMemo(() => {
    const totalSeconds = minutes * 60 + seconds;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return { hrs, mins, secs };
  }, [minutes, seconds]);

  return (
    <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-blue-900">Focus Timer</h2>
        <span className="text-xs uppercase tracking-wide text-gray-500">Pomodoro</span>
      </div>

      {/* Timer Display */}
      <div className="mb-6 flex flex-wrap justify-center gap-6 md:justify-between">
        <div className="text-center">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-3xl font-bold text-blue-900">
            {String(display.hrs).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-600">Hours</p>
        </div>

        <div className="text-center">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-3xl font-bold text-blue-900">
            {String(display.mins).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-600">Minutes</p>
        </div>

        <div className="text-center">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-3xl font-bold text-blue-900">
            {String(display.secs).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-600">Seconds</p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-2 flex gap-4">
        <button
          onClick={handleStartPause}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-500 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-blue-600"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>

        <button
          onClick={handleReset}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
          aria-label="Reset Timer"
        >
          <TimerResetIcon size={22} />
        </button>
      </div>
    </section>
  );
}
