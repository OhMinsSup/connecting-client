import React, { useRef } from 'react'
import styled from 'styled-components'
import { MessageAreaWidthProvider } from '../../context/message-area-width/context'
import { useResizeObserver } from '../../hooks/useResizeObserver'

import type { ScrollState } from '../../libs/state/renderer/types'

const MessageArea = () => {
  const ref = useRef<HTMLDivElement>(null)
  const size = useResizeObserver(ref)

  // ? useRef to avoid re-renders
  const scrollState = useRef<ScrollState>({ type: 'Free' })
  console.log('state', scrollState)

  return (
    <MessageAreaWidthProvider width={size?.width}>
      <Block ref={ref}>
        <div>
          {/* {renderer.state === 'LOADING' && <Preloader type="ring" />}
          {renderer.state === 'WAITING_FOR_NETWORK' && (
            <RequiresOnline>
              <Preloader type="ring" />
            </RequiresOnline>
          )}
          {renderer.state === 'RENDER' && <MessageRenderer last_id={last_id} renderer={renderer} highlight={highlight} />}
          {renderer.state === 'EMPTY' && <ConversationStart channel={channel} />} */}
        </div>
      </Block>
    </MessageAreaWidthProvider>
  )
}

export default MessageArea

const Block = styled.div.attrs({ 'data-scroll-offset': 'with-padding' })`
  height: 100%;
  flex-grow: 1;
  min-height: 0;
  word-break: break-word;

  overflow-x: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar-thumb {
    min-height: 150px;
  }

  > div {
    display: flex;
    min-height: 100%;
    padding-bottom: 26px;
    flex-direction: column;
    justify-content: flex-end;
  }
`
