export type ChargeStatus = 'approved' | 'rejected' | 'error';

export type StatusDetail =
  | 'accredited'
  | 'invalid_request'
  | 'cc_rejected_insufficient_funds'
  | 'cc_rejected_bad_cvv'
  | 'cc_rejected_bad_expiration_date'
  | 'cc_rejected_expired'
  | 'cc_rejected_card_declined'
  | 'service_unavailable'
  | 'gateway_timeout'
  | 'internal_error';

export interface ChargeRequest {
  card_number: string;
  expiration_date: string;
  cvv: string;
  cardholder_name: string;
  amount: number;
  payer_id: string;
  payer_email: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ChargeResponse {
  id: string;
  status: ChargeStatus;
  status_detail: StatusDetail;
  transaction_amount: number | null;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string | null;
  payer_email: string | null;
  card_number: string | null;
  cvv: string | null;
  errors?: FieldError[];
}

export type ChargeOutcome =
  | { kind: 'approved' }
  | { kind: 'rejected'; detail: StatusDetail }
  | { kind: 'system_error' }
  | { kind: 'timeout' };
