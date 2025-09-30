import React from 'react'
import { ForgotPassword } from '@daveyplate/better-auth-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'

export interface ForgotPasswordFormProps {
  redirectTo?: string
  className?: string
}

export function ForgotPasswordForm({
  redirectTo = "/sign-in",
  className
}: ForgotPasswordFormProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPassword redirectTo={redirectTo} />
      </CardContent>
    </Card>
  )
}