import prisma from "../database/prisma.js";

export const createFavorito = async (req, res) => {
  const { local_id } = req.body;
  const { user } = req;

  try {
    const LOCAL_EXISTE = await prisma.local.findUnique({ where: { id: Number(local_id) } });
    if (!LOCAL_EXISTE) {
      return res.status(400).json({ message: "Sala não existe" });
    }

    const usuario = await prisma.usuario.update({
      where: { id: Number(user.id) },
      data: { favoritos: { connect: { id: Number(local_id) } } },
      include: { favoritos: { select: { nome: true } } },
    });

    return res.json({ message: "Favorito adicionado", data: usuario.favoritos });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao adicionar favorito", error: error.message });
  }
};

export const deleteFavorito = async (req, res) => {
  const { local_id } = req.body;
  const { user } = req;
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(user.id) },
      data: {
        favoritos: {
          disconnect: { id: Number(local_id) },
        },
      },
      include: { favoritos: { select: { nome: true } } },
    });

    return res.json({ message: "Favorito removido", data: usuario.favoritos });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar favorito", erro: error });
  }
};

export const listarFavoritos = async (req, res) => {
  const { user } = req;

  const usuario = await prisma.usuario.findUnique({ where: { id: Number(user.id) }, include: { favoritos: true } });

  return res.json(usuario.favoritos);
};
