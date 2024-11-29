import { supabase } from "@/lib/supabase";

export const calculateAndSaveDailyTotals = async (
  user_id,
  batteryCounts,
  zehCounts
) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 項目ごとの合計値を計算（battery + zeh）
    const totalInCount =
      (batteryCounts["イン"] || 0) + (zehCounts["イン"] || 0);
    const totalAppCount =
      (batteryCounts["アプ"] || 0) + (zehCounts["アプ"] || 0);
    const totalApoCount =
      (batteryCounts["アポ"] || 0) + (zehCounts["アポ"] || 0);
    const totalDoorCount =
      (batteryCounts["ドア"] || 0) + (zehCounts["ドア"] || 0);

    // 全ての合計を計算
    const allTotalCount =
      totalInCount + totalAppCount + totalApoCount + totalDoorCount;

    const totalsData = {
      user_id,
      summary_date: today,
      total_in_count: totalInCount,
      total_app_count: totalAppCount,
      total_apo_count: totalApoCount,
      total_door_count: totalDoorCount,
      all_total_count: allTotalCount,
    };

    console.log("保存するデータ:", totalsData);

    // 既存のデータを確認
    const { data: existingData } = await supabase
      .from("daily_totals")
      .select()
      .eq("user_id", user_id)
      .eq("summary_date", today)
      .single();

    let result;

    if (existingData) {
      // 既存データがある場合はupdate
      result = await supabase
        .from("daily_totals")
        .update(totalsData)
        .eq("user_id", user_id)
        .eq("summary_date", today);
    } else {
      // 新規データの場合はinsert
      result = await supabase.from("daily_totals").insert(totalsData);
    }

    if (result.error) {
      console.error("Supabase error:", result.error);
      throw result.error;
    }

    console.group("日次合計処理");
    console.log("保存完了:", totalsData);
    console.groupEnd();

    return { success: true, data: totalsData };
  } catch (error) {
    console.error("Failed to save totals:", error);
    return { success: false, error };
  }
};
