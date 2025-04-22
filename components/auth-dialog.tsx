import React from 'react'
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog'
import { Button } from './ui/button'
import { useAuth } from '@/utils/hooks/use-auth'

interface AuthDialogProps {
  triggerText?: string;
  featureName?: string;
  children?: React.ReactNode;
}

const AuthDialog = ({ 
  triggerText = "Login", 
  featureName = "this feature",
  children
}: AuthDialogProps) => {
  const { isLoading, isAuthenticated } = useAuth();
  
  // If user is authenticated or still loading, render the children directly
  if (isAuthenticated || isLoading) {
    return children || <Button>{triggerText}</Button>;
  }

  // If user is not authenticated, show the auth dialog
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            Please sign in to your account to use {featureName}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => window.location.href = "/sign-up"}>
            Create account
          </Button>
          <Button onClick={() => window.location.href = "/sign-in"}>
            Sign in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AuthDialog;