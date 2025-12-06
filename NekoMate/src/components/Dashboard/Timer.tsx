import { PauseIcon, PlayIcon, TimerResetIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Timer() {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          clearInterval(timer);
          setRunning(false);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds]);

  const handleStartPause = (): void => {
    setRunning((prev) => !prev);
  };

  const handleReset = (): void => {
    setMinutes(25);
    setSeconds(0);
    setRunning(false);
  };

  const display = useMemo(() => {
    const totalSeconds = minutes * 60 + seconds;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return { hrs, mins, secs };
  }, [minutes, seconds]);

  return (
    <section className="flex flex-col rounded-2xl border border-white/10 bg-[#161B22] p-8 text-white shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Focus Timer</h2>
        <span className="text-xs uppercase tracking-wide text-gray-500">Pomodoro</span>
      </div>

      {/* Timer Display */}
      <div className="mb-6 flex flex-wrap justify-center gap-6 md:justify-between">
        <div className="text-center">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-[#0D1117] text-3xl font-bold">
            {String(display.hrs).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-400">Hours</p>
        </div>

        <div className="text-center">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-[#0D1117] text-3xl font-bold">
            {String(display.mins).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-400">Minutes</p>
        </div>

        <div className="text-center">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-[#0D1117] text-3xl font-bold">
            {String(display.secs).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-400">Seconds</p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-2 flex gap-4">
        <button
          onClick={handleStartPause}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-orange-500 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-orange-600"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>

        <button
          onClick={handleReset}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#0D1117] transition hover:border-orange-500/60 hover:text-orange-400"
          aria-label="Reset Timer"
        >
          <TimerResetIcon size={22} />
        </button>
      </div>
    </section>
  );
}
