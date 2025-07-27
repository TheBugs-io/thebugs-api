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
* ReactJS
* CSS
* Axios

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

**Total de Requisitos Funcionais:** 14

**Total de Requisitos Não-Funcionais:** 8

**Total de requisitos concluídos**: 14 (100%)

### Requisitos Funcionais
|   ID      |   Funcionalidade     |    Descrição      |    Front-end    |    Back-end    |  Design  |    Perfil      |      Prioridade       | Status |
|----|----|----|----|-----|-----|----|----|----|
|   RF001   |   Registro    | Como usuário, quero me registrar via solicitação de confirmação de vínculo a secretaria, vinculado ao SIGAA. | Validar dados e enviar solicitação de aprovação | Guardar a solicitação e notificar os secretários | Tela com arquitetura e sequências proposta para respectivos registros dos tipos, docente e discente. | Aluno  | Média | CONCLUIDO |
|   RF002   |   Autenticação    |   Como usuário, quero entrar na plataforma com minha conta.  | Exibir tela de login | Verificar/validar dados e retornar uma confirmação | Demonstrar a identidade visual do projeto |   Geral   |    Alta    | CONCLUIDO |
|   RF003   |   Mapa interativo |   Como usuário, quero visualizar o mapa interativo com layout das salas.  | Exibir opções para visualizar diferentes andares e escolher entre as salas | Filtrar, guardar em cache e fornecer os dados necessários | Representar (de forma abstrata ou realista) a planta do bloco e as cores que definem os status das salas | Geral  |    Média   | CONCLUIDO |
|RF004|Histórico de alterações|Como usuário administrador, quero visualizar o histórico de reserva de salas, autor, dia e horário, além de mudança de status.| Exibir lista/tabela de informações com acessibilidade | Registrar quais eventos aconteceram e quando | Design de acessibilidade |Aluno / Admin|Média| CONCLUIDO |
|RF005|Gerenciamento de reservas de salas|Como usuário administrador, quero aprovar ou rejeitar reservas feitas por alunos.| Tela para ver os detalhes da reserva e decidir sobre ela | Registrar as reservas, ler e atualizá-las | Design de acessibilidade |Admin|Alta| CONCLUIDO |
|RF006|Filtros de sala|Como usuário, quero filtrar ou pesquisar salas por data, horário, tipo ou local.| Atualizar o mapa conforme os filtros selecionados | Fornecer os dados para a data específica | Escolha de filtros pertinentes |Geral|Alta| CONCLUIDO |
|RF007|Retirada de reserva automática|Como usuário administrador, quero que o sistema altere o status das salas de forma automática quando o tempo de reserva expirar.| - | Verificar o prazo da reserva e comparar com a data atual | - |Admin|Média| CONCLUIDO |
|RF008|Detalhes da sala|Como usuário, quero conferir detalhes das salas, como a grade de horários/ocupações e fotos do local.| Exibir todos os dados de uma sala específica | Reunir e enviar todos os dados da sala selecionada | Hierarquia da informação e cores de destaque |Aluno / Professor|Desejável| CONCLUIDO |
|RF009|Notificação do sistema|Como usuário, quero receber notificações automáticas por e-mail ou no sistema para lembrar de reservas, alterações e cancelamentos| - | Enviar e-mails para os usuários | Designar o conteúdo das notificações |Aluno / Professor|Desejável| CONCLUIDO |
|RF010|Solicitação de reserva de sala|Como usuário, quero poder solicitar antecipadamente ou reservar sala diretamente caso esteja disponível no período de tempo desejado e cancelar minhas reservas| Criar um formulário e validar os dados antes de serem enviados | Registrar o pedido no histórico e informar os secretários | - |Aluno / Professor|Alta| CONCLUIDO |
|RF011|Página do histórico do aluno|Como usuário, quero visualizar uma página de perfil com histórico das minhas reservas.| Listar as reservas do usuário na página de perfil | Fornecer o histórico de reservas do usuário  |Geral|Média| CONCLUIDO|
|RF012|Favoritar disciplinas do semestre|Como usuário, quero verificar as salas onde tenho aula, sem precisar pesquisar por elas toda vez.| Listar as disciplinas favoritadas do usuário | Guardar quais disciplinas o usuário favoritou | - |Aluno / Professor|Média| CONCLUIDO |
|RF013|Dashboard de solicitações|Como SECRETARIO, quero visualizar as solicitações de registro com respectivos status e informações dos usuários pedintes como tipo, vínculo e outros. | Tela contendo todos as solicitações, categorizando id, email, nome, tipo, status | Verificar e puxar os dados referentes ao modelo de solicitação de registro | Tela com prevenção de erros e ruptura, com popups para confirmar ações | Admin | Média | CONCLUIDO |
| RF014 | Histórico de solicitações de registro | Como SECRETARIO, quero visualizar o histórico das aprovações/rejeições das solicitações PARA manter registro das ações | Uma tela paralela a dashboard de solicitações listando as informações junto a data de atualização do pedido | Verificar e puxar os dados referentes ao modelo de solicitação de registro e poder deletar o histórico | Tela com prevenção de erros e rupturas | Admin | Baixa | CONCLUIDO |

### Requisitos Não-Funcionais

