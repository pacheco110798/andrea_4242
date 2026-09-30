import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderApp } from '../../test/render-app'

async function fillRegisterForm(user: ReturnType<typeof userEvent.setup>, confirm = 'Secret123') {
  await user.type(screen.getByLabelText('Nombre completo'), 'Ana López')
  await user.type(screen.getByLabelText('Correo electrónico'), 'Ana@Example.com')
  await user.type(screen.getByLabelText('Contraseña'), 'Secret123')
  await user.type(screen.getByLabelText('Confirmar contraseña'), confirm)
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

describe('authentication flow', () => {
  it('redirects to login when there is no session', () => {
    renderApp('/dashboard')
    expect(screen.getByRole('heading', { name: 'Bienvenido de vuelta' })).toBeInTheDocument()
  })

  it('shows validation errors and does not register when passwords differ', async () => {
    const user = userEvent.setup()
    renderApp('/register')

    await fillRegisterForm(user, 'Different1')

    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
    expect(localStorage.getItem('caracol:users')).toBeNull()
  })

  it('registers, logs out and logs back in with the same credentials', async () => {
    const user = userEvent.setup()
    renderApp('/register')

    await fillRegisterForm(user)
    expect(await screen.findByText('Hola, Ana 👋', {}, { timeout: 5000 })).toBeInTheDocument()
    expect(screen.getByTestId('balance')).toHaveTextContent('$0.00')
    expect(localStorage.getItem('caracol:users')).not.toContain('Secret123')

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByRole('heading', { name: 'Bienvenido de vuelta' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Contraseña'), 'wrong-password1')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(
      await screen.findByText('Correo o contraseña incorrectos.', {}, { timeout: 5000 }),
    ).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Contraseña'))
    await user.type(screen.getByLabelText('Contraseña'), 'Secret123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(await screen.findByText('Hola, Ana 👋', {}, { timeout: 5000 })).toBeInTheDocument()
  }, 20_000)
})
