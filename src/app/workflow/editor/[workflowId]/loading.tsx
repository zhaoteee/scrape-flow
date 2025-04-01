import { Loader2Icon } from 'lucide-react'
import React from 'react'

export default function loading() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
        <Loader2Icon size={30} className='animate-spin stroke-primary'></Loader2Icon>
    </div>
  )
}
