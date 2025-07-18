import prisma from "../database/prisma.js";
const TipoSala = [
  "SALA_AULA",
  "LABORATORIO",
  "LAB_ESPECIAL",
  "GABINETE",
  "SECRETARIA",
  "CENTRO_ACADEMICO",
  "COORDENACAO",
  "REUNIAO",
];
const Andares = ["PRIMEIRO_ANDAR", "SEGUNDO_ANDAR", "TERCEIRO_ANDAR"];
//vai precisar das tables: usuarios, salas e reservas

//acabo de perceber que status nao vai existir...
//uma sala estará LIVRE em algumas horas e RESERVADA em outras, n faz sentido ficar atualizando constantemente o banco de dados com isso
//provavelmente será um dado que enviaremos ao front, mas nao vai existir no banco de dados

export const criarSala = async ({ nome, descricao, tipo, andar, numeracao, capacidade }) => {
  nome = nome.trim();
  const PERTENCE_ENUM = TipoSala.includes(tipo) && Andares.includes(andar);
  if (PERTENCE_ENUM) {
    const sala = await prisma.local.create({
      data: {
        nome: nome,
        numeracaoSala: numeracao,
        tipo: tipo,
        localizacao: andar,
        capacidade: capacidade,
        descricao: descricao,
      },
    });
    return sala;
  }

  throw new Error("Cheque os enums da requisição");
};

export const mapaNaData = async (data = "00-00-0000T10:00") => {
  const [dia, _] = data.split("T");
  const hora = Number(_.slice(0, 2));

  const dataObj = new Date(
    ...dia
      .split("-")
      .reverse()
      .map((v, i) => (i == 1 ? Number(v) - 1 : Number(v)))
  );

  const diaSemana = [
    "DOMINGO",
    "SEGUNDA_FEIRA",
    "TERCA_FEIRA",
    "QUARTA_FEIRA",
    "QUINTA_FEIRA",
    "SEXTA_FEIRA",
    "SABADO",
  ][dataObj.getDay()];

  const mapa = await prisma.reserva.findMany({
    where: {
      dataInicio: { lte: dataObj },
      dataFim: { gte: dataObj },
      horarioInicio: { lte: hora },
      horarioFim: { gt: hora },
      repeteEm: { has: diaSemana },
    },
    include: { local: { select: { nome: true, localizacao: true, numeracaoSala: true } } },
  });

  return mapa;
};

export const salaNaData = async (id_sala, data = "00-01-0000T10:00") => {
  const sala = await prisma.local.findUnique({ where: { id: Number(id_sala) } });
  const ENCONTRADA = sala != null;

  if (ENCONTRADA) {
    const [dia, _] = data.split("T");
    const hora = Number(_.slice(0, 2));

    const dataObj = new Date(
      ...dia
        .split("-")
        .reverse()
        .map((v, i) => (i == 1 ? Number(v) - 1 : Number(v)))
    );
    const diaSemana = [
      "DOMINGO",
      "SEGUNDA_FEIRA",
      "TERCA_FEIRA",
      "QUARTA_FEIRA",
      "QUINTA_FEIRA",
      "SEXTA_FEIRA",
      "SABADO",
    ][dataObj.getDay()];

    const reserva = await prisma.reserva.findFirst({
      where: {
        localId: Number(id_sala),
        dataInicio: { lte: dataObj },
        dataFim: { gte: dataObj },
        horarioInicio: { lte: hora },
        horarioFim: { gt: hora },
        repeteEm: { has: diaSemana },
      },
    });
    if (reserva == null) return "livre";
    return reserva;
  }

  throw new Error("Sala não encontrada");
};

export const reservasDaSala = async (sala_id) => {
  // return reservas.filter((r) => r.sala_id == sala_id);
  const reservas = await prisma.reserva.findMany({ where: { localId: sala_id } });
  return reservas;
};

export const getSala = async (sala_id) => {
  const sala = await prisma.local.findUnique({ where: { id: sala_id } });
  return sala;
};
