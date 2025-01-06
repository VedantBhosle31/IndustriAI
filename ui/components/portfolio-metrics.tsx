import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

const metrics = [
  { name: "Principal", value: 62, change: -2.3 },
  { name: "ROI", value: 62, change: -2.3 },
  { name: "ESG", value: 62, change: 2.3 },
  { name: "Risk", value: 62, change: 2.3 },
  { name: "Diversity", value: 62, change: 2.3 },
]

export function PortfolioMetrics() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Portfolio Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="text-3xl font-bold mb-1">{metric.value}%</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                {metric.change > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={metric.change > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(metric.change)}%
                </span>
              </div>
              <div className="text-sm font-medium mt-1">{metric.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

