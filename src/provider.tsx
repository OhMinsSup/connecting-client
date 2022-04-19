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

interface CoreProps {}
const Core: React.FC<React.PropsWithChildren<CoreProps>> = ({ children }) => {
  const { profile } = useProfileQuery()

  const Component = React.Children.map(children, (child) => {
    return React.cloneElement(child as React.ReactElement, {
      profile,
    })
  })

  return <>{Component}</>
}

interface ProviderProps {}
const Provider: React.FC<React.PropsWithChildren<ProviderProps>> = ({ children }) => {
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
