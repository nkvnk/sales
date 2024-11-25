// components/dashboard/GoalMetrics.js
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

export const GoalMetrics = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState({}); // 空のオブジェクトで初期化
  const [achievements, setAchievements] = useState({}); // 空のオブジェクトで初期化
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
      console.log("確認ユーザー", user.id);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Current user ID:", user.id);
      // 目標データの取得
      const { data: goalsData, error: goalsError } = await supabase
        .from("goal")
        .select("*")
        .eq("id", user.id)
        .single();

      setGoals(goalsData || {});
      //実績データの収集
      const { data: achievementsData, error: achievementsError } =
        await supabase
          .from("todayresult")
          .select("*")
          .eq("id", user.id)
          .single();

      setAchievements(achievementsData || {});

      console.log("Query result:", { goalsData, goalsError });
      console.log("できるのか", goalsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // エラー時は空のオブジェクトを使用
      setGoals({});
      setAchievements({});
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (actual, target) => {
    if (!target || !actual) return 0;
    return Math.min(Math.round(((actual || 0) / target) * 100), 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getStatusColor = (progress) => {
    if (progress >= 80) return "text-emerald-600";
    if (progress >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  const getProgressIcon = (progress) => {
    if (progress >= 80) {
      return <TrendingUp className="w-5 h-5 text-emerald-500" />;
    } else if (progress >= 50) {
      return <TrendingUp className="w-5 h-5 text-amber-500" />;
    } else {
      return <TrendingDown className="w-5 h-5 text-rose-500" />;
    }
  };

  const metrics = [
    { key: "attendance", label: "出勤" },
    { key: "support", label: "対応数" },
    { key: "realsupport", label: "実対応" },
    { key: "approach", label: "アプ" },
    { key: "appoint", label: "アポ" },
  ];

  // ローディング中の表示
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map(({ key, label }) => {
        const target = parseInt(goals[key]) || 0; // 数値に変換
        const actual = parseInt(achievements[key]) || 0; // 数値に変換
        const progress = calculateProgress(actual, target);

        return (
          <Card
            key={key}
            className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer group relative"
          >
            {/* ヘッダー部分 */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-600">{label}</h3>
              {getProgressIcon(progress)}
            </div>

            {/* 数値表示 */}
            <div className="flex items-baseline space-x-2 mb-3">
              <span
                className={`text-2xl font-bold ${getStatusColor(progress)}`}
              >
                {actual}
              </span>
              <span className="text-sm text-gray-500">/ {target}</span>
            </div>

            {/* プログレスバー */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor(
                  progress
                )}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 達成率 */}
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">達成率</span>
              <span
                className={`text-sm font-medium ${getStatusColor(progress)}`}
              >
                {progress}%
              </span>
            </div>

            {/* ホバー効果 */}
            <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity" />
          </Card>
        );
      })}
    </div>
  );
};
