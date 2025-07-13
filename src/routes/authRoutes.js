import express from 'express';
import * as authService from "../auth/authService.js";
import * as registerService from "../auth/registerService.js";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { autorizacaoSecretario } from '../middleware/authorizationAdm.js';

const router = express.Router();

router.post('/login', authService.login);
router.post('/register/solicitar', registerService.solicitarRegistro);
router.get('/register/confirmar/:token', registerService.confirmarEmail);
//MARK: - Secretarios
router.post('/register/confirm-user', autorizacaoSecretario, registerService.confirmarEmail);
router.get('/register/token/:token', registerService.buscarPorToken);
router.get('/register/id/:id', registerService.buscarPorId);
router.get('/register/email/:email', registerService.buscarPorEmail);
router.get('/register/pendentes', registerService.listarPendentes);
router.patch('/register/:id', registerService.atualizarStatus);
router.delete('/register/:id', registerService.deletarSolicitacao);

export default router;