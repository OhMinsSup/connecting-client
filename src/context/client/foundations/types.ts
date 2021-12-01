export enum ClientStatus {
  INIT,
  LOADING,
  READY,
  OFFLINE,
  DISCONNECTED,
  CONNECTING,
  RECONNECTING,
  ONLINE,
}

export type Client = {
  status: ClientStatus
}

export enum Action {
  SET_CLIENT_STATUS = 'SET_CLIENT_STATUS',
}

export type ActionType = {
  type: Action.SET_CLIENT_STATUS
  payload: ClientStatus
}
