import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'

interface ConditionalLinkProps extends LinkProps, React.HTMLAttributes<HTMLAnchorElement> {
  active: boolean
}

const ConditionalLink: React.FC<ConditionalLinkProps> = (props) => {
  const { active, ...linkProps } = props

  if (active) {
    return <a onClick={linkProps.onClick}>{props.children}</a>
  }
  return <Link {...linkProps} />
}

export default ConditionalLink
