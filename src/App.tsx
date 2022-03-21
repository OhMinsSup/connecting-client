import React, { useMemo } from 'react'

// provider
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'

// compoentns
import Masks from './components/ui/Masks'

// hooks
import { useProfileQuery } from './atoms/authState'
import { useIsomorphicLayoutEffect } from 'react-use'
import { useThemeActionHook } from './atoms/settingState'

// pages
const HomePage = React.lazy(() => import('./pages/home'))
const LoginPage = React.lazy(() => import('./pages/login'))
const SignupPage = React.lazy(() => import('./pages/signup'))
const ResetPasswordPage = React.lazy(() => import('./pages/reset-password'))
const ChangePasswordPage = React.lazy(() => import('./pages/change-password'))

// import HomePage from './pages/home'
// import LoginPage from './pages/login'
// import SignupPage from './pages/signup'
// import ResetPasswordPage from './pages/reset-password'
// import ChangePasswordPage from './pages/change-password'

// atoms - constants
import { FONTS, MONOSPACE_FONTS } from './atoms/constants/setting'
import { GlobalTheme } from './atoms/utils'
import { recoilInitializer } from './atoms/recoilInitializer'
import Preloader from './components/ui/Preloader'

const Core: React.FC = ({ children }) => {
  useProfileQuery()

  return <>{children}</>
}

const InjectStyles: React.FC = ({ children }) => {
  const { computeVariables, getFont, getMonospaceFont, getLigatures, getCSS } = useThemeActionHook()

  // document element값이 변경되는 경우는 없으니깐, memo 적용
  const rootStyle = useMemo(() => document.documentElement.style, [])

  useIsomorphicLayoutEffect(() => {
    const font = getFont()
    rootStyle.setProperty('--font', `"${font}"`)
    // @ts-ignore
    FONTS[font].load()
  }, [rootStyle, getFont()])

  useIsomorphicLayoutEffect(() => {
    const font = getMonospaceFont()
    rootStyle.setProperty('--monospace-font', `"${font}"`)
    // @ts-ignore
    MONOSPACE_FONTS[font].load()
  }, [rootStyle, getMonospaceFont()])

  useIsomorphicLayoutEffect(() => {
    rootStyle.setProperty('--ligatures', getLigatures())
  }, [rootStyle, getLigatures()])

  useIsomorphicLayoutEffect(() => {
    const resize = () => rootStyle.setProperty('--app-height', `${window.innerHeight}px`)
    resize()

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [rootStyle])

  const variables = computeVariables()

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={variables?.['background']} />
      </Helmet>
      {variables && <GlobalTheme theme={variables} />}
      <style dangerouslySetInnerHTML={{ __html: getCSS() ?? '' }} />
      {children}
    </>
  )
}

const Provider: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RecoilRoot initializeState={recoilInitializer}>
          <Masks />
          <InjectStyles>{children}</InjectStyles>
          <Core />
        </RecoilRoot>
      </BrowserRouter>
    </HelmetProvider>
  )
}

const App: React.FC = () => {
  return (
    <Provider>
      <Routes>
        <Route
          element={
            <React.Suspense fallback={<Preloader type="spinner" />}>
              <HomePage />
            </React.Suspense>
          }
        >
          <Route path="/" element={<div>Home</div>} />
        </Route>
        <Route
          path="login"
          element={
            <React.Suspense fallback={<Preloader type="spinner" />}>
              <LoginPage />
            </React.Suspense>
          }
        />
        <Route
          path="signup"
          element={
            <React.Suspense fallback={<Preloader type="spinner" />}>
              <SignupPage />
            </React.Suspense>
          }
        />
        <Route
          path="reset-password"
          element={
            <React.Suspense fallback={<Preloader type="spinner" />}>
              <ResetPasswordPage />
            </React.Suspense>
          }
        />
        <Route
          path="change-password"
          element={
            <React.Suspense fallback={<Preloader type="spinner" />}>
              <ChangePasswordPage />
            </React.Suspense>
          }
        />
      </Routes>
    </Provider>
  )
}

export default App
