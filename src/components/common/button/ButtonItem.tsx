import React from 'react'
import classNames from 'classnames'
import styles from './styles/button.module.scss'

export interface ButtonItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'as'> {
  active?: boolean
  alert?: 'unread' | 'mention'
  alertCount?: number
  margin?: boolean
  muted?: boolean
  onClick?: () => void
  className?: string
  compact?: boolean
}

const ButtonItem: React.FC<ButtonItemProps> = (props) => {
  const { active, alert, alertCount, onClick, className, children, compact, ...divProps } = props

  return (
    <div
      {...divProps}
      className={classNames(styles.item, { [styles.compact]: compact, [styles.normal]: !compact }, className)}
      onClick={onClick}
      data-active={active}
      data-alert={typeof alert === 'string'}
    >
      <div className={styles.content}>{children}</div>
      {alert && (
        <div className={styles.alert} data-style={alert}>
          {alertCount}
        </div>
      )}
    </div>
  )
}

export default ButtonItem
