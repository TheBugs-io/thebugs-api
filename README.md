<img src="https://github.com/TheBugs-io/thebugs-api/blob/main/docs/thebugs.png?raw=true" width="100">

# Cadê a sala?

<details><summary>Índice</summary>

1. [Sobre o projeto](#sobre-o-projeto)
2. [Tecnologias](#tecnologias)
3. [Instruções de instalação](#como-rodar-o-projeto)
4. [Equipe](#equipe)

</details>


## Sobre o Projeto

Cadê a sala? é uma aplicação web voltada à dinâmica cotidiana do bloco Instituto UFC Virtual, onde o curso de Sistemas e Mídias Digitais é realizado, com objetivo tornar mais eficiente e otimizar o fluxo de informações acerca da utilização das salas e laboratórios do Instituto.

## Detalhes do projeto
O curso de **Sistemas e Midias Digitais** da Universidade Federal do Ceará (UFC) possui atualmente uma planilha que funciona como o **mapa de salas** do bloco e que qualquer aluno pode acessar para consultar quando as salas estarão livres, para encontrar algum professor ou alguma disciplina.
<br>

A planilha também indica, de maneira bem limitada, as reservas de salas, contendo dia e horário em uma disposição de informações de baixa usabilidade.

### Tecnologias:
**Front-end:**
* HTML
* CSS
* Javascript

**Back-end:**
* Node.js
* PrismaORM
* Express
* PostgreSQL
* JWT e bcrypt

## Requisitos

### Legenda
- RFxxx= Requisitos Funcionais da Aplicação
- RNFxxx = Requisitos Não-Funcionais da Aplicação

**Total de Requisitos Funcionais:** 13

**Total de Requisitos Não-Funcionais:** 8


### Requisitos Funcionais
|   ID     |    Funcionalidade     |    Descrição      |    Perfil      |      Prioridade       | Status |
|----|----|----|----|-----|-----|
|   RF001   |   Registro    | Como usuário, quero me registrar via solicitação de confirmação de vínculo a secretaria, vinculado ao SIGAA. | Aluno  | Média | - |
|   RF002   |   Autenticação    |   Como usuário, quero entrar na plataforma com minha conta.  |   Geral   |    Alta    | - |
|   RF003   |   Mapa interativo |   Como usuário, quero visualizar o mapa interativo com layout das salas.  | General  |    Média   | - |
|RF004|Histórico de alterações|Como usuário administrador, quero visualizar o histórico de reserva de salas, autor, dia e horário, além de mudança de status.|Aluno / Admin|Média|
|RF005|Gerenciamento de reservas de salas|Como usuário administrador, quero aprovar ou rejeitar reservas feitas por alunos,|Admin|Alta|
|RF006|Atualizar status de sala|Como usuário administrador, quero atualizar status da sala e adicionar, editar e remover salas.|Admin|Alta|
|RF007|Filtros de sala|Como usuário, quero filtrar ou pesquisar salas por data, horário, tipo ou local.|General|Alta|
|RF008|Retirada de reserva automática|Como usuário administrador, quero que o sistema altere o status das salas de forma automática quando o tempo de reserva expirar.|Admin|Média|
|RF009|Status e fotos de sala|Como usuário, quero poder visualizar detalhes e status da sala, como fotos e equipamentos das salas.|Aluno / Professor|Desejável|
|RF010|Notificação do sistema|Como usuário, quero receber notificações automáticas por e-mail ou no sistema para lembrar de reservas, alterações e cancelamentos|Aluno / Professor|Desejável|
|RF011|Solicitação de reserva de sala|Como usuário, quero poder solicitar antecipadamente ou reservar sala diretamente caso esteja disponível no período de tempo desejado e cancelar minhas reservas|Aluno / Professor|Alta|
|RF012|Página do histórico do aluno|Como usuário, quero visualizar uma página de perfil com histórico das minhas reservas.|General|Média|
|RF013|Favoritar salas do semestre|Como usuário, quero poder verificar as salas das minhas aulas atuais do semestre, sem precisar filtrá-las a cada consulta.|Aluno / Professor|Média|

### Requisitos Não-Funcionais

| ID     | Descrição                                                                                                                   | Prioridade | Status   |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| RNF001 | O sistema deve seguir princípios de usabilidade e fornecer acessibilidade conforme as diretrizes WCAG 2.1.                  | Alta       | - |
| RNF002 | O sistema deve proteger os dados dos usuários contra acessos não autorizados, utilizando autenticação e controle de acesso. | Alta       | - |
| RNF003 | O sistema deve ser responsivo, funcionando adequadamente em desktops e dispositivos móveis.                                 | Média      | - |
| RNF004 | O sistema deve ser compatível com leitores de tela.                                                                         | Alta       | - |
| RNF005 | O sistema deve oferecer opções de alto contraste para usuários com deficiência visual.                                      | Alta       | - |
| RNF006 | O sistema deve utilizar um banco de dados relacional e garantir integridade transacional dos dados.                         | Média      | - |
| RNF007 | O sistema deve permitir visualização e consulta de dados offline na versão PWA.                                             | Média      | - |
| RNF008 | O sistema deve utilizar criptografia para armazenamento e transmissão de dados sensíveis.                                   | Alta       | - |



## Como rodar o projeto

_É necessário ter o NodeJS em sua versão mais recente instalada em sua máquina. Você pode ver as instruções de instalação por aqui_

1. Clone este repositório na sua máquina utilizando o comando git git clone https://github.com/TheBugs-io/thebugs-api
2. Abra a pasta utilizando uma IDE de sua preferência, como Visual Studio Code.
3. Instale as dependências do projeto via terminal usando `npm install`
4. Você pode ver o projeto utilizando o script `npm run dev`


### Equipe:
- **Ingryd Duarte** - Backend/Testes | [Github](https://github.com/ingrydf12)
- **David Boanerges** - Gestão | [Github](https://github.com/DavidBoa)
- **Arthur Heráclio** - Front-end | [Github](https://github.com/arthurheraclio)
- **Giovanna Sousa** - Arte / Design
- **Renan Araujo** - Backend/Testes | [Github](https://github.com/Soiten)
- **Tiago Viana** - Frontend / Design | [Github](https://github.com/TiagoViana-hue)