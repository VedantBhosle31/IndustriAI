"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"

const data = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 120 },
  { name: "Mar", value: 110 },
  { name: "Apr", value: 140 },
  { name: "May", value: 130 },
  { name: "Jun", value: 150 },
]

export function StockAnalysis({ stock = "META", price = 150, rating = "+2%" }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg" alt="" className="h-8 w-8" />
            <div>
              <CardTitle>{stock}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${price}</span>
                <Badge>{rating}</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline">Detailed Analysis</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer
          config={{
            value: {
              label: "Stock Value",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">AI Stock Analysis</h3>
            <ul className="space-y-2 text-sm">
              <li>Expected to rise, invests in low carbon</li>
              <li>Strong market position in social media</li>
              <li>Potential growth in metaverse sector</li>
              <li>High innovation potential</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Effects on your portfolio</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "ROI", value: "+1.2%" },
                { label: "ESG", value: "+1.2%" },
                { label: "Risk", value: "+1.2%" },
                { label: "Diversity", value: "+1.2%" },
              ].map((metric) => (
                <div key={metric.label} className="bg-green-50 p-2 rounded-lg">
                  <div className="text-sm font-medium">{metric.label}</div>
                  <div className="text-green-600">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full">Buy</Button>
            <Button className="w-full" variant="outline">Sell</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

