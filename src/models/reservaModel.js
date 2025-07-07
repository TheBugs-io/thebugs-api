import prisma from "../database/prisma.js";

export const listarReservas = async () => {
  return await prisma.reserva.findMany();
};

export const solicitarReserva = async (req, res) => {
  try {
    const {
      localId,
      tipo,
      dataInicio,
      dataFim,
      usuarioId,
    } = req.body;

    const camposObrigatorios = { localId, tipo, dataInicio, dataFim, usuarioId };

    const camposFaltando = Object.entries(camposObrigatorios)
      .filter(([_, valor]) => valor === undefined || valor === null)
      .map(([campo]) => campo);

    if (camposFaltando.length > 0) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando!",
        campos: camposFaltando,
      });
    }

    const novaSolicitacao = await prisma.solicitacaoReserva.create({
      data: {
        localId,
        tipo,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        usuarioId,
      },
    });

    return res.status(201).json(novaSolicitacao);
  } catch (error) {
    console.error("Erro ao solicitar reserva:", error);
    return res.status(500).json({
      error: "Erro interno ao criar solicitação de reserva.",
    });
  }
};
