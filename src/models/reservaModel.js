import prisma from "../database/prisma.js";
import dataBrasilia from "../utils/datas.js";

//Todas as reservas aqui -> só ADMIN
export const listarReservas = async () => {
  return await prisma.reserva.findMany();
};

export const listarSolicitacoesReservas = async () => {
  return await prisma.solicitacaoReserva.findMany();
};

export const solicitarReserva = async (dadosReserva) => {
  const { localId, tipo, dataInicio, dataFim, usuarioId } = dadosReserva;

  const camposObrigatorios = { localId, tipo, dataInicio, dataFim, usuarioId };

  const camposFaltando = Object.entries(camposObrigatorios)
    .filter(([_, valor]) => valor === undefined || valor === null)
    .map(([campo]) => campo);

  if (camposFaltando.length > 0) {
    throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(", ")}`);
  }

  //Os dois tem que existir pra que a solicitação seja feita, aqui com a Promise eu testo os dois casos, e retorno os erros pelos ifs em baixo
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
      usuarioId,
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
}

//Vinculados ao modelo de Reserva
export const deletarReserva = async (id) => {
  const reserva = await prisma.reserva.findUnique({ where: { id } });

  if (!reserva) {
    throw new Error("Reserva não encontrada.");
  }

  return await prisma.solicitacaoReserva.delete({ where: { id } });
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

