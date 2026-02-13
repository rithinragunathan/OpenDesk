import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { signToken } from '../utils/jwt.js';
import { verifyGoogleIdToken } from '../utils/google.js';

const SALT_ROUNDS = 12;

function toAuthResponse(user) {
  const token = signToken({ id: user.id, email: user.email, name: user.full_name });
  return {
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      avatarUrl: user.avatar_url
    }
  };
}

export async function register(req, res) {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password || password.length < 8) {
    return res.status(400).json({ message: 'Name, email and a minimum 8-char password are required.' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const { rows } = await pool.query(
      `INSERT INTO users(full_name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING *`,
      [fullName, email.toLowerCase(), passwordHash]
    );

    if (!rows[0]) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    return res.status(201).json(toAuthResponse(rows[0]));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create account.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase()]);
  const user = rows[0];

  if (!user || !user.password_hash) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  return res.json(toAuthResponse(user));
}

export async function googleSignIn(req, res) {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Google ID token is required.' });
  }

  try {
    const payload = await verifyGoogleIdToken(idToken);
    const email = payload.email?.toLowerCase();
    const fullName = payload.name || 'Google User';

    if (!email) {
      return res.status(400).json({ message: 'Google account email missing.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO users(google_id, full_name, email, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email)
       DO UPDATE SET google_id = EXCLUDED.google_id, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url
       RETURNING *`,
      [payload.sub, fullName, email, payload.picture]
    );

    return res.json(toAuthResponse(rows[0]));
  } catch (error) {
    return res.status(401).json({ message: 'Google sign-in verification failed.' });
  }
}
