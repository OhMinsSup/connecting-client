import React, { useState } from 'react'
import styled from 'styled-components'

// compoenents
import Button from '../Form/Button'
import Checkbox from '../Form/Checkbox'

// hooks
import { useNavigate } from 'react-router-dom'
import { SECTION_NSFW, useLayoutActionHook } from '../../../atoms/layoutState'

// types
import type { ChannelSchema } from '../../../api/schema/model'

interface AgeGateProps {
  gated: boolean
  type: 'channel'
  channel: ChannelSchema
}

const AgeGate: React.FC<React.PropsWithChildren<AgeGateProps>> = (props) => {
  const navigate = useNavigate()
  const { getSectionState, toggleSectionState } = useLayoutActionHook()
  const [ageGate, setAgeGate] = useState(false)

  if (ageGate || !props.gated) {
    return <>{props.children}</>
  }

  if (!(props.channel.channelType === 'group' || props.channel.channelType === 'text')) return <>{props.children}</>

  return (
    <Base>
      <img loading="eager" src={'https://static.revolt.chat/emoji/mutant/26a0.svg'} draggable={false} />
      <h2>{props.channel.name}</h2>
      <span className="subtext">이 채널은 NSFW로 표시됩니다.</span>

      <Checkbox checked={getSectionState(SECTION_NSFW, false)} onChange={() => toggleSectionState(SECTION_NSFW, false)}>
        자신이 18세 이상임을 확인합니다.
      </Checkbox>
      <div className="actions">
        <Button contrast onClick={() => navigate(-1)}>
          뒤로 가기
        </Button>
        <Button contrast onClick={() => getSectionState(SECTION_NSFW) && setAgeGate(true)}>
          채널 입장
        </Button>
      </div>
    </Base>
  )
}

export default AgeGate

const Base = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: 12px;

  img {
    height: 150px;
  }

  .subtext {
    color: var(--secondary-foreground);
    margin-bottom: 12px;
    font-size: 14px;
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 12px;
  }
`
