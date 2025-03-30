import { cn } from '@/lib/utils';
import { SquareDashedMousePointer } from 'lucide-react';
import React from 'react'

export default function Logo({ fontSize = "2xl", iconSize = 20 }: { fontSize?: string;iconSize?: number }) {
  return (
    <div className={cn("text-2xl font-extrabold flex items-center gap-2", fontSize)}>
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
            <SquareDashedMousePointer size={iconSize}  className='stroke-white' />
        </div>
        <div>
            <span className="bg-gradient-to-t from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Flow
            </span>
            <span className='text-stone-70 dark:text-stone-300'>Scrape</span>
        </div>
    </div>
  )
}
