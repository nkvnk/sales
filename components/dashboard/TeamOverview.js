// components/dashboard/TeamOverview.js
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  calculate達成率,
  getProgressColor,
  getStatusColor,
} from "@/lib/utils/calculations";
import { CustomTooltip } from "./CustomTooltip";

export const TeamOverview = ({ data }) => {
  // 重み付け設定
  const WEIGHTED_METRICS = {
    契約: 0.4, // 40%
    商談: 0.35, // 35%
    アポ: 0.25, // 25%
  };

  // 表示するメトリクスの定義（数値とパーセンテージを分ける）
  const PERCENTAGE_METRICS = ["出勤", "対応", "イン", "ドア"];
  const COUNT_METRICS = ["アプ", "アポ", "商談", "契約", "完工"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((member) => {
        // 重み付けされた達成率の計算
        const weightedAvgAchievement = Object.entries(WEIGHTED_METRICS).reduce(
          (acc, [key, weight]) => {
            const 達成率 = calculate達成率(member.実績[key], member.目標[key]);
            return acc + 達成率 * weight;
          },
          0
        );

        return (
          <Card
            key={member.name}
            className="bg-white hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* 進捗バー */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gray-100">
              <div
                className={`h-full ${getProgressColor(weightedAvgAchievement)}`}
                style={{
                  width: `${Math.min(weightedAvgAchievement, 100)}%`,
                  transition:
                    "width 1s ease-in-out, background-color 0.5s ease",
                }}
              />
            </div>

            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg font-medium text-gray-800 flex justify-between items-center">
                <span>{member.name}</span>
                <span
                  className={`text-base ${getStatusColor(
                    weightedAvgAchievement
                  )}`}
                >
                  総合達成率: {Math.round(weightedAvgAchievement)}%
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* パーセンテージで表示するメトリクス */}
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  進捗状況
                </h3>
                {PERCENTAGE_METRICS.map((key) => {
                  const 達成率 = calculate達成率(
                    member.実績[key],
                    member.目標[key]
                  );
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}</span>
                        <span className={`${getStatusColor(達成率)}`}>
                          {達成率}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
                    </div>
                  );
                })}
              </div>

              {/* 数値で表示するメトリクス */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  実績カウント
                </h3>
                {COUNT_METRICS.map((key) => {
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key}</span>
                      <span className={`text-gray-900`}>
                        {member.実績[key]} / {member.目標[key]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 月次トレンドのミニグラフ */}
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  月次推移
                </h3>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={member.monthlyTrend}>
                      <Line
                        type="monotone"
                        dataKey="実績達成率"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
