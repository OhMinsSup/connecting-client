import { atom, useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'

export interface ClientState {}

export const clientState = atom<ClientState>({
  key: 'clientState',
  default: {},
})

// useClientState auth에 상태값 변경 및 가져오는 함수
export function useClientState() {
  return useRecoilState(clientState)
}

// useClientResetState auth에 상태값 초기화 함수
export function useClientResetState() {
  return useResetRecoilState(clientState)
}

// useClientSetState auth에 상태값 변경 함수
export function useClientSetState() {
  return useSetRecoilState(clientState)
}
