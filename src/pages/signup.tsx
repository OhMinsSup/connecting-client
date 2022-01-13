import React from 'react'
import { AuthLayout } from '../components/auth/ui'
import SignupForm from '../components/auth/SignupForm'

const SignupPage: React.FC = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  )
}

export default SignupPage
