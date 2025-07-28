/*
EMAIL INICIAL PRA REDEFINIR A SENHA (CONFIRMAR QUE ISSO FOI PEDIDO)
*/

export const mailResetPassword = (link) => `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirme seu email no Cadê a Sala</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap");

      body {
        font-family: "Albert Sans", sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 0;
        background-color: #f5f7fa;
      }

      .email-container {
        background-color: white;
        margin: 20px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      header {
        background: rgb(9, 37, 78);
        padding: 2rem;
        text-align: center;
        color: white;
      }

      h2 {
        font-size: 24px;
        margin: 0;
      }

      main {
        padding: 2rem;
      }

      .button-wrapper {
        text-align: center;
        margin: 30px 0;
      }

      .confirm-button {
        display: inline-block;
        background-color: #2c3e50;
        color: #ffffff !important;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        min-width: 180px;
        text-align: center;
        transition: background-color 0.2s ease;
      }

      .confirm-button:hover,
      .confirm-button:focus {
        background-color: #1a242f;
        outline: 3px solid #000;
        outline-offset: 2px;
      }

      footer {
        padding: 1rem 2rem;
        font-size: 12px;
        color: #666;
        text-align: center;
        background-color: #f0f2f5;
      }
    </style>
  </head>
  <body>
    <div class="email-container" role="region" aria-labelledby="titulo-email">
      <header role="banner">
        <h2 id="titulo-email">Confirme seu e-mail</h2>
      </header>

      <main role="main">
        <p>Olá!</p>
        <p>
          Recebemos uma solicitação de redefinição de senha com este e-mail na plataforma <b>Cadê a sala?</b>. Para confirmar
          sua conta, clique no botão abaixo:
        </p>

        <div class="button-wrapper" role="group" aria-label="Redefinição de senha">
          <a
            href="${link}"
            class="confirm-button"
            role="button"
            aria-label="Redefinir senha"
            title="Clique para redefinir sua senha"
          >
            Redefinir senha
          </a>
        </div>

        <p>
          Este link é válido por 1 hora. Se você não pediu essa redefinição de senha, favor
          ignore este e-mail.
        </p>
      </main>

      <footer role="contentinfo">
        <p>
          © ${new Date().getFullYear()} Cadê a Sala? — Universidade Federal do Ceará.
        </p>
        <p>Esta é uma mensagem automática, por favor, não responda.</p>
      </footer>
    </div>
  </body>
</html>`;