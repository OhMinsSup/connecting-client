import React from 'react'

import type { Route } from 'react-location'

// pages
const LoginPage = React.lazy(() => import('../../pages/login'))
const SignupPage = React.lazy(() => import('../../pages/signup'))
const HomePage = React.lazy(() => import('../../pages/home'))
const InvitePage = React.lazy(() => import('../../pages/invite'))
const LoginResetPage = React.lazy(() => import('../../pages/login-reset'))
const LoginResendPage = React.lazy(() => import('../../pages/login-resend'))
const VerifyPage = React.lazy(() => import('../../pages/verify'))

const routes: Route<any>[] = [
  { path: '/', element: <HomePage /> },
  {
    path: 'login',
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: 'reset',
        element: <LoginResetPage />,
        children: [
          {
            path: ':token',
          },
        ],
      },
      {
        path: 'resend',
        element: <LoginResendPage />,
      },
      {
        path: 'verify',
        element: <VerifyPage />,
        children: [
          {
            path: ':token',
          },
        ],
      },
    ],
  },
  {
    path: 'signup',
    element: <SignupPage />,
  },
  {
    path: 'invite',
    children: [
      {
        path: '/', // matches /teams root/index
        element: <InvitePage />,
      },
      {
        path: ':code', // matches /teams/:teamId
      },
    ],
  },
]

export default routes
