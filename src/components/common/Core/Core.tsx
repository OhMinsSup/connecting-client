import React from 'react'

// hooks
import { useProfileQuery } from '../../../atoms/authState'

const Core: React.FC = ({ children }) => {
  useProfileQuery()

  return <>{children}</>
}

export default Core
