// Online = 'online', // 온라인
// Idle = 'idle', // 게으른
// Busy = 'busy', // 바쁨
// Invisible = 'invisible', // 보이지 않는 상태
export type PresenceStatusType = 'online' | 'offline' | 'busy' | 'invisible'

// 'enabled', // 0: 계정 사용 가능
// 'suspended', //  1: 계정이 정지됨
// 'deleted', // 2: 계정이 삭제됨
// 'banned', // 4: 계정이 차단됨
export type UserFlagsType = 'enabled' | 'suspended' | 'deleted' | 'banned'

export type ChannelType = 'group' | 'direct' | 'text' | 'savedMessages'

interface BaseSchema {
  idx: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ChannelSchema extends BaseSchema {
  name: string
  description: string | null
  channelType: ChannelType
  fk_workspace_idx: number | null
  fk_owner_idx: number | null
  members?: UserSchema[]
  owner?: UserSchema
  workspaces?: WorkspaceSchema[]
  channelMembers?: any[]
}

export interface WorkspaceSchema extends BaseSchema {
  name: string
  code: string
  isMyWorkspace: boolean
  description: string | null
  imageUrl: string | null
  backgroundImageUrl: string | null
  fk_owner_idx: number
  owner?: UserSchema
  members?: UserSchema[]
  workspaceMembers?: any[]
  channels?: ChannelSchema[]
  dms?: any[]
}

export interface UserSchema extends BaseSchema {
  email: string
  profile: ProfileSchema
  status: StatusSchema
  workspaceMembers?: any[]
  channelMembers?: any[]
  ownedWorkspaces?: WorkspaceSchema[]
  ownedChannels?: ChannelSchema[]
  workspaces?: WorkspaceSchema[]
  channels?: ChannelSchema[]
  dmSenders?: any[]
  dmReceivers?: any[]
}

export interface ProfileSchema extends BaseSchema {
  nickname: string
  avatarSvg: string
  profileUrl: string | null
  defaultProfile: boolean
  backgroundUrl: string | null
  fk_user_idx: number
}

export interface StatusSchema extends BaseSchema {
  text: string
  flags: UserFlagsType
  presence: PresenceStatusType
  fk_user_idx: number
}

export interface MeSchema extends Pick<UserSchema, 'idx' | 'email'> {
  profile: Omit<ProfileSchema, 'fk_user_idx' | 'updatedAt' | 'createdAt' | 'idx'>
  status: Omit<StatusSchema, 'fk_user_idx' | 'updatedAt' | 'createdAt' | 'idx'>
  myWorkspaces: Array<Pick<WorkspaceSchema, 'idx' | 'name'>>
}
