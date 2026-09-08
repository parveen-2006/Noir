import crypto from 'node:crypto';
import User from '../models/User.js';

const getTokenSecret = () => process.env.JWT_SECRET || 'noir-development-secret';

const createSignature = (payload) => crypto
  .createHmac('sha256', getTokenSecret())
  .update(payload)
  .digest('base64url');

export const requireAuth = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const [payload, signature] = token.split('.');
    const expectedSignature = createSignature(payload);
    const providedSignature = Buffer.from(signature || '');
    const validSignature = Buffer.byteLength(expectedSignature) === providedSignature.length
      && crypto.timingSafeEqual(Buffer.from(expectedSignature), providedSignature);

    if (!payload || !validSignature) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session.sub || !session.exp || session.exp <= Date.now()) {
      return res.status(401).json({ message: 'Authentication token has expired.' });
    }

    const user = await User.findById(session.sub);
    if (!user || user.status !== 'Active') {
      return res.status(401).json({ message: 'User account is unavailable.' });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
};