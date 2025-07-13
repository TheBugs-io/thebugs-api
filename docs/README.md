# Design API

Cadê a sala? é uma aplicação web voltada à dinâmica cotidiana do bloco Instituto UFC Virtual, onde o curso de Sistemas e Mídias Digitais é realizado, com objetivo tornar mais eficiente e otimizar o fluxo de informações acerca da utilização das salas e laboratórios do Instituto.

![image](https://github.com/user-attachments/assets/dcac47cc-eed3-48c3-8978-b6496aa2126a)


```json
openapi: 3.0.3
info:
  title: Cadê a sala? - TheBugs API
  version: "1.0.0"
  description: "Cadê a sala? é uma aplicação web voltada à dinâmica cotidiana do bloco Instituto UFC Virtual, onde o curso de Sistemas e Mídias Digitais é realizado, com objetivo tornar mais eficiente e otimizar o fluxo de informações acerca da utilização das salas e laboratórios do Instituto."

servers:
  - url: http://localhost:3000

paths:
  /api/auth/register/solicitar:
    post:
      summary: Solicitar Registro
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                nomeCompleto:
                  type: string
                email:
                  type: string
                tipoUsuario:
                  type: string
                  enum: [SECRETARIO, PROFESSOR, ADMIN]
      responses:
        '200':
          description: Registro solicitado com sucesso

  /api/auth/login:
    post:
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                senha:
                  type: string
      responses:
        '200':
          description: Autenticação realizada

  /api/auth/register/{id}:
    delete:
      summary: Deletar solicitação
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Solicitação deletada

    patch:
      summary: Atualizar solicitação
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                status:
                  type: string
                  enum: [APROVADO, REPROVADO]
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Solicitação atualizada

  /api/auth/register/pendentes:
    get:
      summary: Listar solicitações pendentes
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Lista retornada

  /api/auth/criar-secretario/:
    post:
      summary: Criação direta de usuário
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
      responses:
        '200':
          description: Usuário criado

  /api/auth/register/confirm-user:
    post:
      summary: Confirmar criação de usuário
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
      responses:
        '200':
          description: Usuário confirmado

  /users:
    get:
      summary: Listar usuários
      responses:
        '200':
          description: Lista de usuários

  /reservas:
    get:
      summary: Listar reservas
      responses:
        '200':
          description: Lista de reservas

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```
