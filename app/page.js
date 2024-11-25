// app/page.js
"use client";
import React, { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { TeamOverview } from "@/components/dashboard/TeamOverview";
import { DailyInputModal } from "@/components/dashboard/DailyInputModal";
import { DetailedMetrics } from "@/components/dashboard/DetailedMetrics";
import { METRICS } from "@/lib/utils/constants";
import { salesData } from "@/lib/utils/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

import { GoalMetrics } from "@/components/dashboard/GoalMetrics";
export default function Page() {
  // const [selectedMember, setSelectedMember] = useState(salesData[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //ユーザーデータの保存認証のやり方
  // const { goals, loading } = useGoal();
  const { user, profile } = useAuth();
  useEffect(() => {
    //console.log("ユーザーデータを表示する", user);
  }, []);
  if (user) {
    //console.log("プロフィール情報", profile);
  }

  //各目標の取得目標

  // 選択されたメンバーが橋本チームの場合のみ、他のメンバーデータを取得
  {
    /*const otherMembers = salesData.filter(
    (member) => member.name !== "橋本チーム"
  );*/
  }

  return (
    <main>
      <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white rounded-xl shadow-sm">
        {/* Header with member selector */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">Dashbord</h1>
          {/*
          <select
            className="p-2 bg-white border border-gray-200 rounded-lg"
            onChange={(e) =>
              setSelectedMember(
                salesData.find((d) => d.name === e.target.value)
              )
            }
            value={selectedMember.name}
          >
            {salesData.map((member) => (
              <option key={member.name} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>*/}
          {/*} <div>{profile.name}</div>`*/}
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">本日の実績</h2>
        {/* Metric Cards Grid */}
        <GoalMetrics />
        {/* Team Overview Section - 橋本チームの場合のみ表示 */}
        {/* {selectedMember.name === "橋本チーム" && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              チームメンバー実績
            </h2>
            <TeamOverview data={otherMembers} />
          </div>
        )}
*/}

        <section className="bg-white rounded-xl shadow-sm">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">詳細データ分析</h2>
          </div>
          <div className="px-8 py-6 mb-10">
            {/*  <DetailedMetrics

            // data={selectedMember}
            />*/}
          </div>
        </section>
        {/* Floating Action Button for Daily Input */}
        {/*
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed right-6 bottom-6 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </button>*/}
        {/* Daily Input Modal */}
        {/*  <DailyInputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            console.log(data);
            setIsModalOpen(false);
          }}
        />*/}
      </div>
    </main>
  );
}
