## EXECUTANDO O PROJETO

### Pré-requisitos

- [Node.js](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/)
- [TURSO](https://turso.tech/)
- [AWS s3](https://aws.amazon.com/pt/s3/)
- [AWS ses](https://aws.amazon.com/pt/ses/)

### Instalação

1. Clone o repositório

   ```sh
   git clone https://github.com/devlulcas/coatiquati.git
   ```

2. Instale as dependências

   ```sh
    pnpm install
   ```

3. Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis de ambiente

   ```sh
    cp .env.example .env.local
   ```

4. Altere as variáveis de ambiente no arquivo `.env.local` com as suas credenciais da AWS, banco de dados e etc.

- AWS_ACCESS_KEY_ID = Chave de acesso de um usuário IAM com permissões de acesso ao S3 e SES da AWS
- AWS_SECRET_ACCESS_KEY = Chave secreta de um usuário IAM com permissões de acesso ao S3 e SES da AWS
- AWS_REGION = Região da AWS
- AWS_BUCKET_NAME = Nome do bucket do S3 ({prod|dev|staging}-{domaintld}-{version}-{nanoid})
- DATABASE_URL = URL de conexão com o banco de dados (libsql://{database}-{user}.turso.io ou http://127.0.0.1:8080)
- DATABASE_AUTH_TOKEN = Token de conexão com o banco de dados (Não é necessário para o banco de dados local)

> Para gerar o banco de dados local instale a CLI do Turso e execute `turso dev --db-file dev.db` ou simplesmente `pnpm db:summon`

5. Execute as migrations

   ```sh
    pnpm run migrate
   ```

6. Inicie o servidor

   ```sh
    pnpm dev
   ```

7. Acesse o servidor em `http://localhost:3000`

### Trocando AWS SES por outro serviço de envio de e-mails

1. Altere o arquivo `src/env.ts` e remova as checagens das variáveis de ambiente `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` e `AWS_REGION` (ou mantenha as variáveis de ambiente e altere o valor delas para as credenciais do serviço de envio de e-mails que você deseja utilizar se ele for compatível com o SES, talvez seja necessário mantê-las caso vá usar o S3 da AWS)

2. Altere o arquivo `/src/modules/email/lib/mail.ts` e crie uma nova função que seja compatível com a interface `MailTransporterFactory` e altere a condição `export const mailer` para retornar a função que você criou

Desde que sua implementação seja compatível com a interface `MailTransporterFactory` você pode usar qualquer serviço de envio de e-mails que desejar.

### Trocando AWS S3 por outro serviço de armazenamento de arquivos

> [!WARNING]
> O serviço de armazenamento de arquivos deve ser compatível com o S3 da AWS. Se você deseja usar um serviço de armazenamento de arquivos que não seja compatível com o S3 da AWS você deve alterar o código fonte do projeto para que ele seja compatível com o serviço de armazenamento de arquivos que você deseja utilizar.

Essa seção ainda não está pronta, alterações serão feitas em breve após o código ser refatorado para ser compatível com outros serviços de armazenamento de arquivos.

### Adicionando login com redes sociais

Para isso talvez seja necessário alterar o código fonte do projeto, pois o projeto atualmente só suporta login com e-mail, usuário e senha.

Você provavelmente terá que alterar o banco de dados também.

Para implementar essa funcionalidade você pode acessar a documentação da biblioteca de autenticacão que o projeto utiliza [Lucia](https://lucia-auth.com/tutorials/github-oauth/) e ver um [exemplo no github](https://github.com/lucia-auth/examples/tree/main/nextjs-app/github-oauth)

## LICENÇA

MIT License

> Seja livre colega! 🚀

## CONTATO

[Lucas Alves Rego no Linkedin](https://www.linkedin.com/in/lucas-alves-rego/)
[lucasrego.tech no meu site](https://lucasrego.tech/)

## Funcionalidades futuras

- [ ] Adicionar login com redes sociais
- [ ] Adicionar suporte a outros serviços de armazenamento de arquivos
- [ ] Suporte a criação de contas de administrador via CLI
- [ ] Suporte a criação de conteúdo com markdown, além do WYSIWYG
- [ ] Suporte a upload de LaTeX para papéis científicos
- [ ] Suporte a upload de arquivos de áudio para micro-podcasts
- [ ] Suporte a upload de arquivos PDF para artigos científicos e livros (com visualizador de PDF)
- [ ] Sistema de tags para categorizar conteúdo
- [ ] Feed de amigos (seguindo e seguidores)
- [ ] Feed "Para você" com base no seu histórico de leitura, tags favoritas, upvotes, downvotes e comentários
- [ ] Sinalizar conteúdo inapropriado para remoção

## Algoritmo de recomendação de conteúdo para o feed "Para você"

O algoritmo de recomendação de conteúdo para o feed "Para você" será baseado em um sistema de recomendação colaborativo com filtragem colaborativa baseada em itens.

Ainda preciso estudar mais sobre a implementação desse algoritmo, mas a ideia é que a sua rede de amigos, tags favoritas, upvotes, downvotes e comentários sejam usados para recomendar conteúdo para você.

[TensorFlow.js](https://www.tensorflow.org/js) parece ser uma boa opção para implementar esse algoritmo.
