import prisma from "../database/prisma.js";
import dataBrasilia from "../utils/datas.js";

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

export const deletarSala = async (sala_id) => {
  const sala = await prisma.local.delete({ where: { id: Number(sala_id) } });
  return sala;
};

export const editarSala = async (sala_id, novosDados) => {
  const atualizada = await prisma.local.update({ where: { id: sala_id }, data: { ...novosDados } });
  return atualizada;
};

export const mapaNaData = async (data = "00-00-0000T10:00") => {
  const [dia, _] = data.split("T");
  const hora = Number(_.slice(0, 2));

  // ...dia
  //   .split("-")
  //   .reverse()
  //   .map((v, i) => (i == 1 ? Number(v) - 1 : Number(v)))
  const dataObj = dataBrasilia({ string: data });

  const diaSemana = [
    "DOMINGO",
    "SEGUNDA_FEIRA",
    "TERCA_FEIRA",
    "QUARTA_FEIRA",
    "QUINTA_FEIRA",
    "SEXTA_FEIRA",
    "SABADO",
  ][dataObj.getDay()];

  const mapa = await prisma.local.findMany({
    select: {
      id: true,
      nome: true,
      reservas: {
        where: {
          dataInicio: { lte: dataObj },
          dataFim: { gte: dataObj },
          horarioInicio: { lte: hora },
          horarioFim: { gt: hora },
          OR: [{ repeteEm: { has: diaSemana } }, { repete: false }],
        },
        include: {
          responsavel: { select: { nomeCompleto: true, tipo: true } },
        },
      },
    },
  });

  return mapa;
};

export const salaNaData = async (id_sala, data = "0000-00-01T10:00") => {
  const sala = await prisma.local.findUnique({ where: { id: Number(id_sala) } });
  const ENCONTRADA = sala != null;

  if (ENCONTRADA) {
    // const [dia, _] = data.split("T");
    const hora = Number(data.split("T")[1].slice(0, 2));

    const dataObj = dataBrasilia({ string: data });

    const diaSemana = [
      "DOMINGO",
      "SEGUNDA_FEIRA",
      "TERCA_FEIRA",
      "QUARTA_FEIRA",
      "QUINTA_FEIRA",
      "SEXTA_FEIRA",
      "SABADO",
    ][dataObj.getDay()];

    console.log(dataObj.toISOString(), data, diaSemana, hora);

    const reserva = await prisma.reserva.findFirst({
      where: {
        localId: Number(id_sala),
        dataInicio: { lte: dataObj },
        dataFim: { gte: dataObj },
        horarioInicio: { lte: hora },
        horarioFim: { gt: hora },
        OR: [{ repeteEm: { has: diaSemana } }, { repete: false }],
      },
      include: {
        responsavel: { select: { nomeCompleto: true, tipo: true } },
      },
    });
    if (reserva == null) return "livre";
    return reserva;
  }

  throw new Error("Sala não encontrada");
};

export const reservasDaSala = async (sala_id) => {
  const reservas = await prisma.reserva.findMany({ where: { localId: sala_id } });
  return reservas;
};

export const getSala = async (sala_id) => {
  const sala = await prisma.local.findUnique({ where: { id: sala_id } });
  return sala;
};
