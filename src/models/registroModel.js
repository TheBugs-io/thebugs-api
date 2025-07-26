import prisma from "../database/prisma.js";

export const criarSolicitacaoRegistro = async (dados) => {
  return await prisma.solicitacaoRegistro.create({
    data: {
      nomeCompleto: dados.nomeCompleto,
      nomeSocial: dados.nomeSocial || null,
      email: dados.email,
      tipoUsuario: dados.tipoUsuario,
      token: dados.token,
      status: "PENDENTE",
    },
  });
};

export const verificarEmailExistente = async (email) => {
  try {
    if (!email) {
      throw new Error("Email é obrigatório");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    return usuario;
  } catch (error) {
    console.error("ERRO AO BUSCAR USUÁRIO POR EMAIL:", error);
    throw error;
  }
};

//MARK: - Visão de administração (Dashboard / Registro de usuários)
export const buscarSolicitacaoPorToken = async (token) => {
  return await prisma.solicitacaoRegistro.findUnique({
    where: { token },
  });
};

export const buscarSolicitacaoPorId = async (id) => {
  return await prisma.solicitacaoRegistro.findUnique({
    where: { id },
  });
};

export const buscarSolicitacaoPorEmail = async (email) => {
  return await prisma.solicitacaoRegistro.findUnique({
    where: { email },
  });
};

export const atualizarStatusSolicitacao = async (
  id,
  status,
  secretarioId = null
) => {
  return await prisma.solicitacaoRegistro.update({
    where: { id },
    data: {
      status,
      secretarioId,
      atualizadoEm: new Date(),
    },
  });
};

export const criarUsuario = async (dadosSolicitacao) => {
  const usuario = await prisma.usuario.create({
    data: {
      nomeCompleto: dadosSolicitacao.nomeCompleto,
      nomeSocial: dadosSolicitacao.nomeSocial || null,
      email: dadosSolicitacao.email,
      senha: dadosSolicitacao.senhaHash,
      tipo: dadosSolicitacao.tipoUsuario,
    },
  });

  switch (dadosSolicitacao.tipoUsuario) {
    case "DOCENTE":
      await prisma.docente.create({
        data: {
          id: usuario.id,
          usuarioId: usuario.id,
        },
      });
      break;

    case "DISCENTE":
      await prisma.discente.create({
        data: {
          id: usuario.id,
          usuarioId: usuario.id,
        },
      });
      break;

    case "SECRETARIO":
      await prisma.secretario.create({
        data: {
          id: usuario.id,
          usuarioId: usuario.id,
        },
      });
      break;
  }

  return usuario;
};

export const listarSolicitacoesPendentes = async () => {
  return await prisma.solicitacaoRegistro.findMany({
    where: {
      status: "PENDENTE",
    },
    orderBy: { criadoEm: "asc" },
  });
};

export const historicoSolicitacoes = async (usuarioId) => {
  //TODO: trocar pro modelo de histórico ae
  return await prisma.solicitacaoRegistro.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: "asc" },
  });
};

export const deletarSolicitacao = async (id) => {
  return await prisma.solicitacaoRegistro.delete({
    where: { id },
  });
};
