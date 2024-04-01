import { Heading, Section, Text } from '@react-email/components';
import { GenericEmailTemplate } from './generic-template-email';

type ConfirmCodeEmailProps = {
  name: string;
  code: string;
};

export function ConfirmCodeEmail({ name, code }: ConfirmCodeEmailProps) {
  return (
    <GenericEmailTemplate title="Código para realização de ação">
      <Heading as="h2" className="text-center text-xl font-bold text-neutral-100">
        Olá, {name}! Confirme o código abaixo para realizar a ação
      </Heading>

      <Section className="text-center">
        <Text className="text-4xl font-bold text-neutral-100">{code}</Text>
      </Section>

      <Text className="text-sm text-red-300">Se você não solicitou este e-mail, ignore-o.</Text>
    </GenericEmailTemplate>
  );
}
