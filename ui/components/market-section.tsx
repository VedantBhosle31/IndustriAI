"use client"

import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 120 },
    { month: "Mar", value: 115 },
    { month: "Apr", value: 130 },
    { month: "May", value: 125 },
    { month: "Jun", value: 140 },
]

export function MarketSection() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Market</h2>
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
                    <TableRow>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <img src="/placeholder.svg" alt="" className="h-6 w-6 rounded-full" />
                                Jup Info
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <div>$150</div>
                                <div className="text-green-600">+2.3%</div>
                            </div>
                        </TableCell>
                        <TableCell>15%</TableCell>
                        <TableCell>-2.3%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <img src="/placeholder.svg" alt="" className="h-8 w-8 rounded-full" />
                            <div>
                                <h3 className="font-semibold">Meta</h3>
                                <div className="text-2xl font-bold">$150</div>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline">Detailed Analysis</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">AI Stock Analysis</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Expected to rise, invests in low carbon</li>
                            <li>Strong market position in social media</li>
                            <li>Potential growth in metaverse sector</li>
                            <li>High innovation potential</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Effects on your portfolio</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { label: "ROI", value: "+1.2%" },
                                { label: "ESG", value: "+1.2%" },
                                { label: "Risk", value: "+1.2%" },
                                { label: "Diversity", value: "+1.2%" },
                            ].map((metric) => (
                                <div key={metric.label} className="bg-green-50 p-2 rounded-lg">
                                    <div className="text-sm font-medium">{metric.label}</div>
                                    <div className="text-green-600">{metric.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button className="w-full">Buy</Button>
                        <Button variant="outline" className="w-full">Sell</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

