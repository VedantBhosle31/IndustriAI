'use client';
import { Sidebar } from "@/components/sidebar"
import { StockCard } from "@/components/stock-card"
import { PortfolioChart } from "@/components/portfolio-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

const stocks = [
  { name: "NVIDIA", symbol: "NVDA", price: 203.65, change: 5.63, chartUrl: "/placeholder.svg" },
  { name: "Meta", symbol: "META", price: 151.74, change: -4.14, chartUrl: "/placeholder.svg" },
  { name: "Tesla Inc", symbol: "TSLA", price: 177.90, change: 7.63, chartUrl: "/placeholder.svg" },
  { name: "Apple Inc", symbol: "AAPL", price: 145.93, change: 2.31, chartUrl: "/placeholder.svg" },
  { name: "AMD", symbol: "AMD", price: 75.40, change: 0.00, chartUrl: "/placeholder.svg" },
]

export default function DashboardPage() {
  const [selectedOption, setSelectedOption] = useState('Medium');
  const [previousOption, setPreviousOption] = useState('Medium');
  const options = ['Small', 'Medium', 'Large'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPreviousOption(selectedOption);
    setSelectedOption(event.target.value);
  };

  const hasRiskChanged = selectedOption !== previousOption;


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$14,032.56</div>
                <div className="text-sm text-green-600 mt-1">+5.63%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invested Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$7,532.21</div>
                <div className="text-sm text-muted-foreground mt-1">Total investment</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Current Risk</CardTitle>
                <Link href="/portfolio">
                  <Button variant="ghost" size="sm">
                    Adjust Risk
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div className="text-2xl font-bold">
                    <select
                      value={selectedOption}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 rounded-md p-2"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Portfolio risk level has changed. Click to review and adjust your strategy.
                </div>
                {hasRiskChanged && (
                  <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
                    <Button variant="ghost" size="sm" className="mt-2">
                      Optimise Current Portfolio
                    </Button>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Review New Portfolio Strategy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <PortfolioChart />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Market Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Previous Close</div>
                  <div className="text-2xl">12,051.48</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Open</div>
                  <div className="text-2xl">12,000.21</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Day Range</div>
                  <div>11,999.87 - 12,248.15</div>
                </div>
                <div>
                  <div className="text-sm font-medium">52 Week Range</div>
                  <div>10,440.64 - 15,265.42</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Watchlist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Amazon", symbol: "AMZN", price: 102.24, change: 3.02 },
                  { name: "Coca-Cola", symbol: "KO", price: 60.49, change: -0.32 },
                  { name: "Microsoft", symbol: "MSFT", price: 248.16, change: 1.62 },
                ].map((stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{stock.name}</div>
                      <div className="text-sm text-muted-foreground">{stock.symbol}</div>
                    </div>
                    <div className={stock.change > 0 ? "text-green-600" : "text-red-600"}>
                      {stock.change > 0 ? "+" : ""}{stock.change}%
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

