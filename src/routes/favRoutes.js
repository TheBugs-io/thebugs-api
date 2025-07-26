import express from "express";
import * as favController from "../controllers/favController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(authMiddleware);
router.get("/favoritos", favController.listarFavoritos);
router.post("/favoritos", favController.createFavorito);
router.delete("/favoritos", favController.deleteFavorito);

export default router;