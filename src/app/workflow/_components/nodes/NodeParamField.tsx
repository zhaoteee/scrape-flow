"use client"

import { Input } from '@/components/ui/input'
import { TaskParam, TaskParamType } from '@/types/task'

export default function NodeParamField({ param }: { param: TaskParam }) {
  switch (param.type) {
    case TaskParamType.STRING:
        return <Input />
    default:
        return <div className='w-full'><p className='text-xs text-muted-foreground'>Not implemented</p></div>
  }
}
