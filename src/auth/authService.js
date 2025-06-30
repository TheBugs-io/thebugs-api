import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userController from '../controllers/usuariosController.js'

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

//TODO: Request change password (PUT)