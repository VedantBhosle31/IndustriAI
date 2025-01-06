"use client"

import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Stock {
  name: string
  logo: string
  value: number
  valueChange: number
  esg: number
  risk: number
}

const stocks: Stock[] = [
  {
    name: "Jup Info",
    logo: "/placeholder.svg",
    value: 150,
    valueChange: 2.3,
    esg: 15,
    risk: -2.3,
  },
  // Add more stocks...
]

export function StockSearch() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search for stocks and more" className="pl-8" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>ESG</TableHead>
            <TableHead>Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.name}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img src={stock.logo} alt="" className="h-6 w-6 rounded-full" />
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
              <TableCell>{stock.esg}%</TableCell>
              <TableCell>{stock.risk}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

