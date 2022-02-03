import type { QueueStatus } from '../constants/queue'

export interface Reply {
  id: number
  mention: boolean
}

export interface QueuedMessageData {
  id: number
  author: string
  channel: string

  content: string
  replies: Reply[]
}

export interface QueuedMessageState {
  id: number
  channel: string
  data: QueuedMessageData
  status: QueueStatus
  error?: string
}
