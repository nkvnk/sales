import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  FileText,
  Footprints,
  Bell,
  DoorOpen,
  Handshake,
  Speech,
  HandHelping,
} from "lucide-react";
import { useRouter } from "next/navigation";
const SimpleSalesMetrics = () => {
  const router = useRouter();
  const metricsData = [
    {
      name: "出勤",
      Icon: CalendarDays,
      path: "/attendance",
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "対応",
      Icon: Footprints,
      path: "/responses",
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "イン",
      Icon: Bell,
      path: "/ins",
      color: "from-green-400 to-green-600",
    },
    {
      name: "ドア",
      Icon: DoorOpen,
      path: "/door",
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "アプ",
      Icon: HandHelping,
      path: "/appointments",
      color: "from-pink-400 to-pink-600",
    },
    {
      name: "アポ",
      Icon: Handshake,
      path: "/scheduled",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      name: "商談",
      Icon: Speech,
      path: "/meetings",
      color: "from-teal-400 to-teal-600",
    },
    {
      name: "契約",
      Icon: FileText,
      path: "/contracts",
      color: "from-red-400 to-red-600",
    },
  ];

  const handleClick = (path) => {
    console.log(`Navigating to: ${path}`);
    router.push(path);
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 mt-5">
          {metricsData.map((item) => (
            <div
              key={item.name}
              onClick={() => handleClick(item.path)}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <item.Icon
                    className="w-6 h-6 group-hover:text-white transition-colors duration-300"
                    style={{ color: `var(--${item.color.split("-")[1]}-500)` }}
                  />
                </div>

                <div className="text-sm font-extrabold text-gray-700 group-hover:text-white transition-colors duration-300">
                  {item.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleSalesMetrics;
