import express from 'express';
//TODO: Pass authController here
import * as authController from "../auth/authService.js";

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

export default router;