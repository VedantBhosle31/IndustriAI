"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiSelect } from "@/components/ui/multi-select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Jan", NIFTY50: 100, NIFTYES: 110, NIFTYSM: 90, NVIDIA: 150, META: 120, TSLA: 200, AAPL: 180 },
  { date: "Feb", NIFTY50: 120, NIFTYES: 130, NIFTYSM: 110, NVIDIA: 160, META: 110, TSLA: 220, AAPL: 190 },
  { date: "Mar", NIFTY50: 110, NIFTYES: 120, NIFTYSM: 100, NVIDIA: 155, META: 115, TSLA: 210, AAPL: 185 },
  { date: "Apr", NIFTY50: 130, NIFTYES: 140, NIFTYSM: 120, NVIDIA: 170, META: 125, TSLA: 230, AAPL: 195 },
  { date: "May", NIFTY50: 140, NIFTYES: 150, NIFTYSM: 130, NVIDIA: 180, META: 130, TSLA: 240, AAPL: 200 },
  { date: "Jun", NIFTY50: 150, NIFTYES: 160, NIFTYSM: 140, NVIDIA: 190, META: 135, TSLA: 250, AAPL: 210 },
]

const kpiOptions = [
  { value: "esg", label: "ESG Score" },
  { value: "diversity", label: "Diversity" },
  { value: "roi", label: "ROI" },
  { value: "risk", label: "Risk" },
  { value: "si", label: "Sustainability Impact" },
]

const marketIndicators = [
  { value: "NIFTY50", label: "NIFTY 50" },
  { value: "NIFTYES", label: "NIFTY ES" },
  { value: "NIFTYSM", label: "NIFTY Small Cap" },
  { value: "SENSEX", label: "SENSEX" },
]

const portfolioStocks = [
  { value: "NVIDIA", label: "NVIDIA" },
  { value: "META", label: "Meta" },
  { value: "TSLA", label: "Tesla" },
  { value: "AAPL", label: "Apple" },
]

export function PortfolioKPIs() {
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(["esg"])
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["NIFTY50"])
  const [selectedStocks, setSelectedStocks] = useState<string[]>(["NVIDIA"])

  const allSelectedItems = [...selectedIndicators, ...selectedStocks]

  const chartConfig = allSelectedItems.reduce((acc, item) => {
    acc[item] = {
      label: item,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <CardTitle>Portfolio KPIs</CardTitle>
        <div className="flex flex-wrap items-center gap-4">
          <MultiSelect
            options={kpiOptions}
            selected={selectedKPIs}
            onChange={setSelectedKPIs}
            placeholder="Select KPIs"
          />
          <MultiSelect
            options={marketIndicators}
            selected={selectedIndicators}
            onChange={setSelectedIndicators}
            placeholder="Select Market Indicators"
          />
          <MultiSelect
            options={portfolioStocks}
            selected={selectedStocks}
            onChange={setSelectedStocks}
            placeholder="Select Stocks"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              {allSelectedItems.map((item) => (
                <Line
                  key={item}
                  type="monotone"
                  dataKey={item}
                  stroke={`var(--color-${item})`}
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

