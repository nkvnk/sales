// components/dashboard/DailyInputModal.js
import React, { useState } from "react";
import { X } from "lucide-react";

export const DailyInputModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
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
  });
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">日次データ登録</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showPreview ? "編集に戻る" : "プレビュー"}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">日付:</span>
                  <p className="font-medium">{formData.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">出勤状況:</span>
                  <p className="font-medium">{formData.出勤 ? "○" : "×"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData)
                  .filter(
                    ([key]) =>
                      !["date", "出勤", "メモ"].includes(key) && key !== ""
                  )
                  .map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm text-gray-600">{key}:</span>
                      <p className="font-medium">{value || 0}</p>
                    </div>
                  ))}
              </div>

              {formData.メモ && (
                <div>
                  <span className="text-sm text-gray-600">メモ:</span>
                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    {formData.メモ}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave(formData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    日付
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    出勤
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.出勤}
                    onChange={(e) =>
                      setFormData({ ...formData, 出勤: e.target.checked })
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
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field]: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  メモ
                </label>
                <textarea
                  value={formData.メモ}
                  onChange={(e) =>
                    setFormData({ ...formData, メモ: e.target.value })
                  }
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                >
                  保存
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
