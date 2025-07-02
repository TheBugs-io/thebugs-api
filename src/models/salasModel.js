//import prisma from '../database/prisma.js';

//acabo de perceber que status nao vai existir...
//uma sala estará LIVRE em algumas horas e RESERVADA em outras, n faz sentido ficar atualizando constantemente o banco de dados com isso
//provavelmente será um dado que enviaremos ao front, mas nao vai existir no banco de dados
const salas = [
  {
    id: 1,
    nome: "sala 5",
    localização: "0A3D", //0º andar, terceira à direita
    status: "",
    capacidade: 30,
    tipo: "SALA",
    descricao: "um lugar muito bacana e cheio de amigos",
  },
  {
    id: 2,
    nome: "lab 5",
    localização: "1A2D", //1º andar, segunda à direita
    status: "",
    capacidade: 30,
    tipo: "LAB",
    descricao: "gandaia",
  },
];
const reservas = [
  {
    nome: "dig",
    responsavel: "inga saboia",
    sala_id: 1,
    inicio: "30-12-2000",
    fim: "01-01-2002",
    dias_da_semana: ["ter", "qui"],
    horarios: ["14:00-16:00", "14:00-16:00"],
  },
  {
    nome: "IHC",
    responsavel: "CATIA LINDA",
    sala_id: 2,
    inicio: "01-01-2000",
    fim: "21-07-2020",
    dias_da_semana: ["ter", "qui"],
    horarios: ["16:00-18:00", "16:00-18:00"],
  },
];

//isso aq vai ter que pesquisar la nas reservas
//vai mostrar oq ta ocorrendo no horario
const mapaNaData = (data = "0-0-0", horario = "10:00") => {
  const mapa = { andar0: [], andar1: [] };

  return mapa;
};

const salaNaData = (id, data = "0-0-0", horario = "10:00") => {
  const sala = salas.find((s) => s.id == id);
  const ENCONTRADA = sala != undefined;

  if (ENCONTRADA) {
    function extrairDadosData(data = "0-0-0") {
      const [diaDoMes, mes, ano] = data.split("-").map(Number);
      const diaDaSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][new Date(ano, mes, diaDoMes).getDay()];
      return [diaDoMes, mes, ano, diaDaSemana];
    }

    function compararDatas(dataAnalisar = "0-0-0", dataInicio = "0-0-0", dataFim = "0-0-0") {
      dataAnalisar = extrairDadosData(dataAnalisar);
      dataInicio = extrairDadosData(dataInicio);
      dataFim = extrairDadosData(dataFim);

      let taEntreAsDuas = true;
      for (let i = 0; i < 3; i++) {
        if (!(dataAnalisar[i] >= dataInicio[i] && dataAnalisar[i] <= dataFim[i])) taEntreAsDuas = false;
      }
      return taEntreAsDuas;
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

    try {
      const reservasDaSala = reservas.filter((r) => r.sala_id == id);
      const reservasNaData = reservasDaSala.filter((r) => compararDatas(data, r.inicio, r.fim));
      const diaDaSemana = extrairDadosData()[4];
      const reservasNoHorario = reservasNaData.filter((r) =>
        verificarDiaEHorario(diaDaSemana, r.dias_da_semana, horario, r.horarios)
      );

      const reservaEncontrada = reservasNoHorario[0];
      return reservaEncontrada;
    } catch (err) {
      //nenhuma reserva encontrada
      return 0;
    }
  }
  //sala não encontrada
  return -1;
};

const reservasDaSala = (sala_id, sortBy) => {
  return reservas.filter((r) => r.sala_id == sala_id);
};
