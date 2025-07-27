import express from "express";
import * as pesquisaController from "../controllers/pesquisaController.js";

const router = express.Router();

router.get("/:string", async (req, res) => {
  const { string } = req.params;
  if (string.trim().length > 25) return res.status(400).json({ message: "Pesquisa muito longa" });
  const resultados = await pesquisaController.pesquisar(string.trim());
  return res.send(resultados);
});

export default router;
