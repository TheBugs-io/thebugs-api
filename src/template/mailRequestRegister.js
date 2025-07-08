/* Template de email a SECRETARIA quando é 
confirmado a SOLICITAÇÃO DE REGISTRO pelo USUÁRIO
TODO: Após as criações das rotas e API em produção, deve alterar para que os links funcionem corretamente.
*/
export const gerarHtmlSecretariaContent = (solicitacao) => `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nova solicitação de registro</title>
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
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin: 20px auto;
      }

      header {
        background: rgb(9, 37, 78);
        padding: 2rem;
        text-align: center;
        color: white;
      }

      h1 {
        font-family: "Montserrat", sans-serif;
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
        background-color: #e6fdff;
        border-left: 4px solid #0fb5c4;
        padding: 1rem;
        font-size: 15px;
        margin: 1rem 0;
      }
      .button-group {
        display: flex;
        flex-direction: row;
        gap: 12px;
        margin: 1rem 0;
        justify-content: center;
      }

      .cta-button {
        display: inline-block;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        text-align: center;
        min-width: 180px;
        transition: background-color 0.2s ease;
        color: #fff !important;
        outline: none;
      }

      .cta-button:focus {
        outline: 3px solid #000;
        outline-offset: 2px;
      }

      .reject-button {
        background-color: #c0392b;
      }

      .reject-button:hover,
      .reject-button:focus {
        background-color: #992d22;
      }

      .approve-button {
        background-color: #2aa768;
      }

      .approve-button:hover,
      .approve-button:focus {
        background-color: #248d5b;
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
    <div class="email-container" role="region" aria-labelledby="titulo-email">
      <header role="banner">
        <div class="alert-icon" aria-hidden="true">📬</div>
        <h1 id="titulo-email">
          Solicitação de registro no <strong>Cadê a sala?</strong>
        </h1>
      </header>
      <main role="main">
        <div class="content-block">
          <p>
            Olá, <b>SECRETARIA</b>.
            <span class="emoji" role="img" aria-label="aceno de mão">👋</span>
          </p>
          <p>
            Este é um novo e-mail de <strong>solicitação de conta</strong>.
            Analise as informações abaixo antes de confirmar.
          </p>
          <div
            class="warning-text"
            role="note"
            aria-label="Informações do usuário solicitante"
          >
            <p><strong>Nome:</strong> ${solicitacao.nomeCompleto}</p>
            <p><strong>E-mail:</strong> ${solicitacao.email}</p>
            <p><strong>Tipo:</strong> ${solicitacao.tipoUsuario}</p>
          </div>
          <div
            class="button-group"
            role="group"
            aria-label="Ações de aprovação de conta"
          >
            <a
              href="#"
              class="cta-button reject-button"
              role="button"
              aria-label="Desaprovar criação de conta para ${solicitacao.nomeCompleto}"
            >
              DESAPROVAR CRIAÇÃO DA CONTA
            </a>

            <a
              href="#"
              class="cta-button approve-button"
              role="button"
              aria-label="Confirmar criação de conta para ${solicitacao.nomeCompleto}"
            >
              CONFIRMAR CRIAÇÃO DA CONTA
            </a>
          </div>
        </div>
        <section
          class="signature"
          role="contentinfo"
          aria-label="Assinatura do sistema"
        >
          <h2 style="font-size: 16px">Atenciosamente,</h2>
          <p>
            <small>Equipe do <strong>Cadê a sala?</strong></small>
          </p>
        </section>
      </main>
      <footer role="contentinfo">
        <p>© 2025 Cadê a Sala?. Todos os direitos reservados.</p>
        <p>Esta é uma mensagem automática, por favor, não responda.</p>
      </footer>
    </div>
  </body>
</html>`;
