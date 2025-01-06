import { Sidebar } from "@/components/sidebar"
import { StockTable } from "@/components/stock-table"
import { PortfolioMetrics } from "@/components/portfolio-metrics"
import { PortfolioAnalytics } from "@/components/portfolio-analytics"
import { PortfolioKPIs } from "@/components/portfolio-kpis"
import { SWOTAnalysis } from "@/components/swot-analysis"

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <StockTable />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <PortfolioMetrics />
          </div>
          <div className="md:col-span-3">
            <SWOTAnalysis />
          </div>
        </div>
        <PortfolioAnalytics />
        <PortfolioKPIs />
      </main>
    </div>
  )
}

