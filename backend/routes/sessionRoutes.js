import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { deleteSession, saveSession, touchSession } from '../services/sessionService.js';

const router = express.Router();

router.post('/continue', requireAuth, async (req, res) => {
  try {
    const session = await touchSession(req.user.id);

    if (!session) {
      return res.status(401).json({ message: 'Session is no longer active.' });
    }

    const currentSession = {
      userId: req.user.id,
      lastSeenAt: session.lastSeenAt,
      expiresAt: session.expiresAt,
    };

    return res.status(200).json({
      message: 'Session continued',
      ...currentSession,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to continue the session.' });
  }
});

router.delete('/logout', requireAuth, async (req, res) => {
  try {
    await deleteSession(req.user.id);
    return res.status(200).json({ message: 'Session ended successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to sign out.' });
  }
});

router.post('/reissue', requireAuth, async (req, res) => {
  try {
    const session = await saveSession({
      userId: req.user.id,
      token: req.headers.authorization?.replace('Bearer ', '') || '',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Session renewed',
      expiresAt: session.expiresAt,
      lastSeenAt: session.lastSeenAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to renew session.' });
  }
});

export default router;
