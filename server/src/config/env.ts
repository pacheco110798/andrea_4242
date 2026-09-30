export interface AppConfig {
  corsOrigin: string;
  snailpayForceError: boolean;
  snailpaySlowResponseMs: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    corsOrigin: env.CORS_ORIGIN ?? 'http://localhost:5173',
    snailpayForceError: env.SNAILPAY_FORCE_ERROR === 'true',
    snailpaySlowResponseMs: Number(env.SNAILPAY_SLOW_RESPONSE_MS ?? 15000),
  };
}
