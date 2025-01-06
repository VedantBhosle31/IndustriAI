"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { isAnyArrayBuffer } from "node:util/types"
import { randomInt } from "node:crypto"

const data = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 120 },
  { name: "Mar", value: 110 },
  { name: "Apr", value: 140 },
  { name: "May", value: 130 },
  { name: "Jun", value: 150 },
]

const stocksData = [
  {
    stock: "AAPL",
    price: 180,
    rating: "+1.8%",
    analysis: [
      "Strong financial performance and revenue growth",
      "Innovative product pipeline",
      "Leading position in consumer electronics",
      "Robust supply chain management",
    ],
    effect: [
      { label: "ROI", value: "+2.1%" },
      { label: "ESG", value: "+5.8%" },
      { label: "Risk", value: "-1.2%" },
      { label: "Diversity", value: "+4.3%" },
    ],
  },
  {
    stock: "MSFT",
    price: 320,
    rating: "+2.0%",
    analysis: [
      "Cloud services expansion drives growth",
      "Strong presence in AI and software",
      "Recurring revenue from Office 365 and Azure",
      "Strategic acquisitions enhance portfolio",
    ],
    effect: [
      { label: "ROI", value: "+3.5%" },
      { label: "ESG", value: "+7.2%" },
      { label: "Risk", value: "-2.0%" },
      { label: "Diversity", value: "+5.1%" },
    ],
  },
  {
    stock: "NVDA",
    price: 500,
    rating: "+3.5%",
    analysis: [
      "Market leader in GPUs and AI technology",
      "Strong demand in gaming and data centers",
      "Potential for AI-driven innovations",
      "Key role in autonomous vehicles and robotics",
    ],
    effect: [
      { label: "ROI", value: "+4.8%" },
      { label: "ESG", value: "+6.0%" },
      { label: "Risk", value: "-1.8%" },
      { label: "Diversity", value: "+2.7%" },
    ],
  },
  {
    stock: "AMD",
    price: 120,
    rating: "+2.3%",
    analysis: [
      "Strong competition with Intel in CPUs",
      "Continued growth in data centers and gaming",
      "Diversified revenue streams across sectors",
      "High R&D investment ensures innovation",
    ],
    effect: [
      { label: "ROI", value: "+3.0%" },
      { label: "ESG", value: "+5.0%" },
      { label: "Risk", value: "-1.5%" },
      { label: "Diversity", value: "+3.8%" },
    ],
  },
  {
    stock: "GOOGL",
    price: 140,
    rating: "+1.6%",
    analysis: [
      "Dominant player in online search and advertising",
      "Diversified revenue through Google Cloud",
      "Focus on AI and machine learning",
      "Investments in hardware and smart devices",
    ],
    effect: [
      { label: "ROI", value: "+2.5%" },
      { label: "ESG", value: "+6.5%" },
      { label: "Risk", value: "-1.0%" },
      { label: "Diversity", value: "+5.6%" },
    ],
  },
  {
    stock: "META",
    price: 150,
    rating: "+2%",
    analysis: [
      "Expected to rise, invests in low carbon",
      "Strong market position in social media",
      "Potential growth in metaverse sector",
      "High innovation potential",
    ],
    effect: [
      { label: "ROI", value: "+1.2%" },
      { label: "ESG", value: "+11.4%" },
      { label: "Risk", value: "-3.5%" },
      { label: "Diversity", value: "+6%" },
    ],
  },
  {
    stock: "AMZN",
    price: 135,
    rating: "+1.7%",
    analysis: [
      "Strong position in e-commerce and cloud computing",
      "High revenue growth potential",
      "Expanding into healthcare and logistics",
      "Focus on automation and efficiency",
    ],
    effect: [
      { label: "ROI", value: "+2.8%" },
      { label: "ESG", value: "+4.8%" },
      { label: "Risk", value: "-2.2%" },
      { label: "Diversity", value: "+3.4%" },
    ],
  },
  {
    stock: "TSLA",
    price: 250,
    rating: "+3.0%",
    analysis: [
      "Leader in electric vehicles and energy storage",
      "High innovation in battery technology",
      "Growing demand for EVs worldwide",
      "Strong brand loyalty and global presence",
    ],
    effect: [
      { label: "ROI", value: "+4.2%" },
      { label: "ESG", value: "+8.5%" },
      { label: "Risk", value: "-3.0%" },
      { label: "Diversity", value: "+2.5%" },
    ],
  },
  {
    stock: "JNJ",
    price: 175,
    rating: "+1.2%",
    analysis: [
      "Diversified healthcare portfolio",
      "Strong pharmaceutical and medical devices segments",
      "Resilient during economic downturns",
      "Focus on R&D and global expansion",
    ],
    effect: [
      { label: "ROI", value: "+1.8%" },
      { label: "ESG", value: "+6.7%" },
      { label: "Risk", value: "-0.8%" },
      { label: "Diversity", value: "+4.2%" },
    ],
  },
  {
    stock: "XOM",
    price: 110,
    rating: "+0.8%",
    analysis: [
      "Stable revenue from oil and gas operations",
      "Investments in renewable energy projects",
      "Global market presence",
      "Focus on operational efficiency and cost reduction",
    ],
    effect: [
      { label: "ROI", value: "+1.5%" },
      { label: "ESG", value: "+3.2%" },
      { label: "Risk", value: "-2.5%" },
      { label: "Diversity", value: "+1.8%" },
    ],
  },
];


interface StockAnalysisProps {
  selectedStocks: string;
  setSelectedStocks: (stocks: string) => void;
}

export function StockAnalysis({ selectedStocks, setSelectedStocks }: StockAnalysisProps) {
  let stock = stocksData.find((stock) => stock.stock === selectedStocks) || stocksData[Math.random() * stocksData.length | 0];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg" alt="" className="h-8 w-8" />
            <div>
              <CardTitle>{selectedStocks}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${stock.price}</span>
                <Badge>{stock.rating}</Badge>
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
              {stock.analysis.map((point, index) => (
                <li key={index}>{index + 1}. {point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Effects on your portfolio</h3>
            <div className="grid grid-cols-4 gap-2">
              {stock.effect.map((metric) => (
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

