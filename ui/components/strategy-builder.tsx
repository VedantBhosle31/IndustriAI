import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

export function StrategyBuilder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          AI recommends focusing on the EV market as it shows good recent trends. It is a ripe time to divest from railways due to recent legislation.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Strength</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">Strong market position in tech sector</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Weakness</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800">High exposure to volatile sectors</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900">Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800">Emerging EV market growth</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-900">Threats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800">Regulatory changes in tech</p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Recommended Transactions</h3>
          <div className="space-y-2">
            {[
              { action: "Buy", stock: "NVIDIA", change: "+2.5%", days: 21 },
              { action: "Buy", stock: "Tesla", change: "+3.2%", days: 14 },
              { action: "Sell", stock: "Meta", change: "-1.8%", days: 30 },
            ].map((rec, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  rec.action === "Buy" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {rec.action === "Buy" ? (
                  <ArrowUpIcon className="text-green-600 h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="text-red-600 h-4 w-4" />
                )}
                <span className="font-medium">{rec.stock}</span>
                <span className={rec.action === "Buy" ? "text-green-600" : "text-red-600"}>
                  {rec.change}
                </span>
                <span className="text-sm text-muted-foreground">
                  in {rec.days} days
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full" variant="secondary">
          Chat with AI to adjust strategy
        </Button>
      </CardContent>
    </Card>
  )
}

