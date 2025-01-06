"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const data = [
  { date: "Jan", NIFTY50: 100, NIFTYES: 110, NIFTYSM: 90, Portfolio: 95, ROI: 5, ESG: 80, Risk: 20, Value: 1000 },
  { date: "Feb", NIFTY50: 120, NIFTYES: 130, NIFTYSM: 110, Portfolio: 115, ROI: 7, ESG: 82, Risk: 18, Value: 1150 },
  { date: "Mar", NIFTY50: 110, NIFTYES: 120, NIFTYSM: 100, Portfolio: 105, ROI: 6, ESG: 85, Risk: 19, Value: 1050 },
  { date: "Apr", NIFTY50: 130, NIFTYES: 140, NIFTYSM: 120, Portfolio: 125, ROI: 8, ESG: 83, Risk: 17, Value: 1250 },
  { date: "May", NIFTY50: 140, NIFTYES: 150, NIFTYSM: 130, Portfolio: 135, ROI: 9, ESG: 86, Risk: 16, Value: 1350 },
  { date: "Jun", NIFTY50: 150, NIFTYES: 160, NIFTYSM: 140, Portfolio: 145, ROI: 10, ESG: 88, Risk: 15, Value: 1450 },
]

const kpiOptions = [
  { value: "Value", label: "Value" },
  { value: "ROI", label: "ROI" },
  { value: "ESG", label: "ESG" },
  { value: "Risk", label: "Risk" },
]

export function PortfolioKPIs() {
  const [selectedKPI, setSelectedKPI] = useState("Value")

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Portfolio KPIs</CardTitle>
          <Select value={selectedKPI} onValueChange={setSelectedKPI}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select KPI" />
            </SelectTrigger>
            <SelectContent>
              {kpiOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedKPI}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="NIFTY50"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="NIFTYES"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="NIFTYSM"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

