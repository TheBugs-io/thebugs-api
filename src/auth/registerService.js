import bcrypt from "bcrypt";
import * as registroModel from "../models/registroModel.js";
import prisma from "../database/prisma.js";
import { v4 as uuidv4 } from "uuid";
import validarEmailInstitucional from "../utils/validationEmail.js";
import {
  enviarEmailConfirmacao,
  notificarSecretaria, notificarStatusRegistro,
  notificarUsuario
} from "../service/mailRegister.js";
import gerarSenhaInicial from "../utils/generatePassword.js";

export const solicitarRegistro = async (req, res) => {
  try {
    const {
      nomeCompleto,
      nomeSocial,
      email,
      tipoUsuario,
      ...dadosEspecificos
    } = req.body;

    const camposObrigatorios = { nomeCompleto, email, tipoUsuario };
    const camposFaltando = Object.entries(camposObrigatorios)
      .filter(([_, valor]) => !valor)
      .map(([campo]) => campo);

    if (camposFaltando.length > 0) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando!",
        campos: camposFaltando,
      });
    }

    if (await registroModel.verificarEmailExistente(email)) {
      return res.status(409).json({ error: "Email já está em uso" });
    }

    if (!validarEmailInstitucional(email)) {
      return res.status(400).json({
        error: "Apenas e-mails institucionais do domínio UFC são permitidos.",
      });
    }

    const tokenConfirmacao = uuidv4();

    await registroModel.criarSolicitacaoRegistro({
      nomeCompleto,
      nomeSocial,
      email,
      tipoUsuario,
      token: tokenConfirmacao,
      ...dadosEspecificos,
    });

    await enviarEmailConfirmacao(email, tokenConfirmacao);

    return res.status(201).json({
      message:
        "Solicitação de registro criada com sucesso. Por favor, verifique seu email para confirmar sua conta.",
    });
  } catch (error) {
    console.error("Erro ao solicitar registro:", error);
    return res.status(500).json({
      error:
        "Erro ao processar sua solicitação de registro. Por favor, tente novamente.",
    });
  }
};

export const confirmarEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const solicitacao = await prisma.solicitacaoRegistro.findUnique({
      where: { token },
    });

    if (!solicitacao) {
      return res.status(404).json({
        error: "Token de confirmação inválido ou expirado.",
      });
    }

    if (solicitacao.status !== "PENDENTE") {
      return res.status(400).json({
        error: "Esta solicitação já foi processada.",
      });
    }

    await prisma.solicitacaoRegistro.update({
      where: { id: solicitacao.id },
      data: { status: "PENDENTE" },
    });

    await notificarSecretaria(solicitacao);

    return res.status(200).json({
      message:
        "Email confirmado com sucesso! Sua conta está agora aguardando aprovação do administrador.",
    });
  } catch (error) {
    console.error("Erro ao confirmar email:", error);
    return res.status(500).json({
      error: "Erro ao confirmar email.",
    });
  }
};

//MARK: - Rotas de secretario
//TODO: Talvez remover
export const buscarPorToken = async (req, res) => {
  try {
    const { token } = req.params;
    const solicitacao = await registroModel.buscarSolicitacaoPorToken(token);

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    res.status(200).json(solicitacao);
  } catch (error) {
    console.error("Erro ao buscar por token:", error);
    res.status(500).json({ error: "Erro interno ao buscar token." });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitacao = await registroModel.buscarSolicitacaoPorId(id);

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    res.status(200).json(solicitacao);
  } catch (error) {
    console.error("Erro ao buscar por ID:", error);
    res.status(500).json({ error: "Erro interno." });
  }
};

export const buscarPorEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const solicitacao = await registroModel.buscarSolicitacaoPorEmail(email);

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    res.status(200).json(solicitacao);
  } catch (error) {
    console.error("Erro ao buscar por email:", error);
    res.status(500).json({ error: "Erro interno." });
  }
};

export const listarPendentes = async (req, res) => {
  try {
    const solicitacoes = await registroModel.listarSolicitacoesPendentes();
    res.status(200).json(solicitacoes);
  } catch (error) {
    console.error("Erro ao listar solicitações:", error);
    res.status(500).json({ error: "Erro ao listar solicitações." });
  }
};

export const historicoSolicitacoes = async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    const historico = await registroModel.historicoSolicitacoes(usuarioId);
    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico de solicitações:", error);
    res.status(500).json({ error: "Erro ao buscar histórico de solicitações." });
  }
};

export const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const secretarioId = req.user?.tipo === "SECRETARIO" ? req.user.id : null;

    const atualizada = await registroModel.atualizarStatusSolicitacao(
      Number(id),
      status,
      secretarioId
    );

    if (status.toLowerCase() === 'rejeitado') {
      const dadosSolicitacao = await registroModel.buscarPorId(Number(id));
      await notificarStatusRegistro(dadosSolicitacao.email, dadosSolicitacao.nome);
      await deletarRegistro(Number(id));
    } else if (status.toLowerCase() === 'aprovado') {
      const response = await confirmarCriacaoUsuarioInterno(Number(id));
      if (response.erro) {
        return res.status(response.status).json({ error: response.erro });
      }
    }

    res.status(200).json(atualizada);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro ao atualizar status." });
  }
};

export const deletarSolicitacao = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const solicitacao = await registroModel.buscarSolicitacaoPorId(id);
    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    await registroModel.deletarSolicitacao(id);
    res.status(200).json({ message: "Solicitação deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar solicitação:", error);
    res.status(500).json({ error: "Erro ao deletar solicitação." });
  }
};

//MARK: - Lógica de criação de usuário
export const confirmarCriacaoUsuarioInterno = async (id) => {
  try {
    const solicitacao = await prisma.solicitacaoRegistro.findUnique({ where: { id } });
    if (!solicitacao) return { erro: "Solicitação não encontrada.", status: 404 };

    const jaExisteUsuario = await prisma.usuario.findUnique({ where: { email: solicitacao.email } });
    if (jaExisteUsuario) return { erro: "Usuário já existe com esse e-mail.", status: 409 };

    const senhaInicial = gerarSenhaInicial(10);
    const senhaHash = await bcrypt.hash(senhaInicial, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nomeCompleto: solicitacao.nomeCompleto,
        nomeSocial: solicitacao.nomeSocial,
        email: solicitacao.email,
        senha: senhaHash,
        tipo: solicitacao.tipoUsuario,
      },
    });

    await prisma.solicitacaoRegistro.update({
      where: { id: solicitacao.id },
      data: { status: "APROVADO", usuarioId: novoUsuario.id },
    });

    await notificarUsuario(novoUsuario.email, senhaInicial);
    return { usuario: novoUsuario, senha: senhaInicial };
  } catch (error) {
    console.error("Erro interno ao criar usuário:", error);
    return { erro: "Erro interno ao criar usuário.", status: 500 };
  }
};