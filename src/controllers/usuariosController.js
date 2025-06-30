import * as userModel from "../models/usuarioModel.js";

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await userModel.listarUsuarios();

    if (usuarios.length === 0) {
      return res
        .status(200)
        .json({ message: "Nenhum usuário encontrado.", usuarios: [] });
    }

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};

export const buscarUsuarioPorEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("Email é obrigatório");
    }

    const user = await userModel.buscarUsuarioPorEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  } catch (error) {
    console.error("ERRO AO BUSCAR USUÁRIO POR EMAIL:", error.message);
    throw error;
  }
};