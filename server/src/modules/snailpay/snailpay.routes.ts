import { Router } from 'express';

import type { AppConfig } from '../../config/env.js';
import { createChargeHandler } from './snailpay.controller.js';

export function createSnailpayRouter(config: AppConfig): Router {
  const router = Router();
  router.post('/charges', createChargeHandler(config));
  return router;
}
