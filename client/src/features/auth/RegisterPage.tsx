import { type FormEvent, useState } from 'react'
import { Link } from 'react-router'

import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { type FieldErrors, getFieldErrors } from '../../lib/form-errors'
import { type RegisterInput, registerSchema } from './auth.schemas'
import { AuthError } from './auth.service'
import { AuthLayout } from './AuthLayout'
import { useAuth } from './useAuth'

const emptyForm: RegisterInput = { fullName: '', email: '', password: '', confirmPassword: '' }

export function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FieldErrors<RegisterInput>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof RegisterInput) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const parsed = registerSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error))
      return
    }

    setSubmitting(true)
    try {
      await register(parsed.data)
    } catch (error) {
      setFormError(
        error instanceof AuthError && error.code === 'EMAIL_TAKEN'
          ? 'Ya existe una cuenta con este correo.'
          : 'No pudimos crear tu cuenta. Inténtalo de nuevo.',
      )
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Registra tus datos para seguir las carreras."
      footer={
        <>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        {formError && <Alert tone="error">{formError}</Alert>}
        <TextField
          label="Nombre completo"
          autoComplete="name"
          value={form.fullName}
          onChange={(event) => updateField('fullName')(event.target.value)}
          error={errors.fullName}
        />
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
          autoComplete="new-password"
          hint="Mínimo 8 caracteres, con letras y números."
          value={form.password}
          onChange={(event) => updateField('password')(event.target.value)}
          error={errors.password}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(event) => updateField('confirmPassword')(event.target.value)}
          error={errors.confirmPassword}
        />
        <Button type="submit" loading={submitting}>
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  )
}
