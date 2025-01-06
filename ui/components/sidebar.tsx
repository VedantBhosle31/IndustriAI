'use client';
import { BarChart3, CircleDollarSign, LogOut, Home } from 'lucide-react'
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from 'react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const currentRoute = typeof window !== 'undefined' ? window.location.pathname : '/';
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/quote');
        console.log(response);
        const data = await response.json();
        console.log(data);
        setQuote(data.body);
      } catch (error) {
        console.error('Error fetching the quote:', error);
      }
    };

    fetchQuote();
  }, []);


  return (
    <div className={cn("pb-12 min-h-screen w-60 border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center">
            <h2 className="text-2xl font-bold tracking-tight">temenos</h2>
          </Link>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            User Panel
          </h2>
          <div className="space-y-1">
            <Button variant={currentRoute === '/' ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant={currentRoute === '/portfolio' ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/portfolio">
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Portfolio
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/trading">
                <BarChart3 className="mr-2 h-4 w-4" />
                Trading & Market
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="mb-2 rounded-lg bg-green-50 p-4">
            <h3 className="font-medium mb-2">Thoughts Time</h3>
            <p className="text-sm text-muted-foreground">
              {quote || "Loading quote..."}
            </p>
          </div>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

