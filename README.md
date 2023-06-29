# COATI 🦝

[:us: Hey! This project is also available in English!](./README.en.md)

## Sobre o projeto

O projeto consiste em um sistema de compartilhamento de conhecimento. Professores podem criar trilhas sobre um determinado assunto e alunos, professores e pessoas interessadas podem seguir essas trilhas e aprender sobre o assunto. O professor passa primeiro, criando tópicos (migalhas) e adicionando conteúdo a eles. Depois, os alunos podem seguir essas trilhas, aprender sobre o assunto e deixar suas próprias migalhas. Dessa forma o conhecimento é compartilhado e todos podem aprender e ensinar.

## Tecnologias utilizadas

Esse projeto tem como principal linguagem de programação o Typescript.

TailwindCSS e CSS puro com PostCSS como pré-processador são utilizados para estilização.

O banco de dados usado é Postgres e o ORM é o Drizzle, que possui uma camada de abstração sobre mais fina sobre o SQL puro e facilita a integração com o Typescript. Em desenvolvimento é possível usar uma instância do Postgres rodando em um container Docker, mas em produção é usado o [Neon (Serverless Postgres)](https://neon.tech/).

Para enviar emails é usado o [Mailgun](https://www.mailgun.com/) em produção e o [Nodemailer](https://nodemailer.com/about/) com [Mailtrap](https://mailtrap.io/) em desenvolvimento para evitar que emails de teste sejam enviados para usuários reais.

Para o backend, assim como o frontend, é usado o [SvelteKit](https://kit.svelte.dev/), que é um framework para desenvolvimento de aplicações web que usa o [Svelte](https://svelte.dev/) como base. Com ele é possível criar aplicações SSR, SPA, SSG e até mesmo API's REST.

O deploy é feito no [Vercel](https://vercel.com/), que é uma plataforma de deploy de aplicações web que possui integração com o SvelteKit.

Essas são provavelmente as tecnologias mais notáveis do projeto, mas existem outras que podem ser vistas no arquivo `package.json` na raiz do projeto.

## Como rodar o projeto localmente

### Requisitos

- Docker
- Docker Compose

### Passo a passo

0. Clone o repositório

   ```bash
   git clone
   ```

1. Entre na pasta do projeto

   ```bash
   cd coati
   ```

2. Crie um arquivo `.env` na raiz do projeto e copie o conteúdo do arquivo `.env.example` para ele

   ```bash
   cp .env.example .env
   ```

3. Rode o comando `docker-compose up` para subir os containers do projeto

   ```bash
   docker-compose up
   ```

4. Acesse o endereço `localhost:3000` no seu navegador
