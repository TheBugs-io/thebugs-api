import prisma from "../database/prisma.js";

export const pesquisar = async (string) => {
  const usuarios = await prisma.usuario.findMany({
    where: {
      AND: [
        { nomeCompleto: { contains: string, mode: "insensitive" } },
        {
          OR: [
            { tipo: "DOCENTE" },
            { Reserva: { some: {} } }
          ]
        },
        { NOT: { tipo: "ADMIN" } }
      ]
    },
    orderBy: { nomeCompleto: "asc" },
    select: {
      id: true,
      nomeCompleto: true,
      Reserva: {
        select: {
          id: true,
        }
      }
    }
  });

  const salas = await prisma.local.findMany({
    where: { nome: { contains: string, mode: "insensitive" } }
  });

  const reservas = await prisma.reserva.findMany({
    where: { nome: { contains: string, mode: "insensitive" } }
  });

  return { usuarios, salas, reservas };
};
