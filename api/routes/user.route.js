import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId',verifyToken, updateUser)

export default router