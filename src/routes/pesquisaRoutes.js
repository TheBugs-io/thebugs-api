import express from "express";
import * as pesquisaController from "../controllers/pesquisaController.js";

const router = express.Router();

router.get("/:string", async (req, res) => {
  try {
    const { string } = req.params;
    const termo = string.trim();

    if (!termo) {
      return res.status(400).json({ message: "Termo de pesquisa vazio" });
    }

    if (termo.length > 25) {
      return res.status(400).json({ message: "Pesquisa muito longa" });
    }

    const resultados = await pesquisaController.pesquisar(termo);
    return res.json(resultados);
  } catch (error) {
    console.error("Erro na pesquisa:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;