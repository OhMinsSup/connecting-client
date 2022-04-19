import React from 'react'
import { Outlet } from 'react-router-dom'

import bgImage from '../../../assets/images/background.jpeg'
import styles from '../../../assets/styles/modules/auth.module.scss'

interface PublicLayoutProps {}
const PublicLayout: React.FC<PublicLayoutProps> = () => {
  return (
    <div className={styles.auth}>
      <div className={styles.content}>
        <div className={styles.modal}>
          <Outlet />
        </div>
      </div>
      <div className={styles.bg} style={{ background: `url('${bgImage}')` }} />
    </div>
  )
}

export default PublicLayout
