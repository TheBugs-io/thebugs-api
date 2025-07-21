import prisma from "../database/prisma.js";

export const createFavorito = async (req, res) => {
  const { reserva_id } = req.body;
  const { user } = req;

  const usuario = await prisma.usuario.update({
    where: { id: Number(user.id) },
    data: { favoritos: { connect: { id: Number(reserva_id) } } },
    include: { favoritos: { select: { nome: true } } },
  });

  return res.json({ message: "Favorito adicionado", data: usuario.favoritos });
};

export const deleteFavorito = async (req, res) => {
  const { reserva_id } = req.body;
  const { user } = req;
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(user.id) },
      data: {
        favoritos: {
          disconnect: { id: Number(reserva_id) },
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
