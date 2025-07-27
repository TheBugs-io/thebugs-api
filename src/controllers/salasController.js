import * as salaModel from "../models/salasModel.js";

export const listarSalas = async (req, res) => {
  try {
    const salas = await salaModel.listarSalas();

    if (salas.length === 0) {
      return res
        .status(200)
        .json({ message: "Nenhuma sala encontrada.", salas: [] });
    }

    return res.status(200).json({ salas });
  } catch (error) {
    console.error("Erro ao listar salas:", error);
    return res.status(500).json({ error: "Erro ao buscar salas." });
  }
};

export const criarSala = async (req, res) => {
  const { sala } = req.body;

  if (!sala || typeof sala !== "object") {
    return res.status(400).json({ error: "Dados da sala inválidos." });
  }

  try {
    const novaSala = await salaModel.criarSala(sala);

    return res.status(201).json({
      message: "Sala criada com sucesso.",
      sala: novaSala,
    });
  } catch (error) {
    console.error("Erro ao criar sala:", error);

    return res.status(500).json({
      error: "Erro ao criar sala.",
      details: error.message,
    });
  }
};

//  /mapa?data=DD-MM-AAAATHH:MM
export const mapaNaData = async (req, res) => {
  const { data } = req.query;
  const [dia, hora] = data.split("T");
  const FORMATO_VALIDO =
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dia) &&
    /^[0-9]{2}:[0-9]{2}$/.test(hora);
  if (!FORMATO_VALIDO) return res.sendStatus(400);

  const mapa = await salaModel.mapaNaData(data);
  return res.send(mapa);
};

//pega oq ta acontecendo naquela sala naquele horario (util pra favoritos, pra ver oq ta acontecendo ou vai acontecer)
export const salaNaData = async (req, res) => {
  const { sala_id, data } = req.query;
  const [dia, hora] = data.split("T");
  const FORMATO_VALIDO =
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dia) &&
    /^[0-9]{2}:[0-9]{2}$/.test(hora) &&
    /[0-9]{1,6}/.test(sala_id);
  if (!FORMATO_VALIDO) return res.sendStatus(400);

  const reserva = await salaModel.salaNaData(sala_id, data);
  return res.send(reserva);
};

export const reservasDaSala = async (req, res) => {
  const id = parseInt(req.query.sala_id, 10);

  if (!Number.isInteger(id) || id < 1 || id > 999999) {
    return res.status(400).json({ error: "ID da sala inválido" });
  }

  try {
    const reservas = await salaModel.reservasDaSala(id);
    return res.status(200).json(reservas);
  } catch (error) {
    console.error("Erro ao buscar reservas da sala:", error);
    return res.status(500).json({ error: "Erro interno ao buscar reservas." });
  }
};

export const getSala = async (req, res) => {
  const { id } = req.params;
  if (!/[0-9]{1,6}/.test(id)) return res.sendStatus(400);

  const sala = await salaModel.getSala(Number(id));
  return res.send(sala);
};

//precisa de 'novosDados' no body
export const editarSala = async (req, res) => {
  const { sala_id, novosDados } = req.body;

  const permitido = [
    "nome",
    "numeracaoSala",
    "descricao",
    "tipo",
    "localizacao",
    "status",
    "capacidade",
  ];
  function validarDados(dataObj) {
    for (let key in dataObj) {
      if (!permitido.includes(key)) return false;
    }
    return true;
  }
  const FORMATO_VALIDO =
    typeof sala_id == "number" &&
    typeof novosDados == "object" &&
    validarDados(novosDados);

  if (FORMATO_VALIDO) {
    const editada = await salaModel.editarSala(sala_id, novosDados);
    return res
      .status(200)
      .json({ message: "Editada com sucesso", data: editada });
  }
  return res.status(400).json({
    message: `Envie 'sala_id' inteiro e 'novosDados' no body com algum dos campos permitidos (${permitido})`,
  });
};

export const deletarSala = async (req, res) => {
  const { sala_id } = req.body;
  if (typeof sala_id == "number") {
    const deletada = await salaModel.deletarSala(sala_id);
    return res
      .status(200)
      .json({ message: "Deletada com sucesso", data: deletada });
  }
  return res.status(400).json({ message: "'sala_id' deve ser inteiro" });
};
