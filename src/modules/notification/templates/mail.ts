import { html } from '../lib/render-html';

export const signUpMailTemplate = (name: string, link: string) => html`
  <h1>Olá, ${name}!</h1>
  <p>Seja bem-vindo(a) ao nosso site!</p>
  <p>Para ativar sua conta, clique no link abaixo:</p>
  <p><a href="${link}">${link}</a></p>
  <p>Se você não se cadastrou em nosso site, desconsidere este e-mail.</p>
`;

export const forgotPasswordMailTemplate = (name: string, link: string) => html`
  <h1>Olá, ${name}!</h1>
  <p>Para redefinir sua senha, clique no link abaixo:</p>
  <p><a href="${link}">${link}</a></p>
  <p>Se você não solicitou a redefinição de senha, desconsidere este e-mail.</p>
`;

export const secretCodeMailTemplate = (name: string, code: string) => html`
  <h1>Olá, ${name}!</h1>
  <p>Seu código secreto é:</p>
  <p><strong>${code}</strong></p>
  <p>Se você não solicitou um código secreto, desconsidere este e-mail.</p>
`;
