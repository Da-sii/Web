import type { ReviewStats as ReviewStatsType } from "@/types/models";
import { ReviewStar } from "./ReviewStar";

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  const entries = ["5", "4", "3", "2", "1"].map((key) => ({
    score: key,
    percent: stats.distribution[key] ?? 0,
  }));

  const maxPercent = Math.max(...entries.map((e) => e.percent));

  return (
    <div className="flex h-[140px] w-full items-center rounded-xl bg-[#F6F5FA]">
      {/* 왼쪽: 평균 점수 */}
      <div className="flex h-[100px] flex-col items-center justify-center border-r border-gray-200" style={{ flex: "0 0 40%" }}>
        <span className="text-[28px] font-extrabold leading-none">
          {stats.averageRating.toFixed(2)}
        </span>
        <div className="mt-1">
          <ReviewStar rating={stats.averageRating} size={14} />
        </div>
      </div>

      {/* 오른쪽: 분포 막대 */}
      <div className="flex h-[100px] items-center justify-center" style={{ flex: "0 0 60%" }}>
        <div className="flex w-[170px] justify-center gap-0">
          {entries.map(({ score, percent }) => {
            const isTop = percent === maxPercent && maxPercent > 0;
            return (
              <div key={score} className="relative flex flex-1 flex-col items-center justify-center gap-[5px]">
                <span
                  className={`absolute top-0 text-center text-[10px] ${
                    isTop ? "font-extrabold text-green-500" : "font-bold text-gray-700"
                  }`}
                >
                  {percent}%
                </span>
                <div className="mt-4 h-[60px] w-[5px] overflow-hidden rounded-full bg-gray-200 flex flex-col justify-end">
                  <div
                    className="rounded-full bg-green-500"
                    style={{ height: `${percent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-700">{score}점</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
