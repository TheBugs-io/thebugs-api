import prisma from "../database/prisma.js";

export const listarReservas = async () => {
  return await prisma.reserva.findMany();
};

export const solicitarReserva = async (dadosReserva) => {
  const {
    localId,
    tipo,
    dataInicio,
    dataFim,
    usuarioId,
  } = dadosReserva;

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
    prisma.usuario.findUnique({ where: { id: usuarioId } })
  ]);

  if (!local) throw new Error("Local informado não existe.");
  if (!usuario) throw new Error("Usuário informado não existe.");

  return await prisma.solicitacaoReserva.create({
    data: {
      localId,
      tipo,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      usuarioId,
    },
  });
};