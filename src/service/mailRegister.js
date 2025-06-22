import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  //TODO: Need to pass something here / security
  auth: {
    user: "",
    pass: "",
  },
});

const htmlSecretariaContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alerta de Segurança</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@300;400;700&display=swap');
        
        body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f5f7fa;
        }
        
        .email-container {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
        }
        
        header {
            background: rgb(26, 86, 176);
            padding: 2rem;
            text-align: center;
            color: white;
        }
        
        h1 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            margin: 0;
            font-size: 24px;
        }
        
        .alert-icon {
            font-size: 48px;
            margin-bottom: 15px;
            display: inline-block;
        }
        
        main {
            padding: 2rem;
        }
        
        .content-block {
            margin-bottom: 1.5rem;
        }
        
        .warning-text {
            background-color:rgb(230, 253, 255);
            border-left: 4px solid rgb(15, 181, 196);
            padding: 1rem;
            font-size: 15px;
            margin: 1rem 0;
        }
        
        .cta-button {
            display: inline-block;
            background: #2aa768;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            margin: 1rem 0;
            text-align: center;
        }
        
        footer {
            background-color: #f0f2f5;
            padding: 1.5rem;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        
        .emoji {
            font-size: 20px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <header>
            <div class="alert-icon"></div>
            <h1>Solicitação de registro no <b>Cadê a sala?</b></h1>
        </header>
        
        <main>
            <div class="content-block">
                <p>Olá, secretaria. <span class="emoji">👋</span></p>
                
                <p>Esse é novo e-mail para solicitação de uma conta, analise a solicitação antes de confirmar. </p>
                <div class="warning-text">
                    <b>Informações do usuário:</b>
                    <p></p>
                </div>
                
                <a href="#" class="cta-button">CONFIRMAR CRIAÇÃO DA CONTA</a>
            </div>
            
            <div class="signature">
                <h4>Atenciosamente,</h4>
                <p><small>Equipe da Cadê a sala?</small></p>
            </div>
        </main>
        
        <footer>
            <p>© 2025 Cadê a Sala?. Todos os direitos reservados.</p>
            <p>Esta é uma mensagem automática, por favor não responda.</p>
        </footer>
    </div>
</body>
</html>
`;

//MARK: - Envio de email praSecretaria
export const mailServiceToSec = (async () => {
  try {
    const info = await transporter.sendMail({
      from: '"" <ingrydcduarte@gmail.com>',
      to: "dboanerges@alu.ufc.br",
      subject: "SOLICITAÇÃO: Novo pedido de conta na plataforma",
      text: "Olá,\n\nhouve novo pedido de criação de conta na plataforma. Por favor, analise o pedido de registro de usuário.\n\nAtenciosamente,\nEquipe do Cadê a sala?",
      html: htmlSecretariaContent,
    });

    console.log("E-mail enviado:", info.messageId);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
})();