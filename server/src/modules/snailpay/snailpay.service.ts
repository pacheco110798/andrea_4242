import {
  APPROVED_CARD,
  INSUFFICIENT_FUNDS_CARD,
  SYSTEM_ERROR_CARD,
  TIMEOUT_CARD,
} from './snailpay.test-cards.js';
import type { ChargeOutcome, ChargeRequest } from './snailpay.types.js';

/** A card is valid through the last day of its expiration month. */
export function isExpired(expirationDate: string, now: Date): boolean {
  const [month, year] = expirationDate.split('/').map(Number);
  const firstDayAfterExpiration = new Date(2000 + year, month, 1);
  return now >= firstDayAfterExpiration;
}

/** Decides the simulated result of a charge. Expects an already validated request. */
export function evaluateCharge(request: ChargeRequest, now: Date = new Date()): ChargeOutcome {
  const { card_number, expiration_date, cvv } = request;

  if (card_number === SYSTEM_ERROR_CARD) return { kind: 'system_error' };
  if (card_number === TIMEOUT_CARD) return { kind: 'timeout' };
  if (isExpired(expiration_date, now)) return { kind: 'rejected', detail: 'cc_rejected_expired' };

  if (card_number === APPROVED_CARD.number) {
    if (expiration_date !== APPROVED_CARD.expirationDate) {
      return { kind: 'rejected', detail: 'cc_rejected_bad_expiration_date' };
    }
    if (cvv !== APPROVED_CARD.cvv) return { kind: 'rejected', detail: 'cc_rejected_bad_cvv' };
    return { kind: 'approved' };
  }

  if (card_number === INSUFFICIENT_FUNDS_CARD) {
    return { kind: 'rejected', detail: 'cc_rejected_insufficient_funds' };
  }

  return { kind: 'rejected', detail: 'cc_rejected_card_declined' };
}
