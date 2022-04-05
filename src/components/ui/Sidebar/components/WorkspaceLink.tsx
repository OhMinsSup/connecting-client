import React from 'react'

// hooks
import { useParams } from 'react-router-dom'

// components
import { WorkspaceIcon } from '../../Icon'
import ConditionalLink from '../../ConditionalLink'
import Tooltip from '../../Tooltip'
import WorkspaceEntry from '../styles/WorkspaceEntry'
import Icon from './Icon'
import Swoosh from './Swoosh'

// types
import type { WorkspaceSchema } from '../../../../api/schema/model'

interface WorkspaceLinkProps {
  item: WorkspaceSchema
}

const WorkspaceLink: React.FC<WorkspaceLinkProps> = ({ item }) => {
  const params = useParams<{ workspaceId?: string }>()
  const active = item.idx === Number(params.workspaceId)

  const isUnread = false
  const mentionCount = 0

  return (
    <ConditionalLink key={item.idx} active={active} to={'/'}>
      <WorkspaceEntry active={active}>
        <Swoosh />
        <Tooltip content={item.name} placement="right">
          <Icon size={42} unread={mentionCount > 0 ? 'mention' : isUnread ? 'unread' : undefined} count={mentionCount}>
            <WorkspaceIcon size={32} target={item} />
          </Icon>
        </Tooltip>
      </WorkspaceEntry>
    </ConditionalLink>
  )
}

export default WorkspaceLink
