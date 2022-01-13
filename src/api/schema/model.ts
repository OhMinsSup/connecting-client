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
  presence: string
  createdAt: string
  updatedAt: string
  fk_user_idx: number
}
