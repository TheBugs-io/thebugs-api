import prisma from "../database/prisma.js";

const registrarHistorico = async (acao, objeto, tipoCRUD, tipoEntidade) => {
  const entidadesPossiveis = ["USUARIO", "RESERVA", "SALA", "SOLICITACAO"];
  const CRUD = ["CREATE", "UPDATE", "DELETE"];
  const ACAO_VALIDA = entidadesPossiveis.includes(tipoEntidade) && CRUD.includes(tipoCRUD);
  if (!ACAO_VALIDA)
    throw new Error(`Ação precisa ser de alguma das entidades ${entidadesPossiveis} ou tipos CRUD ${CRUD}`);

  const registro = await prisma.registroHistorico.create({ data: { acao, objeto, tipoCRUD, tipoEntidade } });
  return registro;
};

export const lerHistorico = async (req, res) => {
  const registros = await prisma.registroHistorico.findMany();
  return res.json(registros);
};

export default registrarHistorico;
