import { transporter } from "../utils/transporterMailConfig.js";

// Precisa criar os templates de email, desse jeito, só envia texto simples mesmo
export const notificarAtualizacaoReservaAdm = async (email, reserva, usuario) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Atualização de estado de reserva.",
        text: `Foi feita uma alteração no estado de reserva por ${usuario}: Foi ${reserva.status}.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Erro ao enviar email para secretaria:", error);
    }
}

export const notificarUsuarioReserva = async (email, reserva, usuario) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Atualização de estado de reserva.",
        text: `Sua reserva foi atualizada por ${usuario}: Foi ${reserva.status}.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Erro ao enviar email para usuário:", error);
    }
}

export const notificarSecretariaPedido = async (email, reserva, usuario) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Nova solicitação de reserva.",
        text: `Uma nova solicitação de reserva foi feita: ${usuario.nomeCompleto}.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Erro ao enviar email para secretaria:", error);
    }
}