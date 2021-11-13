import React, { Suspense } from 'react'
import { Router } from 'react-location'
import { HelmetProvider } from 'react-helmet-async'

import Masks from './components/ui/Masks'

// components
import Preloader from './components/ui/Preloader'

// routes
import location from './libs/routes/location'
import routes from './libs/routes/routes'

const App = () => {
  return (
    <HelmetProvider>
      <Masks />
      <Suspense fallback={<Preloader type="spinner" />}>
        <Router location={location} routes={routes} defaultPendingElement={<Preloader type="spinner" />} />
      </Suspense>
    </HelmetProvider>
  )
}

export default App
