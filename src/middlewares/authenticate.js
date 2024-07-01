import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, _res, next) => {
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

  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }
  if (new Date() > new Date(session.accessTokenValidUntil)) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UsersCollection.findById(session.userId);
  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;
  next();
};
