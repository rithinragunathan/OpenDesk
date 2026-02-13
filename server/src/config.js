import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/environmental_platform',
  jwtSecret: process.env.JWT_SECRET || 'change-this-super-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '8h',
  googleClientId: process.env.GOOGLE_CLIENT_ID || ''
};
