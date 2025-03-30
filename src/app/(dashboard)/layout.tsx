import DesktopSidebar from '@/components/sideBar'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export default function layout({children} : {children: React.ReactNode}) {
  return (
    <div className='flex h-screen'>
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-center px-6 py-4 h-[50px] container">
          ScrapeFlow
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
