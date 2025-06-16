import express from 'express';
import * as reservaController from '../controllers/reservaController.js';

const router = express.Router();

router.get('/', reservaController.listarReservas)

export default router;