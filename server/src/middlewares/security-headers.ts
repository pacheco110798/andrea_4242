import type { RequestHandler } from 'express';
import helmetImport, { type HelmetOptions } from 'helmet';

type Helmet = (options?: HelmetOptions) => RequestHandler;

// helmet ships separate ESM and CommonJS typings. Some compilers (e.g. Vercel's build)
// resolve the CommonJS ones, where the callable lives under `.default`.
const helmet = ((helmetImport as unknown as { default?: Helmet }).default ??
  helmetImport) as unknown as Helmet;

export const securityHeaders = (options?: HelmetOptions): RequestHandler => helmet(options);
