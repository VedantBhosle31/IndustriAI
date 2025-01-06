import { Sidebar } from "@/components/sidebar"
import { CompareTool } from "@/components/compare-tool"
import { StrategyBuilder } from "@/components/strategy-builder"
import { StockAnalysis } from "@/components/stock-analysis"

export default function TradingPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CompareTool />
            <StrategyBuilder />
          </div>
          <div>
            <StockAnalysis />
          </div>
        </div>
      </main>
    </div>
  )
}

