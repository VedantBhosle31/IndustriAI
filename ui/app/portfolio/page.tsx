import { Sidebar } from "@/components/sidebar"
import { StockTable } from "@/components/stock-table"
import { PortfolioMetrics } from "@/components/portfolio-metrics"
import { PortfolioAnalytics } from "@/components/portfolio-analytics"
import { PortfolioKPIs } from "@/components/portfolio-kpis"
import { ChatSection } from "@/components/chat-section"

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <StockTable />
              <PortfolioKPIs />
            </div>
            <div className="space-y-6">
              <PortfolioMetrics />
              <PortfolioAnalytics />
            </div>
          </div>
          <ChatSection />
        </div>
      </main>
    </div>
  )
}

