import prisma from "../database/prisma.js";

const ENTIDADES_VALIDAS = ["USUARIO", "RESERVA", "SALA", "SOLICITACAO"];
const CRUD_VALIDOS = ["CREATE", "UPDATE", "DELETE"];

function validarAcao(tipoEntidade, tipoCRUD) {
  const entidadeValida = ENTIDADES_VALIDAS.includes(tipoEntidade);
  const crudValido = CRUD_VALIDOS.includes(tipoCRUD);

  if (!entidadeValida || !crudValido) {
    return {
      error: `Ação inválida: tipoEntidade deve ser um dos [${ENTIDADES_VALIDAS.join(
        ", "
      )}], e tipoCRUD deve ser um dos [${CRUD_VALIDOS.join(", ")}]`,
    };
  }

  return null;
}

const registrarHistorico = async (acao, objeto, tipoCRUD, tipoEntidade) => {
  const validacao = validarAcao(tipoEntidade, tipoCRUD);
  
  if (validacao) {
    return { error: validacao.error };
  }

  try {
    const registro = await prisma.registroHistorico.create({
      data: { acao, objeto, tipoCRUD, tipoEntidade },
    });

    return { success: true, registro };
  } catch (error) {
    return {
      error: error.message || "Erro ao registrar histórico.",
    };
  }
};

export const lerHistorico = async (req, res) => {
  try {
    const registros = await prisma.registroHistorico.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(registros);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Erro ao ler o histórico.",
    });
  }
};

export default registrarHistorico;
