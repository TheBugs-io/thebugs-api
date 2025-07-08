import express from 'express';
import * as reservaController from '../controllers/reservaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { autorizacaoSecretario } from '../middleware/authorizationAdm.js';

const router = express.Router();
// Protege as rotas abaixo com autorização de secretário
router.use(autorizacaoSecretario)
router.get('/', reservaController.listarReservas)
 // Protege as rotas abaixo com autenticação
router.use(authMiddleware)
router.post('/solicitar-reserva', reservaController.solicitarReserva)
router.delete('/:id', reservaController.cancelarReserva);
router.get('/minhas-reservas', reservaController.listarReservasUsuario);

export default router;