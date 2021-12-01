import React, { useReducer, useMemo } from 'react'
import { createContext } from '../../libs/react-utils'
import { PRESETS } from './foundations/client'
import { Action } from './foundations/types'

import type { Client, ActionType, ClientStatus } from './foundations/types'

interface ClientContext extends Client {
  dispatch: React.Dispatch<ActionType>
  setClientStatus: (status: ClientStatus) => void
}

const initialState = PRESETS

const [Provider, useClientContext] = createContext<ClientContext>({
  name: 'useClientContext',
  errorMessage: 'useClientContext: `context` is undefined.',
  defaultValue: initialState,
})

interface ClientProps {
  children: React.ReactNode
}

function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Action.SET_CLIENT_STATUS:
      return {
        ...state,
        status: action.payload,
      }
    default:
      return state
  }
}

function ClientProvider({ children }: ClientProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setClientStatus = (status: ClientStatus) => {
    dispatch({
      type: Action.SET_CLIENT_STATUS,
      payload: status,
    })
  }

  const actions = useMemo(
    () => ({
      ...state,
      setClientStatus,
      dispatch,
    }),
    [state],
  )

  return <Provider value={actions}>{children}</Provider>
}

export { ClientProvider, useClientContext }
