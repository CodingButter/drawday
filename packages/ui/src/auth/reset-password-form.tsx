import React from 'react'
import { ResetPassword } from '@daveyplate/better-auth-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'

export interface ResetPasswordFormProps {
  redirectTo?: string
  className?: string
}

export function ResetPasswordForm({
  redirectTo = "/sign-in",
  className
}: ResetPasswordFormProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create New Password</CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPassword redirectTo={redirectTo} />
      </CardContent>
    </Card>
  )
}