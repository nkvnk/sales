"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";

import AttendanceInsight from "@/components/dashboard/attendanceinsight";
// ... 既存のデータ定義

const AttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("monthly");
  const router = useRouter();

  // 月間実績のサンプルデータ
  const monthlyStats = {
    attended: 8,
    total: 7,
    percentage: 80,
    avgHours: 6.5,
    totalEmployees: 12,
  };

  const handleBack = () => {
    router.back();
  };

  const renderBarChart = (data, xAxisKey) => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="attendance" name="出勤" fill="#4ade80" />
        <Bar dataKey="late" name="遅刻" fill="#fbbf24" />
        <Bar dataKey="absent" name="欠勤" fill="#f87171" />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="mx-auto space-y-6 bg-white rounded-xl shadow-sm mb-20">
      <div className="p-6 flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Attendance Insights
        </h1>
      </div>

      {/* 月間実績セクション */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <h2 className="font-bold text-xl">月間出勤目標</h2>
          <Card className="bg-white">
            <CardHeader></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center items-center">
                  {" "}
                  {/* justifyをcenterに変更 */}
                  <span className="text-3xl font-bold text-green-600">
                    {" "}
                    {/* フォントサイズを大きくして存在感を出す */}
                    {monthlyStats.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 rounded-full h-2"
                    style={{ width: `${monthlyStats.percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 text-center">
                  {monthlyStats.attended}/{monthlyStats.total} 回出勤
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="p-2  px-6">
        <h2 className="font-bold text-xl">出勤グラフ</h2>
      </div>
      <AttendanceInsight />
      {/* 既存のグラフセクション */}
      <Card className="w-full max-w-6xl mx-auto">
        {/* ... 既存のCardHeader, CardContent, Tabsなど */}
      </Card>
    </div>
  );
};

export default AttendanceDashboard;
