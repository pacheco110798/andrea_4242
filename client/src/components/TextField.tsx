import { type InputHTMLAttributes, useId } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function TextField({ label, error, hint, ...inputProps }: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        className="field__input"
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <p id={messageId} className={error ? 'field__error' : 'field__hint'}>
          {message}
        </p>
      )}
    </div>
  )
}
