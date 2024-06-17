import dotenv from 'dotenv';

dotenv.config();

export const env = (envVar, defaultValue) => {
  const value = process.env[envVar];
  if (value) return value;
  if (defaultValue) return defaultValue;
  throw new Error(`Environment ${envVar} not found`);
};
