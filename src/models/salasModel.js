//import prisma from '../database/prisma.js';
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

export const mapaNaData = (data = "0-0-0", horario = "10:00") => {
  const mapa = {};

  for (let sala of salas) {
    const reserva = salaNaData(sala.id, data, horario);
    const [andar, _, ordem, lado] = sala.localizacao; //pensei que ia ser usado em outro canto; se pa muda pra const andar = sala.localizacao[0]
    if (mapa[`andar${andar}`] == undefined) mapa[`andar${andar}`] = [];
    mapa[`andar${andar}`].push({ sala, reserva });
  }

  return mapa;
};

export const salaNaData = (id, data = "0-0-0", horario = "10:00") => {
  const sala = salas.find((s) => s.id == id);
  const ENCONTRADA = sala != undefined;

  if (ENCONTRADA) {
    //vê se uma data ta entre outras duas
    function compararDatas(dataAnalise, dataInicio, dataFim) {
      dataAnalise = new Date(dataAnalise.split("-").reverse().join("-"));
      dataInicio = new Date(dataInicio.split("-").reverse().join("-"));
      dataFim = new Date(dataFim.split("-").reverse().join("-"));
      return dataAnalise >= dataInicio && dataAnalise <= dataFim;
    }

    //vê se a reserva ocorre no dia da semana e horario informados
    function verificarDiaEHorario(dia, diasPossiveis = [], horario, horariosPossiveis = []) {
      const index = diasPossiveis.indexOf(dia);
      if (index == -1) return false;

      //converte os horarios do formato "14:30" para 14.5 ou "09:15" para 9.25
      const [horaInicio, horaFim] = horariosPossiveis[index]
        .split("-")
        .map((s) => s.split(":").map(Number))
        .map((h) => h[0] + h[1] / 60);
      horario = horario.split(":").map(Number);
      horario = horario[0] + horario[1] / 60;

      return horaInicio <= horario && horaFim >= horario;
    }

    const diaDaSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][
      new Date(data.split("-").reverse().join("-")).getDay()
    ];

    let reservasPossiveis = reservas.filter((r) => r.sala_id == id);
    reservasPossiveis = reservasPossiveis.filter((r) => compararDatas(data, r.inicio, r.fim));
    reservasPossiveis = reservasPossiveis.filter((r) =>
      verificarDiaEHorario(diaDaSemana, r.dias_da_semana, horario, r.horarios)
    );

    return reservasPossiveis[0] ? reservasPossiveis[0] : "livre";
  }
  //sala não encontrada
  return -1;
};

export const reservasDaSala = (sala_id, sortBy) => {
  return reservas.filter((r) => r.sala_id == sala_id);
};

export const getSala = (sala_id) => {
  return salas.filter((s) => {
    sala_id == s.id;
  });
};
