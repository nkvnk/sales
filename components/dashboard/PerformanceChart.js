// components/dashboard/PerformanceChart.js
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculate達成率 } from "@/lib/utils/calculations";
import { CustomTooltip } from "./CustomTooltip";

export const PerformanceChart = ({ data }) => {
  const compareData = Object.keys(data.目標).map((key) => ({
    name: key,
    目標: data.目標[key],
    実績: data.実績[key],
    達成率: calculate達成率(data.実績[key], data.目標[key]),
  }));

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">項目別達成状況</CardTitle>
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
  );
};
