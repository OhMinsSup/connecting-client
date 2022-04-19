import styled, { css } from 'styled-components'

// hooks
import { useLocation } from 'react-router-dom'

// icons
import { ChevronLeft, ChevronRight, Menu } from '@styled-icons/boxicons-regular'

// utils
import { isTouchscreenDevice } from '../../libs/utils/utils'

// constants
import { SIDEBAR_CHANNELS, useLayoutActionHook } from '../../atoms/layoutState'

interface Props {
  topBorder?: boolean
  bottomBorder?: boolean

  background?: boolean
  transparent?: boolean
  placement: 'primary' | 'secondary'
}

const Header = styled.div<Props>`
  gap: 10px;
  flex: 0 auto;
  display: flex;
  flex-shrink: 0;
  padding: 0 16px;
  font-weight: 600;
  user-select: none;
  align-items: center;

  height: var(--header-height);

  background-size: cover !important;
  background-position: center !important;

  svg {
    flex-shrink: 0;
  }

  .menu {
    margin-inline-end: 8px;
    color: var(--secondary-foreground);
  }

  ${(props) =>
    props.transparent
      ? css`
          background-color: rgba(var(--primary-header-rgb), max(var(--min-opacity), 0.75));
          backdrop-filter: blur(20px);
          z-index: 20;
          position: absolute;
          width: 100%;
        `
      : css`
          background-color: var(--primary-header);
        `}

  ${(props) =>
    props.background &&
    css`
      height: 120px !important;
      align-items: flex-end;

      text-shadow: 0px 0px 1px black;
    `}

    ${(props) =>
    props.placement === 'secondary' &&
    css`
      background-color: var(--secondary-header);
      padding: 14px;
    `}

    ${(props) =>
    props.topBorder &&
    css`
      border-start-start-radius: 8px;
    `}

    ${(props) =>
    props.bottomBorder &&
    css`
      border-end-start-radius: 8px;
    `}
`

export default Header

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--secondary-foreground);
  margin-right: 5px;

  > svg {
    margin-right: -5px;
  }

  ${!isTouchscreenDevice &&
  css`
    &:hover {
      color: var(--foreground);
    }
  `}
`

export function HamburgerAction() {
  if (!isTouchscreenDevice) return null

  const openSidebar = () => {
    document.querySelector('#app > div > div')?.scrollTo({ behavior: 'smooth', left: 0 })
  }

  return (
    <div className="menu" onClick={openSidebar}>
      <Menu size={27} />
    </div>
  )
}

type PageHeaderProps = Omit<Props, 'placement' | 'borders'> & {
  noBurger?: boolean
  icon?: React.ReactNode
}

export const PageHeader: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({ children, icon, noBurger, ...props }) => {
  const { getSectionState, toggleSectionState } = useLayoutActionHook()
  const visible = getSectionState(SIDEBAR_CHANNELS, true)
  const { pathname } = useLocation()

  return (
    <Header {...props} placement="primary" topBorder={!visible} bottomBorder={!pathname.includes('/server')}>
      {!noBurger && <HamburgerAction />}
      <IconContainer onClick={() => toggleSectionState(SIDEBAR_CHANNELS, true)}>
        {!isTouchscreenDevice && visible && <ChevronLeft size={18} />}
        {icon}
        {!isTouchscreenDevice && !visible && <ChevronRight size={18} />}
      </IconContainer>
      {children}
    </Header>
  )
}
