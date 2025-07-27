import prisma from "../database/prisma.js";

export const pesquisar = async (string) => {
  const usuarios = await prisma.usuario.findMany({
    where: {
      nomeCompleto: { contains: string, mode: "insensitive" },
      OR: [{ tipo: "DOCENTE" }, { Reserva: { some: {} } }],
      NOT: {
        tipo: "ADMIN",
      },
    },
    orderBy: {
      nomeCompleto: "asc",
    },
    select: { nomeCompleto: true, id: true, Reserva: true },
  });

  const salas = await prisma.local.findMany({ where: { nome: { contains: string, mode: "insensitive" } } });

  const reservas = await prisma.reserva.findMany({
    where: {
      OR: [
        { nome: { contains: string, mode: "insensitive" } },
        { responsavel: { nomeCompleto: { contains: string, mode: "insensitive" }, NOT: { tipo: "SECRETARIO" } } },
      ],
    },
  });

  const resultados = { usuarios, salas, reservas };
  return resultados;
};
