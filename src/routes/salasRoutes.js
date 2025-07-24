import express from "express";
import * as salasController from "../controllers/salasController.js";
import { autorizacaoSecretario } from "../middleware/authorizationAdm.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", salasController.listarSalas);
router.get("/mapa", salasController.mapaNaData);
router.get("/na-data", salasController.salaNaData);
router.get("/:id", salasController.getSala);
router.get("/reservas-da-sala", salasController.reservasDaSala);

router.use(authMiddleware)
router.post("/criar", autorizacaoSecretario, salasController.criarSala);
router.put("/editar", autorizacaoSecretario, salasController.editarSala);
router.delete("/deletar", autorizacaoSecretario, salasController.deletarSala);

export default router;