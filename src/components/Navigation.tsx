'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Home
          </Link>
          <Link
            href="/list"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/list' ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            List View
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  )
} 