import { createTransport } from 'nodemailer';
import prisma from '../database/prisma.js';
import { gerarHtmlSecretariaContent } from '../template/mailRequestRegister.js'
import { mailConfirmToken } from '../template/mailEmailConfirm.js'

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const enviarEmailConfirmacao = async (email, token) => {
  const link = `${process.env.FRONTEND_URL}/confirmar?token=${token}`;

  await transporter.sendMail({
    //TODO: Mudar pro email próprio da aplicação (provavel criar)
    from: '"Cadê a Sala?" <nao-responda@ufc.br>',
    to: email,
    subject: 'Confirmação de Cadastro - Cadê a Sala?',
    html: mailConfirmToken(link)
  });
};

export const notificarSecretaria = async (solicitacao) => {
  const admins = await prisma.usuario.findMany({
    where: { tipo: 'SECRETARIO' },
    select: { email: true }
  });

  if (admins.length === 0) return;

  const emails = admins.map(a => a.email).join(',');
  
  await transporter.sendMail({
    //TODO: Mudar pro email próprio da aplicação (provavel criar)
    from: '"Cadê a Sala?" <nao-responda@ufc.br>',
    to: emails,
    subject: 'Nova solicitação de cadastro',
    text: "Olá,\n\nhouve novo pedido de criação de conta na plataforma. Por favor, analise o pedido de registro de usuário.\n\nAtenciosamente,\nEquipe do Cadê a sala?",
    html: gerarHtmlSecretariaContent(solicitacao)
  });
};