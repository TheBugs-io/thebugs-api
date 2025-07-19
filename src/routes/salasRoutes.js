import express from "express";
import * as salasController from "../controllers/salasController.js";
import { autorizacaoSecretario } from "../middleware/authorizationAdm.js";
const router = express.Router();

router.get("/mapa", salasController.mapaNaData);
router.get("/na-data", salasController.salaNaData);
router.get("/sala", salasController.getSala);
router.get("/reservas-da-sala", salasController.reservasDaSala);

//protege as rotas abaixo
router.use(autorizacaoSecretario);
router.post("/criar", autorizacaoSecretario, salasController.criarSala);
router.put("/editar", autorizacaoSecretario, salasController.editarSala);
router.delete("/deletar", autorizacaoSecretario, salasController.deletarSala);

export default router;
