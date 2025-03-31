import { getWorkflowsForUser } from '@/ations/workflows/getWorkflowsForUser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, InboxIcon } from 'lucide-react'
import React, { Suspense } from 'react'
import CreateWorkflowDialog from './_components/CreateWorkflowDialog'
import WrokflowCard from './_components/WrokflowCard'

export default function page() {
  return (
    <div className='flex-1 flex flex-col h-full'>
        <div className='flex justify-between'>
            <div className='flex flex-col'>
                <h1 className='text-3xl font-bold'>Workflows</h1>
                <p className='text-muted-foreground'>Manage your workflows</p>
            </div>
            <CreateWorkflowDialog triggerText='Create workflow' />  
        </div>

        <div className='h-full py-6'>
            <Suspense fallback={<UserWorkflowsSkeleton />}>
                <UserWorkflows />
            </Suspense>
        </div>
    </div>
  )
}

function UserWorkflowsSkeleton() {
    return (
        <div className='space-y-2'>
            { 
                Array.from({ length: 4 }).map((_, idx) => (<Skeleton key={idx} className='h-10 w-full' />))
            }
        </div>
    )
}

async function UserWorkflows() {
    const workflows =  await getWorkflowsForUser()
    if (!workflows) {
        return <Alert variant={"destructive"}>
            <AlertCircle className='w-4 h-4'></AlertCircle>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong. Please try again later</AlertDescription>
        </Alert>
    }
    if (workflows.length === 0) {
        return <div className='flex flex-col gap-4 h-full items-center justify-center'>
            <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
                <InboxIcon size={40}  className='stroke-primary' />
            </div>
            <div className='flex flex-col gap-1 text-center'>
                <p className='font-bold'>No workflow created yet</p>
                <p className='text-sm text-muted-foreground'>
                    Click the btn below to create your first workflow
                </p>
            </div>
            <CreateWorkflowDialog triggerText='Create you first workflow' />
        </div>
    }
    return (
        <div className='grid grid-cols-1 gap-4'>
            {
                workflows.map((workflow) => (
                    <WrokflowCard key={workflow.id} workflow={workflow} />
                ))
            }
        </div>
    )
}
