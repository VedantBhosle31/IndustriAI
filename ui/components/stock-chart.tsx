"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Jan", AAPL: 150, GOOGL: 2800, MSFT: 300 },
  { name: "Feb", AAPL: 155, GOOGL: 2850, MSFT: 310 },
  { name: "Mar", AAPL: 160, GOOGL: 2900, MSFT: 320 },
  { name: "Apr", AAPL: 165, GOOGL: 2950, MSFT: 330 },
  { name: "May", AAPL: 170, GOOGL: 3000, MSFT: 340 },
  { name: "Jun", AAPL: 175, GOOGL: 3050, MSFT: 350 },
]

const stockColors = {
  AAPL: "hsl(var(--chart-1))",
  GOOGL: "hsl(var(--chart-2))",
  MSFT: "hsl(var(--chart-3))",
}

export function StockChart({ stocks, onDragEnd }) {
  const chartConfig = stocks.reduce((acc, stock) => {
    acc[stock] = {
      label: stock,
      color: stockColors[stock],
    }
    return acc
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Performance</CardTitle>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="stock-chart" direction="horizontal">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2">
                {stocks.map((stock, index) => (
                  <Draggable key={stock} draggableId={stock} index={index}>
                    {(provided) => (
                      <Badge
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        variant="secondary"
                      >
                        {stock}
                      </Badge>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {stocks.map((stock) => (
                <Line
                  key={stock}
                  type="monotone"
                  dataKey={stock}
                  stroke={stockColors[stock]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

