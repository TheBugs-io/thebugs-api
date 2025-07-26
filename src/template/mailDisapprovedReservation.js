/*
    Description: Email de desaprovação de reserva.
    STATUS: Todo (falta implementar)
*/
export const disapprovedReservationRequest = async (reserva) => `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reserva não aprovada - Cadê a Sala</title>
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
        background-color: white;
        margin: 20px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      header {
        background: #a80000;
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
        <h2 id="titulo-email">Status da sua reserva</h2>
      </header>

      <main role="main">
        <p>Olá, ${reserva.nomeSolicitante}</p>
        <p>
          Sua solicitação de reserva para o espaço <b>${
            reserva.espaco
          }</b>, no dia <b>${reserva.data}</b> às <b>${
  reserva.horario
}</b>, foi <b>rejeitada</b>.
        </p>
        <p>
          Isso pode ter ocorrido por conflito de horários, dados incorretos ou outras restrições. Você pode revisar os detalhes e realizar uma nova tentativa.
        </p>
        <p>
          Caso precise de mais informações, entre em contato com a administração do espaço ou a secretaria responsável.
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
