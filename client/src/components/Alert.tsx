import type { ReactNode } from 'react'

interface AlertProps {
  tone: 'success' | 'error' | 'info'
  title?: string
  children: ReactNode
}

export function Alert({ tone, title, children }: AlertProps) {
  return (
    <div className={`alert alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <p className="alert__title">{title}</p>}
      <div>{children}</div>
    </div>
  )
}
