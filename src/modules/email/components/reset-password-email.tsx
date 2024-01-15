import { Button, Heading, Link, Row, Section, Text } from '@react-email/components';
import { GenericEmailTemplate } from './generic-template-email';

type ResetPasswordEmailProps = {
  name: string;
  url: string;
};

export function ResetPasswordEmail({ name, url }: ResetPasswordEmailProps) {
  return (
    <GenericEmailTemplate title="Alteração de senha">
      <Heading as="h2" className="text-xl font-bold text-center text-neutral-100">
        Olá, {name}! Clique no link abaixo para alterar sua senha:
      </Heading>

      <Section className="text-center">
        <Button
          href={url}
          className="text-center text-neutral-100 bg-violet-700 rounded px-4 py-2 border border-violet-200"
        >
          Clique aqui para alterar sua senha
        </Button>

        <Row>
          <Text className="text-neutral-300">ou</Text>
        </Row>

        <Row>
          <Link href={url}>
            Acesse este link para alterar sua senha: <strong>{url}</strong>
          </Link>
        </Row>
      </Section>

      <Text className="text-red-300 text-sm">Se você não solicitou este e-mail, ignore-o.</Text>
    </GenericEmailTemplate>
  );
}
