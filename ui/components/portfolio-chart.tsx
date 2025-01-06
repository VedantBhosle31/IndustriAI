"use client"

import { Line, LineChart, ResponsiveContainer, Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { time: "8 am", value: 10500 },
  { time: "9 am", value: 10800 },
  { time: "10 am", value: 11000 },
  { time: "11 am", value: 11250 },
  { time: "12 pm", value: 10900 },
  { time: "1 pm", value: 11500 },
  { time: "2 pm", value: 11300 },
  { time: "3 pm", value: 11800 },
  { time: "4 pm", value: 11650 },
  { time: "5 pm", value: 11900 },
  { time: "6 pm", value: 11700 },
  { time: "7 pm", value: 12050 },
  { time: "8 pm", value: 12100 },
  { time: "9 pm", value: 11880 },
  { time: "10 pm", value: 12200 },
  { time: "11 pm", value: 12000 },
  { time: "12 am", value: 12450 },
  { time: "1 am", value: 12200 },
  { time: "2 am", value: 12500 },
  { time: "3 am", value: 12350 }
];

export function PortfolioChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Analytics</CardTitle>
        <CardDescription>Your portfolio performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Portfolio Value",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                // dot={false}
                fill="hsl(var(--primary) / 0.2)"

              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

