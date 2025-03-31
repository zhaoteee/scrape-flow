import { Alert } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import React from 'react'

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    workflowName: string;
}

export default function DeleteWorkflowDialog({ open, setOpen, workflowName }: Props) {
  const [confirmText, setConfirmText] = React.useState<string>("");
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this workflow?</AlertDialogTitle>
                <AlertDialogDescription>
                    If you delete this workflow, you will not be able to recover it.
                    <span className='flex flex-col py-2 gap-2'>
                        <span>If you are sure, enter <b>{workflowName}</b> to confirm:</span>
                        <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value) }/>
                    </span>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={confirmText !== workflowName} className='bg-destructive text-destructive-foreground hover:bg-destructive/90' >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
