import styled, { css } from 'styled-components'
import { isTouchscreenDevice } from '../../libs/utils/utils'

const IconContainer = styled.div`
  cursor: pointer;
  color: var(--secondary-foreground);
  ${!isTouchscreenDevice &&
  css`
    &:hover {
      color: var(--foreground);
    }
  `}
`

export default IconContainer
