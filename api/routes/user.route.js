import express from 'express';
import { deleteUser, test, updateUser, signout, getUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId',verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken,deleteUser);
router.post('/signout', signout);
router.get('/getUsers',verifyToken, getUsers);

export default router