import { randomInt, randomUUID } from 'node:crypto';

import type { ChargeResponse, ChargeStatus, FieldError, StatusDetail } from './snailpay.types.js';

interface ResponseInput {
  status: ChargeStatus;
  statusDetail: StatusDetail;
  payload: unknown;
  errors?: FieldError[];
}

function readString(payload: unknown, key: string): string | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const value = (payload as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : null;
}

function readAmount(payload: unknown): number | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const value = (payload as Record<string, unknown>).amount;
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

function buildReference(date: Date): string {
  const day = date.toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase();
  return `SP-${day}-${suffix}`;
}

function buildAuthorizationCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

/**
 * Builds the SnailPay response. Values are read from the raw payload so that
 * invalid requests still echo back whatever the client sent.
 */
export function buildChargeResponse({
  status,
  statusDetail,
  payload,
  errors,
}: ResponseInput): ChargeResponse {
  const now = new Date();

  return {
    id: randomUUID(),
    status,
    status_detail: statusDetail,
    transaction_amount: readAmount(payload),
    date_created: now.toISOString(),
    authorization_code: status === 'approved' ? buildAuthorizationCode() : null,
    reference: buildReference(now),
    payer_id: readString(payload, 'payer_id'),
    payer_email: readString(payload, 'payer_email'),
    card_number: readString(payload, 'card_number'),
    cvv: readString(payload, 'cvv'),
    ...(errors && { errors }),
  };
}
