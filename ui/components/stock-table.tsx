"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { useRouter } from 'next/navigation';

const stocks = [
  {
    name: "NVIDIA",
    logo: "/logos/NVDA.png",
    value: 480,
    valueChange: 5.3,
    esg: { value: 80, change: 1.2 },
    risk: { value: 30, change: -1.5 },
    roi: { value: 25, change: 3.8 },
  },
  {
    name: "JIO",
    logo: "/placeholder.svg",
    value: 150,
    valueChange: 2.1,
    esg: { value: 55, change: 0.8 },
    risk: { value: 45, change: 2.3 },
    roi: { value: 18, change: -1.2 },
  },
  {
    name: "AMD",
    logo: "/logos/AMD.png",
    value: 420,
    valueChange: 6.5,
    esg: { value: 70, change: 2.4 },
    risk: { value: 28, change: -1.1 },
    roi: { value: 22, change: 4.0 },
  },
  {
    name: "Apple",
    logo: "/logos/AAPL.png",
    value: 600,
    valueChange: 3.2,
    esg: { value: 85, change: 1.8 },
    risk: { value: 20, change: -0.7 },
    roi: { value: 30, change: 1.9 },
  },
  {
    name: "Microsoft",
    logo: "/logos/MSFT.png",
    value: 340,
    valueChange: 2.0,
    esg: { value: 90, change: 1.5 },
    risk: { value: 15, change: -0.4 },
    roi: { value: 28, change: 1.8 },
  },
  {
    name: "Tata",
    logo: "/placeholder.svg",
    value: 190,
    valueChange: -1.2,
    esg: { value: 60, change: -0.5 },
    risk: { value: 35, change: 0.7 },
    roi: { value: 14, change: -1.3 },
  },
  {
    name: "Meta",
    logo: "/placeholder.svg",
    value: 285,
    valueChange: 4.7,
    esg: { value: 65, change: 2.0 },
    risk: { value: 25, change: -1.2 },
    roi: { value: 21, change: 3.5 },
  },
];


export function StockTable() {
  const router = useRouter();

  const handleOptimizeClick = () => {
    router.push('/trading');
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your stocks</h2>
        <Button variant="secondary" onClick={handleOptimizeClick}>Optimize Strategy</Button>
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
                      {/* <img src={stock.logo} alt="" className="h-6 w-6" /> */}
                      <Image src={stock.logo} alt="" width={24} height={24} />
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

