import { BellIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-6">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Hello Matt,</h2>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="sm">$ 14,032.56</Button>
                    <Button variant="secondary" size="sm">Medium Risk</Button>
                    <Button variant="ghost" size="icon">
                        <BellIcon className="h-5 w-5" />
                    </Button>
                    <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}

