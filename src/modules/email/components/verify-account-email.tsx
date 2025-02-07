import { Button, Heading, Link, Row, Section, Text } from '@react-email/components';
import { GenericEmailTemplate } from './generic-template-email';

type VerifyAccountEmailProps = {
  name: string;
  url: string;
};

export function VerifyAccountEmail({ name, url }: VerifyAccountEmailProps) {
  return (
    <GenericEmailTemplate title="Verificação de conta">
      <Heading as="h2" className="text-center text-xl font-bold text-neutral-100">
        Olá, {name}! Clique no link abaixo para verificar sua conta:
      </Heading>

      <Section className="text-center">
        <Button
          href={url}
          className="rounded border border-violet-200 bg-violet-700 px-4 py-2 text-center text-neutral-100"
        >
          Clique aqui para verificar sua conta
        </Button>

        <Row>
          <Link href={url}>
            Ou acesse este link para verificar sua conta: <strong>{url}</strong>
          </Link>
        </Row>
      </Section>

      <Text className="text-sm text-red-300">Se você não solicitou este e-mail, ignore-o.</Text>
    </GenericEmailTemplate>
  );
}
