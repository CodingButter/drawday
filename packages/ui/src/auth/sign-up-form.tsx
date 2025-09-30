import React from 'react'
import { SignUp } from '@daveyplate/better-auth-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'

export interface SignUpFormProps {
  redirectTo?: string
  callbackUrl?: string
  className?: string
  showTerms?: boolean
  termsUrl?: string
  privacyUrl?: string
  providers?: string[]
}

export function SignUpForm({
  redirectTo = "/dashboard",
  callbackUrl,
  className,
  showTerms = true,
  termsUrl = "/terms",
  privacyUrl = "/privacy",
  providers = ["google", "github"]
}: SignUpFormProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up for a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUp
          redirectTo={redirectTo}
          callbackUrl={callbackUrl}
          showTerms={showTerms}
          termsUrl={termsUrl}
          privacyUrl={privacyUrl}
          providers={providers}
        />
      </CardContent>
    </Card>
  )
}