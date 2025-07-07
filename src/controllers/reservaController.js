import * as reservaModel from '../models/reservaModel.js'

export const listarReservas = async (req, res) => {
    try {
        const reservas = await reservaModel.listarReservas();
        res.status(200).json({message: "Sem reservas por enquanto.", reservas})
    } catch (error) {
        res.status(500).json({erro: error.message || "Erro ao listar!"});
    }
}

export const solicitarReserva = async (req, res) => {
  try {
    const {
      localId,
      tipo,
      dataInicio,
      dataFim,
      usuarioId,
    } = req.body;

    const solicitacao = await reservaModel.solicitarReserva({
      localId,
      tipo,
      dataInicio,
      dataFim,
      usuarioId,
    });

    res.status(200).json({
      message: "Reserva solicitada. Aguarde a aprovação da secretaria.",
      solicitacao,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Erro ao solicitar sua reserva.",
    });
  }
};