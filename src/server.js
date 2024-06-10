import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.send('Welcome to the server!');
  });

  app.use(contactsRouter);

  app.use('*', (_req, res, _next) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use((err, _req, res, _next) => {
    res.status(500).json({ message: 'error', error: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
