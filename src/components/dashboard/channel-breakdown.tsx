"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label, ResponsiveContainer, Tooltip } from "recharts";
import type { ChannelBreakdown as ChannelBreakdownPoint } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCenterLabel(props: any) {
  const { viewBox, totalLabel } = props;
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan
        x={cx}
        dy="-0.4em"
        className="fill-foreground"
        style={{ fontSize: 20, fontWeight: 700 }}
      >
        {totalLabel}
      </tspan>
      <tspan
        x={cx}
        dy="1.4em"
        className="fill-muted-foreground"
        style={{ fontSize: 12 }}
      >
        Total
      </tspan>
    </text>
  );
}

interface ChannelBreakdownProps {
  data: ChannelBreakdownPoint[];
}

export function ChannelBreakdown({ data }: ChannelBreakdownProps) {
  const totalImpressions = data.reduce((sum, item) => sum + item.impressions, 0);
  const totalLabel =
    totalImpressions >= 1000
      ? `${(totalImpressions / 1000).toFixed(1)}K`
      : totalImpressions.toString();

  return (
    <Card className="rounded-xl border-slate-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold tracking-tight">
          Impresiones por Canal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          <div className="h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {data.map((entry) => (
                    <Cell key={entry.channel} fill={entry.color} />
                  ))}
                  <Label
                    content={(props) =>
                      renderCenterLabel({
                        ...props,
                        totalLabel,
                      })
                    }
                    position="center"
                  />
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(value, _name, props) => [
                    `${value}% (${(props.payload as ChannelBreakdownPoint).impressions.toLocaleString()})`,
                    (props.payload as ChannelBreakdownPoint).label,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Horizontal on mobile, vertical on desktop */}
          <div className="flex w-full flex-row flex-wrap justify-center gap-3 lg:flex-col lg:gap-4">
            {data.map((channel) => (
              <div
                key={channel.channel}
                className="flex min-w-[150px] items-center gap-3 lg:min-w-0"
              >
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: channel.color }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {channel.label}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {channel.percentage}% · {channel.impressions.toLocaleString()} imp.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
