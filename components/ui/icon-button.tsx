import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type IconButtonProps = {
  label: string
  onClick: () => void
  children: ReactNode
}

export function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="size-10 rounded-lg border-border text-muted-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-5"
    >
      {children}
    </Button>
  )
}
