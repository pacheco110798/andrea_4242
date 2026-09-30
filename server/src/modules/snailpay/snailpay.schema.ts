import { z } from 'zod';

const MAX_AMOUNT = 100_000;

const hasAtMostTwoDecimals = (value: number) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-9;

export const chargeRequestSchema = z.object({
  card_number: z.string().regex(/^\d{16}$/, 'Card number must have 16 digits'),
  expiration_date: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must use the MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must have 3 or 4 digits'),
  cardholder_name: z.string().trim().min(1, 'Cardholder name is required').max(100),
  amount: z
    .number('Amount must be a number')
    .positive('Amount must be greater than zero')
    .max(MAX_AMOUNT, `Amount cannot exceed ${MAX_AMOUNT}`)
    .refine(hasAtMostTwoDecimals, 'Amount can have at most 2 decimals'),
  payer_id: z.string().trim().min(1, 'Payer id is required').max(100),
  payer_email: z.email('Payer email must be a valid email'),
});
