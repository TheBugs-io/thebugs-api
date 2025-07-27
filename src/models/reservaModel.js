import prisma from "../database/prisma.js";
import dataBrasilia from "../utils/datas.js";

//Todas as reservas aqui -> só ADMIN
export const listarReservas = async () => {
  return await prisma.reserva.findMany({
    include: {
      responsavel: {
        select: {
          nomeCompleto: true,
          email: true,
          tipo: true,
        },
      },
      local: {
        select: {
          nome: true,
          localizacao: true,
        },
      },
    },
  });
};

export const listarSolicitacoesReservas = async () => {
  return await prisma.solicitacaoReserva.findMany({
    include: {
      usuario: {
        select: {
          nomeCompleto: true,
          email: true,
          tipo: true,
        },
      },
      local: {
        select: {
          nome: true,
        },
      },
    },
  });
};

export const solicitarReserva = async (dadosReserva) => {
  const {
    localId,
    tipo,
    dataInicio,
    dataFim,
    horarioInicio,
    horarioFim,
    repeteEm,
    usuarioId,
  } = dadosReserva;

  const camposObrigatorios = {
    localId,
    tipo,
    dataInicio,
    dataFim,
    horarioInicio,
    horarioFim,
    repeteEm,
    usuarioId,
  };

  const camposFaltando = Object.entries(camposObrigatorios)
    .filter(([_, valor]) => valor === undefined || valor === null)
    .map(([campo]) => campo);

  if (camposFaltando.length > 0) {
    throw new Error(
      `Campos obrigatórios faltando: ${camposFaltando.join(", ")}`
    );
  }

  const [local, usuario] = await Promise.all([
    prisma.local.findUnique({ where: { id: localId } }),
    prisma.usuario.findUnique({ where: { id: usuarioId } }),
  ]);

  if (!local) throw new Error("Local informado não existe.");
  if (!usuario) throw new Error("Usuário informado não existe.");

  return await prisma.solicitacaoReserva.create({
    data: {
      localId,
      tipo,
      dataInicio: dataBrasilia({ string: dataInicio }),
      dataFim: dataBrasilia({ string: dataFim }),
      horarioInicio,
      horarioFim,
      repeteEm,
      usuarioId,
    },
    include: {
      local: {
        select: {
          nome: true,
        },
      },
    },
  });
};

export const buscarSolicitacaoReserva = async (id) => {
  const solicitacao = await prisma.solicitacaoReserva.findUnique({
    where: { id },
  });

  if (!solicitacao) {
    throw new Error("Solicitação de reserva não encontrada.");
  }

  return solicitacao;
};

//Vinculados ao modelo de Reserva
export const deletarReserva = async (id) => {
  const reserva = await prisma.reserva.findUnique({ where: { id } });

  if (!reserva) {
    throw new Error("Reserva não encontrada.");
  }

  return await prisma.reserva.delete({ where: { id } });
};

export const listarReservasUsuario = async (usuarioId) => {
  return await prisma.reserva.findMany({
    where: { usuarioId },
  });
};

export const atualizarStatusReserva = async (id, status) => {
  const reserva = await prisma.reserva.findUnique({ where: { id } });

  if (!reserva) {
    throw new Error("Reserva não encontrada.");
  }

  return await prisma.reserva.update({
    where: { id },
    data: { status },
  });
};

//nota: já que a solicitação não tem um nome, aqui a gente ta transformando o nome no modelo de reserva ser o nome do local, tipo "Sala 01"
export const aprovarSolicitacao = async (id) => {
  const idNum = Number(id);

  const solicitacao = await prisma.solicitacaoReserva.findUnique({
    where: { id: idNum },
    include: { local: true },
  });

  if (!solicitacao) {
    throw new Error("Solicitação de reserva não encontrada.");
  }

  const novaReserva = await prisma.reserva.create({
    data: {
      nome: solicitacao.local.nome,
      tipo: solicitacao.tipo,
      dataInicio: solicitacao.dataInicio,
      dataFim: solicitacao.dataFim,
      horarioInicio: solicitacao.horarioInicio,
      horarioFim: solicitacao.horarioFim,
      localId: solicitacao.localId,
      responsavelId: solicitacao.usuarioId,
      statusPedido: "APROVADO",
    },
  });

  await prisma.solicitacaoReserva.delete({ where: { id: idNum } });

  return novaReserva;
};
