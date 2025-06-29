import * as reservaModel from '../models/reservaModel.js'

export const listarReservas = async (req, res) => {
    try {
        const reservas = await reservaModel.listarReservas();
        res.status(200).json({message: "Sem reservas por enquanto.", reservas})
    } catch (error) {
        res.status(500).json({erro: error.message || "Erro ao listar!"});
    }
}