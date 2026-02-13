import { OAuth2Client } from 'google-auth-library';
import { config } from '../config.js';

const client = new OAuth2Client(config.googleClientId || undefined);

export async function verifyGoogleIdToken(idToken) {
  if (!config.googleClientId) {
    throw new Error('Google client ID is not configured on the server.');
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.googleClientId
  });

  return ticket.getPayload();
}
