# CoatiQuati

## Sobre o projeto

CoatiQuati é um projeto de [código aberto](https://github.com/devlulcas/coatiquati), desenvolvido por [mim (Lucas Alves Rego)](https://github.com/devlulcas/), com o objetivo de ajudar pessoas interessadas em aprender algo novo
e que não sabem por onde começar.

## Funcionamento geral

O projeto funciona da seguinte forma:

- Um professoar cria uma trilha de estudos com um nome, uma descrição, uma imagem e mais alguns detalhes.
- Um professor adicona à trilha de estudos criada, uma lista de tópicos com um nome, uma descrição, uma imagem e mais alguns detalhes. Dando direção aos estudos dos alunos.
- Um aluno pode se inscrever em uma trilha de estudos e começar a estudar os tópicos adicionados pelo professor. O aluno pode marcar os tópicos como concluídos e assim, o professor pode acompanhar o progresso do aluno. Assim que o aluno for progredindo ele pode publicar seus materiais de estudo e compartilhar com outros alunos em cada tópico.
- Alunos podem comentar nos tópicos e compartilhar suas dúvidas com outros alunos e professores.

## Executando o projeto localmente

Primeiro copie o arquivo `.env.example` para `.env.local` e preencha as variáveis de ambiente.

```bash
cp .env.example .env.local
```

Instale o PNPM globalmente na sua máquina.

[PNPM Installation](https://pnpm.io/pt/installation)

Instale as dependências do projeto.

```bash
pnpm install
```

Execute as migrations do banco de dados.

```bash
pnpm migrate
```

Execute o projeto.

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.
