import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TooltipWrapperProps {
    children: React.ReactNode;
    content: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
}
export default function TooltipWrapper(props: TooltipWrapperProps) {
  return (
    <TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger asChild>
                {props.children}
            </TooltipTrigger>
            <TooltipContent side={props.side}>{props.content}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
