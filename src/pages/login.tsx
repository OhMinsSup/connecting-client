import React from 'react'
import LoginForm from '../components/auth/LoginForm'
import { AuthLayout } from '../components/auth/common'

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
