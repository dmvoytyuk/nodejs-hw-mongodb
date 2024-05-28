import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';
import { env } from './utils/env.js';

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

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res
      .status(200)
      .json({ message: 'Successfully get contacts', data: contacts });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'Could not find contact',
      });
    } else {
      res.status(200).json({
        message: `Successfully found contact with id ${contactId}`,
        data: contact,
      });
    }
  });

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
