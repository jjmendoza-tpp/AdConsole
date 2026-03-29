"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Label, ResponsiveContainer, Tooltip } from "recharts";
import { channelBreakdown } from "@/lib/mock-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCenterLabel(props: any) {
  const { viewBox } = props;
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan
        x={cx}
        dy="-0.4em"
        className="fill-foreground"
        style={{ fontSize: 20, fontWeight: 700 }}
      >
        18.4K
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

export function ChannelBreakdown() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Impresiones por Canal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {channelBreakdown.map((entry) => (
                    <Cell key={entry.channel} fill={entry.color} />
                  ))}
                  <Label content={renderCenterLabel} position="center" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(value, _name, props) => [
                    `${value}% (${(props.payload as typeof channelBreakdown[number]).impressions.toLocaleString()})`,
                    (props.payload as typeof channelBreakdown[number]).label,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Horizontal on mobile, vertical on desktop */}
          <div className="flex flex-row flex-wrap justify-center gap-3 lg:flex-col lg:gap-3">
            {channelBreakdown.map((channel) => (
              <div key={channel.channel} className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: channel.color }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
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
