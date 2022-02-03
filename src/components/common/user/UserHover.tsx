import React from 'react'
import styled from 'styled-components'
import Tooltip from '../../ui/Tooltip'

// import type { UserSchema } from '../../../api/schema/model'

interface UserHoverProps {
  //   user?: UserSchema
}

const UserHover: React.FC<UserHoverProps> = ({ children }) => {
  return (
    <Tooltip
      placement="right-end"
      content={
        <Base>
          {/* <Username className="username" user={user} /> */}
          Username
          <span className="status">
            hoverTestigo
            {/* <UserStatus user={user} /> */}
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
