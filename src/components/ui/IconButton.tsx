import React from 'react'
import styled, { css } from 'styled-components'

interface IconButtonProps {
  rotate?: string
  type?: 'default' | 'circle'
}

const normal = `var(--secondary-foreground)`
const hover = `var(--foreground)`

const IconButton: React.FC<IconButtonProps> = ({ children, ...reset }) => {
  return <IconButtonBlock {...reset}>{children}</IconButtonBlock>
}

export default IconButton

const IconButtonBlock = styled.div<IconButtonProps>`
  z-index: 1;
  display: grid;
  cursor: pointer;
  place-items: center;

  transition: 0.1s ease all;

  fill: ${normal};
  color: ${normal};

  a {
    color: ${normal};
  }

  svg {
    transition: 0.2s ease transform;
  }

  &:hover {
    fill: ${hover};
    color: ${hover};

    a {
      color: ${hover};
    }
  }

  ${(props) =>
    props.type === 'circle' &&
    css`
      padding: 4px;
      border-radius: var(--border-radius-half);
      background-color: var(--secondary-header);

      &:hover {
        background-color: var(--primary-header);
      }
    `}

  ${(props) =>
    props.rotate &&
    css`
      svg {
        transform: rotateZ(${props.rotate});
      }
    `}
`
