import create from 'zustand'
import shallow from 'zustand/shallow'

import type { GetState, SetState, StateSelector } from 'zustand'

const actionNames = [] as const
export type ActionNames = typeof actionNames[number]

type Getter = GetState<IState>
export type Setter = SetState<IState>

export interface IState {
  actions: Record<ActionNames, () => void>
  get: Getter
  set: Setter

  // themes
  themes: any
  // theme
}

const useStoreImpl = create<IState>((set: SetState<IState>, get: GetState<IState>) => {
  const actions = {}
  return {
    actions,
    get,
    set,
    themes: {},
  }
})

// interface Mutation {}

// export const mutation: Mutation = {}

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

export { getState, setState, useStore }
