"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { X, Search } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const data = [
    { name: "Jan", DELL: 80, AAPL: 140, TSLA: 20, GOOG: 90, META: 110 },
    { name: "Feb", DELL: 70, AAPL: 75, TSLA: 40, GOOG: 95, META: 90 },
    { name: "Mar", DELL: 75, AAPL: 30, TSLA: 60, GOOG: 100, META: 70 },
    { name: "Apr", DELL: 80, AAPL: 20, TSLA: 90, GOOG: 110, META: 60 },
    { name: "May", DELL: 75, AAPL: 15, TSLA: 110, GOOG: 130, META: 80 },
    { name: "Jun", DELL: 70, AAPL: 10, TSLA: 180, GOOG: 140, META: 70 },
]

const availableStocks = [
    { value: "DELL", label: "Dell Technologies" },
    { value: "AAPL", label: "Apple Inc." },
    { value: "TSLA", label: "Tesla Inc." },
    { value: "GOOG", label: "Google" },
    { value: "META", label: "Meta Platforms" },
    { value: "MSFT", label: "Microsoft" },
    { value: "AMZN", label: "Amazon" },
    { value: "NVDA", label: "NVIDIA" },
]

const colors = {
    DELL: "hsl(10, 70%, 50%)",
    AAPL: "hsl(100, 70%, 50%)",
    TSLA: "hsl(200, 70%, 50%)",
    GOOG: "hsl(270, 70%, 50%)",
    META: "hsl(340, 70%, 50%)",
    MSFT: "hsl(160, 70%, 50%)",
    AMZN: "hsl(40, 70%, 50%)",
    NVDA: "hsl(220, 70%, 50%)",
}

export function CompareSection() {
    const [selectedStocks, setSelectedStocks] = useState(["DELL", "AAPL", "TSLA", "GOOG", "META"])
    const [open, setOpen] = useState(false)

    const handleRemoveStock = (stockToRemove: string) => {
        setSelectedStocks(selectedStocks.filter(stock => stock !== stockToRemove))
    }

    const handleAddStock = (stockToAdd: string) => {
        if (!selectedStocks.includes(stockToAdd)) {
            setSelectedStocks([...selectedStocks, stockToAdd])
        }
        setOpen(false)
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(selectedStocks)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setSelectedStocks(items)
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <CardTitle>Compare</CardTitle>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Search className="h-4 w-4 mr-2" />
                                Add Stock
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="end">
                            <Command>
                                <CommandInput placeholder="Search stocks..." />
                                <CommandEmpty>No stocks found.</CommandEmpty>
                                <CommandGroup>
                                    {availableStocks
                                        .filter(stock => !selectedStocks.includes(stock.value))
                                        .map(stock => (
                                            <CommandItem
                                                key={stock.value}
                                                onSelect={() => handleAddStock(stock.value)}
                                            >
                                                {stock.label} ({stock.value})
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="stocks" direction="horizontal">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex flex-wrap gap-2"
                            >
                                {selectedStocks.map((stock, index) => (
                                    <Draggable key={stock} draggableId={stock} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Button variant="secondary" size="sm" className="gap-2">
                                                    {stock}
                                                    <X
                                                        className="h-4 w-4 hover:text-destructive"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            handleRemoveStock(stock)
                                                        }}
                                                    />
                                                </Button>
                                            </div>
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
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            {selectedStocks.map((stock) => (
                                <Line
                                    key={stock}
                                    type="monotone"
                                    dataKey={stock}
                                    stroke={colors[stock]}
                                    strokeWidth={2}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

