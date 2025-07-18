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
export const salas = [
  {
    id: 1,
    nome: "sala 5",
    localizacao: "0A3D", //0º andar, terceira à direita
    status: "",
    capacidade: 30,
    tipo: "SALA",
    descricao: "um lugar muito bacana e cheio de amigos",
  },
  {
    id: 2,
    nome: "lab 5",
    localizacao: "1A2D", //1º andar, segunda à direita
    status: "",
    capacidade: 30,
    tipo: "LAB",
    descricao: "gandaia",
  },
  {
    id: 3,
    nome: "lab 1002",
    localizacao: "1A3D", //1º andar, segunda à direita
    status: "",
    capacidade: 30,
    tipo: "LAB",
    descricao: "loucuras",
  },
  { id: 4, nome: "teste", localizacao: "1..." },
  { id: 5, nome: "teste", localizacao: "1..." },
  { id: 6, nome: "teste", localizacao: "1..." },
  { id: 7, nome: "teste", localizacao: "1..." },
  { id: 8, nome: "teste", localizacao: "2..." },
  { id: 9, nome: "teste", localizacao: "2..." },
  { id: 10, nome: "teste", localizacao: "2..." },
  { id: 11, nome: "teste", localizacao: "2..." },
  { id: 12, nome: "teste", localizacao: "2..." },
  { id: 13, nome: "teste", localizacao: "3..." },
  { id: 14, nome: "teste", localizacao: "3..." },
];
export const reservas = [
  {
    nome: "dig",
    responsavel: "inga saboia",
    sala_id: 1,
    inicio: "01-01-2025",
    fim: "30-12-2025",
    dias_da_semana: ["ter", "qui"],
    horarios: ["14:00-16:00", "14:00-16:00"],
  },
  {
    nome: "IHC",
    responsavel: "CATIA LINDA",
    sala_id: 2,
    inicio: "01-01-2025",
    fim: "30-12-2025",
    dias_da_semana: ["ter", "qui"],
    horarios: ["16:00-18:00", "16:00-18:00"],
  },
  {
    nome: "INTRODUÇÃO A CIBERCULTURA",
    responsavel: "Linco",
    sala_id: 3,
    inicio: "01-01-2025",
    fim: "30-12-2025",
    dias_da_semana: ["qua", "sex"],
    horarios: ["16:00-18:00", "16:00-18:00"],
  },
  {
    nome: "Autoração Multimídia II",
    responsavel: "Velto",
    sala_id: 3,
    inicio: "01-01-2025",
    fim: "30-12-2025",
    dias_da_semana: ["qua", "sex"],
    horarios: ["14:00-16:00", "14:00-16:00"],
  },
];

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
