import type { ErrorRequestHandler, RequestHandler } from 'express';

import { buildChargeResponse } from '../modules/snailpay/snailpay.response.js';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ status: 'error', status_detail: 'not_found' });
};

function isBodyParseError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    (error.type === 'entity.parse.failed' || error.type === 'entity.too.large')
  );
}

// Express identifies error handlers by their 4 arguments, so `_next` must stay.
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isBodyParseError(error)) {
    res.status(400).json(
      buildChargeResponse({
        status: 'rejected',
        statusDetail: 'invalid_request',
        payload: null,
        errors: [{ field: 'body', message: 'Request body must be valid JSON' }],
      }),
    );
    return;
  }

  console.error(error);
  res.status(500).json(
    buildChargeResponse({ status: 'error', statusDetail: 'internal_error', payload: null }),
  );
};
