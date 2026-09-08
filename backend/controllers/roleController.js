import { createRole as createRoleService, deleteRole as deleteRoleService, listRoles, updateRole as updateRoleService } from '../services/roleService.js';

export const getRoles = async (req, res) => {
  try {
    return res.status(200).json(await listRoles());
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    return res.status(201).json(await createRoleService(req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    return res.status(200).json(await updateRoleService(req.params.id, req.body));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    return res.status(200).json(await deleteRoleService(req.params.id));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
