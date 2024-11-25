"use client";
import React, { useState, useCallback, useEffect } from "react";
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

// Supabase logging function with retry logic and reload
const logCountToSupabase = async (item, value, userId, type) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      // セッション確認
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!session) {
        await supabase.auth.refreshSession();
      }

      // データ保存
      const { error } = await supabase.from("count_logs").insert({
        user_id: userId,
        count_value: value,
        count_time: new Date().toISOString(),
      });

      if (!error) {
        console.log("Successfully saved to Supabase");
        return true;
      }

      throw error;
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      retryCount++;

      if (retryCount === maxRetries) {
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, retryCount * 100));
    }
  }
  return false;
};

const CounterSection = ({ items, counts, setCounts, type }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const refreshSession = async () => {
      try {
        await supabase.auth.refreshSession();
      } catch (error) {
        console.error("Session refresh error:", error);
      }
    };
    refreshSession();
  }, []);

  const handleCount = useCallback(
    async (item, newCount) => {
      if (!user?.id) {
        toast({
          description: "ユーザー情報の取得に失敗しました",
          variant: "destructive",
        });
        return;
      }

      const updatedCounts = {
        ...counts,
        [item]: Math.max(0, newCount),
      };
      setCounts(updatedCounts);

      try {
        const saveSuccess = await logCountToSupabase(
          item,
          newCount,
          user.id,
          type
        );

        if (!saveSuccess) {
          toast({
            description: "データの保存に失敗しました。ページをリロードします。",
            variant: "destructive",
          });

          // 少し待ってからリロード
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          return;
        }

        const storedData = getStoredData() || {};
        storeData({
          ...storedData,
          [type]: updatedCounts,
        });
      } catch (error) {
        console.error("Failed to save count:", error);
        toast({
          description: "データの保存に失敗しました。ページをリロードします。",
          variant: "destructive",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    },
    [user?.id, counts, setCounts, type, toast]
  );

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

// ... rest of the code remains the same ...
export default function CounterPage() {
  const { toast } = useToast();
  const [batteryItems] = useState(["イン", "ドア", "アプ", "アポ"]);
  const [zehItems] = useState(["イン", "ドア", "アプ", "アポ"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [batteryCounts, setBatteryCounts] = useState(() => {
    const storedData = getStoredData();
    return (
      storedData?.battery ||
      Object.fromEntries(batteryItems.map((item) => [item, 0]))
    );
  });

  const [zehCounts, setZehCounts] = useState(() => {
    const storedData = getStoredData();
    return (
      storedData?.zeh || Object.fromEntries(zehItems.map((item) => [item, 0]))
    );
  });

  const handleComplete = useCallback(() => {
    const resetCounts = Object.fromEntries(
      batteryItems.map((item) => [item, 0])
    );

    setBatteryCounts(resetCounts);
    setZehCounts(resetCounts);

    storeData({
      battery: resetCounts,
      zeh: resetCounts,
    });

    setIsModalOpen(false);
    toast({
      description: "カウントをリセットしました",
    });
  }, [batteryItems, toast]);

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
              type="battery"
            />
          </TabsContent>

          <TabsContent value="zeh" className="mt-6">
            <CounterSection
              items={zehItems}
              counts={zehCounts}
              setCounts={setZehCounts}
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
                完了すると、すべてのカウントがリセットされます。
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
