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

export const listarSalas = async () => {
  const salas = await prisma.local.findMany();
  return salas;
};

export const criarSala = async ({
  nome,
  descricao,
  tipo,
  localizacao,
  numeracaoSala,
  capacidade,
}) => {
  nome = nome.trim();

  const PERTENCE_ENUM = TipoSala.includes(tipo) && Andares.includes(localizacao);
  if (!PERTENCE_ENUM) {
    throw new Error("Tipo ou localização inválidos. Cheque os enums da requisição.");
  }

  const salaExistente = await prisma.local.findFirst({
    where: {
      numeracaoSala,
      localizacao,
    },
  });

  if (salaExistente) {
    throw new Error(
      `Já existe uma sala com a numeração "${numeracaoSala}" no local "${localizacao}".`
    );
  }

  // Criação da sala
  const sala = await prisma.local.create({
    data: {
      nome,
      descricao,
      tipo,
      localizacao,
      numeracaoSala,
      capacidade,
    },
  });

  return sala;
};

export const deletarSala = async (sala_id) => {
  const sala = await prisma.local.delete({ where: { id: Number(sala_id) } });
  return sala;
};

export const editarSala = async (sala_id, novosDados) => {
  const atualizada = await prisma.local.update({ where: { id: sala_id }, data: { ...novosDados } });
  return atualizada;
};

// traz atualizacao do mapa de salas na data, por padrão vem a data atual do sistema
export const mapaNaData = async (dataHora = null) => {
  const dataObj = dataHora ? dataBrasilia({ string: dataHora }) : new Date();
  
  const hora = dataObj.getHours();
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
      tipo: true,
      localizacao: true,
      capacidade: true,
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
    orderBy: [
      { localizacao: 'asc' },
      { numeracaoSala: 'asc' } 
    ],
  });

  return mapa;
};

//traz as infos da sala na data e deve estar vinculada com a função mapaNaData
export const salaNaData = async (id_sala, dataHora = null) => {
  const sala = await prisma.local.findUnique({ 
    where: { id: Number(id_sala) },
    include: {
      responsavel: { select: { nomeCompleto: true } },
    }
  });
  
  if (!sala) {
    throw new Error("Sala não encontrada");
  }

  const dataObj = dataHora ? dataBrasilia({ string: dataHora }) : new Date();
  const hora = dataObj.getHours();
  getDiaSemana = (data) => {
    const dias = [
      "DOMINGO",
      "SEGUNDA_FEIRA",
      "TERCA_FEIRA",
      "QUARTA_FEIRA",
      "QUINTA_FEIRA",
      "SEXTA_FEIRA",
      "SABADO"
    ];
    return dias[data.getDay()];
  };

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

  return {
    ...sala,
    status: reserva ? "reservada" : "livre",
    reservaAtual: reserva || null
  };
};

//feat: verifica a disponibilidade da sala
export const verificarDisponibilidadePeriodo = async (
  sala_id,
  dataInicio,
  dataFim,
  horarioInicio,
  horarioFim,
  repete = false,
  repeteEm = []
) => {
  const inicio = dataBrasilia({ string: dataInicio });
  const fim = dataBrasilia({ string: dataFim });
  
  const sala = await prisma.local.findUnique({
    where: { id: Number(sala_id) }
  });
  
  if (!sala) {
    throw new Error("Sala não encontrada");
  }

  const reservasConflitantes = await prisma.reserva.findMany({
    where: {
      localId: Number(sala_id),
      OR: [
        {
          repete: false,
          dataInicio: { lte: fim },
          dataFim: { gte: inicio },
          OR: [
            {
              horarioInicio: { lt: horarioFim },
              horarioFim: { gt: horarioInicio }
            }
          ]
        },
        {
          repete: true,
          dataInicio: { lte: fim },
          dataFim: { gte: inicio },
          repeteEm: {
            hasSome: repete ? repeteEm : [getDiaSemana(inicio)]
          },
          horarioInicio: { lt: horarioFim },
          horarioFim: { gt: horarioInicio }
        }
      ]
    },
    include: {
      responsavel: {
        select: { nomeCompleto: true }
      }
    }
  });

  return {
    disponivel: reservasConflitantes.length === 0,
    conflitos: reservasConflitantes,
    mensagem: reservasConflitantes.length > 0
      ? `A sala possui ${reservasConflitantes.length} reserva(s) conflitante(s) neste período`
      : "Sala disponível no período solicitado"
  };
};

//todo: modularizar essa função 
function getDiaSemana(data) {
  const dias = [
    "DOMINGO",
    "SEGUNDA_FEIRA",
    "TERCA_FEIRA",
    "QUARTA_FEIRA",
    "QUINTA_FEIRA",
    "SEXTA_FEIRA",
    "SABADO"
  ];
  return dias[data.getDay()];
}

export const reservasDaSala = async (sala_id) => {
  const reservas = await prisma.reserva.findMany({
    where: { localId: Number(sala_id) }, include: { responsavel: {
      select: { nomeCompleto: true, tipo: true },
    } },
  });
  return reservas;
};

export const getSala = async (sala_id) => {
  const sala = await prisma.local.findUnique({ where: { id: sala_id } });
  return sala;
};
