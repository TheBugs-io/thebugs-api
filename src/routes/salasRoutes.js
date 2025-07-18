import express from "express";
import * as salasController from "../controllers/salasController.js";
import { autorizacaoSecretario } from "../middleware/authorizationAdm.js";
const router = express.Router();

router.post("/criar", autorizacaoSecretario, salasController.criarSala);
// router.post("/criar", salasController.criarSala);
router.get("/mapa", salasController.mapaNaData);
router.get("/na-data", salasController.salaNaData);
router.get("/sala", salasController.getSala);
router.get("/reservas-da-sala", salasController.reservasDaSala);

export default router;
