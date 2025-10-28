import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LogoutModal({ open, onOpenChange, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You will need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Export alias for compatibility
export const LogoutDialog = LogoutModal
