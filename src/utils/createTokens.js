import { randomBytes } from 'crypto';

export const createTokens = () => {
  const tokens = {
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
  };

  return tokens;
};
