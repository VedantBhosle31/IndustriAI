"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const stocks = [
  {
    name: "NVIDIA",
    logo: "/placeholder.svg",
    value: 150,
    valueChange: 2.3,
    esg: { value: 15, change: -2.3 },
    risk: { value: 15, change: -2.3 },
    roi: { value: 15, change: -2.3 },
  },
  {
    name: "JIO",
    logo: "/placeholder.svg",
    value: 130,
    valueChange: 2.3,
    esg: { value: 15, change: 20.3 },
    risk: { value: 15, change: 20.3 },
    roi: { value: 15, change: -12.2 },
  },
  {
    name: "P.H.",
    logo: "/placeholder.svg",
    value: 150,
    valueChange: 2.3,
    esg: { value: 15, change: -2.3 },
    risk: { value: 15, change: -2.3 },
    roi: { value: 15, change: -2.3 },
  },
  {
    name: "Tata",
    logo: "/placeholder.svg",
    value: 150,
    valueChange: 2.3,
    esg: { value: 15, change: -2.3 },
    risk: { value: 15, change: -2.3 },
    roi: { value: 15, change: -2.3 },
  },
  {
    name: "Meta",
    logo: "/placeholder.svg",
    value: 200,
    valueChange: 2.3,
    esg: { value: 15, change: -2.3 },
    risk: { value: 15, change: -2.3 },
    roi: { value: 15, change: -2.3 },
  },
  {
    name: "Apple",
    logo: "/placeholder.svg",
    value: 175,
    valueChange: 1.8,
    esg: { value: 18, change: 1.5 },
    risk: { value: 12, change: -1.7 },
    roi: { value: 20, change: 2.1 },
  },
  {
    name: "Microsoft",
    logo: "/placeholder.svg",
    value: 310,
    valueChange: 0.9,
    esg: { value: 20, change: 2.8 },
    risk: { value: 10, change: -0.8 },
    roi: { value: 18, change: 1.5 },
  },
]

export function StockTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your stocks</h2>
        <Button variant="secondary">Optimize Strategy</Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Stock</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>ESG</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>ROI</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <ScrollArea className="h-[460px]">
          <Table>
            <TableBody>
              {stocks.map((stock, index) => (
                <TableRow
                  key={stock.name}
                  className="cursor-pointer hover:bg-green-50 transition-colors"
                  style={{ backgroundColor: index % 2 === 0 ? 'rgb(240, 253, 244)' : 'transparent' }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img src={stock.logo} alt="" className="h-6 w-6" />
                      {stock.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>${stock.value}</div>
                      <div className="text-green-600">+{stock.valueChange}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{stock.esg.value}%</div>
                      <div className={stock.esg.change > 0 ? "text-green-600" : "text-red-600"}>
                        {stock.esg.change > 0 ? "+" : ""}{stock.esg.change}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{stock.risk.value}%</div>
                      <div className={stock.risk.change > 0 ? "text-red-600" : "text-green-600"}>
                        {stock.risk.change > 0 ? "+" : ""}{stock.risk.change}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{stock.roi.value}%</div>
                      <div className={stock.roi.change > 0 ? "text-green-600" : "text-red-600"}>
                        {stock.roi.change > 0 ? "+" : ""}{stock.roi.change}%
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}

