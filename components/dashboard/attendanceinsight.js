"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  SkipBack,
  SkipForward,
} from "lucide-react";

const AttendanceInsight = () => {
  const [interval, setInterval] = useState("1hour");
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  // データ生成関数
  const generateData = () => {
    const now = new Date();
    const data = [];
    let totalHours = 24;
    let intervalMinutes = 60;

    switch (interval) {
      case "30min":
        intervalMinutes = 30;
        totalHours = 12;
        break;
      case "15min":
        intervalMinutes = 15;
        totalHours = 6;
        break;
      default:
        intervalMinutes = 60;
        totalHours = 24;
    }

    const totalIntervals = (totalHours * 60) / intervalMinutes;

    for (let i = 0; i < totalIntervals; i++) {
      const time = new Date(now);
      time.setMinutes(time.getMinutes() - i * intervalMinutes);
      data.unshift({
        time: time.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        responses: Math.floor(Math.random() * 50) + 10,
      });
    }
    return data;
  };

  // ページサイズ取得関数
  const getPageSize = () => {
    switch (interval) {
      case "30min":
        return 12;
      case "15min":
        return 8;
      default:
        return 12;
    }
  };

  // データのページング処理
  const getPagedData = () => {
    const pageSize = getPageSize();
    const start = currentPage * pageSize;
    return data.slice(start, start + pageSize);
  };

  // インターバル変更時のデータ更新
  useEffect(() => {
    const newData = generateData();
    setData(newData);
    setCurrentPage(0);
  }, [interval]);

  const totalPages = Math.ceil(data.length / getPageSize());

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 ">
          <p className="text-gray-600 font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {label}
          </p>
          <p className="text-2xl font-bold text-emerald-600 ">
            {payload[0].value}
            <span className="text-sm font-normal text-gray-500 ml-1">件</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const NavigationControls = () => (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-3 pb-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCurrentPage(0)}
        disabled={currentPage === 0}
        className="hover:bg-emerald-50 transition-colors"
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
        disabled={currentPage === 0}
        className="hover:bg-emerald-50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
        <span className="text-sm font-medium text-gray-700">
          {currentPage + 1} / {totalPages}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
        }
        disabled={currentPage === totalPages - 1}
        className="hover:bg-emerald-50 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCurrentPage(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        className="hover:bg-emerald-50 transition-colors"
      >
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="space-y-4">
          <div className="flex gap-2">
            {[
              { value: "1hour", label: "１週間" },
              { value: "30min", label: "１カ月" },
              { value: "15min", label: "３か月" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={interval === option.value ? "default" : "outline"}
                onClick={() => setInterval(option.value)}
                className={`w-24 transition-all duration-200 ${
                  interval === option.value
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500"
                    : ""
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6 relative pb-16">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getPagedData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                onMouseMove={(state) => {
                  if (state.isTooltipActive) {
                    setHoveredBar(state.activeTooltipIndex);
                  } else {
                    setHoveredBar(null);
                  }
                }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                  <linearGradient
                    id="barGradientHover"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#6B7280" }}
                  tickLine={{ stroke: "#6B7280" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tick={{ fill: "#6B7280" }}
                  tickLine={{ stroke: "#6B7280" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickCount={8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="responses"
                  radius={[6, 6, 0, 0]}
                  name="対応数"
                  onMouseEnter={(data, index) => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {getPagedData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        hoveredBar === index
                          ? "url(#barGradientHover)"
                          : "url(#barGradient)"
                      }
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <NavigationControls />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceInsight;
