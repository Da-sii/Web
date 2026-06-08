"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const btn = btnRefs.current[activeTab];
    const container = containerRef.current;
    if (!btn || !container) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - containerRect.left + container.scrollLeft,
      width: btnRect.width,
    });
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className="relative flex overflow-x-auto border-b border-gray100 no-scrollbar"
    >
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            ref={(el) => { btnRefs.current[tab] = el; }}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "shrink-0 px-4 py-3 text-sm",
              isActive ? "font-bold text-gray900" : "font-normal text-gray400",
            )}
          >
            {tab}
          </button>
        );
      })}

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 h-0.5 bg-gray900 transition-[left,width] duration-300 ease-in-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
