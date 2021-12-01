import React from 'react'
import { useLocation } from 'react-location'
import { AuthLayout } from '../components/auth/common'
import ResendForm from '../components/auth/ResendForm'

const LoginResetPage = () => {
  const { current } = useLocation()
  const { pathname } = current
  const isReset = pathname.includes('reset')

  return (
    <AuthLayout>
      <ResendForm isReset={isReset} />
    </AuthLayout>
  )
}

export default LoginResetPage
