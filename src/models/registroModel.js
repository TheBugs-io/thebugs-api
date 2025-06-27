//TODO: Pra implementar essas funções, ainda falta definir algumas coisas nas autorizações de cada e o modelo definitivo do usuário

export const criarSolicitacaoRegistro = async (dados) => {
  // Implementação para salvar as solicitações no banco -> Após aprovar, provavelmente será deletado.
};

export const buscarSolicitacaoPorToken = async (token) => {
  // TODO or Remove
};

export const buscarSolicitacaoPorId = async (id) => {
  // TODO
};

export const atualizarStatusSolicitacao = async (id, status, adminId = null) => {
  // Atualiza status da solicitação
};

export const criarUsuario = async (dados) => {
  // Cria usuário definitivo
};