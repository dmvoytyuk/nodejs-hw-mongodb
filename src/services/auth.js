import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { createTokens } from '../utils/createTokens.js';
import { env } from '../utils/env.js';
import { APP_DOMAIN, JWT_SECRET, SMTP } from '../constants/index.js';
import { sendEmail } from '../utils/sendMail.js';

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

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(JWT_SECRET),
    {
      expiresIn: '15m',
    },
  );
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${env(APP_DOMAIN)}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (err) {
    console.log("can't send email:", err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later!',
    );
  }
};

export const resetPassword = async (payload) => {
  let data;
  try {
    data = jwt.verify(payload.token, env(JWT_SECRET));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UsersCollection.findOne({
    // @ts-ignore
    email: data.email,
    _id: data.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  const sessionId = SessionCollection.findOneAndDelete({ userId: user._id });
};
