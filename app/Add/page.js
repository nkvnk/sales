// DailySalesInput.js
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const initialDailyData = {
  date: new Date().toISOString().split("T")[0],
  出勤: false,
  対応: "",
  イン: "",
  ドア: "",
  アプ: "",
  アポ: "",
  商談: "",
  契約: "",
  完工: "",
  メモ: "",
};

const DailySalesInput = ({ onSave, existingData = [] }) => {
  const [dailyData, setDailyData] = useState(initialDailyData);
  const [showHistory, setShowHistory] = useState(false);

  const handleInputChange = (field, value) => {
    setDailyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(dailyData);
    setDailyData(initialDailyData);
  };

  const getStatusColor = (value, target) => {
    const ratio = (value / target) * 100;
    if (ratio >= 80) return "text-emerald-600";
    if (ratio >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>日次データ入力</span>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showHistory ? "入力フォームを表示" : "履歴を表示"}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showHistory ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    日付
                  </label>
                  <input
                    type="date"
                    value={dailyData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="mt-1 block w-full rounded-md border-grey-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    出勤
                  </label>
                  <input
                    type="checkbox"
                    checked={dailyData.出勤}
                    onChange={(e) =>
                      handleInputChange("出勤", e.target.checked)
                    }
                    className="mt-3 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "対応",
                  "イン",
                  "ドア",
                  "アプ",
                  "アポ",
                  "商談",
                  "契約",
                  "完工",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={dailyData[field]}
                      onChange={(e) =>
                        handleInputChange(field, parseInt(e.target.value) || 0)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  メモ
                </label>
                <textarea
                  value={dailyData.メモ}
                  onChange={(e) => handleInputChange("メモ", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                保存
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日付
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        出勤
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        対応
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        イン
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ドア
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アプ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アポ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        商談
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        契約
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        完工
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingData.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.出勤 ? "○" : "×"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.対応}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.イン}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.ドア}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.アプ}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.アポ}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.商談}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.契約}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.完工}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// 使用例
export default function Add() {
  const [dailyRecords, setDailyRecords] = useState([]);

  const handleSaveDaily = (newData) => {
    setDailyRecords((prev) =>
      [...prev, newData].sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DailySalesInput onSave={handleSaveDaily} existingData={dailyRecords} />
    </div>
  );
}
