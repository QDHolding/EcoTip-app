"use client"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  text: string
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function CopyButton({ text, children, className, variant = "outline", size = "sm" }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
    >
      {children || "Copy"}
    </Button>
  )
}
