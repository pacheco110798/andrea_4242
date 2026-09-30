// Fictitious cards that trigger each simulated SnailPay scenario.
export const APPROVED_CARD = {
  number: '1234123412341234',
  expirationDate: '12/26',
  cvv: '543',
} as const;

export const INSUFFICIENT_FUNDS_CARD = '4000000000000002';
export const SYSTEM_ERROR_CARD = '5000000000000009';
export const TIMEOUT_CARD = '6000000000000006';
