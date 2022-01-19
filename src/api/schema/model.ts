export interface UserSchema {
  idx: number
  email: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  profile: ProfileSchema
  status: StatusSchema
}

export interface ProfileSchema {
  idx: number
  nickname: string
  avatarSvg: string
  profileUrl: string | null
  defaultProfile: boolean
  backgroundUrl: string | null
  createdAt: string
  updatedAt: string
  fk_user_idx: number
}

export interface StatusSchema {
  idx: number
  presence: PresenceStatusType
  createdAt: string
  updatedAt: string
  fk_user_idx: number
}

// Online = 'online', // 온라인
// Idle = 'idle', // 게으른
// Busy = 'busy', // 바쁨
// Invisible = 'invisible', // 보이지 않는 상태
export type PresenceStatusType = 'online' | 'offline' | 'busy' | 'invisible'
