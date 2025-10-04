"use client"
import React, { useState, useEffect } from "react"

const TimerCard: React.FC = () => {
  // State types inferred automatically, but explicit typing for clarity
  const [time, setTime] = useState<number>(1500) // 25 minutes = 1500s
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, time])

  // format mm:ss
  const formatTime = (t: number): string => {
    const minutes: string = Math.floor(t / 60).toString().padStart(2, "0")
    const seconds: string = (t % 60).toString().padStart(2, "0")
    return `${minutes}:${seconds}`
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-xl w-72 bg-white hover:shadow-2xl transition">
      <h2 className="text-lg font-bold text-center text-blue-600 mb-4">
        Focus Timer
      </h2>

      {/* Timer Display */}
      <div className="text-4xl font-mono text-center mb-6 text-gray-800">
        {formatTime(time)}
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false)
            setTime(1500)
          }}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default TimerCard
