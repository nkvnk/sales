// lib/utils/calculations.js
import React from "react";
import { ArrowUpCircle, ArrowDownCircle, Target } from "lucide-react";
export const calculate達成率 = (実績, 目標) => {
  return Math.round((実績 / 目標) * 100);
};

export const getProgressBackground = (達成率) => {
  if (達成率 >= 80) return "bg-emerald-50";
  if (達成率 >= 50) return "bg-amber-50";
  return "bg-rose-50";
};

export const getStatusIcon = (達成率) => {
  if (達成率 >= 80)
    return <ArrowUpCircle className="w-6 h-6 text-emerald-600" />;
  if (達成率 >= 50) return <Target className="w-6 h-6 text-amber-500" />;
  return <ArrowDownCircle className="w-6 h-6 text-rose-500" />;
};
// lib/utils/calculations.js の色関連の関数を更新
export const getProgressColor = (達成率) => {
  if (達成率 >= 80) return "bg-emerald-500";
  if (達成率 >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

export const getStatusColor = (達成率) => {
  if (達成率 >= 80) return "text-emerald-600";
  if (達成率 >= 50) return "text-amber-600";
  return "text-rose-600";
};