| ID     | Descrição                                                                                                                   | Prioridade | Status   |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| RNF001 | O sistema deve seguir princípios de usabilidade e fornecer acessibilidade adequada.              | Alta       | OK |
| RNF002 | O sistema deve proteger os dados dos usuários contra acessos não autorizados, utilizando autenticação e controle de acesso. | Alta       | OK |
| RNF003 | O sistema deve ser responsivo, funcionando adequadamente em desktops e dispositivos móveis.                                 | Média      | OK |
| RNF004 | O sistema deve ser compatível com leitores de tela.                                                                         | Alta       | OK |
| RNF005 | O sistema deve oferecer opções de alto contraste para usuários com deficiência visual.                                      | Média      | OK |
| RNF006 | O sistema deve utilizar um banco de dados relacional e garantir integridade transacional dos dados.                         | Média      | OK |
| RNF007 | O sistema deve permitir visualização e consulta de dados offline na versão PWA.                                             | Média      | - |
| RNF008 | O sistema deve utilizar criptografia para armazenamento e transmissão de dados sensíveis.                                   | Alta       | OK |

## Quadro Kanban

Utilizando o Notion categorizando entre <b>Design e Code</b> sections:

<img src="https://github.com/user-attachments/assets/58ffc5d1-0c7d-4e14-a81f-1e40ea220b31">

<img src="https://github.com/user-attachments/assets/d28d5c01-e8ac-454f-92a2-5118e61a9c38">

## Estrutura de pastas / Arquitetura Backend

Nosso backend e API, a estrutura é baseada na arquitetura Model-View-Controller (MVC), separando em partes como middlewares, controladores, modelos, serviços e rotas.
A estrutura do nosso projeto é feita na base:

```
prisma -> pasta com os arquivos prisma
    migrations -> pasta com as migrations do prisma, alterações no esquema do banco de dados
    schema.prisma -> modelo do banco de dados, contendo relaciomentos e entidades.
src -> diretório com a estrutura de pastas do projeto
    auth -> serviços de autenticação, usando JWT e bcrypt.
    controllers -> arquivos responsáveis por gerenciar a lógica
    utils -> arquivos auxiliares como validacao de email, geração de tokens e senhas iniciais.
    middlewares -> funções que conectam o sistema operacional a aplicações, dados e usuários, usando HTTP
    models -> estrutura dos dados e a lógica de acesso ao banco de dados
    routes -> definições de endpoints da API
    templates -> modelos de documento para serviços de email
    test -> pasta de arquivos de testes, dados mockados e outros.
    services -> serviços centralizados e mais específicos como envio de emails, notificações e outros criados.
```

## Documentação da API

Swagger | OpenAPI -> Principais rotas do backend

### Autenticação

#### Solicitar Registro
```http
POST /api/auth/register/solicitar
Content-Type: application/json

{
  "nomeCompleto": "João Silva",
  "email": "joao.silva@ufc.br",
  "tipoUsuario": "DISCENTE"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ufc.br",
  "senha": "suaSenha123"
}
```

### Salas

#### Listar Todas as Salas
```http
GET /salas
Authorization: Bearer {token}
```

#### Buscar Sala por ID
```http
GET /salas/{id}
Authorization: Bearer {token}
```

#### Ver Reservas de uma Sala
```http
GET /salas/reservas-da-sala?sala_id={id}
```

### Reservas

#### Listar Minhas Reservas
```http
GET /reservas
Authorization: Bearer {token}
```

#### Solicitar Reserva
```http
POST /reservas/solicitar-reserva
Authorization: Bearer {token}
Content-Type: application/json

{
  "localId": 1,
  "tipo": "AULA",
  "dataInicio": "2025-07-25T10:00:00.000Z",
  "dataFim": "2025-07-25T12:00:00.000Z",
  "horarioInicio": 10,
  "horarioFim": 12,
  "repeteEm": [],
  "usuarioId": 5
}
```

#### Cancelar Reserva
```http
DELETE /reservas/solicitar-reserva
Authorization: Bearer {token}
```

### Favoritos

#### Listar Salas Favoritas
```http
GET /users/favoritos
Authorization: Bearer {token}
```

#### Favoritar Sala
```http
POST /users/favoritos
Authorization: Bearer {token}
Content-Type: application/json

{
  "local_id": 1
}
```

### Nota:
As rotas de administração não estão listadas aqui.

## Como rodar o projeto

_É necessário ter o NodeJS em sua versão mais recente instalada em sua máquina. Você pode ver as instruções de instalação por aqui_

1. Clone este repositório na sua máquina utilizando o comando git `git clone https://github.com/TheBugs-io/thebugs-api`
2. Abra a pasta utilizando uma IDE de sua preferência, como Visual Studio Code.
3. Instale as dependências do projeto via terminal usando `npm install`
4. Para iniciar o projeto em modo de desenvolvimento, utilize o comando `npm run dev`.  
5. Para gerar a versão de produção, execute `npm run build`.


### Equipe:
- **Ingryd Duarte** - Fullstack / Testes | [Github](https://github.com/ingrydf12)
- **David Boanerges** - Gestão / Design | [Github](https://github.com/DavidBoa)
- **Arthur Heráclio** - Front-end / Design | [Github](https://github.com/arthurheraclio)
- **Giovanna Sousa** - Artes
- **Renan Araujo** - Backend / Testes | [Github](https://github.com/Soiten)
- **Tiago Viana** - Frontend / Design | [Github](https://github.com/TiagoViana-hue)