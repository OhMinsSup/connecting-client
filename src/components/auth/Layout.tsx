import React from 'react'
import bgImage from '../../assets/images/background.jpeg'
import styles from './style/auth.module.scss'

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.auth}>
      <div className={styles.content}>
        <div className={styles.modal}>{children}</div>
      </div>
      <div className={styles.bg} style={{ background: `url('${bgImage}')` }} />
    </div>
  )
}

export default Layout
