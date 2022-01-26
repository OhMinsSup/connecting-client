import React, { useMemo } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'

// compoentns
import Masks from './components/ui/Masks'

// hooks
import { useProfileQuery } from './atoms/authState'
import { useIsomorphicLayoutEffect } from 'react-use'
import { useThemeActionHook, useThemeValueHook } from './atoms/settingState'

// pages
import HomePage from './pages/home'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import ResetPasswordPage from './pages/reset-password'
import ChangePasswordPage from './pages/change-password'

// atoms - constants
import { FONTS, MONOSPACE_FONTS } from './atoms/constants/setting'
import { GlobalTheme } from './atoms/utils'

const Core: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { profile } = useProfileQuery()

  console.log(`%c🐳 [Core - profile]:`, 'color: #66aee9;', profile)

  return <>{children}</>
}

const Hydrate: React.FC = ({ children }) => {
  const { getFont, getMonospaceFont, getLigatures, getCSS } = useThemeValueHook()
  const { computeVariables } = useThemeActionHook()

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
  console.log(`%c🐳 [Hydrate - hydrateState]:`, 'color: #0ef19a;', variables)

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
        <RecoilRoot>
          <Masks />
          <Hydrate>
            <Core>{children}</Core>
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
