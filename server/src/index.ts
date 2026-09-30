import { createApp } from './app.js';

const app = createApp();

// On Vercel the exported app runs as a serverless function; locally we start the server.
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export default app;
