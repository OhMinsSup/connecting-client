import React from 'react'

// hooks
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfileQuery } from '../../../../atoms/authState'

// components
import ConditionalLink from '../../Link/ConditionalLink'
import WorkspaceEntry from '../styles/WorkspaceEntry'
import Swoosh from './Swoosh'
import Icon from './Icon'
import UserIcon from '../../User/UserIcon'
import UserHover from '../../User/UserHover'

import type { WorkspaceSchema } from '../../../../api/schema/model'

interface MyWorkspaceLinkProps {
  item: Pick<WorkspaceSchema, 'idx' | 'name'>
}

const MyWorksapceLink: React.FC<MyWorkspaceLinkProps> = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const homeActive = !pathname.startsWith('/invite')
  const { profile } = useProfileQuery()

  return (
    <ConditionalLink active={homeActive} to={'/'}>
      <WorkspaceEntry home active={homeActive}>
        <Swoosh />
        <div onClick={() => homeActive && navigate('/settings')}>
          <UserHover>
            <Icon size={42} unread={undefined} count={0}>
              <UserIcon target={profile ?? undefined} size={32} status hover />
            </Icon>
          </UserHover>
        </div>
      </WorkspaceEntry>
    </ConditionalLink>
  )
}

export default MyWorksapceLink
