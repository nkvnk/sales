"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Area,
  AreaChart,
} from "recharts";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Target,
  Users,
  Calendar,
  TrendingUp,
  BarChart2,
} from "lucide-react";

const salesData = [
  {
    name: "全体",
    目標: {
      出勤: 100,
      対応: 500,
      イン: 250,
      ドア: 150,
      アプ: 100,
      アポ: 50,
      商談: 40,
      契約: 25,
      完工: 20,
    },
    実績: {
      出勤: 92,
      対応: 450,
      イン: 220,
      ドア: 130,
      アプ: 85,
      アポ: 42,
      商談: 35,
      契約: 20,
      完工: 18,
    },
    monthlyTrend: [
      { month: "4月", 目標達成率: 80, 実績達成率: 75 },
      { month: "5月", 目標達成率: 85, 実績達成率: 82 },
      { month: "6月", 目標達成率: 85, 実績達成率: 88 },
      { month: "7月", 目標達成率: 90, 実績達成率: 85 },
    ],
  },
  {
    name: "山田太郎",
    目標: {
      出勤: 20,
      対応: 100,
      イン: 50,
      ドア: 30,
      アプ: 20,
      アポ: 10,
      商談: 8,
      契約: 5,
      完工: 3,
    },
    実績: {
      出勤: 18,
      対応: 85,
      イン: 20,
      ドア: 25,
      アプ: 15,
      アポ: 8,
      商談: 6,
      契約: 3,
      完工: 2,
    },
    monthlyTrend: [
      { month: "4月", 目標達成率: 70, 実績達成率: 65 },
      { month: "5月", 目標達成率: 75, 実績達成率: 70 },
      { month: "6月", 目標達成率: 80, 実績達成率: 75 },
      { month: "7月", 目標達成率: 85, 実績達成率: 85 },
    ],
  },
  {
    name: "鈴木花子",
    目標: {
      出勤: 20,
      対応: 100,
      イン: 50,
      ドア: 30,
      アプ: 20,
      アポ: 10,
      商談: 8,
      契約: 5,
      完工: 3,
    },
    実績: {
      出勤: 19,
      対応: 88,
      イン: 41,
      ドア: 23,
      アプ: 17,
      アポ: 9,
      商談: 7,
      契約: 4,
      完工: 3,
    },
    monthlyTrend: [
      { month: "4月", 目標達成率: 75, 実績達成率: 75 },
      { month: "5月", 目標達成率: 80, 実績達成率: 82 },
      { month: "6月", 目標達成率: 85, 実績達成率: 88 },
      { month: "7月", 目標達成率: 90, 実績達成率: 92 },
    ],
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const calculate達成率 = (実績, 目標) => {
  return Math.round((実績 / 目標) * 100);
};

const getProgressColor = (達成率) => {
  if (達成率 >= 80) return "bg-emerald-500";
  if (達成率 >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

const getStatusColor = (達成率) => {
  if (達成率 >= 80) return "text-emerald-600";
  if (達成率 >= 50) return "text-amber-500";
  return "text-rose-500";
};

const getStatusIcon = (達成率) => {
  if (達成率 >= 80)
    return <ArrowUpCircle className="w-6 h-6 text-emerald-600" />;
  if (達成率 >= 50) return <Target className="w-6 h-6 text-amber-500" />;
  return <ArrowDownCircle className="w-6 h-6 text-rose-500" />;
};

const getProgressBackground = (達成率) => {
  if (達成率 >= 80) return "bg-emerald-50";
  if (達成率 >= 50) return "bg-amber-50";
  return "bg-rose-50";
};

const TeamOverview = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data
        .filter((member) => member.name !== "全体")
        .map((member) => {
          const avgAchievement =
            Object.keys(member.実績).reduce((acc, key) => {
              const 達成率 = calculate達成率(
                member.実績[key],
                member.目標[key]
              );
              return acc + 達成率;
            }, 0) / Object.keys(member.実績).length;

          const keyMetrics = ["契約", "アポ", "商談"];

          return (
            <Card
              key={member.name}
              className="bg-white hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800 flex justify-between items-center">
                  <span>{member.name}</span>
                  <span
                    className={`text-base ${getStatusColor(avgAchievement)}`}
                  >
                    平均達成率: {Math.round(avgAchievement)}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keyMetrics.map((key) => {
                    const 達成率 = calculate達成率(
                      member.実績[key],
                      member.目標[key]
                    );
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{key}</span>
                          <span className={`${getStatusColor(達成率)}`}>
                            {達成率}% ({member.実績[key]}/{member.目標[key]})
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${getProgressColor(
                              達成率
                            )}`}
                            style={{ width: `${Math.min(達成率, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};
export default function Dashboard() {
  const [selectedMember, setSelectedMember] = useState(salesData[0]);

  const metrics = [
    { key: "出勤", label: "出勤", icon: <Calendar className="w-6 h-6" /> },
    { key: "対応", label: "対応", icon: <Users className="w-6 h-6" /> },
    { key: "イン", label: "イン", icon: <TrendingUp className="w-6 h-6" /> },
    { key: "契約", label: "契約", icon: <BarChart2 className="w-6 h-6" /> },
  ];

  const compareData = Object.keys(selectedMember.目標).map((key) => ({
    name: key,
    目標: selectedMember.目標[key],
    実績: selectedMember.実績[key],
    達成率: calculate達成率(selectedMember.実績[key], selectedMember.目標[key]),
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900"></h1>
        <select
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200"
          onChange={(e) =>
            setSelectedMember(salesData.find((d) => d.name === e.target.value))
          }
          value={selectedMember.name}
        >
          {salesData.map((member) => (
            <option key={member.name} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map(({ key, label, icon }) => {
          const 達成率 = calculate達成率(
            selectedMember.実績[key],
            selectedMember.目標[key]
          );
          return (
            <Card
              key={key}
              className="bg-white hover:shadow-md transition-all duration-300 relative group"
            >
              <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getProgressColor(
                    達成率
                  )}`}
                  style={{
                    width: `${Math.min(達成率, 100)}%`,
                    transition:
                      "width 1s ease-in-out, background-color 0.5s ease",
                  }}
                />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {label}
                </CardTitle>
                {React.cloneElement(icon, {
                  className: `w-6 h-6 transition-colors duration-300 ${getStatusColor(
                    達成率
                  )}`,
                })}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`text-3xl font-bold ${getStatusColor(達成率)}`}
                    >
                      {達成率}%
                    </div>
                    <div className="text-xs text-gray-500">
                      実績: {selectedMember.実績[key]} / 目標:{" "}
                      {selectedMember.目標[key]}
                    </div>
                  </div>
                  {getStatusIcon(達成率)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">月次推移</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedMember.monthlyTrend}>
                <defs>
                  <linearGradient id="目標Color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="実績Color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="目標達成率"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#目標Color)"
                  name="目標"
                />
                <Area
                  type="monotone"
                  dataKey="実績達成率"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#実績Color)"
                  name="実績"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              項目別達成状況
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="目標"
                  fill="#059669"
                  opacity={0.8}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="実績"
                  fill="#10B981"
                  opacity={0.8}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {selectedMember.name === "全体" && (
        <div className="space-y-6">
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              チームメンバー実績
            </h2>
            <TeamOverview data={salesData} />
          </div>
        </div>
      )}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">詳細データ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {compareData.map((item) => (
              <div
                key={item.name}
                className={`p-4 rounded-lg ${getProgressBackground(
                  item.達成率
                )} relative overflow-hidden group hover:shadow-md transition-all duration-300`}
              >
                <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressColor(
                      item.達成率
                    )}`}
                    style={{
                      width: `${Math.min(item.達成率, 100)}%`,
                      transition:
                        "width 1s ease-in-out, background-color 0.5s ease",
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600">{item.name}</div>
                <div
                  className={`text-2xl font-bold ${getStatusColor(
                    item.達成率
                  )}`}
                >
                  {item.達成率}%
                </div>
                <div className="text-xs text-gray-500">
                  実績: {item.実績} / 目標: {item.目標}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
