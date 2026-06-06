"use client";

import { cn } from "@/lib/utils";

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex overflow-x-auto border-b border-gray100 no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "relative shrink-0 px-4 py-3 text-sm",
              isActive
                ? "font-bold text-gray900 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-green500"
                : "font-normal text-gray400",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
