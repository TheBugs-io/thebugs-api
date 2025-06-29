import prisma from '../database/prisma.js';

export const listarReservas = async () => {
    return await prisma.reserva.findMany();
}
