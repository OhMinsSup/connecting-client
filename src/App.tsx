import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'

import Masks from './components/ui/Masks'

// context
import { ThemeProvider } from './context'

// atoms
import { useProfileQuery } from './atoms/authState'

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

const WrappedProvider: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <RecoilRoot>
            <Masks />
            <Core>{children}</Core>
          </RecoilRoot>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}

const App: React.FC = () => {
  return (
    <WrappedProvider>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              메인
              <Link to="/login">로그인</Link>
            </div>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Routes>
    </WrappedProvider>
  )
}

export default App
