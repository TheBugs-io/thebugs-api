import { createTransport } from 'nodemailer';
import prisma from '../database/prisma.js';
import { gerarHtmlSecretariaContent } from '../template/mailRequestRegister.js'

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
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Confirmação de e-mail</h2>
        <p>Olá,</p>
        <p>Recebemos uma solicitação de cadastro com este e-mail. Para confirmar sua conta, clique no botão abaixo:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #2c3e50; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Confirmar e-mail</a>
        </p>
        <p>Se o botão acima não funcionar, copie e cole este link no seu navegador:</p>
        <p style="word-break: break-word;"><a href="${link}">${link}</a></p>
        <p style="margin-top: 20px; font-size: 0.9em; color: #555;">Este link é válido por 24 horas. Se você não solicitou esse cadastro, ignore este e-mail.</p>
        <p style="margin-top: 40px; font-size: 0.8em; color: #aaa;">© ${new Date().getFullYear()} Cadê a Sala? - Universidade Federal do Ceará</p>
      </div>
    `
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

export const notificarUsuario = async (email, senhaInicial) => {
  if (!email) return;

  await transporter.sendMail({
    from: '"Cadê a Sala?" <nao-responda@ufc.br>',
    to: email,
    subject: 'Sua conta foi criada',
    text: `Olá,\n\nSua conta na plataforma "Cadê a Sala?" foi criada com sucesso.\n\nEmail: ${email}\nSenha inicial: ${senhaInicial}\n\nRecomendamos que você altere sua senha após o primeiro acesso.\n\nAtenciosamente,\nEquipe do Cadê a Sala?`,
    html: `
      <p>Olá,</p>
      <p>Sua conta na plataforma <strong>Cadê a Sala?</strong> foi criada com sucesso.</p>
      <p><strong>Email:</strong> ${email}<br/>
         <strong>Senha inicial:</strong> ${senhaInicial}</p>
      <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
      <p>Atenciosamente,<br/>Equipe do Cadê a Sala?</p>
    `
  });
};