import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

const recommendations = [
  { action: "Buy", stock: "Bose", change: "+2.5%", days: 21, type: "Value" },
  { action: "Buy", stock: "Bose", change: "+25%", days: 21, type: "ESG" },
  { action: "Sell", stock: "Meta", change: "+45.3%", days: 67, type: "Risk" },
  { action: "Sell", stock: "Meta", change: "-25.3%", days: 67, type: "ESG" },
]

export function SWOTAnalysis() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">SWOT Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-16 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-semibold">Strengths</div>
            <div className="h-16 bg-red-500 rounded-lg flex items-center justify-center text-white font-semibold">Weaknesses</div>
            <div className="h-16 bg-purple-400 rounded-lg flex items-center justify-center text-white font-semibold">Opportunities</div>
            <div className="h-16 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-semibold">Threats</div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpIcon className="text-green-600 h-6 w-6" />
                  <span className="font-semibold">Buy</span>
                </div>
                {recommendations.filter(r => r.action === "Buy").map((rec, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-200 rounded px-3 py-1">
                      {rec.stock}
                    </div>
                    <div className="bg-green-100 text-green-800 rounded px-2 py-1 text-sm">
                      {rec.change}
                      <div className="text-xs text-gray-600">
                        {rec.type} since {rec.days} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownIcon className="text-red-600 h-6 w-6" />
                  <span className="font-semibold">Sell</span>
                </div>
                {recommendations.filter(r => r.action === "Sell").map((rec, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-200 rounded px-3 py-1">
                      {rec.stock}
                    </div>
                    <div className="bg-red-100 text-red-800 rounded px-2 py-1 text-sm">
                      {rec.change}
                      <div className="text-xs text-gray-600">
                        {rec.type} since {rec.days} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

