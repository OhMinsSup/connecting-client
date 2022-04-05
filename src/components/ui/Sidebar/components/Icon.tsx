import React from 'react'

function Icon({ children, unread, count, size }: { children: React.ReactNode; unread?: 'mention' | 'unread'; count: number | 0; size: number }) {
  return (
    <svg width={size} height={size} aria-hidden="true" viewBox="0 0 32 32">
      <use href="#serverIndicator" />
      <foreignObject x="0" y="0" width="32" height="32" mask={unread ? 'url(#server)' : undefined}>
        {children}
      </foreignObject>
      {unread === 'unread' && <circle cx="27" cy="5" r="5" fill={'white'} />}
      {unread === 'mention' && (
        <>
          <circle cx="27" cy="5" r="5" fill={'var(--error)'} />
          <text
            x="27"
            y="5"
            r="5"
            fill={'white'}
            fontSize={'7.5'}
            fontWeight={600}
            textAnchor="middle"
            alignmentBaseline={'middle'}
            dominantBaseline={'middle'}
          >
            {count < 10 ? count : '9+'}
          </text>
        </>
      )}
    </svg>
  )
}

export default Icon
