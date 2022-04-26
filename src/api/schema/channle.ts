import type { ChannelSchema, ProfileSchema, StatusSchema, UserSchema } from './model'

export interface ChannelListSchema extends Pick<ChannelSchema, 'name' | 'idx' | 'description' | 'channelType' | 'fk_workspace_idx'> {
  owner: Pick<UserSchema, 'idx' | 'email'> & {
    profile: Omit<ProfileSchema, 'fk_user_idx' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'idx'>
    status: Omit<StatusSchema, 'fk_user_idx' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'idx'>
  }
  memberCount: number
}
