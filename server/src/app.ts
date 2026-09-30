import cors from 'cors';
import express from 'express';

import { type AppConfig, loadConfig } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { securityHeaders } from './middlewares/security-headers.js';
import { createSnailpayRouter } from './modules/snailpay/snailpay.routes.js';

export function createApp(config: AppConfig = loadConfig()) {
  const app = express();

  app.use(securityHeaders());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/snailpay', createSnailpayRouter(config));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
