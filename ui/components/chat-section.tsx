"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Paperclip, Send } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'ai';
};

export function ChatSection() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I assist you with your portfolio today?", sender: 'ai' },
        { id: 2, text: "Can you analyze my current portfolio performance?", sender: 'user' },
        { id: 3, text: "I've analyzed your portfolio and noticed a few key points. Your overall performance is up 5.3% this month, with technology stocks being the main driver. However, your exposure to the energy sector is slightly higher than recommended. Would you like more detailed insights?", sender: 'ai' },
        { id: 4, text: "Yes, please provide more details on the technology stocks performance.", sender: 'user' },
        { id: 5, text: "Your technology stocks have shown strong growth. Apple (AAPL) is up 8.2%, Microsoft (MSFT) has gained 6.7%, and NVIDIA (NVDA) has surged by 12.3% this month. These performances have significantly contributed to your portfolio's overall growth. Would you like recommendations on how to optimize your technology sector holdings?", sender: 'ai' },
        { id: 6, text: "That sounds great. What are your recommendations?", sender: 'user' },
        { id: 7, text: "Based on current market trends and your risk profile, I recommend the following:\n\n1. Consider increasing your position in NVIDIA (NVDA) by 5-10% as they continue to lead in AI chip technology.\n2. Maintain your current positions in Apple (AAPL) and Microsoft (MSFT).\n3. Look into adding exposure to cloud computing through companies like Amazon (AMZN) or Salesforce (CRM) to diversify within the tech sector.\n4. To balance risk, consider trimming your energy sector holdings by 3-5% and reallocating to a technology ETF like XLK.\n\nWould you like me to provide more specific actions or explain any of these recommendations further?", sender: 'ai' },
    ]);

    return (
        <Card className="mt-4">
            <CardContent className="p-4">
                <ScrollArea className="h-[400px] mb-4 pr-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`mb-4 p-2 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                                } max-w-[80%]`}
                        >
                            {message.text}
                        </div>
                    ))}
                </ScrollArea>
                <div className="flex items-center gap-2 mt-4">
                    <Input
                        placeholder="Chat with AI or attach your report for analysis"
                        className="flex-1"
                    />
                    <Button size="icon">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

