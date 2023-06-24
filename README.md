# COATI 🦝

## Sobre o projeto

O projeto consiste em um sistema de compartilhamento de conhecimento. Professores podem criar trilhas sobre um determinado assunto e alunos, professores e pessoas interessadas podem seguir essas trilhas e aprender sobre o assunto. O professor passa primeiro, criando tópicos (migalhas) e adicionando conteúdo a eles. Depois, os alunos podem seguir essas trilhas, aprender sobre o assunto e deixar suas próprias migalhas. Dessa forma o conhecimento é compartilhado e todos podem aprender e ensinar.

## Tecnologias utilizadas

Esse projeto tem como principal linguagem de programação o Typescript.

Para estilização uso TailwindCSS e CSS puro com PostCSS como pré-processador.

O banco de dados usado é Postgres e o ORM é o Drizzle, que possui uma camada de abstração sobre mais fina sobre o SQL puro e facilita a integração com o Typescript.

Para o backend, assim como o frontend, é usado o SvelteKit, que é um framework para desenvolvimento de aplicações web que usa o Svelte como base. Com ele é possível criar aplicações SSR, SPA, SSG e até mesmo API's REST.

Essas são provavelmente as tecnologias mais notáveis do projeto, mas existem outras que podem ser vistas no arquivo `package.json` na raiz do projeto.

## Como rodar o projeto

### Requisitos

- Docker
- Docker Compose

### Passo a passo

1. Clone o repositório

```bash
git clone
```

2. Entre na pasta do projeto

```bash
cd coati
```

3. Crie um arquivo `.env` na raiz do projeto e copie o conteúdo do arquivo `.env.example` para ele

```bash
cp .env.example .env
```

4. Rode o comando `docker-compose up` para subir os containers do projeto

```bash
docker-compose up
```

5. Acesse o endereço `localhost:3000` no seu navegador
