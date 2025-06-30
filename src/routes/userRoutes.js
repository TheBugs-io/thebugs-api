import express from 'express';
import * as userController from "../controllers/usuariosController.js";

const router = express.Router();

router.get('/', userController.listarUsuarios);

export default router;