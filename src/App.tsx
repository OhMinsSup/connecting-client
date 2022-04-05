import React from 'react'

// provider
import { Route, Routes } from 'react-router-dom'

// pages
const HomePage = React.lazy(() => import('./pages/home'))
const LoginPage = React.lazy(() => import('./pages/login'))
const SignupPage = React.lazy(() => import('./pages/signup'))
const ResetPasswordPage = React.lazy(() => import('./pages/reset-password'))
const ChangePasswordPage = React.lazy(() => import('./pages/change-password'))

// modal
import ChannelAddModal from './components/modal/ChannelAddModal'
import WorkspaceAddModal from './components/modal/WorkspaceAddModal'

// sidebar
const Sidebar = React.lazy(() => import('./components/ui/Sidebar/Sidebar'))

// components
import Preloader from './components/ui/Preloader'

// types
import type { MeSchema } from './api/schema/model'

interface AppProps {
  profile?: MeSchema
}

const App: React.FC<AppProps> = (props) => {
  if (!props.profile) {
    return <PublicRoutes />
  }
  return <PrivateRoutes profile={props.profile} />
}

export default App

const PrivateRoutes: React.FC<Required<AppProps>> = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <React.Suspense fallback={<Preloader type="spinner" />}>
              <Sidebar />
            </React.Suspense>
          }
        >
          <Route
            index
            element={
              <React.Suspense fallback={<React.Fragment />}>
                <HomePage />
              </React.Suspense>
            }
          />
          <Route path="settings" element={<React.Suspense fallback={<React.Fragment />}>Settings</React.Suspense>} />
        </Route>
      </Routes>
      <WorkspaceAddModal />
      <ChannelAddModal />
    </>
  )
}

const PublicRoutes = () => {
  return (
    <Routes>
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
  )
}
