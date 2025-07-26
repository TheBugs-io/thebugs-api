import express from 'express';
import * as reservaController from '../controllers/reservaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { autorizacaoSecretario } from '../middleware/authorizationAdm.js';
//TODO: nEED TO FIX

const router = express.Router();
router.use(authMiddleware)
router.get('/', autorizacaoSecretario, reservaController.listarReservas);
router.get('/solicitacoes', autorizacaoSecretario, reservaController.listarSolicitacoesReservas);
router.patch('/:id/status', autorizacaoSecretario, reservaController.atualizarStatusSolicitacao);
router.post('/solicitar-reserva', authMiddleware, reservaController.solicitarReserva);
router.delete('/:id', authMiddleware, reservaController.cancelarReserva);
router.get('/minhas-reservas', authMiddleware, reservaController.listarReservasUsuario);

export default router;