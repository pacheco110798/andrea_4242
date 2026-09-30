import { z } from 'zod'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

/** Keeps the first validation message of each field. */
export function getFieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const { fieldErrors } = z.flattenError(error)
  const result: FieldErrors<T> = {}
  for (const [field, messages] of Object.entries(fieldErrors) as [keyof T, string[] | undefined][]) {
    if (messages?.[0]) result[field] = messages[0]
  }
  return result
}
