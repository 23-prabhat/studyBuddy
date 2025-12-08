import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Activity,
} from "lucide-react";
import SideBar from "@/components/Dashboard/SideBar";
import { analyticsService } from "@/services/analyticsService";
import type { AnalyticsData } from "@/types/analytics";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Analytics() {
  const [user] = useAuthState(auth);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await analyticsService.getAnalyticsData(user.uid);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <p>Please login to view your analytics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white text-gray-900 font-sans">
        <SideBar />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </main>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-screen bg-white text-gray-900 font-sans">
        <SideBar />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-600">No analytics data available</p>
        </main>
      </div>
    );
  }

  const pieData = [
    { name: "Completed", value: analytics.taskStats.completed, color: "#10b981" },
    { name: "Active", value: analytics.taskStats.active, color: "#f97316" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData = analytics.dailyStats.map((stat) => ({
    date: formatDate(stat.date),
    minutes: stat.totalMinutes,
    sessions: stat.sessions,
  }));

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <SideBar />

      <main className="flex-1 overflow-y-auto px-8 py-10 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-blue-900">Analytics Dashboard</h1>
            <p className="mt-1 text-gray-600">Track your productivity and progress</p>
          </header>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Focus Time */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Focus Time</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalFocusTime} min</p>
                </div>
              </div>
            </div>

            {/* Weekly Focus Time */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.weeklyFocusTime} min</p>
                </div>
              </div>
            </div>

            {/* Total Sessions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-3">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Study Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalSessions}</p>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.taskStats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Daily Focus Time Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Daily Focus Time (Last 7 Days)</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      color: "#111827",
                    }}
                  />
                  <Bar dataKey="minutes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Study Sessions Chart */}
            <div className="rounded-xl border border-white/10 bg-[#161B22] p-6">
              <div className="mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Study Sessions Per Day</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ fill: "#a855f7", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Task Completion Pie Chart */}
            <div className="rounded-xl border border-white/10 bg-[#161B22] p-6">
              <div className="mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-semibold">Task Completion</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: "#9ca3af" }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="rounded-xl border border-white/10 bg-[#161B22] p-6">
              <div className="mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Performance Summary</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Average Session Time</span>
                    <span className="font-semibold text-orange-400">
                      {analytics.averageSessionTime} min
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full bg-orange-500 transition-all"
                      style={{
                        width: `${Math.min((analytics.averageSessionTime / 60) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Tasks Completed</span>
                    <span className="font-semibold text-green-400">
                      {analytics.taskStats.completed} / {analytics.taskStats.total}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${analytics.taskStats.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Active Tasks</span>
                    <span className="font-semibold text-blue-400">
                      {analytics.taskStats.active}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{
                        width: `${analytics.taskStats.total > 0 ? (analytics.taskStats.active / analytics.taskStats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-[#0D1117] p-4">
                  <p className="text-center text-sm text-gray-400">
                    Keep up the great work! 🎉
                  </p>
                  <p className="mt-1 text-center text-xs text-gray-500">
                    You've been productive this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
