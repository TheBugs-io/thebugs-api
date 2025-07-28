import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userController from "../controllers/usuariosController.js";
import { verificarRedefinicaoEmail } from "../service/mailRegister.js";

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
    const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await verificarRedefinicaoEmail(usuario.email, link);
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
    return res
      .status(400)
      .json({ error: "Token e nova senha são obrigatórios." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.userId;

    const usuario = await userController.buscarUsuarioPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await userController.atualizarSenha(usuarioId, senhaCriptografada);

    return res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado." });
    }

    return res.status(400).json({ error: "Token inválido." });
  }
};
