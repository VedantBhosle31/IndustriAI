"use client"

import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StockAnalysis } from "@/components/stock-analysis"
import { useState } from 'react'
import { Button } from './ui/button'

const tickerList = ['AAPL', 'ABBV', 'ABT', 'ADBE', 'ADI', 'AI', 'ALNY', 'AMAT', 'AMD', 'AMGN', 'AMZN', 'ASML', 'AXP', 'BABA', 'BAC', 'BE', 'BIIB', 'BLK', 'BMBL', 'BMY', 'BNTX', 'C', 'CHPT', 'COP', 'CPNG', 'CRM', 'CRWD', 'CVX', 'DDOG', 'EBAY', 'ENPH', 'EOG', 'ETSY', 'F', 'FSLR', 'FSR', 'GILD', 'GM', 'GOOGL', 'GS', 'HOOD', 'IBM', 'INCY', 'INTC', 'JD', 'JNJ', 'JPM', 'LCID', 'LI', 'LLY', 'LRCX', 'MA', 'MELI', 'META', 'MPC', 'MRK', 'MRNA', 'MS', 'MSFT', 'MTCH', 'MU', 'NEE', 'NET', 'NIO', 'NVDA', 'ORCL', 'OXY', 'PANW', 'PDD', 'PFE', 'PINS', 'PLTR', 'PLUG', 'PSX', 'PXD', 'QCOM', 'RBLX', 'REGN', 'RIVN', 'RUN', 'SCHW', 'SEDG', 'SGEN', 'SHOP', 'SLB', 'SNAP', 'SNOW', 'SPWR', 'STEM', 'TMO', 'TSLA', 'TSM', 'TWTR', 'U', 'UNH', 'V', 'VLO', 'VRTX', 'W', 'XOM', 'XPEV', 'ZS']


const stocks = [
    {
        ticker: "AAPL",
        logo: "/logos/apple-logo.svg",
        value: 320,
        valueChange: 5.6,
        esg: 75,
        esgChange: 1.8,
        risk: 30,
        riskChange: -1.2,
    },
    {
        ticker: "TSLA",
        logo: "/logos/tesla-logo.svg",
        value: 850,
        valueChange: 7.2,
        esg: 85,
        esgChange: 2.4,
        risk: 40,
        riskChange: -0.9,
    },
    {
        ticker: "MSFT",
        logo: "/logos/microsoft-logo.svg",
        value: 290,
        valueChange: 2.1,
        esg: 90,
        esgChange: 1.5,
        risk: 25,
        riskChange: -0.5,
    },
    {
        ticker: "AMZN",
        logo: "/logos/amazon-logo.svg",
        value: 145,
        valueChange: -1.3,
        esg: 55,
        esgChange: 0.4,
        risk: 60,
        riskChange: 1.2,
    },
    {
        ticker: "META",
        logo: "/logos/meta-logo.svg",
        value: 375,
        valueChange: 3.8,
        esg: 65,
        esgChange: 2.0,
        risk: 45,
        riskChange: -0.6,
    },
    {
        ticker: "NVDA",
        logo: "/logos/nvidia-logo.svg",
        value: 495,
        valueChange: 8.4,
        esg: 80,
        esgChange: 3.2,
        risk: 50,
        riskChange: -1.5,
    },
    {
        ticker: "GOOGL",
        logo: "/logos/google-logo.svg",
        value: 142,
        valueChange: 1.9,
        esg: 88,
        esgChange: 2.3,
        risk: 22,
        riskChange: -0.8,
    },
    {
        ticker: "JNJ",
        logo: "/logos/johnson-logo.svg",
        value: 165,
        valueChange: 0.5,
        esg: 92,
        esgChange: 1.1,
        risk: 15,
        riskChange: -0.3,
    },
    {
        ticker: "KO",
        logo: "/logos/coca-cola-logo.svg",
        value: 62,
        valueChange: -0.2,
        esg: 80,
        esgChange: 0.9,
        risk: 10,
        riskChange: 0.0,
    },
    {
        ticker: "INTC",
        logo: "/logos/intel-logo.svg",
        value: 98,
        valueChange: -0.5,
        esg: 50,
        esgChange: -0.8,
        risk: 65,
        riskChange: 2.1,
    },
    {
        ticker: "ADBE",
        logo: "/logos/adobe-logo.svg",
        value: 490,
        valueChange: 3.6,
        esg: 82,
        esgChange: 2.1,
        risk: 30,
        riskChange: -0.7,
    },
    {
        ticker: "XOM",
        logo: "/logos/exxon-logo.svg",
        value: 108,
        valueChange: 0.8,
        esg: 45,
        esgChange: 0.5,
        risk: 70,
        riskChange: 1.8,
    },
];



