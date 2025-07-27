import prisma from "../database/prisma.js";

export const createFavorito = async (req, res) => {
  const { usuario } = req;

  try {
    const LOCAL_EXISTE = await prisma.local.findUnique({
      where: { id: Number(local_id) },
    });
    if (!LOCAL_EXISTE) {
      return res.status(400).json({ message: "Sala não existe" });
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(usuario.id) },
      data: { favoritos: { connect: { id: Number(local_id) } } },
      include: { favoritos: { select: { nome: true } } },
    });

    return res.json({
      message: "Favorito adicionado",
      data: usuarioAtualizado.favoritos,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao adicionar favorito", error: error.message });
  }
};

export const deleteFavorito = async (req, res) => {
  const { usuario } = req;
  const { local_id } = req.body;
  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(usuario.id) },
      data: {
        favoritos: {
          disconnect: { id: Number(local_id) },
        },
      },
      include: { favoritos: { select: { nome: true } } },
    });

    return res.json({ message: "Favorito removido", data: usuarioAtualizado.favoritos });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao deletar favorito", erro: error });
  }
};

export const listarFavoritos = async (req, res) => {
  const { usuario } = req;

  try {
    const usuarioComFavoritos = await prisma.usuario.findUnique({
      where: { id: Number(usuario.id) },
      include: { favoritos: true },
    });

    return res.json(usuarioComFavoritos.favoritos);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar favoritos", error: error.message });
  }
};