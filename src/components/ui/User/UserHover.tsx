import React from 'react'
import styled from 'styled-components'

import Tooltip from '../Tooltip'
import UserStatus from './UserStatus'
import UserShort from './UserShort'

// hooks
import { useProfileQuery } from '../../../atoms/authState'

const UserHover: React.FC = ({ children }) => {
  const { profile } = useProfileQuery()

  return (
    <Tooltip
      placement="right-end"
      content={
        <Base>
          <UserShort className="username" user={profile} />
          <span className="status">
            <UserStatus user={profile} />
          </span>
        </Base>
      }
    >
      {children}
    </Tooltip>
  )
}

export default UserHover

const Base = styled.div`
  display: flex;
  flex-direction: column;

  .username {
    font-size: 13px;
    font-weight: 600;
  }

  .status {
    font-size: 11px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tip {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
    color: var(--secondary-foreground);
  }
`
