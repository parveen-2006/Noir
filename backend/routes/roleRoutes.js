import express from 'express';
import { createRole, deleteRole, getRoles, updateRole } from '../controllers/roleController.js';

const router = express.Router();

router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;
