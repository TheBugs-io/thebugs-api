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
  const ENCONTRADA = sala != -1;

  if (ENCONTRADA) {
    const reservasDaSala = reservas.filter((r) => r.sala_id == id);

    //parei aqui; tem que achar uma forma de comparar as datas de reservas e creio q seja mais facil no prisma
    //preciso: ver se a reserva ta na data, ou seja, se a data em questao está entre o inicio e o fim da reserva E TAMBEM se repete no tal dia da semana
    //next: achar a reserva no dito horario (bem mais facil) (btw talvez seja melhor filtrar na ordem inversa. horario primeiro e dps data)

    // function compararDatas(d1 = "0-0-0", d2 = "0-0-0") {
    //   d1 = d1.split("-").map((_) => Number(_));
    //   d2 = d2.split("-").map((_) => Number(_));
    //   for (let i = 0; i < 3; i++) {
    //     if (d1[i] !== d2[i]) return false;
    //   }
    //   return true
    // }

    // const reservasNaData = reservasDaSala.filter(r=>compararDatas(r.inicio));
  } else {
  }

  return atribuicoes;
};
