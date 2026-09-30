// Balances are kept in integer cents to avoid floating point drift.
export const toCents = (amount: number) => Math.round(amount * 100)

const currencyFormatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

export const formatCents = (cents: number) => currencyFormatter.format(cents / 100)
export const formatAmount = (amount: number) => currencyFormatter.format(amount)
