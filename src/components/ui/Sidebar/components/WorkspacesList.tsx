import React, { useId } from 'react'
import { Cog } from '@styled-icons/boxicons-solid'
import { Plus } from '@styled-icons/boxicons-regular'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

// compoentns
import IconButton from '../../Icon/IconButton'
import LineDivider from '../../LineDivider'
import Tooltip from '../../Tooltip'
import MyWorksapceLink from './MyWorksapceLink'
import WorkspaceLink from './WorkspaceLink'
import WorkspaceCircle from '../styles/WorkspaceCircle'

// utils
import { isTouchscreenDevice } from '../../../../libs/utils/utils'

// constants
import { MODAL_TYPE } from '../../../../constants'

// hooks
import { useWorkspacesQuery } from '../../../../api/queries/workspace'
import { useProfileQuery } from '../../../../atoms/authState'
import { useUrlState } from '../../../../hooks/useUrlState'

// https://developers.revolt.chat/api/#tag/Relationships
const WorkspacesList = () => {
  const [, setState] = useUrlState(
    {
      modalType: null,
    },
    {
      navigateMode: 'replace',
    },
  )

  const { profile } = useProfileQuery()

  const { workspaces } = useWorkspacesQuery()

  /**
   * @description 워크스페이스 추가 모달 생성 url state로 관리
   * @author veloss
   * @date 2022-02-24
   */
  const onClickAddWorkspace = () => {
    setState({
      modalType: MODAL_TYPE.CREATE_WORKSPACE,
    })
  }

  const id = useId()

  return (
    <Block>
      <ContentList>
        {profile?.myWorkspaces.map((item) => {
          return <MyWorksapceLink item={item} key={`my-workspace-item-${id}`} />
        })}
        {/* channles */}
        <LineDivider />
        {/* servers */}
        {workspaces.map((item) => {
          return <WorkspaceLink item={item} key={`workspace-item-${id}`} />
        })}
        <WorkspaceCircle>
          <Tooltip content="워크스페이스 추가" placement="right">
            <div className="circle">
              <IconButton onClick={onClickAddWorkspace}>
                <Plus size={32} />
              </IconButton>
            </div>
          </Tooltip>
        </WorkspaceCircle>
      </ContentList>

      {!isTouchscreenDevice && (
        <Tooltip content={'설정'} placement="right">
          <WorkspaceCircle>
            <Link to="/settings">
              <div className="circle">
                <IconButton>
                  <Cog size={24} fill="var(--secondary-foreground) !important" />
                </IconButton>
              </div>
            </Link>
          </WorkspaceCircle>
        </Tooltip>
      )}
    </Block>
  )
}

export default WorkspacesList

const Block = styled.div`
  width: 58px;
  height: 100%;
  padding-inline-start: 2px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  ${isTouchscreenDevice &&
  css`
    padding-bottom: 50px;
  `}
`

const ContentList = styled.div`
  flex-grow: 1;
  display: flex;
  overflow-y: scroll;
  padding-bottom: 20px;
  flex-direction: column;
  scrollbar-width: none;
  > :first-child > svg {
    margin: 6px 0 6px 4px;
  }
  &::-webkit-scrollbar {
    width: 0px;
  }
`
