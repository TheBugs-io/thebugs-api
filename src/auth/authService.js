import "bcrypt";
import "jsonwebtoken";
import validarEmailInstitucional from "../utils/validationEmail";

export const solicitarRegistro = async (req, res) => {
  try {
    const {
      nomeCompleto,
      nomeSocial,
      email,
      tipo,
      ...dadosEspecificos
    } = req.body;
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
      return res.status(409).json({ error: "Esse email já foi cadastrado! Fique atento ao seu email ou contate a secretaria." });
    }

    if(!validarEmailInstitucional(email)){
        return res.status(400).json({error: "Apenas e-mails institucionais do domínio UFC são permitidos."})
    }

    //TODO: Passar os dados específicos do tipo (Discente / Docente)

  } catch (error) {
    throw new Error("Erro ao solicitar sua conta: " + error.message);
  }
};