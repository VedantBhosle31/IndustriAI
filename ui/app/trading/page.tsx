import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MarketSection } from "@/components/market-section"
import { CompareSection } from "@/components/compare-section"
import { StrategySection } from "@/components/strategy-section"

export default function TradingPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketSection />
            <div className="space-y-6">
              <CompareSection />
              <StrategySection />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

