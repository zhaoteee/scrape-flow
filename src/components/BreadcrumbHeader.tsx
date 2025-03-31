'use client'
import { usePathname } from 'next/navigation'
// This is a client component
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from './ui/breadcrumb';
import { MobileSidebar } from './SideBar';

export default function BreadcrumbHeader() {
  const pathName = usePathname();
  const paths = pathName === '/' ? [''] : pathName?.split('/');
  
  return (
    <div className='flex items-center justify-start gap-2'>
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
        {
            paths.map((path, idx) => (
              <React.Fragment key={idx}>
                <BreadcrumbItem>
                    <BreadcrumbLink className='capitalize' href={`/${path}`}>{path === "" ? "home" : path}</BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))
          }
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
