// components/dashboard/MetricCard.js
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const MetricCard = ({ label, icon: Icon, 実績, 目標 }) => {
  const 達成率 = Math.round((実績 / 目標) * 100);

  const getBarColor = (達成率) => {
    if (達成率 >= 80) return "bg-emerald-500";
    if (達成率 >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getTextColor = (達成率) => {
    if (達成率 >= 80) return "text-emerald-600";
    if (達成率 >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  const getSubTextColor = (達成率) => {
    if (達成率 >= 80) return "text-emerald-700";
    if (達成率 >= 50) return "text-amber-700";
    return "text-rose-700";
  };

  return (
    <Card className="bg-white p-4">
      <CardHeader className="p-0 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base text-gray-600">{label}</CardTitle>
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${getTextColor(達成率)}`}>
            {達成率}%
          </div>
          <div className={`text-xs ${getSubTextColor(達成率)}`}>
            実績: {実績} / 目標: {目標}
          </div>
          <div className="h-1 bg-gray-100">
            <div
              className={`h-full ${getBarColor(
                達成率
              )} transition-all duration-300`}
              style={{ width: `${Math.min(達成率, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
