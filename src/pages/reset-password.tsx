import React from 'react'
import EmailForm from '../components/auth/EmailForm'
import Layout from '../components/auth/Layout'

const ResetPasswordPage = () => {
  return (
    <Layout>
      <EmailForm isReset />
    </Layout>
  )
}

export default ResetPasswordPage
