import express from 'express';
import * as authService from "../auth/authService.js";
import * as registerService from "../auth/registerService.js";

const router = express.Router();

router.post('/login', authService.login);
router.post('/register', registerService.solicitarRegistro);

export default router;