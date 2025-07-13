import * as reservaModel from '../models/reservaModel.js'
import * as mailReserva from '../service/mailReserva.js';

export const listarReservas = async (req, res) => {
  try {
    const reservas = await reservaModel.listarReservas();
    res.status(200).json({ message: "Sem reservas por enquanto.", reservas })
  } catch (error) {
    res.status(500).json({ erro: error.message || "Erro ao listar!" });
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

export const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await reservaModel.deletarReserva(id);

    if (!reserva) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.status(200).json({ message: "Reserva cancelada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro ao cancelar a reserva." });
  }
};

export const listarReservasUsuario = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const reservas = await reservaModel.listarReservasUsuario(usuarioId);

    if (reservas.length === 0) {
      return res.status(404).json({ message: "Nenhuma reserva encontrada para este usuário." });
    }

    res.status(200).json({ reservas });
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro ao listar reservas do usuário." });
  }
};

export const atualizarStatusReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status é obrigatório." });
    }

    const reservaAtualizada = await reservaModel.atualizarStatusReserva(id, status);

    if (!reservaAtualizada) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    switch (status.toLowerCase()) {
      case 'cancelado':
        await mailReserva.notificarAtualizacaoReservaAdm(reservaAtualizada.email, reservaAtualizada, req.user.nome);
        return res.status(200).json({ message: "Reserva cancelada com sucesso." });
      case 'pendente':
        await mailReserva.notificarSecretariaPedido(reservaAtualizada);
        break;
      case 'rejeitado':
        await mailReserva.notificarUsuarioReserva(reservaAtualizada);
        await reservaModel.deletarReserva(id);
        return res.status(200).json({ message: "Reserva rejeitada e deletada." });
      case 'aprovado':
        await mailReserva.notificarUsuarioReserva(reservaAtualizada);
        break;
      default:
        return res.status(400).json({ error: "Status inválido." });
    }

    res.status(200).json({ message: "Status da reserva atualizado com sucesso.", reserva: reservaAtualizada });
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro ao atualizar o status da reserva." });
  }
};

export const deletarSolicitacao = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const solicitacao = await reservaModel.buscarSolicitacaoPorId(id);
    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    await reservaModel.deletarSolicitacao(id);
    res.status(200).json({ message: "Solicitação deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar solicitação:", error);
    res.status(500).json({ error: "Erro ao deletar solicitação." });
  }
}