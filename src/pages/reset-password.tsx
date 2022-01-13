import React from 'react'
import EmailForm from '../components/auth/EmailForm'
import { AuthLayout } from '../components/auth/ui'

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <EmailForm isReset />
    </AuthLayout>
  )
}

export default ResetPasswordPage
