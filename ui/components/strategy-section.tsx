"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

type Strategy = {
    id: number;
    name: string;
    description: string;
    strength: string;
    weakness: string;
    opportunity: string;
    threat: string;
    recommendations: string[];
}

const strategies: Strategy[] = [
    {
        id: 1,
        name: "Strategy 1",
        description: "AI recommends focusing on the EV market as it shows good recent trends. It is a ripe time to divest from railways due to recent legislation.",
        strength: "Strong market position in tech sector",
        weakness: "High exposure to volatile sectors",
        opportunity: "Emerging EV market growth",
        threat: "Regulatory changes in tech",
        recommendations: ["NVIDIA", "NVIDIA", "NVIDIA"]
    },
    {
        id: 2,
        name: "Strategy 2",
        description: "Focus on renewable energy sectors while maintaining tech exposure. Consider reducing positions in traditional energy companies.",
        strength: "Diversified portfolio across sectors",
        weakness: "Limited exposure to emerging markets",
        opportunity: "Growing renewable energy sector",
        threat: "Market volatility in tech sector",
        recommendations: ["Tesla", "Tesla", "Tesla"]
    },
    {
        id: 3,
        name: "Strategy 3",
        description: "Balanced approach with focus on blue-chip stocks. Recommend increasing positions in stable dividend-paying companies.",
        strength: "Strong dividend income stream",
        weakness: "Lower growth potential",
        opportunity: "Value stocks becoming attractive",
        threat: "Rising interest rates impact",
        recommendations: ["Apple", "Apple", "Apple"]
    }
]

export function StrategySection() {
    const [selectedStrategy, setSelectedStrategy] = useState<number>(1)
    const strategy = strategies.find(s => s.id === selectedStrategy)!

    return (
        <Card className="h-[600px]">
            <CardHeader>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>Strategy Builder</CardTitle>
                        <div className="flex gap-2">
                            {strategies.map((s) => (
                                <Button
                                    key={s.id}
                                    variant={selectedStrategy === s.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedStrategy(s.id)}
                                >
                                    {s.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {strategy.description}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-500 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Strength</h3>
                            <p className="text-white text-sm mt-2">{strategy.strength}</p>
                        </div>
                        <div className="bg-red-500 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Weakness</h3>
                            <p className="text-white text-sm mt-2">{strategy.weakness}</p>
                        </div>
                        <div className="bg-purple-400 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Opportunity</h3>
                            <p className="text-white text-sm mt-2">{strategy.opportunity}</p>
                        </div>
                        <div className="bg-yellow-400 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Threats</h3>
                            <p className="text-white text-sm mt-2">{strategy.threat}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Recommended Transactions</h3>
                        <ScrollArea className="h-[120px]">
                            <div className="space-y-2">
                                {strategy.recommendations.map((stock, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-green-50"
                                    >
                                        <img src="/placeholder.svg" alt="" className="h-6 w-6" />
                                        <span>{stock}</span>
                                    </div>
                                ))}
                                <Button variant="link" className="text-sm px-0">
                                    show more
                                </Button>
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="pt-4 mt-4 border-t">
                        <div className="bg-muted rounded-lg p-4">
                            <div className="relative flex items-center">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Chat with AI to adjust strategy"
                                    className="pl-8 pr-20"
                                />
                                <Button size="sm" className="absolute right-1 top-1">
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

