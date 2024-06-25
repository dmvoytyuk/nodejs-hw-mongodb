import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    next(createHttpError(401, 'Please log in'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer') {
    next(createHttpError(401, 'Auth header should be bearer type'));
    return;
  }

  // const session = await SessionCollection.findOne({ accessToken: token });
  // if (!session) throw createHttpError(401, 'Session not found');
  //
  // if (new Date() < new Date(session.accessTokenValidUntil)) {
  //   throw createHttpError(401, 'Access token expired');
  // }

  next();
};
