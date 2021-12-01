import React from 'react'

import type { Route } from 'react-location'

// pages
const LoginPage = React.lazy(() => import('../../pages/login'))
const SignupPage = React.lazy(() => import('../../pages/signup'))
const HomePage = React.lazy(() => import('../../pages/home'))
const InvitePage = React.lazy(() => import('../../pages/invite'))

const routes: Route<any>[] = [
  { path: '/', element: <HomePage /> },
  {
    path: 'login',
    element: <LoginPage />,
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
