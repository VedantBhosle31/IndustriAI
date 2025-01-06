"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search"

export function CompareTool() {
  const [comparedStocks, setComparedStocks] = useState<string[]>([])

  const addStock = (stock: string) => {
    if (!comparedStocks.includes(stock)) {
      setComparedStocks([...comparedStocks, stock])
    }
  }

  const removeStock = (stock: string) => {
    setComparedStocks(comparedStocks.filter((s) => s !== stock))
  }

  const onDragEnd = (result: any) => {
    // This is a placeholder, you'll need to implement the actual drag-and-drop logic here.
    // This example simply logs the result to the console.  You'll likely want to update the state
    // based on the result.destination.index
    console.log("Drag End Result:", result);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchBar onAdd={addStock} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="compare-tool" direction="horizontal">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4 flex flex-wrap gap-2">
                {comparedStocks.map((stock, index) => (
                  <Draggable key={stock} draggableId={stock} index={index}>
                    {(provided) => (
                      <Badge
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        variant="secondary"
                        className="pr-1"
                      >
                        {stock}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeStock(stock)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* Add comparison chart or table here */}
      </CardContent>
    </Card>
  )
}

