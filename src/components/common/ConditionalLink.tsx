import React from 'react'
import { Link } from 'react-location'
import type { LinkProps } from 'react-location'

interface ConditionalLinkProps extends LinkProps {
  condition: boolean
}
const ConditionalLink: React.FC<ConditionalLinkProps> = (props) => {
  const { condition, ...linkProps } = props

  if (condition) {
    return <a onClick={linkProps.onClick}>{props.children}</a>
  }
  return <Link {...linkProps} />
}

export default ConditionalLink
