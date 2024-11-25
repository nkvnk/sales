// components/dashboard/DetailedMetrics.js
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  getProgressColor,
  getStatusColor,
  getProgressBackground,
} from "@/lib/utils/calculations";
import { useRouter } from "next/navigation";

export const DetailedMetrics = ({ data }) => {
  const router = useRouter();

  const handleMetricClick = (metric) => {
    router.push(`/metric-detail?metric=${metric}&name=${data.name}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(data.目標).map(([metric, target]) => {
        const 達成率 = Math.round((data.実績[metric] / target) * 100);

        return (
          <div
            key={metric}
            onClick={() => handleMetricClick(metric)}
            className={`
             p-4

              rounded-lg 
              ${getProgressBackground(達成率)}
              relative 
              overflow-hidden 
              cursor-pointer
              transition-all 
              duration-150
              active:opacity-60
              hover:opacity-80
              hover:shadow-sm
              active:shadow-none
              active:transform 
              active:scale-95
            `}
          >
            {/* プログレスバー */}
            <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
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

            {/* コンテンツ */}
            <div className="text-sm text-gray-600">{metric}</div>
            <div className={`text-2xl font-bold ${getStatusColor(達成率)}`}>
              {達成率}%
            </div>
            <div className="text-xs text-gray-500">
              実績: {data.実績[metric]} / 目標: {target}
            </div>
          </div>
        );
      })}
    </div>
  );
};
