import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import Role from '../models/Role.js';
import User from '../models/User.js';
import { saveSession } from './sessionService.js';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const getTokenSecret = () => process.env.JWT_SECRET || 'noir-development-secret';

const createSessionToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + TOKEN_TTL_MS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getTokenSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
};

export const authenticateUser = async ({ email, password } = {}) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  const passwordMatches = user && await bcrypt.compare(String(password), user.password);

  if (!passwordMatches) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const role = await Role.findOne({ name: user.role });
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const token = createSessionToken(user);
  await saveSession({ userId: user.id, token, expiresAt });

  return {
    message: 'Login successful',
    token,
    expiresAt: new Date(expiresAt).toISOString(),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: role?.permissions || [],
    },
  };
};