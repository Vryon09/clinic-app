import { useMemo, useState } from "react";
import { Card } from "../../shadcn/card";
import type { ConsultationTrendPoint } from "@/types/DashboardType";
import dayjs from "dayjs";

interface ConsultationTrendChartProps {
  data: ConsultationTrendPoint[];
}

export function ConsultationTrendChart({ data }: ConsultationTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxCount = useMemo(() => {
    if (!data.length) return 1;
    const max = Math.max(...data.map((d) => d.count));
    return max > 0 ? max : 1;
  }, [data]);

  const totalCount = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  // Chart coordinate space
  const chartHeight = 160;
  const chartWidth = 600;
  const paddingX = 16;
  const innerWidth = chartWidth - paddingX * 2;
  const step = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  // Generate SVG path for area & smooth line
  const points = useMemo(() => {
    if (!data.length) return [];
    return data.map((d, i) => {
      const x = paddingX + i * step;
      const y = chartHeight - 20 - (d.count / maxCount) * (chartHeight - 40);
      return { x, y, ...d };
    });
  }, [data, step, maxCount, chartHeight, paddingX]);

  const linePath = useMemo(() => {
    if (!points.length) return "";
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaPath = useMemo(() => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    const bottom = chartHeight - 10;
    return `${linePath} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
  }, [points, linePath, chartHeight]);

  const hoveredPoint =
    hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Consultation Volume</h3>
          <p className="text-xs text-muted-foreground">Daily encounter frequency over time</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-foreground">{totalCount}</span>
          <span className="ml-1 text-[11px] text-muted-foreground">total visits</span>
        </div>
      </div>

      {/* Responsive SVG Chart container */}
      <div className="relative my-auto w-full pt-2">
        {!data.length ? (
          <div className="flex h-44 w-full items-center justify-center text-xs text-muted-foreground">
            No consultation data available for this range.
          </div>
        ) : (
          <div
            className="relative h-44 w-full"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1, #0d9488)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-chart-1, #0d9488)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal guide lines */}
              <line
                x1={paddingX}
                y1={20}
                x2={chartWidth - paddingX}
                y2={20}
                stroke="currentColor"
                className="text-border/60 dark:text-muted-foreground/25"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="currentColor"
                className="text-border/60 dark:text-muted-foreground/25"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={chartHeight - 10}
                x2={chartWidth - paddingX}
                y2={chartHeight - 10}
                stroke="currentColor"
                className="text-border/80 dark:text-muted-foreground/40"
              />

              {/* Area fill */}
              <path d={areaPath} fill="url(#trendGradient)" />

              {/* Trend line */}
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-chart-1, #0d9488)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Interactive Data points overlay (keeps dots circular and scales from center without SVG transform-origin glitches) */}
            {points.length <= 35 &&
              points.map((p, idx) => {
                const isHovered = hoveredIndex === idx;
                const leftPct = (p.x / chartWidth) * 100;
                const topPct = (p.y / chartHeight) * 100;

                return (
                  <div
                    key={p.date}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex((prev) => (prev === idx ? null : prev))}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="absolute flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
                  >
                    <span
                      className={`block size-2 rounded-full border-2 border-chart-1 bg-background dark:bg-card transition-transform duration-150 ${
                        isHovered ? "scale-150 bg-chart-1/20" : ""
                      }`}
                    />
                  </div>
                );
              })}

            {/* Hover tooltip */}
            {hoveredPoint && points.length <= 35 && (
              <div
                style={{
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: `${(hoveredPoint.y / chartHeight) * 100}%`,
                }}
                className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md ${
                  hoveredPoint.y < 52 ? "translate-y-3" : "-translate-y-[calc(100%+10px)]"
                } ${
                  (hoveredPoint.x / chartWidth) * 100 < 15
                    ? "-translate-x-2"
                    : (hoveredPoint.x / chartWidth) * 100 > 85
                      ? "-translate-x-[calc(100%-8px)]"
                      : "-translate-x-1/2"
                }`}
              >
                <div className="font-semibold text-foreground">
                  {hoveredPoint.count} {hoveredPoint.count === 1 ? "visit" : "visits"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {dayjs(hoveredPoint.date).format("MMM D, YYYY")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Axis date markers */}
      <div className="mt-2 flex justify-between border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
        <span>{data.length ? dayjs(data[0].date).format("MMM D") : ""}</span>
        <span>
          {data.length > 2
            ? dayjs(data[Math.floor(data.length / 2)].date).format("MMM D")
            : ""}
        </span>
        <span>{data.length ? dayjs(data[data.length - 1].date).format("MMM D") : ""}</span>
      </div>
    </Card>
  );
}
