import prisma from "../database/prisma.js";

export const listarUsuarios = async () => {
  const users = await prisma.usuario.findMany();
  if (users.length === 0) {
    throw new Error("Nenhum usuário encontrado.");
  }
  return users;
};

export const buscarUsuarioPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });
  if (!usuario) {
    throw new Error("Usuário não encontrado...");
  }
  return usuario;
};

export const buscarUsuarioPorEmail = async (email) => {
  return await prisma.usuario.findUnique({
    where: {
      email: email.toLowerCase().trim(),
    },
  });
};

export const criarUsuario = async (dadosUsuario) => {
  return await prisma.usuario.create({
    data: dadosUsuario,
  });
};

export const atualizarSenha = async (id, senha) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });
  if (!usuario) {
    throw new Error("Usuário não encontrado...");
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  return await prisma.usuario.update({
    where: { id },
    data: { senha: senhaHash },
  });
};

/* export const atualizarUsuario = async (
  id,
  { nome, sobrenome, email, senha, tipo }
) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });
  if (!usuario) {
    throw new Error("Usuário não atualizado...");
  }
  const senhaHash = senha ? await bcrypt.hash(senha, 10) : usuario.senha;
  return await prisma.usuario.update({
    where: { id },
    data: {
      nome,
      sobrenome,
      email,
      senha: senhaHash,
      tipo,
    },
  });
};

export const excluirUsuario = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });
  if (!usuario) {
    throw new Error("Usuário não excluído...");
  }

  await prisma.usuario.delete({
    where: { id },
  });
};
 */
