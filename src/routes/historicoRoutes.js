import express from "express";
import { lerHistorico } from "../controllers/historicoController.js";
import { autorizacaoSecretario } from "../middleware/authorizationAdm.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", autorizacaoSecretario, lerHistorico);

export default router;
