import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userController from "../controllers/usuariosController.js";
import { verificarRedefinicaoEmail } from "../service/mailRegister.js";
import * as tokenRepository from "../models/tokenRepository.js";''
import { v4 as uuidv4 } from "uuid";

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await userController.buscarUsuarioPorEmail(email);
    console.log("Resultado da busca:", usuario);
    if (!usuario) {
      return res.status(400).send({ error: "Usuário não encontrado!" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log("Senha válida?", senhaValida);
    if (!senhaValida) {
      return res.status(401).send({ error: "Senha inválida!" });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      usuario: {
        token,
        id: usuario.id,
        nome: usuario.nomeCompleto,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login!" });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email é obrigatório." });
  }
  try {
    const usuario = await userController.buscarUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    await tokenRepository.createToken(usuario.id, token, expiresAt);

    await verificarRedefinicaoEmail(usuario.email, token);
    return res.status(200).json({ message: "E-mail de recuperação enviado." });
  } catch (error) {
    console.error("Erro ao enviar e-mail de recuperação:", error);
    return res
      .status(500)
      .json({ error: "Erro ao enviar e-mail de recuperação." });
  }
};


export const resetPassword = async (req, res) => {
  const { token, novaSenha } = req.body;

  if (!token || !novaSenha) {
    return res.status(400).json({ error: "Token e nova senha são obrigatórios." });
  }

  try {
    const registroToken = await tokenRepository.findValidToken(token);
    if (!registroToken) {
      return res.status(400).json({ error: "Token inválido ou expirado." });
    }

    const usuarioId = registroToken.userId;
    const usuario = await userController.buscarUsuarioPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await userController.atualizarSenha(usuarioId, novaSenha);

    await tokenRepository.invalidateToken(token);

    return res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
};