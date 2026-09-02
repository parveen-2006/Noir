import { createRole as createRoleService, deleteRole as deleteRoleService, listRoles, updateRole as updateRoleService } from '../services/roleService.js';

export const getRoles = (req, res) => {
  try {
    return res.status(200).json(listRoles());
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const createRole = (req, res) => {
  try {
    return res.status(201).json(createRoleService(req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateRole = (req, res) => {
  try {
    return res.status(200).json(updateRoleService(req.params.id, req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteRole = (req, res) => {
  try {
    return res.status(200).json(deleteRoleService(req.params.id));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
