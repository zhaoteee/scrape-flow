"use client";

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { createWorkflowSchema } from '@/schema/workflow';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Layers2Icon } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof createWorkflowSchema>>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {}
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>{triggerText ?? "Create workflow"}</Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDialogHeader
              icon={Layers2Icon}
              title="Create workflow"
              subTitle='Start building your workflow'
            ></CustomDialogHeader>
            <div className='p-6 pt-0'>
              <Form {...form}>
                <form className='space-y-8 w-full'>
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex gap-1 items-center'>Name
                        <p className='text-xs text-primary'>(required)</p>
                      </FormLabel>
                      <FormControl><Input { ...field } /></FormControl>
                      <FormDescription>Choose a descriptive and unique name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}>

                  </FormField>
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex gap-1 items-center'>Description
                        <p className='text-xs text-muted-foreground'>(optional)</p>
                      </FormLabel>
                      <FormControl><Textarea className='resize-none' { ...field } /></FormControl>
                      <FormDescription>
                        Provide a brief description of your workflow. <br />
                        This will help you and others understand its purpose and functionality.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}>

                  </FormField>
                </form>
                <Button className='w-full mt-2' type='submit'>Proceed</Button>
              </Form>
            </div>
        </DialogContent>
    </Dialog>
  )
}
