import prisma from '../database/prisma.js';

export const listarReservas = async () => {
    return await prisma.reserva.findMany();
}

export const solicitarReserva = async () => {
    try {
        const camposObrigatorios = { sala, responsavel, dataInicio, dataFim, horarioInicio, horarioFim }
        const camposFaltando = Object.entries(camposObrigatorios)
            .filter(([_, valor]) => !valor)
            .map(([campo]) => campo);

        if (camposFaltando.length > 0) {
            return res.status(400).json({
                error: "Campos obrigatórios faltando!",
                campos: camposFaltando,
            });
        }

        //TODO: - Envio de um modelo intermediário de solicitação, assim como registro.
    } catch (error) {
        return res.status(500).json({error: "Erro ao processar sua solicitação de reserva. Por favor, tente novamente.", });
    }
}
