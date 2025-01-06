"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Stock {
  name: string
  logo: string
  value: number
  valueChange: number
  esg: number
  esgChange: number
  risk: number
  riskChange: number
  roi: number
  roiChange: number
}

const stocks: Stock[] = [
  {
    name: "NVIDIA",
    logo: "/placeholder.svg",
    value: 150,
    valueChange: 2.3,
    esg: 15,
    esgChange: -2.3,
    risk: 15,
    riskChange: -2.3,
    roi: 15,
    roiChange: -2.3
  },
  {
    name: "JIO",
    logo: "/placeholder.svg",
    value: 130,
    valueChange: 2.3,
    esg: 15,
    esgChange: 20.3,
    risk: 15,
    riskChange: 20.3,
    roi: 15,
    roiChange: -12.2
  },
  // Add other stocks...
]

export function StockTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your stocks</h2>
        <Button variant="secondary">Optimize Strategy</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>ESG</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>ROI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.name}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <img src={stock.logo} alt={stock.name} className="w-6 h-6" />
                  {stock.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>${stock.value}</div>
                  <div className={stock.valueChange > 0 ? "text-green-600" : "text-red-600"}>
                    {stock.valueChange > 0 ? "+" : ""}{stock.valueChange}%
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{stock.esg}%</div>
                  <div className={stock.esgChange > 0 ? "text-green-600" : "text-red-600"}>
                    {stock.esgChange > 0 ? "+" : ""}{stock.esgChange}%
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{stock.risk}%</div>
                  <div className={stock.riskChange > 0 ? "text-green-600" : "text-red-600"}>
                    {stock.riskChange > 0 ? "+" : ""}{stock.riskChange}%
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{stock.roi}%</div>
                  <div className={stock.roiChange > 0 ? "text-green-600" : "text-red-600"}>
                    {stock.roiChange > 0 ? "+" : ""}{stock.roiChange}%
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

