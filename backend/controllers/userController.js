import { createUser as createUserService, deleteUser as deleteUserService, listUsers, updateUser as updateUserService } from '../services/userService.js';

export const getUsers = (req, res) => {
  try {
    return res.status(200).json(listUsers(req.query));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const createUser = (req, res) => {
  try {
    return res.status(201).json(createUserService(req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateUser = (req, res) => {
  try {
    return res.status(200).json(updateUserService(req.params.id, req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteUser = (req, res) => {
  try {
    return res.status(200).json(deleteUserService(req.params.id));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
