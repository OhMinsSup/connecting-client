import type { ChannelSchema, ProfileSchema, StatusSchema, UserSchema } from './model'

export interface ChannelListSchema extends Pick<ChannelSchema, 'name' | 'idx' | 'description' | 'channelType'> {
  owner: Pick<UserSchema, 'idx' | 'email'> &
    Omit<ProfileSchema, 'fk_user_idx' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'idx'> &
    Omit<StatusSchema, 'fk_user_idx' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'idx'>
  memberCount: number
}
