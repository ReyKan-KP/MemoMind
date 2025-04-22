"use client"

import { Toaster } from "sonner"

export const ToasterProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      richColors
      toastOptions={{
        duration: 3000,
      }}
    />
  )
} 