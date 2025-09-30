import React from 'react'
import { UserButton as BetterAuthUserButton } from '@daveyplate/better-auth-ui'

export interface UserButtonProps {
  className?: string
  showName?: boolean
  showEmail?: boolean
  avatarSize?: 'sm' | 'md' | 'lg'
}

export function UserButton({
  className,
  showName = true,
  showEmail = false,
  avatarSize = 'md'
}: UserButtonProps) {
  return (
    <BetterAuthUserButton
      className={className}
      showName={showName}
      showEmail={showEmail}
      avatarSize={avatarSize}
    />
  )
}