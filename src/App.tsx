import React, { Suspense } from 'react'
import { Router } from 'react-location'
import { HelmetProvider } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'

import Masks from './components/ui/Masks'

// components
import Preloader from './components/ui/Preloader'

// routes
import location from './libs/routes/location'
import routes from './libs/routes/routes'

// context
import { ThemeProvider } from './context'

// atoms
import { useProfileQuery } from './atoms/authState'

const Core: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useProfileQuery()

  return <>{children}</>
}

const WrappedProvider: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <RecoilRoot>
        <ThemeProvider>
          <Masks />
          <Core>{children}</Core>
        </ThemeProvider>
      </RecoilRoot>
    </HelmetProvider>
  )
}

const App: React.FC = () => {
  return (
    <WrappedProvider>
      <Suspense fallback={<Preloader type="spinner" />}>
        <Router location={location} routes={routes} defaultPendingElement={<Preloader type="spinner" />} />
      </Suspense>
    </WrappedProvider>
  )
}

export default App
