import { z } from 'zod'

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Ingresa un correo electrónico válido'))

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Ingresa tu nombre completo')
      .max(80, 'El nombre no puede superar 80 caracteres'),
    email,
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(128, 'La contraseña no puede superar 128 caracteres')
      .regex(/[A-Za-z]/, 'La contraseña debe incluir al menos una letra')
      .regex(/\d/, 'La contraseña debe incluir al menos un número'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
