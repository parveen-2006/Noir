import { authenticateUser } from '../services/authService.js';

export const loginUser = async (req, res) => {
  try {
    return res.status(200).json(await authenticateUser(req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
