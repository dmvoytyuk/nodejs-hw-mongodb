import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { createTokens } from '../utils/createTokens.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordEqual = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordEqual) throw createHttpError(401, 'Unauthorized');

  await SessionCollection.deleteOne({ userId: user._id });

  const { accessToken, refreshToken } = createTokens();

  return await SessionCollection.create({
    userId: user._id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const { accessToken, refreshToken } = createTokens();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
};

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const session = await SessionCollection.findOne({
    refreshToken,
    sessionId,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isRefreshTokenExpired) throw createHttpError(401, 'Session expired');

  const newSession = createSession();

  await SessionCollection.deleteOne({
    refreshToken: refreshToken,
  });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
