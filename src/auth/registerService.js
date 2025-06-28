import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokenUtils.js";
import * as modelRegister from "../models/registroModel";
import validarEmailInstitucional from "../utils/validationEmail";

export const solicitarRegistro = async (req, res) => {
  try {
    const { nomeCompleto, nomeSocial, email, tipo, ...dadosEspecificos } =
      req.body;
    const camposObrigatorios = { nomeCompleto, email, tipo };
    const camposFaltando = Object.entries(camposObrigatorios)
      .filter(([_, valor]) => !valor)
      .map(([campo]) => campo);

    if (camposFaltando.length > 0) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando!",
        campos: camposFaltando,
      });
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res
        .status(409)
        .json({
          error:
            "Esse email já foi cadastrado! Fique atento ao seu email ou contate a secretaria.",
        });
    }

    if (!validarEmailInstitucional(email)) {
      return res
        .status(400)
        .json({
          error: "Apenas e-mails institucionais do domínio UFC são permitidos.",
        });
    }

    const senhaHash = bcrypt.hash(senha, 10);
    const tokenConfirmacao = generateToken();

    const solicitacao = await modelRegister.criarSolicitacaoRegistro({
      nomeCompleto,
      nomeSocial,
      email,
      tipo,
      senha: senhaHash,
      dadosEspecificos,
      tokenConfirmacao,
      status: 'pendente'
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

    const solicitacao = await modelRegister.buscarSolicitacaoPorToken(token);
    
    if (!solicitacao) {
      return res.status(404).json({ error: "Token de confirmação inválido ou expirado." });
    }

    if (solicitacao.status !== 'pendente') {
      return res.status(400).json({ error: "Esta solicitação já foi processada." });
    }

    await atualizarStatusSolicitacao(solicitacao.id, 'aguardando_aprovacao');

    await enviarEmailAprovacaoAdmin(solicitacao);

    return res.status(200).json({ 
      message: "Email confirmado com sucesso! Sua conta está agora aguardando aprovação do administrador." 
    });

  } catch (error) {
    console.error("Erro ao confirmar email:", error);
    return res.status(500).json({ error: "Erro ao confirmar email." });
  }
};