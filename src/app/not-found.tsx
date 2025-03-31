import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
        <div className='text-center'>
            <h1 className='text-4xl font-bold text-primary mb-4'>404</h1>
            <p className='text-2xl font-semibold mb-4'>Page Not Found</p>
            <p className='text-sm text-muted-foreground mb-4'>The page you are looking for does not exist.</p>
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <Link href={'/'} className='flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md
                hover:bg-primary/80 transition-colors duration-300'>
                    <ArrowLeft size={20} className='mr-2' />
                    Go Back Home
                </Link>
            </div>
        </div>
    </div>
  )
}
