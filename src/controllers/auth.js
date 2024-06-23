import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';

export const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.json({
    status: 201,
    message: 'Seccessfully registered user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession();
  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
  // });
  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
  // });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).json({});
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshSession({
    refreshToken: req.cookies.refreshToken,
  });

  setupSession();

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
