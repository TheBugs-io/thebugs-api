import * as reservaModel from "../models/reservaModel.js";
import * as mailReserva from "../service/mailReserva.js";
import registrarHistorico from "./historicoController.js";

export const listarReservas = async (req, res) => {
  try {
    const reservas = await reservaModel.listarReservas();

    if (!reservas || reservas.length === 0) {
      return res
        .status(200)
        .json({ message: "Sem reservas por enquanto.", reservas: [] });
    }

    res.status(200).json({ reservas });
  } catch (error) {
    res.status(500).json({ erro: error.message || "Erro ao listar!" });
  }
};


export const solicitarReserva = async (req, res) => {
  try {
    const {
      localId,
      tipo,
      dataInicio,
      dataFim,
      horarioInicio,
      horarioFim,
      repeteEm,
      usuarioId,
    } = req.body;

    const solicitacao = await reservaModel.solicitarReserva({
      localId,
      tipo,
      dataInicio,
      dataFim,
      horarioInicio,
      horarioFim,
      repeteEm,
      usuarioId,
    });

    await registrarHistorico(
      "Reserva solicitada",
      solicitacao,
      "CREATE",
      "SOLICITACAO"
    );

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

export const listarSolicitacoesReservas = async (req, res) => {
  try {
    const solicitacoes = await reservaModel.listarSolicitacoesReservas();
    res.status(200).json({ solicitacoes });
  } catch (error) {
    res
      .status(500)
      .json({
        error: error.message || "Erro ao listar solicitações de reservas.",
      });
  }
};

export const cancelarReserva = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const reserva = await reservaModel.deletarReserva(id);

    if (!reserva) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    await registrarHistorico("Reserva cancelada", reserva, "DELETE", "RESERVA");

    res.status(200).json({ message: "Reserva cancelada com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Erro ao cancelar a reserva." });
  }
};

export const listarReservasUsuario = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const reservas = await reservaModel.listarReservasUsuario(usuarioId);

    if (reservas.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma reserva encontrada para este usuário." });
    }

    res.status(200).json({ reservas });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Erro ao listar reservas do usuário." });
  }
};

export const atualizarStatusReserva = async (req, res) => {
  try {
    const { id } = req.body;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status é obrigatório." });
    }

    const reservaAtualizada = await reservaModel.atualizarStatusReserva(
      id,
      status
    );

    if (!reservaAtualizada) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    switch (status.toLowerCase()) {
      case "cancelado":
        await mailReserva.notificarAtualizacaoReservaAdm(
          reservaAtualizada.email,
          reservaAtualizada,
          req.user.nome
        );
        return res
          .status(200)
          .json({ message: "Reserva cancelada com sucesso." });
      case "pendente":
        await mailReserva.notificarSecretariaPedido(reservaAtualizada);
        break;
      case "rejeitado":
        await mailReserva.notificarUsuarioReserva(reservaAtualizada);
        await reservaModel.deletarReserva(id);
        return res
          .status(200)
          .json({ message: "Reserva rejeitada e deletada." });
      case "aprovado":
        await mailReserva.notificarUsuarioReserva(reservaAtualizada);
        break;
      default:
        return res.status(400).json({ error: "Status inválido." });
    }

    await registrarHistorico(
      "Reserva atualizada",
      reservaAtualizada,
      "UPDATE",
      "RESERVA"
    );

    res
      .status(200)
      .json({
        message: "Status da reserva atualizado com sucesso.",
        reserva: reservaAtualizada,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        error: error.message || "Erro ao atualizar o status da reserva.",
      });
  }
};

export const atualizarStatusSolicitacao = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status é obrigatório." });
  }

  try {
    let resultado;
    let message;

    if (status.toUpperCase() === "APROVADO") {
      resultado = await reservaModel.aprovarSolicitacao(id);
      message = "Solicitação aprovada e reserva criada com sucesso.";
      await registrarHistorico("Solicitação aprovada", resultado, "UPDATE", "SOLICITACAO");
      return res.status(200).json({ message, reserva: resultado });
    }

    if (status.toUpperCase() === "REJEITADO") {
      await reservaModel.rejeitarSolicitacao(id);
      const solicitacao = await reservaModel.buscarSolicitacaoReserva(id);
      await registrarHistorico("Solicitação rejeitada", solicitacao, "DELETE", "SOLICITACAO");
      return res.status(200).json({ message: "Solicitação rejeitada com sucesso." });
    }

    resultado = await reservaModel.atualizarStatusReserva(id, { status });

    if (!resultado) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    message = "Status da solicitação atualizado com sucesso.";
    await registrarHistorico("Solicitação atualizada", resultado, "UPDATE", "SOLICITACAO");
    return res.status(200).json({ message, solicitacao: resultado });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Erro ao atualizar o status da solicitação.",
    });
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

    await reservaModel.rejeitarSolicitacao(id);
    await registrarHistorico(
      "Solicitação rejeitada",
      solicitacao,
      "DELETE",
      "SOLICITACAO"
    );
    res.status(200).json({ message: "Solicitação rejeitada com sucesso." });
  } catch (error) {
    console.error("Erro ao rejeitar solicitação:", error);
    res.status(500).json({ error: "Erro ao rejeitar solicitação." });
  }
};
