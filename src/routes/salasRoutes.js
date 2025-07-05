import express from "express";
import * as salasController from "../controllers/salasController.js";

const router = express.Router();

router.get("/mapa", salasController.mapaNaData);
router.get("/sala", salasController.salaNaData);
router.get("/reservas_da_sala", salasController.reservasDaSala);

export default router;
