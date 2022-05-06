import React from 'react'
import styled, { css } from 'styled-components'

// component
import TextAreaAutoSize from '../ui/Form/TextAreaAutoSize'
import IconButton from '../ui/Icon/IconButton'
import FilePreview from '../messages/FilePreview'
import FileUploads from '../ui/Form/FileUploads'

// uitls
import { isTouchscreenDevice } from '../../libs/utils/utils'

// hooks
import useAutoComplete from '../../hooks/useAutoComplete'

// icons
import { Send } from '@styled-icons/boxicons-solid'

// types
import type { ChannelSchema } from '../../api/schema/model'

interface MessageBoxProps {
  channel: ChannelSchema
}

const MessageBox: React.FC<MessageBoxProps> = ({ channel }) => {
  const setMessage = (e: any) => {
    console.log('log', e)
  }

  const { onChange } = useAutoComplete(setMessage, {
    users: { type: 'channel', idx: channel.idx },
    channels: channel.channelType === 'text' ? { workspace: channel.fk_workspace_idx } : undefined,
  })

  return (
    <>
      <FilePreview />
      <Block>
        <FileAction>
          <FileUploads
            size={24}
            behaviour="multi"
            style="attachment"
            fileType="attachments"
            maxFileSize={20_000_000}
            attached={false}
            uploading={false}
            remove={() => Promise.resolve()}
            onChange={() => console.log()}
            cancel={() => console.log()}
            append={() => console.log()}
          />
        </FileAction>
        <TextAreaAutoSize
          autoFocus
          hideBorder
          maxRows={20}
          id="message"
          padding="var(--message-box-padding)"
          value=""
          placeholder={'메모에 저장됩니다'}
          // onKeyUp={onKeyUp}
          // value={state.draft.get(channel._id) ?? ''}
          // onKeyDown={(e) => {
          //   if (e.ctrlKey && e.key === 'Enter') {
          //     e.preventDefault()
          //     return send()
          //   }

          //   if (onKeyDown(e)) return

          //   if (e.key === 'ArrowUp' && !state.draft.has(channel._id)) {
          //     e.preventDefault()
          //     internalEmit('MessageRenderer', 'edit_last')
          //     return
          //   }

          //   if (!e.shiftKey && !e.isComposing && e.key === 'Enter' && !isTouchscreenDevice) {
          //     e.preventDefault()
          //     return send()
          //   }

          //   if (e.key === 'Escape') {
          //     if (replies.length > 0) {
          //       setReplies(replies.slice(0, -1))
          //     } else if (uploadState.type === 'attached' && uploadState.files.length > 0) {
          //       setUploadState({
          //         type: uploadState.files.length > 1 ? 'attached' : 'none',
          //         files: uploadState.files.slice(0, -1),
          //       })
          //     }
          //   }

          //   debouncedStopTyping(true)
          // }}
          // placeholder={
          //   channel.channel_type === 'DirectMessage'
          //     ? translate('app.main.channel.message_who', {
          //         person: channel.recipient?.username,
          //       })
          //     : channel.channel_type === 'SavedMessages'
          //     ? translate('app.main.channel.message_saved')
          //     : translate('app.main.channel.message_where', {
          //         channel_name: channel.name ?? undefined,
          //       })
          // }
          // disabled={uploadState.type === 'uploading' || uploadState.type === 'sending'}
          onChange={(e) => {
            setMessage(e.currentTarget.value)
            // startTyping()
            onChange(e)
          }}
          // onFocus={onFocus}
          // onBlur={onBlur}
        />
        <Action>
          <IconButton className="mobile" onClick={() => console.log('replay')} onMouseDown={(e) => e.preventDefault()}>
            <Send size={20} />
          </IconButton>
        </Action>
      </Block>
    </>
  )
}

export default MessageBox

const Block = styled.div`
  z-index: 1;
  display: flex;
  align-items: flex-start;
  background: var(--message-box);

  textarea {
    font-size: var(--text-size);
    background: transparent;

    &::placeholder {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`

// const Blocked = styled.div`
//   display: flex;
//   align-items: center;
//   user-select: none;
//   font-size: var(--text-size);
//   color: var(--tertiary-foreground);
//   flex-grow: 1;
//   cursor: not-allowed;

//   .text {
//     padding: var(--message-box-padding);
//   }

//   > div > div {
//     cursor: default;
//   }

//   svg {
//     flex-shrink: 0;
//   }
// `

const Action = styled.div`
  > div {
    height: 48px;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    /*padding: 14px 0 14px 14px;*/
  }

  .mobile {
    width: 62px;
  }

  ${() =>
    !isTouchscreenDevice &&
    css`
      .mobile {
        display: none;
      }
    `}
`

const FileAction = styled.div`
    > div {
        height: 48px;
        width: 62px;
        display: flex;
        align-items: center;
        justify-content: center;
`
