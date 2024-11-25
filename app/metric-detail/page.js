// app/metric-detail/page.js
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const getDailyData = (month = 1) => {
  return Array.from({ length: new Date(2024, month, 0).getDate() }, (_, i) => ({
    day: i + 1,
    実績: Math.floor(Math.random() * 100),
    目標: 80,
  }));
};

const getWeeklyData = () => {
  const weeks = ["第1週", "第2週", "第3週", "第4週", "第5週"];
  return weeks.map((week) => ({
    week,
    実績: Math.floor(Math.random() * 100),
    目標: 80,
  }));
};

export default function MetricDetailPage() {
  const searchParams = useSearchParams();
  const metric = searchParams.get("metric");
  const name = searchParams.get("name");

  const dailyData = getDailyData();
  const weeklyData = getWeeklyData();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{metric}の詳細</h1>
          <p className="text-gray-600">{name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 日次トレンド */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">日次推移</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="実績"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Line
                  type="monotone"
                  dataKey="目標"
                  stroke="#6B7280"
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 週次集計 */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">週次集計</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="実績" fill="#10B981" />
                <Bar dataKey="目標" fill="#6B7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 時間帯別分析 */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">時間帯別実績</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { time: "9-11時", value: 30 },
                  { time: "11-13時", value: 45 },
                  { time: "13-15時", value: 35 },
                  { time: "15-17時", value: 50 },
                  { time: "17-19時", value: 40 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 統計サマリー */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">統計サマリー</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">平均実績</p>
              <p className="text-2xl font-bold text-emerald-600">85%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">最高実績日</p>
              <p className="text-2xl font-bold">95%</p>
              <p className="text-sm text-gray-500">2024年1月15日</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">最低実績日</p>
              <p className="text-2xl font-bold text-rose-600">65%</p>
              <p className="text-sm text-gray-500">2024年1月5日</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
