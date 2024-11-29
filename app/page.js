"use client";
import React, { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { CircleArrowDown } from "lucide-react";
import { GoalMetrics } from "@/components/dashboard/GoalMetrics";
import SimpleSalesMetrics from "@/components/dashboard/SalesDetailView";

const MetricRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <div>
      <span className="text-gray-600">{label}</span>
    </div>
    <div>
      <span className="font-semibold">{value}</span>
    </div>
  </div>
);

export default function Page() {
  const [isBatteryExpanded, setIsBatteryExpanded] = useState(false);
  const [isZehExpanded, setIsZehExpanded] = useState(false);

  const batteryMetrics = [
    {
      label: "イン",
      value: 31.8,
    },
    {
      label: "アプ",
      value: 66,
    },
    {
      label: "アポ",
      value: 45,
    },
    {
      label: "ドア",
      value: 28,
    },
  ];

  const zehMetrics = [
    {
      label: "イン",
      value: 31.8,
    },
    {
      label: "アプ",
      value: 66,
    },
    {
      label: "アポ",
      value: 45,
    },
    {
      label: "ドア",
      value: 28,
    },
  ];

  useEffect(() => {
    // console.log("ユーザーデータを表示する", user);
  }, []);

  return (
    <main>
      <div className="p-5 mx-auto space-y-6 bg-white rounded-xl shadow-sm mb-20">
        {/* Header with member selector */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900">Daily Metrics</h2>

        {/* Metric Cards Grid */}
        <GoalMetrics />

        <section className="bg-white rounded-xl w-full">
          {/* Battery Index */}
          <div className="px-8 py-2 border-gray-100 w-full">
            <div className="mx-auto">
              <h2 className="text-l font-extrabold text-gray-900 text-center border-b border-emerald-500 py-2">
                Battery Index
              </h2>
            </div>
            <div
              className="text-center mt-2 cursor-pointer"
              onClick={() => setIsBatteryExpanded(!isBatteryExpanded)}
            >
              <CircleArrowDown
                className={`text-emerald-500 w-5 h-5 mx-auto transition-transform duration-200 ${
                  isBatteryExpanded ? "transform rotate-180" : ""
                }`}
              />
            </div>
            {isBatteryExpanded && (
              <div className="px-4 py-6">
                {batteryMetrics.map((metric, index) => (
                  <MetricRow
                    key={index}
                    label={metric.label}
                    value={metric.value}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Zeh Index */}
          <div className="px-8 py-2 border-gray-100">
            <div className="mx-auto">
              <h2 className="text-l font-extrabold text-gray-900 text-center border-b border-emerald-500 py-2">
                Zeh Index
              </h2>
            </div>
            <div
              className="text-center mt-2 cursor-pointer"
              onClick={() => setIsZehExpanded(!isZehExpanded)}
            >
              <CircleArrowDown
                className={`text-emerald-500 w-5 h-5 mx-auto transition-transform duration-200 ${
                  isZehExpanded ? "transform rotate-180" : ""
                }`}
              />
            </div>
            {isZehExpanded && (
              <div className="px-4 py-6">
                {zehMetrics.map((metric, index) => (
                  <MetricRow
                    key={index}
                    label={metric.label}
                    value={metric.value}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <h2 className="text-2xl font-extrabold text-gray-900">
          Sustained Metrics
        </h2>
        <SimpleSalesMetrics />
      </div>
    </main>
  );
}
