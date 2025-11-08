import { PauseIcon, PlayIcon, TimerResetIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Timer() {
  const [hours , setHours] = useState<number>(0)  
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

  return (
    <div className="flex flex-col text-white rounded-2xl p-8 shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">Focus Timer</h1>

      {/* Timer Display */}
      <div className="flex space-x-6 mb-6">
        <div >
          <div className="bg-gray-700 rounded-lg w-20 h-20 flex flex-col justify-center items-center text-3xl font-bold">
            {String(hours).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-400">Hours</p>
        </div>

        <div className="text-center">
          <div className="bg-gray-700 rounded-lg w-20 h-20 flex flex-col justify-center items-center text-3xl font-bold">
            {String(minutes).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-400">Minutes</p>
        </div>

        <div className="text-center">
          <div className="bg-gray-700 rounded-lg w-20 h-20 flex flex-col justify-center items-center text-3xl font-bold">
            {String(seconds).padStart(2, "0")}
          </div>
          <p className="mt-2 text-sm text-gray-400">Seconds</p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-6 mt-2">
        <button
          onClick={handleStartPause}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transition-all"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded-full p-4 transition-all"
          aria-label="Reset Timer"
        >
          <TimerResetIcon size={22} />
        </button>
      </div>
    </div>
  );
}
