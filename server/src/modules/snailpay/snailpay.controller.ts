import { setTimeout as sleep } from 'node:timers/promises';

import type { RequestHandler } from 'express';

import type { AppConfig } from '../../config/env.js';
import { buildChargeResponse } from './snailpay.response.js';
import { chargeRequestSchema } from './snailpay.schema.js';
import { evaluateCharge } from './snailpay.service.js';

export function createChargeHandler(config: AppConfig): RequestHandler {
  return async (req, res) => {
    const payload: unknown = req.body;

    if (config.snailpayForceError) {
      res.status(503).json(
        buildChargeResponse({ status: 'error', statusDetail: 'service_unavailable', payload }),
      );
      return;
    }

    const parsed = chargeRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      res.status(400).json(
        buildChargeResponse({ status: 'rejected', statusDetail: 'invalid_request', payload, errors }),
      );
      return;
    }

    const outcome = evaluateCharge(parsed.data);

    switch (outcome.kind) {
      case 'approved':
        res.status(201).json(
          buildChargeResponse({ status: 'approved', statusDetail: 'accredited', payload }),
        );
        return;
      case 'rejected':
        res.status(402).json(
          buildChargeResponse({ status: 'rejected', statusDetail: outcome.detail, payload }),
        );
        return;
      case 'system_error':
        res.status(503).json(
          buildChargeResponse({ status: 'error', statusDetail: 'service_unavailable', payload }),
        );
        return;
      case 'timeout':
        // Never approves: the client is expected to give up before this responds.
        await sleep(config.snailpaySlowResponseMs);
        res.status(504).json(
          buildChargeResponse({ status: 'error', statusDetail: 'gateway_timeout', payload }),
        );
        return;
    }
  };
}
