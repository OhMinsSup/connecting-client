import { atom, useRecoilState, useResetRecoilState } from 'recoil'
import { QueueStatus } from './constants/queue'
import type { QueuedMessageState, QueuedMessageData } from './type/queue'

export const queueState = atom<QueuedMessageState[]>({
  key: 'queueState',
  default: [],
})

// useQueueState queue에 상태값 변경 및 가져오는 함수
export function useQueueState() {
  return useRecoilState(queueState)
}

// useResetQueueState queue에 상태값 변경 및 가져오는 함수
export const useQueueStateAction = () => {
  const [queued, setQueued] = useQueueState()

  // reset queue
  const resetQueue = useResetRecoilState(queueState)

  // 새로운 메시지 추가
  const addQueue = (queue: { nonce: number; channel: string; message: QueuedMessageData }) => {
    setQueued((prev) => {
      return [
        ...prev.filter((x) => x.id !== queue.nonce),
        {
          id: queue.nonce,
          data: queue.message,
          channel: queue.channel,
          status: QueueStatus.SENDING,
        },
      ]
    })
  }

  const startQueue = (nonce: number) => {
    setQueued((prev) => {
      const entry = prev.find((x) => x.id === nonce)
      return [...prev.filter((x) => x.id !== nonce), ...(entry ? [{ ...entry, status: QueueStatus.SENDING }] : [])]
    })
  }

  const failQueue = (nonce: number, error?: string) => {
    setQueued((prev) => {
      const entry = prev.find((x) => x.id === nonce)
      return [...prev.filter((x) => x.id !== nonce), ...(entry ? [{ ...entry, status: QueueStatus.ERRORED, error }] : [])]
    })
  }

  const failQueueAll = (error?: string) => {
    setQueued((prev) => {
      return [...prev.filter((x) => x.status !== QueueStatus.SENDING), ...prev.map((x) => ({ ...x, status: QueueStatus.ERRORED, error }))]
    })
  }

  const removeQueue = (nonce: number) => {
    setQueued((prev) => {
      return [...prev.filter((x) => x.id !== nonce)]
    })
  }

  return {
    queued,
    startQueue,
    addQueue,
    removeQueue,
    failQueue,
    failQueueAll,
    resetQueue,
  }
}
