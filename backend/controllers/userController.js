import { createUser as createUserService, deleteUser as deleteUserService, listUsers, updateUser as updateUserService } from '../services/userService.js';

export const getUsers = async (req, res) => {
  try {
    return res.status(200).json(await listUsers(req.query));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    return res.status(201).json(await createUserService(req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    return res.status(200).json(await updateUserService(req.params.id, req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    return res.status(200).json(await deleteUserService(req.params.id));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