interface MarketSectionProps {
    selectedStocks: string; // Replace 'any' with the appropriate type if known
    setSelectedStocks: (stocks: string) => void; // Replace 'any' with the appropriate type if known
}

export function MarketSection({ selectedStocks, setSelectedStocks }: MarketSectionProps) {
    const [searchInput, setSearchInput] = useState('');

    // let filteredStocks = stocks.filter(stock => {
    //     // stock.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    //     let namelist = tickerList.filter(ticker => ticker.toLowerCase().includes(searchInput.toLowerCase()));

    //     namelist = namelist.slice(0, 5);
    //     let rand = stocks
    //         .sort(() => 0.5 - Math.random()) // Shuffle the array randomly
    //         .slice(0, 5);
    //     let finalStocks = [];

    //     for (let i = 0; i < namelist.length; i++) {
    //         finalStocks.push({ ticker: namelist[i], value: rand[i].value, valueChange: rand[i].valueChange, esg: rand[i].esg, risk: rand[i].risk });

    //     }
    //     console.log(finalStocks, namelist, rand);

    //     // finalStocks = finalStocks.slice(0, 5);
    //     return finalStocks;
    // }
    // );
    function getFinalStocks(stocks: any, tickerList: any, searchInput: any) {
        // Create a list of filtered tickers based on the search input
        let namelist = tickerList.filter(ticker => ticker.toLowerCase().includes(searchInput.toLowerCase()));
        namelist = namelist.slice(0, 5); // Limit to 5 elements

        // Randomly select 5 stocks
        let rand = stocks
            .sort(() => 0.5 - Math.random()) // Shuffle the array randomly
            .slice(0, 5); // Take the first 5 elements

        // Build the finalStocks array
        let finalStocks = [];
        for (let i = 0; i < namelist.length; i++) {
            if (rand[i]) { // Ensure rand[i] exists
                finalStocks.push({
                    ticker: namelist[i],
                    value: rand[i].value,
                    valueChange: rand[i].valueChange,
                    esg: rand[i].esg,
                    risk: rand[i].risk
                });
            }
        }

        // Log the results for debugging
        console.log(finalStocks, namelist, rand);

        return finalStocks; // Return the generated list
    }

    // Usage example
    let filteredStocks = getFinalStocks(stocks, tickerList, searchInput);
    if (searchInput == '') {
        filteredStocks = stocks.slice(0, 5);
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Market</h2>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search for stocks and more"
                    className="pl-8 bg-background"
                    onChange={(e) => setSearchInput(e.target.value)}
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

                    {filteredStocks.map((stock, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            onClick={() => setSelectedStocks(stock.ticker)}
                            className={`w-full justify-start p-2 ${index % 2 === 0 ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-100'
                                }`}
                        >
                            <div className="grid grid-cols-4 gap-4 w-full">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-orange-400 rounded-full" />
                                    {stock.ticker}
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
                        </Button>
                    ))}
                </div>
            </ScrollArea>
            <StockAnalysis selectedStocks={selectedStocks} setSelectedStocks={setSelectedStocks} />
        </div>
    )
}

