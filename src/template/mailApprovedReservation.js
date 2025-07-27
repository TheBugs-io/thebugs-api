/*
    Description: Email de confirmação de reserva aprovada.
    STATUS: Done
*/
export const approvedReservationRequest = async (reserva) => `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reserva aprovada – Cadê a Sala</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@300;400;700&display=swap");

      body {
        font-family: "Roboto", sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 0;
        background-color: #f5f7fa;
      }

      .email-container {
        background-color: #ffffff;
        margin: 20px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      header {
        background: rgb(9, 37, 78);
        padding: 2rem;
        text-align: center;
        color: #ffffff;
      }

      h2 {
        font-size: 24px;
        margin: 0;
      }

      main {
        padding: 2rem;
      }

      .details {
        background: #f0f2f5;
        border-radius: 6px;
        padding: 1rem 1.5rem;
        margin: 1rem 0 1.5rem;
        font-weight: 700;
      }

      a.button {
        display: inline-block;
        margin-top: 0.75rem;
        padding: 0.8rem 1.4rem;
        border-radius: 6px;
        background: rgb(9, 37, 78);
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 700;
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
        <h2 id="titulo-email">Reserva aprovada!</h2>
      </header>

      <main role="main">
        <p>Olá, ${reserva.nomeSolicitante},</p>
        <p>
          Sua reserva para o espaço <b>${
            reserva.espaco
          }</b> foi <b>aprovada</b> com sucesso.
          Seguem os detalhes:
        </p>

        <div class="details">
          Data: ${reserva.data}<br />
          Horário: ${reserva.horario}
        </div>

        ${
          reserva.linkDetalhes
            ? `<div style="text-align: center;">
         <a href="${reserva.linkDetalhes}" class="button" target="_blank" rel="noopener noreferrer">
           Ver detalhes da reserva
         </a>
       </div>`
            : ""
        }

        <p>
          Caso precise cancelar ou alterar informações, acesse a plataforma ou entre em contato
          com a secretaria.
        </p>
      </main>

      <footer role="contentinfo">
        <p>© ${new Date().getFullYear()} Cadê a Sala? — Universidade Federal do Ceará.</p>
        <p>Esta é uma mensagem automática, por favor, não responda.</p>
      </footer>
    </div>
  </body>
</html>`;
