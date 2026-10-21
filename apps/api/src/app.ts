import express, { Application } from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

export function createApp(): Application {
  const app = express();

  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

  app.use(
    cors({
      origin: allowedOrigin === '*' ? '*' : [allowedOrigin],
      credentials: true,
    })
  );

  app.use(express.json());

  // Rotas da API
  app.use('/api', healthRouter);

  // Tratamento de rotas inexistentes (404) e erros globais (500)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
