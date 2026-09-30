import type { ReactNode } from 'react'

import { Logo } from '../../components/Logo'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="auth">
      <section className="auth__panel">
        <Logo />
        <h1 className="auth__title">{title}</h1>
        <p className="auth__subtitle">{subtitle}</p>
        {children}
        <p className="auth__footer">{footer}</p>
      </section>
    </main>
  )
}
