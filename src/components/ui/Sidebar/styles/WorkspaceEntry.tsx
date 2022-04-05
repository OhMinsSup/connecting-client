import React from 'react'
import styled, { css } from 'styled-components'

interface WorkspaceEntryProps {
  active: boolean
  home?: boolean
}

const WorkspaceEntry: React.FC<WorkspaceEntryProps> = (props) => {
  return <Block {...props}>{props.children}</Block>
}

export default WorkspaceEntry

const Block = styled.div<{ active: boolean; home?: boolean }>`
  height: 54px;
  display: flex;
  align-items: center;
  //transition: 0.2s ease height;
  :focus {
    outline: 3px solid blue;
  }
  > div {
    height: 42px;
    padding-inline-start: 6px;
    display: grid;
    place-items: center;
    border-start-start-radius: 50%;
    border-end-start-radius: 50%;
    &:active {
      transform: translateY(1px);
    }
    ${(props) =>
      props.active &&
      css`
        &:active {
          transform: none;
        }
      `}
  }
  > span {
    width: 0;
    display: relative;
    ${(props) =>
      !props.active &&
      css`
        display: none;
      `}
    svg {
      margin-top: 5px;
      pointer-events: none;
    }
  }
  ${(props) =>
    (!props.active || props.home) &&
    css`
      cursor: pointer;
    `}
`
