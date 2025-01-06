"use client"

import { X } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Jan", DELL: 80, AAPL: 140, TSLA: 20, GOOG: 90, META: 110 },
  { name: "Feb", DELL: 70, AAPL: 75, TSLA: 40, GOOG: 95, META: 90 },
  { name: "Mar", DELL: 75, AAPL: 30, TSLA: 60, GOOG: 100, META: 70 },
  { name: "Apr", DELL: 80, AAPL: 20, TSLA: 90, GOOG: 110, META: 60 },
  { name: "May", DELL: 75, AAPL: 15, TSLA: 110, GOOG: 130, META: 80 },
  { name: "Jun", DELL: 70, AAPL: 10, TSLA: 180, GOOG: 140, META: 70 },
]

const stocks = ["DELL", "AAPL", "TSLA", "GOOG", "META"]

export function StockComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare</CardTitle>
        <div className="flex flex-wrap gap-2">
          {stocks.map((stock) => (
            <Button key={stock} variant="secondary" size="sm" className="gap-2">
              {stock}
              <X className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            DELL: {
              label: "Dell",
              color: "hsl(var(--chart-1))",
            },
            AAPL: {
              label: "Apple",
              color: "hsl(var(--chart-2))",
            },
            TSLA: {
              label: "Tesla",
              color: "hsl(var(--chart-3))",
            },
            GOOG: {
              label: "Google",
              color: "hsl(var(--chart-4))",
            },
            META: {
              label: "Meta",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {stocks.map((stock) => (
                <Line
                  key={stock}
                  type="monotone"
                  dataKey={stock}
                  stroke={`var(--color-${stock})`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

