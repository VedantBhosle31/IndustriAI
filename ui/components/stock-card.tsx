import { Card } from "@/components/ui/card"

interface StockCardProps {
  name: string
  symbol: string
  price: number
  change: number
  chartUrl: string
}

export function StockCard({ name, symbol, price, change, chartUrl }: StockCardProps) {
  const isPositive = change > 0
  const bgColor = isPositive ? 'bg-green-100' : 'bg-red-100'
  const textColor = isPositive ? 'text-green-600' : 'text-red-600'
  
  return (
    <Card className={`${bgColor} p-4 relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{symbol}</p>
        </div>
        <span className={`${textColor} text-sm font-medium`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
      <div className="text-2xl font-bold mb-2">
        ${price.toFixed(2)}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-12 opacity-50">
        <img src={chartUrl} alt="Stock chart" className="w-full h-full object-cover" />
      </div>
    </Card>
  )
}

