"use client";
import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { calculateAndSaveDailyTotals } from "@/lib/analytics/daily-summary";
// LocalStorage utilities
const STORAGE_KEY = "counterData";

const getStoredData = () => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("LocalStorage read error:", error);
    return null;
  }
};

const storeData = (data) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("LocalStorage write error:", error);
  }
};

const CounterSection = ({
  items,
  counts,
  setCounts,
  type,
  countHistory,
  setCountHistory,
}) => {
  const handleCount = (item, newCount) => {
    const timestamp = new Date().toISOString();

    // カウント値を更新
    const updatedCounts = {
      ...counts,
      [item]: Math.max(0, newCount),
    };
    setCounts(updatedCounts);

    // 履歴を更新
    const updatedHistory = {
      ...countHistory,
      [item]: [
        ...(countHistory[item] || []),
        {
          value: newCount,
          timestamp,
          type,
        },
      ],
    };
    setCountHistory(updatedHistory);

    // ローカルストレージに保存
    const storedData = getStoredData() || {};
    const newStoredData = {
      ...storedData,
      [type]: {
        counts: updatedCounts,
        history: updatedHistory,
      },
    };
    storeData(newStoredData);

    // コンソールログ出力
    console.group("カウント操作");
    console.log("操作時刻:", new Date(timestamp).toLocaleString("ja-JP"));
    console.log("種別:", type);
    console.log("項目:", item);
    console.log("カウント値:", newCount);
    console.log(`${type}の全カウント:`, updatedCounts);
    console.log(`${item}の履歴:`, updatedHistory[item]);
    console.log("LocalStorage データ:", newStoredData);
    console.groupEnd();
  };

  return (
    <Card className="bg-white shadow-none border-none">
      <CardContent className="p-6 space-y-12">
        {items.map((item) => (
          <div key={item} className="flex justify-between items-center">
            <button
              onClick={() => {
                const currentCount = counts[item] || 0;
                if (currentCount > 0) {
                  handleCount(item, currentCount - 1);
                }
              }}
              className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 text-3xl font-bold flex items-center justify-center hover:bg-rose-100 active:bg-rose-200 transition-colors"
              disabled={!counts[item] || counts[item] === 0}
            >
              -
            </button>
            <div className="text-center flex-1 mx-8">
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {counts[item] || 0}
              </div>
              <div className="text-gray-600 text-lg">{item}</div>
            </div>
            <button
              onClick={() => handleCount(item, (counts[item] || 0) + 1)}
              className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 text-3xl font-bold flex items-center justify-center hover:bg-emerald-100 active:bg-emerald-200 transition-colors"
            >
              +
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function CounterPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [batteryItems] = useState(["イン", "ドア", "アプ", "アポ"]);
  const [zehItems] = useState(["イン", "ドア", "アプ", "アポ"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // カウント状態
  const [batteryCounts, setBatteryCounts] = useState(() => {
    const storedData = getStoredData();
    return (
      storedData?.battery?.counts ||
      Object.fromEntries(batteryItems.map((item) => [item, 0]))
    );
  });

  const [zehCounts, setZehCounts] = useState(() => {
    const storedData = getStoredData();
    return (
      storedData?.zeh?.counts ||
      Object.fromEntries(zehItems.map((item) => [item, 0]))
    );
  });

  // 履歴状態
  const [batteryHistory, setBatteryHistory] = useState(() => {
    const storedData = getStoredData();
    return storedData?.battery?.history || {};
  });

  const [zehHistory, setZehHistory] = useState(() => {
    const storedData = getStoredData();
    return storedData?.zeh?.history || {};
  });

  const handleComplete = async () => {
    if (!user?.id) {
      toast({
        description: "ユーザー情報の取得に失敗しました",
        variant: "destructive",
      });
      return;
    }

    try {
      const timestamp = new Date().toISOString();

      // カウントタイミングログ（従来通り）
      const countLogs = [
        ...Object.entries(batteryHistory).flatMap(([item, history]) =>
          history.map((record) => ({
            user_id: user.id,
            item_name: item,
            count_type: "battery",
            count_time: record.timestamp,
            local_created_at: record.timestamp,
          }))
        ),
        ...Object.entries(zehHistory).flatMap(([item, history]) =>
          history.map((record) => ({
            user_id: user.id,
            item_name: item,
            count_type: "zeh",
            count_time: record.timestamp,
            local_created_at: record.timestamp,
          }))
        ),
      ];

      // 蓄電池の最終カウント値（新形式）
      const batteryFinalLog = {
        user_id: user.id,
        app_count: batteryCounts["アプ"] || 0,
        apo_count: batteryCounts["アポ"] || 0,
        door_count: batteryCounts["ドア"] || 0,
        in_count: batteryCounts["イン"] || 0,
        local_created_at: timestamp,
      };

      // ZEHの最終カウント値（新形式）
      const zehFinalLog = {
        user_id: user.id,
        app_count: zehCounts["アプ"] || 0,
        apo_count: zehCounts["アポ"] || 0,
        door_count: zehCounts["ドア"] || 0,
        in_count: zehCounts["イン"] || 0,
        local_created_at: timestamp,
      };

      // Log data before saving
      console.group("完了処理");
      console.log("Count Timing Logs:", countLogs);
      console.log("Battery Final Log:", batteryFinalLog);
      console.log("ZEH Final Log:", zehFinalLog);
      console.groupEnd();

      // Save to each table
      const results = await Promise.all([
        supabase.from("battery_logs").insert(batteryFinalLog),
        supabase.from("zeh_logs").insert(zehFinalLog),
        supabase.from("count_logs").insert(countLogs),
      ]);
      // 日次集計の保存を追加
      const summaryResult = await calculateAndSaveDailyTotals(
        user.id,
        batteryCounts,
        zehCounts
      );

      // Reset states
      const resetCounts = Object.fromEntries(
        batteryItems.map((item) => [item, 0])
      );
      setBatteryCounts(resetCounts);
      setZehCounts(resetCounts);
      setBatteryHistory({});
      setZehHistory({});
      storeData({
        battery: { counts: resetCounts, history: {} },
        zeh: { counts: resetCounts, history: {} },
      });

      toast({
        description: "データを保存し、リセットしました",
      });
    } catch (error) {
      console.error("Failed to save counts:", error);
      toast({
        description: "データの保存に失敗しました",
        variant: "destructive",
      });
    }

    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Counter</h1>
        <Tabs defaultValue="battery" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 p-1.5 rounded-lg">
            <TabsTrigger
              value="battery"
              className="rounded-md text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              蓄電池
            </TabsTrigger>
            <TabsTrigger
              value="zeh"
              className="rounded-md text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              ZEH
            </TabsTrigger>
          </TabsList>

          <TabsContent value="battery" className="mt-6">
            <CounterSection
              items={batteryItems}
              counts={batteryCounts}
              setCounts={setBatteryCounts}
              countHistory={batteryHistory}
              setCountHistory={setBatteryHistory}
              type="battery"
            />
          </TabsContent>

          <TabsContent value="zeh" className="mt-6">
            <CounterSection
              items={zehItems}
              counts={zehCounts}
              setCounts={setZehCounts}
              countHistory={zehHistory}
              setCountHistory={setZehHistory}
              type="zeh"
            />
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-extrabold text-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
          >
            完了
          </button>
        </div>

        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogContent className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-[90%] border-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900 mb-4">
                本当に完了しますか？
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600">
                完了すると、すべてのカウントがSupabaseに保存され、リセットされます。
                この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-end gap-3 mt-8">
              <AlertDialogCancel className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-base font-medium">
                戻る
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleComplete}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-base font-medium"
              >
                はい
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
