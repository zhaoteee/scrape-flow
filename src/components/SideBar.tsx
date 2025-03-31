 "use client"

import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react'
import React from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { DialogTitle } from '@radix-ui/react-dialog'
const routes = [
    {
        href: '',
        label: 'Home',
        icon: HomeIcon,
    },
    {
        href: 'workflows',
        label: 'workflows',
        icon: Layers2Icon,
    },
    {
        href: 'credentials',
        label: 'credentials',
        icon: ShieldCheckIcon,
    },{
        href: 'bilings',
        label: 'Bilings',
        icon: CoinsIcon,
    },
]

export function DesktopSidebar() {
    const pathname = usePathname();
    const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0]
  return (
    <div className='hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full
        bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate
        '>
            <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
                <Logo />
            </div>
            <div className="flex flex-col p-2">
                {
                    routes.map((route) => (
                        <Link key={route.href} href={route.href} className={buttonVariants({
                            variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
                        })}>
                            <route.icon size={20} />
                            {route.label}
                        </Link>
                    ))
                }
            </div>
        </div>
  )
}

export function MobileSidebar() {
    const [isOpen, setOpen] = React.useState(false);
    const pathname = usePathname();
    const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0]
  return (
    <div className='block border-separate bg-background md:hidden'>
        <div className='container flex items-center justify-between pl-1 pr-4'>
            <Sheet open={isOpen} onOpenChange={setOpen} >
                <SheetTrigger>
                    <Button className='w-6 h-6' asChild variant={'ghost'} size={'icon'} >
                        <MenuIcon  />
                    </Button>
                </SheetTrigger>
                <SheetContent className='w-[400px] sm:w-[540px] space-y-4' side={'left'}>
                    <DialogTitle><Logo /></DialogTitle>
                    <div className="flex flex-col gap-1 p-2">
                        {
                            routes.map((route) => (
                                <Link key={route.href} href={route.href} className={buttonVariants({
                                    variant: activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
                                })} onClick={() => setOpen(prev => !prev)}>
                                    <route.icon size={20} />
                                    {route.label}
                                </Link>
                            ))
                        }
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </div>
  ) 
}
