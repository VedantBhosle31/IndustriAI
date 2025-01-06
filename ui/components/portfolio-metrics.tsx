import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

const metrics = [
  { name: "Principal", value: 62, change: 2.3 },
  { name: "ROI", value: 62, change: -1.5 },
  { name: "ESG", value: 62, change: 3.7 },
  { name: "Risk", value: 62, change: -0.8 },
  { name: "Diversity", value: 62, change: 1.2 },
]

const swotColors = {
  strength: "bg-green-500",
  weakness: "bg-red-500",
  opportunity: "bg-purple-400",
  threat: "bg-yellow-400"
}

const recommendations = [
  {
    action: "Buy",
    stock: "Bose",
    changes: [
      { value: "+2.5%", note: "since 21 days" },
      { value: "+25%", note: "ESG since 67 days" }
    ]
  },
  {
    action: "Sell",
    stock: "Meta",
    changes: [
      { value: "-45.3%", note: "Risk since 21 days" },
      { value: "-25.3%", note: "ESG since 67 days" }
    ]
  }
]

export function PortfolioMetrics() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-6">Portfolio Analysis</h2>

        {/* Metrics Section */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="text-3xl font-bold mb-1">62%</div>
              <div className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </div>
              <div className="text-sm font-medium mt-1">{metric.name}</div>
            </div>
          ))}
        </div>

        {/* SWOT Analysis */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4 h-24">
            <div className="bg-green-500 rounded-lg p-2">
              <h3 className="font-semibold text-white mb-1 text-xs">Strengths</h3>
              <p className="text-white text-xs">Strong tech sector market position</p>
            </div>
            <div className="bg-red-500 rounded-lg p-2">
              <h3 className="font-semibold text-white mb-1 text-xs">Weaknesses</h3>
              <p className="text-white text-xs">High exposure to volatile markets</p>
            </div>
            <div className="bg-purple-400 rounded-lg p-2">
              <h3 className="font-semibold text-white mb-1 text-xs">Opportunities</h3>
              <p className="text-white text-xs">Emerging markets and new technologies</p>
            </div>
            <div className="bg-yellow-400 rounded-lg p-2">
              <h3 className="font-semibold text-white mb-1 text-xs">Threats</h3>
              <p className="text-white text-xs">Regulatory changes and economic uncertainty</p>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <h3 className="font-semibold mb-4">Recommended Actions</h3>
          <div className="grid grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  {rec.action === "Buy" ? (
                    <ArrowUpIcon className="text-green-600 h-6 w-6" />
                  ) : (
                    <ArrowDownIcon className="text-red-600 h-6 w-6" />
                  )}
                  <span className="font-semibold">{rec.action}</span>
                </div>
                {rec.changes.map((change, changeIndex) => (
                  <div
                    key={changeIndex}
                    className="flex items-center gap-2 mb-2"
                  >
                    <div className={`px-3 py-1 rounded bg-gray-100`}>
                      {rec.stock}
                    </div>
                    <div className={`px-2 py-1 rounded ${rec.action === "Buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                      {change.value}
                      <div className="text-xs text-gray-600">
                        {change.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

