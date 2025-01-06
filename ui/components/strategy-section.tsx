"use client";

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

type Strategy = {
    // id: number;
    // description: string;
    commentary: string;
    name: string;
    recommendations: {
        buy: {
            reason: string;
            ticker: string;
        }[];
        sell: {
            reason: string;
            ticker: string;
        }[];
    }
    sectors: string[];
    swot: {
        opportunities: string;
        strengths: string;
        threats: string;
        weaknesses: string;
    }
}
type StrategyOld = {
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
        "commentary": "This strategy transforms the portfolio by allocating significant capital to EV-related stocks, while selectively adding emerging tech companies poised for rapid growth. Expect a higher allocation to innovative, tech-driven companies that will drive the future of mobility and energy.",
        "name": "Electrifying Growth Pursuit",
        "recommendations": {
            "buy": [
                {
                    "reason": "10.4% move with 67.0% volatility",
                    "ticker": "LI"
                },
                {
                    "reason": "+-2.8% uptrend with 41.9 risk score",
                    "ticker": "GM"
                }
            ],
            "sell": [
                {
                    "reason": "+0.1% gain with strong ESG score (109.7)",
                    "ticker": "AAPL"
                },
                {
                    "reason": "10.1% with -22.1% max drawdown",
                    "ticker": "GOOGL"
                }
            ]
        },
        "sectors": [
            "Electric Vehicles",
            "New Materials",
            "Energy Storage"
        ],
        "swot": {
            "opportunities": "Roaring demand for EVs, government incentives, and decreasing battery costs create a perfect storm for growth.",
            "strengths": "Compelling value proposition from undervalued EV stocks, potential for long-term outperformance.",
            "threats": "Rapid technological advancements, limited charging infrastructure, and fluctuating commodity prices pose risks.",
            "weaknesses": "High concentration risk, limited liquidity in some names, potential for regulatory setbacks."
        }
    },
    {
        "commentary": "This strategy significantly increases exposure to emerging technologies, such as artificial intelligence, autonomous driving, and 5G, while slowly phasing out traditional energy holdings. The goal is to create a diversified portfolio with a significant stake in the technologies that will shape the future.",
        "name": "Emerging Tech Thesis",
        "recommendations": {
            "buy": [
                {
                    "reason": "+10.6% momentum with low governance risk",
                    "ticker": "NVDA"
                },
                {
                    "reason": "+-4.6% uptrend with 37.6 risk score",
                    "ticker": "IBM"
                }
            ],
            "sell": [
                {
                    "reason": "+0.1% gain with strong ESG score (88.7)",
                    "ticker": "AAPL"
                },
                {
                    "reason": "10.1% with -22.1% max drawdown",
                    "ticker": "GOOGL"
                }
            ]
        },
        "sectors": [
            "Artificial Intelligence",
            "Autonomous Systems",
            "Internet of Things (IoT)"
        ],
        "swot": {
            "opportunities": "AI's vast applicability, 5G's enhanced capabilities, and continued EV adoption create fertile ground for growth.",
            "strengths": "Unique exposure to rapidly growing emerging tech sectors, potential for high returns.",
            "threats": "Regulatory barriers, intense competition, and the ever-present risk of technological obsolescence.",
            "weaknesses": "Limited historical data, uncertain regulatory environments, and intense competition."
        }
    },
    {
        "commentary": "",
        "name": "Disruptive Innovation Focus",
        "recommendations": {
            "buy": [],
            "sell": []
        },
        "sectors": [
            "Biotechnology",
            "Advanced Materials",
            "Fintech"
        ],
        "swot": {
            "opportunities": "Early-stage investments in emerging stars, innovative solutions for pressing global challenges.",
            "strengths": "Ability to capitalize on unmet needs, underestimated companies, and game-changing innovations.",
            "threats": "Regulatory hurdles, competition from established players, and the ever-present risk of market volatility.",
            "weaknesses": "Higher risk due to unproven concepts, limited diversification in the early stages."
        }
    }
]

export function StrategySection() {
    const [strategyData, setStrategyData] = useState<Strategy[]>(strategies)
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0])
    // const strategy = strategies.find(s => s === selectedStrategy)!
    const [inputValue, setInputValue] = useState('');


    useEffect(() => {
        // console.log('selectedStrategy', selectedStrategy)
        // console.log(process.env.BACKEND_URL)
        let backendUrl = 'http://localhost:5000';
        // let url = new URL(`${process.env.BACKEND_URL}/api/analytics/strategies`)
        let url = new URL(`${backendUrl}/api/analytics/strategies`)
        let params = {
            portfolio: 'NVDA,META,TSLA,AAPL,AMD,GOOGL,AMZN,ADBE',
            prompt: 'I want to focus on EV market and emerging tech, but avoid traditional energy. Looking for growth opportunities in next 2-3 years.'
        };

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key as keyof typeof params]));
        // console.log(url);
        const strategy = async () => {
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(data => data).catch(err => console.error(err));
            // console.log("strategy", response);
            setStrategyData(response)
        }
        // console.log(strategy());
    })
    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const handleKeyPress = async (event: any) => {
        if (event.key === 'Enter') {
            await sendDataToAPI();
        }
    };
    const handleButtonClick = async () => {
        await sendDataToAPI();
    };
    const sendDataToAPI = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            let params = {
                user_id: '123',
                portfolio: 'NVDA,META,TSLA,AAPL,AMD,GOOGL,AMZN,ADBE',
                prompt: inputValue
            }
            const url = new URL('/api/analytics/strategies', backendUrl);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key as keyof typeof params]));
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(data => data).catch(err => console.error(err));
            console.log("response send API", response);
            setSelectedStrategy(response[0])
            setStrategyData(response)
            // Handle the response data as needed
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>Strategy Builder</CardTitle>
                        <div className="flex gap-2">
                            {strategyData.map((s, index) => (
                                <Button
                                    key={index}
                                    variant={selectedStrategy === strategyData[index] ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedStrategy(strategyData[index])}
                                >
                                    {`Strat ${index + 1}`}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">
                        {selectedStrategy.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {selectedStrategy.commentary}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-500 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Strength</h3>
                            <p className="text-white text-sm mt-2">{selectedStrategy.swot.strengths}</p>
                        </div>
                        <div className="bg-red-500 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Weakness</h3>
                            <p className="text-white text-sm mt-2">{selectedStrategy.swot.weaknesses}</p>
                        </div>
                        <div className="bg-purple-400 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Opportunity</h3>
                            <p className="text-white text-sm mt-2">{selectedStrategy.swot.opportunities}</p>
                        </div>
                        <div className="bg-yellow-400 p-4 rounded-lg h-32">
                            <h3 className="font-semibold text-white">Threats</h3>
                            <p className="text-white text-sm mt-2">{selectedStrategy.swot.threats}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Recommended Transactions</h3>
                        <ScrollArea className="h-[120px]">
                            <div className="space-y-2">
                                {selectedStrategy.recommendations.buy.map((stock, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-green-50"
                                    >
                                        <img src="/placeholder.svg" alt="" className="h-6 w-6" />
                                        <span>{stock.ticker}</span>
                                    </div>
                                ))}
                                {selectedStrategy.recommendations.sell.map((stock, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-red-50"
                                    >
                                        <img src="/placeholder.svg" alt="" className="h-6 w-6" />
                                        <span>{stock.ticker}</span>
                                    </div>
                                ))}
                                {/* <Button variant="link" className="text-sm px-0">
                                    show more
                                </Button> */}
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
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button size="sm" className="absolute right-1 top-1" onClick={handleButtonClick}>
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

