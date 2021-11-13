import React from 'react'

import type { Route } from 'react-location'

// pages
const LoginPage = React.lazy(() => import('../../pages/login'))

const routes: Route<any>[] = [
  { path: '/', element: <div>Home</div> },
  {
    path: 'login',
    element: <LoginPage />,
  },
]

export default routes
