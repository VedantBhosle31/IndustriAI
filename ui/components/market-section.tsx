"use client"

import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StockAnalysis } from "@/components/stock-analysis"

const stocks = [
    {
        name: "Jup Info",
        logo: "/placeholder.svg",
        value: 150,
        valueChange: 2.3,
        esg: 15,
        esgChange: 2.3,
        risk: 15,
        riskChange: -2.3,
    },
    {
        name: "Jup Info",
        logo: "/placeholder.svg",
        value: 150,
        valueChange: 2.3,
        esg: 15,
        esgChange: 2.3,
        risk: 15,
        riskChange: -2.3,
    },
    {
        name: "Jup Info",
        logo: "/placeholder.svg",
        value: 150,
        valueChange: 2.3,
        esg: 15,
        esgChange: 2.3,
        risk: 15,
        riskChange: -2.3,
    },
    {
        name: "Jup Info",
        logo: "/placeholder.svg",
        value: 150,
        valueChange: 2.3,
        esg: 15,
        esgChange: 2.3,
        risk: 15,
        riskChange: -2.3,
    },
]

export function MarketSection() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Market</h2>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search for stocks and more"
                    className="pl-8 bg-background"
                />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-2">
                <div className="text-sm font-medium">Stock</div>
                <div className="text-sm font-medium">Value</div>
                <div className="text-sm font-medium">ESG</div>
                <div className="text-sm font-medium">Risk</div>
            </div>
            <ScrollArea className="h-[240px]">
                <div className="space-y-1">
                    {stocks.map((stock, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-4 gap-4 p-2 rounded-lg ${index % 2 === 0 ? 'bg-green-50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-orange-400 rounded-full" />
                                {stock.name}
                            </div>
                            <div>
                                <div>${stock.value}</div>
                                <div className="text-green-600">+{stock.valueChange}%</div>
                            </div>
                            <div>
                                <div>${stock.value}</div>
                                <div className="text-green-600">+{stock.valueChange}%</div>
                            </div>
                            <div>
                                <div>{stock.risk}%</div>
                                <div className="text-red-600">{stock.riskChange}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <StockAnalysis />
        </div>
    )
}

