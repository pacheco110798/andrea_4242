import { type FormEvent, useState } from 'react'
import { Link } from 'react-router'

import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { type FieldErrors, getFieldErrors } from '../../lib/form-errors'
import { type LoginInput, loginSchema } from './auth.schemas'
import { AuthError } from './auth.service'
import { AuthLayout } from './AuthLayout'
import { useAuth } from './useAuth'

const emptyForm: LoginInput = { email: '', password: '' }

export function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FieldErrors<LoginInput>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof LoginInput) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const parsed = loginSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error))
      return
    }

    setSubmitting(true)
    try {
      await login(parsed.data)
    } catch (error) {
      setFormError(
        error instanceof AuthError && error.code === 'INVALID_CREDENTIALS'
          ? 'Correo o contraseña incorrectos.'
          : 'No pudimos iniciar sesión. Inténtalo de nuevo.',
      )
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión para ver tu saldo y las carreras del día."
      footer={
        <>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        {formError && <Alert tone="error">{formError}</Alert>}
        <TextField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => updateField('email')(event.target.value)}
          error={errors.email}
        />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => updateField('password')(event.target.value)}
          error={errors.password}
        />
        <Button type="submit" loading={submitting}>
          Iniciar sesión
        </Button>
      </form>
    </AuthLayout>
  )
}
