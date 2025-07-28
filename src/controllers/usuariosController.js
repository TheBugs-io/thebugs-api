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

export const buscarUsuarioPorId = async (id) => {
  try {
    if (!id) {
      throw new Error("ID do usuário é obrigatório");
    }
    const usuario = await userModel.buscarUsuarioPorId(id);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
    return usuario;
  } catch (error) {
    console.error("ERRO AO BUSCAR USUÁRIO POR ID:", error.message);
    throw error;
  }
};

export const atualizarSenha = async (usuarioId, novaSenha) => {
  try {
    if (!usuarioId || !novaSenha) {
      throw new Error("ID do usuário e nova senha são obrigatórios");
    }

    const usuario = await userModel.atualizarSenha(usuarioId, novaSenha);

    if (!usuario) {
      throw new Error("Usuário não encontrado ou erro ao atualizar senha");
    }

    return usuario;
  } catch (error) {
    console.error("ERRO AO ATUALIZAR SENHA:", error.message);
    throw error;
  }
};