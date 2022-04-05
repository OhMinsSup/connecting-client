import React from 'react'

import { HelmetProvider } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'

// atoms - constants
import { recoilInitializer } from './atoms/recoilInitializer'

// components
import { Masks } from './components/ui/Mask'
import { Styles } from './components/ui/Styles'

// hooks
import { useProfileQuery } from './atoms/authState'

const Core: React.FC = ({ children }) => {
  const { profile } = useProfileQuery()

  const Component = React.Children.map(children, (child) => {
    return React.cloneElement(child as React.ReactElement, {
      profile,
    })
  })

  return <>{Component}</>
}

const Provider: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RecoilRoot initializeState={recoilInitializer}>
          <Masks />
          <Styles>
            <Core>{children}</Core>
          </Styles>
        </RecoilRoot>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default Provider
