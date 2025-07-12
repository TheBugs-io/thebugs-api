import express from 'express';
import * as reservaController from '../controllers/reservaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { autorizacaoSecretario } from '../middleware/authorizationAdm.js';

const router = express.Router();
// Protege as rotas abaixo com autorização de secretário
router.get('/', autorizacaoSecretario, reservaController.listarReservas)
router.patch('/:id/status', autorizacaoSecretario, reservaController.atualizarStatusReserva);
// Protege as rotas abaixo com autenticação
router.use(authMiddleware)
router.post('/solicitar-reserva', authMiddleware, reservaController.solicitarReserva)
router.delete('/:id', authMiddleware, reservaController.cancelarReserva);
router.get('/minhas-reservas', authMiddleware, reservaController.listarReservasUsuario);

export default router;