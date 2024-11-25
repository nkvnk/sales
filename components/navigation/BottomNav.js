// components/navigation/BottomNav.js
"use client";

import { BarChart2, Calculator } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "カウンター",
      href: "/counter",
      icon: Calculator,
    },
    {
      label: "営業データ",
      href: "/",
      icon: BarChart2,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <nav className="flex h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-1 flex-col items-center justify-center
                  transition-colors duration-200
                  ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} />
                <span className="mt-1 text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
