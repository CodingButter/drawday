import React from 'react'
import { SignIn } from '@daveyplate/better-auth-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'

export interface SignInFormProps {
  redirectTo?: string
  callbackUrl?: string
  className?: string
  showRememberMe?: boolean
  showForgotPassword?: boolean
  providers?: string[]
}

export function SignInForm({
  redirectTo = "/dashboard",
  callbackUrl,
  className,
  showRememberMe = true,
  showForgotPassword = true,
  providers = ["google", "github"]
}: SignInFormProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignIn
          redirectTo={redirectTo}
          callbackUrl={callbackUrl}
          showRememberMe={showRememberMe}
          showForgotPassword={showForgotPassword}
          providers={providers}
        />
      </CardContent>
    </Card>
  )
}