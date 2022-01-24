import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'

import Masks from './components/ui/Masks'

// context
import { ThemeProvider } from './context'
import { hydrateState } from './libs/state'

// atoms
import { useProfileQuery } from './atoms/authState'
import { useIsomorphicLayoutEffect } from 'react-use'

import HomePage from './pages/home'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import ResetPasswordPage from './pages/reset-password'
import ChangePasswordPage from './pages/change-password'

const Core: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { profile } = useProfileQuery()

  console.log(`%c🐳 [Core - profile]:`, 'color: #66aee9;', profile)

  return <>{children}</>
}

const Hydrate: React.FC = ({ children }) => {
  const [ready, setReady] = useState(false)

  useIsomorphicLayoutEffect(() => {
    hydrateState().then(() => setReady(true))
  }, [])

  console.log(`%c🐳 [Hydrate - hydrateState]:`, 'color: #0ef19a;', ready)

  return <>{children}</>
}

const Provider: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RecoilRoot>
          <Masks />
          <Hydrate>
            <Core>{children}</Core>
            <ThemeProvider />
          </Hydrate>
        </RecoilRoot>
      </BrowserRouter>
    </HelmetProvider>
  )
}

const App: React.FC = () => {
  return (
    <Provider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Routes>
    </Provider>
  )
}

export default App
