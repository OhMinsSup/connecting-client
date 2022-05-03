import React, { useReducer, useMemo } from 'react'

import { createContext } from '../../libs/react-utils'

export const MESSAGE_AREA_PADDING = 82

export enum Action {
  SET_WIDTH = 'SET_WIDTH',
}

export type SetWidthAction = {
  type: Action.SET_WIDTH
  payload: number
}

export type ActionType = SetWidthAction

interface MessageAreaWidthState {
  width: number
}

interface MessageAreaWidthContext extends MessageAreaWidthState {
  dispatch: React.Dispatch<ActionType>
}

const initialState: MessageAreaWidthState = {
  width: 0,
}

const [Provider, useMessageAreaWidthContext] = createContext<MessageAreaWidthContext>({
  name: 'useMessageAreaWidthContext',
  errorMessage: 'useMessageAreaWidthContext: `context` is undefined.',
  defaultValue: initialState,
})

interface MessageAreaWidthProps {
  width?: number
  children: React.ReactNode
}

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case Action.SET_WIDTH:
      return {
        ...state,
        width: action.payload,
      }
    default:
      return state
  }
}

function MessageAreaWidthProvider({ children, width }: MessageAreaWidthProps) {
  const safeWidth = width ?? 0
  const [state, dispatch] = useReducer(reducer, {
    width: safeWidth - MESSAGE_AREA_PADDING,
  })

  const setWidth = (width: number) => {
    dispatch({
      type: Action.SET_WIDTH,
      payload: width,
    })
  }

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
      setWidth,
    }),
    [state],
  )

  return <Provider value={actions}>{children}</Provider>
}

export { MessageAreaWidthProvider, useMessageAreaWidthContext }
