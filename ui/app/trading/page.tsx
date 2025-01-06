'use client'
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MarketSection } from "@/components/market-section"
import { CompareSection } from "@/components/compare-section"
import { StrategySection } from "@/components/strategy-section"
import { useState } from "react"

export default function TradingPage() {
  const [selectedStocks, setSelectedStocks] = useState<string>('');
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketSection selectedStocks={selectedStocks} setSelectedStocks={setSelectedStocks} />
            <div className="space-y-6">
              <CompareSection selectedStocks={selectedStocks} setSelectedStocks={setSelectedStocks} />
              <StrategySection selectedStocks={selectedStocks} setSelectedStocks={setSelectedStocks} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

